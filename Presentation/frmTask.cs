using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using BLL;

namespace Presentation
{
    public partial class frmTask : Form
    {
        private readonly TaskLogic taskLogic = new TaskLogic();

        public frmTask()
        {
            InitializeComponent();
        }

        

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void btnAddTask_Click(object sender, EventArgs e)
        {
            frmAddTask addtaskForm = new frmAddTask();
            addtaskForm.ShowDialog(); // Abre el registro
        }

        private void flowLayoutPanel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnRefresh_Click(object sender, EventArgs e)
        {

        }
    }
}
