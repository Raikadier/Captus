using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Presentation
{
    public partial class frmRegister : Form
    {
        public frmRegister()
        {
            InitializeComponent();

            // Sin bordes de sistema
            this.FormBorderStyle = FormBorderStyle.None;

            // Para que al maximizar no se pase ni deje espacio
            this.MaximizedBounds = Screen.FromHandle(this.Handle).WorkingArea;

            // Evento para controlar el redimensionamiento
            this.Resize += new EventHandler(Form1_Resize);
        }

        [DllImport("user32.dll", EntryPoint = "ReleaseCapture")]
        private extern static void ReleaseCapture();
        [DllImport("user32.dll", EntryPoint = "SendMessage")]
        private extern static void SendMessage(System.IntPtr hwnd, int wmsg, int wparam, int lparam);

        private void Form1_Resize(object sender, EventArgs e)
        {
            if (this.WindowState == FormWindowState.Maximized)
            {
                this.MaximumSize = Screen.FromHandle(this.Handle).WorkingArea.Size;
                this.Location = Screen.FromHandle(this.Handle).WorkingArea.Location;
            }
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnMinimizar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Application.Exit();
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

        private void Panel2_MouseDown(object sender, MouseEventArgs e)
        {
            ReleaseCapture();
            SendMessage(this.Handle, 0x112, 0xf012, 0);
        }

        private void btnReply_Click(object sender, EventArgs e)
        {
            //this.Hide(); // Oculta el register
            //frmLogin loginForm = new frmLogin();
            //loginForm.ShowDialog(); // Abre el login

            this.Close();
        }

        private void btnRegister_Click(object sender, EventArgs e)
        {
            // Aquí guardarías en base de datos o archivo (omito esa parte por ahora)

            MessageBox.Show("Guardado con éxito", "¡ Registrado !", MessageBoxButtons.OK, MessageBoxIcon.Information);

            this.Close(); // Cierra el registro y regresa al login
        }
    }
}
