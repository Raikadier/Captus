using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Presentation
{
    public partial class frmMain : Form
    {
        bool isExpanding = false;
        bool isCollapsing = false;
        int expandedWidth = 200;
        int collapsedWidth = 88;
        int step = 7; // velocidad de animación
       
        

        public frmMain()
        {
            InitializeComponent();
            timer1.Interval = 10;
            InitializeLayout(); // Config inicial
        }

        private void InitializeLayout()
        {
            picLogoCaptus.SizeMode = PictureBoxSizeMode.Zoom;
            label1.Visible = true;

            foreach (Control ctrl in panel1.Controls)
            {
                if (ctrl is Button btn)
                {
                    btn.TextImageRelation = TextImageRelation.ImageBeforeText;
                    btn.ImageAlign = ContentAlignment.MiddleLeft;
                    btn.TextAlign = ContentAlignment.MiddleLeft;
                }
            }
        }

        private void frmMain_Load(object sender, EventArgs e)
        {
            picLogoCaptus.SizeMode = PictureBoxSizeMode.Zoom;
            picLogoCaptus.Width = panel1.Width;

            // Establecer el tamaño inicial del panel (expandido)
            panel1.Width = expandedWidth;
            // Actualizar UI del panel al estado expandido
            UpdatePanelUI(true); // true = expandido
        }

        private void UpdatePanelUI(bool expanded)
        {
            // --- Ajustar tamaño del logo ---
            int logoSize = (int)(panel1.Width * 0.6);
            picLogoCaptus.Width = logoSize;
            picLogoCaptus.Height = logoSize;
            picLogoCaptus.Location = new Point(
                (panel1.Width - picLogoCaptus.Width) / 2,
                20
            );

            // --- Ajustar label debajo del logo ---
            label1.Font = new Font("Segoe UI", expanded ? 12 : 8, FontStyle.Bold);
            label1.Visible = expanded;
            label1.Location = new Point(
                (panel1.Width - label1.PreferredWidth) / 2,
                picLogoCaptus.Bottom + 5
            );

            // --- Ajustar botones ---
            foreach (Control ctrl in panel1.Controls)
            {
                if (ctrl is Button btn)
                {
                    btn.Text = expanded ? btn.Tag?.ToString() ?? "" : "";
                    btn.TextImageRelation = expanded ? TextImageRelation.ImageBeforeText : TextImageRelation.Overlay;
                    btn.ImageAlign = ContentAlignment.MiddleCenter;
                    btn.TextAlign = ContentAlignment.MiddleLeft;
                }
            }
        }

        private void btnMinimizar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        private void btnRestaurar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Normal;
            btnRestaurar.Visible = false;
            btnMaximizar.Visible = true;
            btnMaximizar.BringToFront();  // Este botón va arriba
        }

        private void btnMaximizar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Maximized;
            btnMaximizar.Visible = false;
            btnRestaurar.Visible = true;
            btnRestaurar.BringToFront();  // Este botón va arriba
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void btnMenu_Click(object sender, EventArgs e)
        {
            if (panel1.Width == expandedWidth)
            {
                isCollapsing = true;
                isExpanding = false;
            }
            else
            {
                isExpanding = true;
                isCollapsing = false;
            }

            timer1.Start();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (isExpanding)
            {
                if (panel1.Width < expandedWidth)
                {
                    panel1.Width += step;
                    if (panel1.Width >= expandedWidth)
                    {
                        panel1.Width = expandedWidth;
                        timer1.Stop();
                        isExpanding = false;
                    }
                }
            }
            else if (isCollapsing)
            {
                if (panel1.Width > collapsedWidth)
                {
                    panel1.Width -= step;
                    if (panel1.Width <= collapsedWidth)
                    {
                        panel1.Width = collapsedWidth;
                        timer1.Stop();
                        isCollapsing = false;
                    }
                }
            }

            picLogoCaptus.Width = panel1.Width;

            // Adaptar logo en tiempo real
            int logoSize = (int)(panel1.Width * 0.6); // Ejemplo: 60% del ancho del panel
            picLogoCaptus.Width = logoSize;
            picLogoCaptus.Height = logoSize;
            picLogoCaptus.Location = new Point(
                (panel1.Width - picLogoCaptus.Width) / 2,
                20 // margen superior
            );

            // Ajustar label debajo del logo
            label1.Font = new Font("Segoe UI", panel1.Width >= expandedWidth ? 12 : 8, FontStyle.Bold);
            label1.Visible = panel1.Width >= expandedWidth;
            label1.Location = new Point(
                (panel1.Width - label1.PreferredWidth) / 2,
                picLogoCaptus.Bottom + 5 // justo debajo del logo
            );

            //// Ajustar label de los botones
            //txtTaskList.Font = new Font("Segoe UI", panel1.Width >= expandedWidth ? 12 : 8, FontStyle.Bold);
            //txtTaskList.Visible = panel1.Width >= expandedWidth;
            //txtTaskList.Location = new Point(
            //    (panel1.Width - txtTaskList.PreferredWidth) / 2,
            //    picLogoCaptus.Bottom + 5 // justo debajo del logo
            //);


        }

        private void UpdatePanelContent(bool expanded)
        {
            label1.Visible = expanded;

            foreach (Control ctrl in panel1.Controls)
            {
                if (ctrl is Button btn)
                {
                    btn.Text = expanded ? btn.Tag?.ToString() ?? "" : "";
                    btn.TextImageRelation = expanded ? TextImageRelation.ImageBeforeText : TextImageRelation.Overlay;
                    btn.ImageAlign = ContentAlignment.MiddleCenter;
                    btn.TextAlign = ContentAlignment.MiddleLeft;
                }
            }
        }

        private void picLogoCaptus_Click(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }
    }
}
