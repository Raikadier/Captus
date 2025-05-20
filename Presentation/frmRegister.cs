using BLL;
using ENTITY;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Presentation
{
    public partial class frmRegister : Form
    {
        private readonly UserLogic userLogic;
        public frmRegister()
        {
            InitializeComponent();
            userLogic = new UserLogic();
            this.FormBorderStyle = FormBorderStyle.None;
            this.MaximizedBounds = Screen.FromHandle(this.Handle).WorkingArea;
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
            Save();

            MessageBox.Show("Guardado con éxito", "¡ Registrado !", MessageBoxButtons.OK, MessageBoxIcon.Information);

            this.Close(); // Cierra el registro y regresa al login
        }
        private void Save()
        {
            if (!verifyFields() || !varifyPassword() || !verifyEmail())
                return;
            User user = new User();
            user.Name = txtName.Text;
            user.UserName = txtUsername.Text.ToUpper();
            user.Password = txtPassword.Text;
            user.LastName = txtLastName.Text;
            user.Email = txtEmail.Text;
            user.Phone = txtPhNumber.Text;
            var result = userLogic.Save(user);
            if (result.Success)
            {
                MessageBox.Show("User saved successfully.", "¡ Gratulations !", MessageBoxButtons.OK, MessageBoxIcon.Information);
                this.Close();
            }
            else
            {
                MessageBox.Show($"Error: {result.Message}");
            }
        }
        private bool varifyPassword()
        {
            string password = txtPassword.Text;
            if (password.Length < 8)
            {
                MessageBox.Show("La contraseña debe tener al menos 8 caracteres.");
                return false;
            }
            if (!Regex.IsMatch(password, @"[A-Z]") ||
                !Regex.IsMatch(password, @"[a-z]") ||
                !Regex.IsMatch(password, @"[0-9]"))
            {
                MessageBox.Show("La contraseña debe contener mayúsculas, minúsculas y números.");
                return false;
            }
            if (txtPassword.Text != txtCnPassword.Text)
            {
                MessageBox.Show("Las contraseñas no coinciden.");
                return false;
            }
            return true;
        }
        private bool verifyFields()
        {
            if (string.IsNullOrEmpty(txtName.Text) || string.IsNullOrEmpty(txtPassword.Text) || string.IsNullOrEmpty(txtEmail.Text) || string.IsNullOrEmpty(txtLastName.Text) || string.IsNullOrEmpty(txtPhNumber.Text) || string.IsNullOrEmpty(txtUsername.Text))
            {
                MessageBox.Show("Please fill in all fields.");
                return false;
            }
            return true;
        }
        private bool verifyEmail()
        {
            string email = txtEmail.Text;
            if (!Regex.IsMatch(email, @"^[^@\s]+@gmail\.com$"))
            {
                MessageBox.Show("Debe ingresar un correo electrónico válido de Gmail.");
                return false;
            }

            //string codigo = new Random().Next(100000, 999999).ToString();
            //if (!SendVerifyCode(email, codigo))
            //{
            //    return false;
            //}
            return true;
        }
    }
}
