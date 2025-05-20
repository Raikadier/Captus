using BLL;
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
    public partial class frmAddTask : Form
    {
        private readonly CategoryLogic categoryService;
        private readonly PriorityLogic priorityService;
        public frmAddTask()
        {
            InitializeComponent();
            categoryService = new CategoryLogic();
            priorityService = new PriorityLogic();
            LoadPriorities();
            LoadCategories();

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
        private void LoadPriorities()
        {
            var priorities = priorityService.GetAll();

            cbPriority.DataSource = priorities;
            cbPriority.DisplayMember = "Name";
            cbPriority.ValueMember = "Id_Priority";
            //holaaa
        }
        private void LoadCategories()
        {
            var categories = categoryService.GetAll();
            cbCategories.DataSource = categories;
            cbCategories.DisplayMember = "Name";
            cbCategories.ValueMember = "Id";
        }
        private void Panel1_MouseDown(object sender, MouseEventArgs e)
        {
            ReleaseCapture();
            SendMessage(this.Handle, 0x112, 0xf012, 0);
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
