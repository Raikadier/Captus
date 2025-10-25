// NotesPage - Equivalent to frmNote.cs
// Rich text editor for notes with file operations
import React, { useState, useRef } from 'react';
import { FileText, Save, FolderOpen, X, Palette, Type } from 'lucide-react';

const NotesPage = () => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Sin título');
  const [isSaved, setIsSaved] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const textAreaRef = useRef(null);

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  const fonts = [
    'Arial', 'Times New Roman', 'Courier New', 'Georgia',
    'Verdana', 'Comic Sans MS', 'Impact', 'Century Gothic'
  ];

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    // TODO: Implement save to backend
    console.log('Saving note:', { fileName, content });
    setIsSaved(true);
    alert('Nota guardada exitosamente');
  };

  const handleOpen = () => {
    // TODO: Implement file open dialog
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.rtf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setContent(e.target.result);
          setFileName(file.name);
          setIsSaved(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleNew = () => {
    if (!isSaved && content.trim()) {
      if (!confirm('¿Deseas guardar los cambios antes de crear una nueva nota?')) {
        return;
      }
      handleSave();
    }
    setContent('');
    setFileName('Sin título');
    setIsSaved(true);
  };

  const applyColor = (color) => {
    document.execCommand('foreColor', false, color);
    setShowColorPicker(false);
  };

  const applyFont = (fontFamily) => {
    document.execCommand('fontName', false, fontFamily);
    setShowFontPicker(false);
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - equivalent to panel1 in frmNote.cs */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/iconNote.png" alt="Notes" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Notes</h1>
              <p className="text-green-100 text-sm">{fileName} {!isSaved && '*'}</p>
            </div>
          </div>
          <button className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Menu Bar - equivalent to menuStrip1 */}
      <div className="bg-green-50 border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center space-x-6">
          {/* Archivo Menu */}
          <div className="relative">
            <button className="text-gray-700 hover:text-green-600 font-medium">
              Archivo
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-32 hidden group-hover:block">
              <button
                onClick={handleNew}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Nuevo
              </button>
              <button
                onClick={handleOpen}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center space-x-2"
              >
                <FolderOpen size={14} />
                <span>Abrir</span>
              </button>
              <button
                onClick={handleSave}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center space-x-2"
              >
                <Save size={14} />
                <span>Guardar</span>
              </button>
            </div>
          </div>

          {/* Formato de Texto Menu */}
          <div className="relative">
            <button className="text-gray-700 hover:text-green-600 font-medium">
              Formato de texto
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-40 hidden group-hover:block">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center space-x-1 text-sm hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <Palette size={14} />
                    <span>Color</span>
                  </button>
                  <button
                    onClick={() => setShowFontPicker(!showFontPicker)}
                    className="flex items-center space-x-1 text-sm hover:bg-gray-100 px-2 py-1 rounded"
                  >
                    <Type size={14} />
                    <span>Fuente</span>
                  </button>
                </div>

                {/* Color Picker */}
                {showColorPicker && (
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => applyColor(color)}
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}

                {/* Font Picker */}
                {showFontPicker && (
                  <div className="space-y-1">
                    {fonts.map((font) => (
                      <button
                        key={font}
                        onClick={() => applyFont(font)}
                        className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Text Formatting Buttons */}
              <div className="px-4 py-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => formatText('bold')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => formatText('italic')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() => formatText('underline')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <u>U</u>
                  </button>
                  <button
                    onClick={() => formatText('strikeThrough')}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <s>S</s>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Area - equivalent to richTextBox1 */}
      <div className="flex-1 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <textarea
              ref={textAreaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Empieza a escribir tu nota..."
              className="w-full h-96 p-6 text-gray-800 resize-none focus:outline-none"
              style={{
                fontFamily: 'Arial',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600">
          <span>{content.length} caracteres</span>
          <span>{isSaved ? 'Guardado' : 'No guardado'}</span>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;