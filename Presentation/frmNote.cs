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
    public partial class frmNote : Form
    {
        public frmNote()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void btnClse_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }

        private void abrirToolStripMenuItem_Click(object sender, EventArgs e)
        {
            string v;
            openFileDialog1.ShowDialog();
            System.IO.StreamReader file = new System.IO.StreamReader(openFileDialog1.FileName);
            v = file.ReadToEnd();
            richTextBox1.Text = v.ToString();
        }

        private void guardarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            saveFileDialog1.FileName = "Sin titulo";
            var bb = saveFileDialog1.ShowDialog();
            if (bb == DialogResult.OK)
            {
                using (var savefile = new System.IO.StreamWriter(saveFileDialog1.FileName))
                {
                    savefile.WriteLine(richTextBox1.Text);

                }
            }
        }

        private void cerrarToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void colorToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var kl = colorDialog1.ShowDialog();
            if (kl == DialogResult.OK)
            {
                richTextBox1.ForeColor = colorDialog1.Color;
            }
        }

        private void fuenteToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var fm = fontDialog1.ShowDialog();
            if (fm == DialogResult.OK)
            {
                richTextBox1.Font = fontDialog1.Font;

            }
        }
    }
}
