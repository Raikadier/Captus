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
    public partial class algo: Form
    {
        private readonly UserLogic userLogic;
        public algo()
        {
            InitializeComponent();
            userLogic = new UserLogic();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Save();
        }
        private void Save()
        {
            if (string.IsNullOrEmpty(txtName.Text) || string.IsNullOrEmpty(txtPassword.Text)||string.IsNullOrEmpty(txtEmail.Text) || string.IsNullOrEmpty(txtLastName.Text) || string.IsNullOrEmpty(txtPhone.Text) || string.IsNullOrEmpty(txtUserName.Text))
            {
                MessageBox.Show("Please fill in all fields.");
                return;
            }
            User user = new User();
            user.Name = txtName.Text;
            user.UserName = txtUserName.Text.ToUpper();
            user.Password = txtPassword.Text;
            user.LastName = txtLastName.Text;
            user.Email = txtEmail.Text;
            user.Phone = txtPhone.Text;
            var result = userLogic.Save(user);
            if (result.Success)
            {
                MessageBox.Show("User saved successfully.");
                ClearFields();
            }
            else
            {
                MessageBox.Show($"Error: {result.Message}");
            }
        }
        private void ClearFields()
        {
            txtName.Clear();
            txtUserName.Clear();
            txtPassword.Clear();
            txtLastName.Clear();
            txtEmail.Clear();
            txtPhone.Clear();
        }
    }
}
