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
    public partial class frmMessageBox : Form
    {

        public frmMessageBox(string mensaje, string titulo = "Mensaje")
        {
            InitializeComponent();
            this.StartPosition = FormStartPosition.CenterScreen;
            labelCaption.Text = mensaje;
            labelTitle.Text = titulo;
        }

        // Versión simple como reemplazo directo de MessageBox.Show
        public static DialogResult Show(string mensaje, string titulo = "Mensaje")
        {
            frmMessageBox box = new frmMessageBox(mensaje, titulo);
            return box.ShowDialog();
        }

        private void frmMessageBox_Load(object sender, EventArgs e)
        {

        }

        private void panelTitleBar_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panelButtons_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panelBody_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnClse_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        private void labelCaption_Click(object sender, EventArgs e)
        {

        }

        private void buttonPersonal1_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }
    }
}
