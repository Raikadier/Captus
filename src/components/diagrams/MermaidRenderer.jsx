import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Button } from '../../ui/button';
import { Download, FileImage, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'arial',
  logLevel: 5, // Reduce logging
});

export default function MermaidRenderer({ code, allowExport = false }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      if (!code || !code.trim()) return;

      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Clear previous content
        if (containerRef.current) {
           containerRef.current.innerHTML = '';
        }

        // Check if mermaid is properly initialized
        if (!mermaid || typeof mermaid.render !== 'function') {
          console.warn('Mermaid not properly initialized');
          return;
        }

        const { svg } = await mermaid.render(id, code);

        if (isMounted && svg) {
          setSvgContent(svg);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        }
      } catch (err) {
        // Silently handle mermaid errors to avoid UI disruption
        console.warn('Mermaid render warning (non-critical):', err.message);
        if (isMounted) {
          setError(null);
          // Clear any partial content that might have been rendered
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }
        }
      }
    };

    // Small delay to ensure mermaid is fully loaded
    const timeoutId = setTimeout(renderDiagram, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [code]);

  const downloadImage = async (format) => {
    if (!containerRef.current) return;
    setIsExporting(true);

    try {
      const svgElement = containerRef.current.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      // Get exact dimensions from SVG
      const svgRect = svgElement.getBoundingClientRect();
      const width = svgRect.width || 800;
      const height = svgRect.height || 600;

      // Scale for better quality
      const scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (format === 'png') {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `diagrama-${Date.now()}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } else if (format === 'pdf') {
           // Use jsPDF
           const pdf = new jsPDF({
             orientation: width > height ? 'l' : 'p',
             unit: 'px',
             format: [width + 40, height + 40] // Add some padding
           });
           ctx.fillStyle = 'white';
           ctx.fillRect(0, 0, canvas.width, canvas.height);
           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
           const imgData = canvas.toDataURL('image/png');
           pdf.addImage(imgData, 'PNG', 20, 20, width, height);
           pdf.save(`diagrama-${Date.now()}.pdf`);
        }
        URL.revokeObjectURL(url);
        setIsExporting(false);
      };

      img.src = url;

    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const downloadSVG = () => {
      if (!svgContent) return;
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `diagrama-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  }

  // If there's an error or no valid content, show a simple message
  if (error || !svgContent) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full bg-gray-50 rounded-lg min-h-[100px] flex items-center justify-center p-4">
          <span className="text-sm text-gray-500">Diagrama no disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        ref={containerRef}
        className="w-full overflow-x-auto bg-white rounded-lg min-h-[100px] flex items-center justify-center p-4"
      />

      {allowExport && svgContent && (
        <div className="flex gap-2 justify-end mt-2">
           <Button variant="outline" size="sm" onClick={() => downloadImage('png')} disabled={isExporting}>
             <FileImage className="w-4 h-4 mr-1" /> PNG
           </Button>
           <Button variant="outline" size="sm" onClick={downloadSVG} disabled={isExporting}>
             <Download className="w-4 h-4 mr-1" /> SVG
           </Button>
           <Button variant="outline" size="sm" onClick={() => downloadImage('pdf')} disabled={isExporting}>
             <FileText className="w-4 h-4 mr-1" /> PDF
           </Button>
        </div>
      )}
    </div>
  );
}
