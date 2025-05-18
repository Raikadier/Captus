using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Entity;
using BLL;
namespace GUI
{
    public partial class otracosa: Form
    {
        private readonly UserLogic userLogic;
        public otracosa()
        {
            InitializeComponent();
            userLogic = new UserLogic();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Login();
        }

        private void Login()
        {
            if (string.IsNullOrEmpty(txtUserName.Text) || string.IsNullOrEmpty(txtPassword.Text))
            {
                MessageBox.Show("Please fill in all fields.");
                return;
            }
            User user = userLogic.Login(txtUserName.Text.ToUpper(), txtPassword.Text);
            if (user != null)
            {
                MessageBox.Show("Login successful.");
                // Proceed to the next form or functionality
            }
            else
            {
                MessageBox.Show("Invalid username or password.");
            }
        }
    }
}
