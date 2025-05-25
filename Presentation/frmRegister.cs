using BLL;
using ENTITY;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Mail;
using System.Net;
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
            this.StartPosition = FormStartPosition.CenterScreen;
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

        

        

       

        

        private void Panel2_MouseDown(object sender, MouseEventArgs e)
        {
            ReleaseCapture();
            SendMessage(this.Handle, 0x112, 0xf012, 0);
        }

        private void btnReply_Click(object sender, EventArgs e)
        {
            this.Hide(); // Oculta el register
            frmLogin loginForm = new frmLogin();
            loginForm.ShowDialog(); // Abre el login

            this.Close();
        }

        private void btnRegister_Click(object sender, EventArgs e)
        {
            Save();
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
                frmMessageBox.Show("Usuario registrado exitosamente.", "¡Felicidades!");
                this.Close();
            }
            else
            {
                frmMessageBox.Show($"Error al registrar: {result.Message}", "Error");
            }
        }
        private bool varifyPassword()
        {
            string password = txtPassword.Text;
            if (password.Length < 8)
            {
                frmMessageBox.Show("La contraseña debe tener al menos 8 caracteres.", "Contraseña débil");
                return false;
            }
            if (!Regex.IsMatch(password, @"[A-Z]") ||
                !Regex.IsMatch(password, @"[a-z]") ||
                !Regex.IsMatch(password, @"[0-9]"))
            {
                frmMessageBox.Show("La contraseña debe contener mayúsculas, minúsculas y números.", "Contraseña inválida");
                return false;
            }
            if (txtPassword.Text != txtCnPassword.Text)
            {
                frmMessageBox.Show("Las contraseñas no coinciden.", "Error de confirmación");
                return false;
            }
            return true;
        }
        private bool verifyFields()
        {
            if (string.IsNullOrEmpty(txtName.Text) || string.IsNullOrEmpty(txtPassword.Text) || string.IsNullOrEmpty(txtEmail.Text) || string.IsNullOrEmpty(txtLastName.Text) || string.IsNullOrEmpty(txtPhNumber.Text) || string.IsNullOrEmpty(txtUsername.Text))
            {
                frmMessageBox.Show("Por favor complete todos los campos.", "Campos requeridos");
                return false;
            }
            return true;
        }
        private bool verifyEmail()
        {
            string email = txtEmail.Text;
            if (!Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                frmMessageBox.Show("Debe ingresar un correo electrónico válido.", "Correo inválido");
                return false;
            }

            string code = new Random().Next(100000, 999999).ToString();
            if (!SendCode(email, code))
            {
                frmMessageBox.Show("No se pudo enviar el código de verificación al correo.", "Error de envío");
                return false;
            }
            using (var formVerificationn = new ValideCode())
            {
                if (formVerificationn.ShowDialog() == DialogResult.OK)
                {
                    string codigoIngresado = formVerificationn.CodeInsert;
                    if (codigoIngresado != code)
                    {
                        frmMessageBox.Show("El código ingresado es incorrecto.", "Código inválido");
                        return false;
                    }
                }
                else
                {
                    frmMessageBox.Show("La verificación fue cancelada por el usuario.", "Cancelado");
                    return false;
                }
            }

            return true;
        }
        public bool SendCode(string correoDestino, string codigo)
        {
            try
            {
                var mail = new MailMessage();
                mail.From = new MailAddress("captusupc07@gmail.com");
                mail.To.Add(correoDestino);
                mail.Subject = "Código de verificación para tu cuenta en CAPTUS";
                mail.Body = $"Hola,\n\nTu código de verificación es: {codigo}\n\nIngresa este código en la app para continuar con tu registro.\n\nGracias por usar CAPTUS.";
                mail.ReplyToList.Add(new MailAddress("captusupc07@gmail.com"));
                var smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("captusupc07@gmail.com", "qguo vidf kanr amvg"),
                    EnableSsl = true
                };

                smtp.Send(mail);
                return true;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error al enviar correo: " + ex.Message);
                return false;
            }
        }

        private void btnClse_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void btnRestaurar_Click_1(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Normal;
            btnRestaurar.Visible = false;
            btnMaximizarbtnMaximizar.Visible = true;
            btnMaximizarbtnMaximizar.BringToFront();  // Este botón va arriba
        }

      

        private void btnMinimizar_Click_1(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;

        }

        private void btnMaximizarbtnMaximizar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Maximized;
            btnMaximizarbtnMaximizar.Visible = false;
            btnRestaurar.Visible = true;
            btnRestaurar.BringToFront();  // Este botón va arriba
        }
    }
}
