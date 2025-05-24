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
    public partial class ValideCode: Form
    {
        private Button btnInvisible;
        public string CodeInsert => txtValideCode.Text;
        public ValideCode()
        {
            InitializeComponent();
            txtValideCode.Focus();
            configureFocus();
        }
        private void configureFocus()
        {
            btnInvisible = new Button();
            btnInvisible.Size = new Size(0, 0);
            btnInvisible.Location = new Point(-100, -100);
            btnInvisible.TabStop = false;
            this.Controls.Add(btnInvisible);
            btnInvisible.Focus();
            ConfigureTool();
        }
        private void ConfigureTool()
        {
            toolEmail.SetToolTip(imgInfo, "Si no encuentras el mensaje, revisa tu carpeta de \"Correo no deseado\" y márcalo como “No es spam” para futuras comunicaciones.");
        }
        private void Verify()
        {
            if (string.IsNullOrWhiteSpace(txtValideCode.Text))
            {
                MessageBox.Show("Ingrese el código enviado a su correo.");
                return;
            }

            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        private void btnValidar_Click(object sender, EventArgs e)
        {
            Verify();
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            CloseFrm();
        }
        private void CloseFrm()
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }

        private void txtValideCode_Click(object sender, EventArgs e)
        {
            if (txtValideCode.Text == "Ingresa el código")
            {
                txtValideCode.Text = "";
                txtValideCode.ForeColor = Color.Black;
            }
        }

        private void txtValideCode_Leave(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtValideCode.Text))
            {
                txtValideCode.Text = "Ingresa el código";
                txtValideCode.ForeColor = Color.Gray;
            }
        }

        private void btnValidar_MouseEnter(object sender, EventArgs e)
        {
            btnValidar.BackColor = Color.FromArgb(255, 255, 192); 
            btnValidar.Font = new Font(btnValidar.Font.FontFamily, btnValidar.Font.Size + 5, FontStyle.Bold);
        }

        private void btnValidar_MouseLeave(object sender, EventArgs e)
        {
            btnValidar.BackColor = Color.FromArgb(255, 255, 128);
            btnValidar.Font = new Font(btnValidar.Font.FontFamily, btnValidar.Font.Size - 5, FontStyle.Regular);
        }
    }
}
