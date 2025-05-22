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
using ENTITY;

namespace Presentation
{
    public partial class frmBot : Form
    {
        private readonly ChatGPTService _chatGPTService;
        private readonly ChatLogic _chatLogic;
        private readonly User _currentUser;

        public frmBot()
        {
            InitializeComponent();
            _chatGPTService = new ChatGPTService("aqui-va-la-api-key");
            _chatLogic = new ChatLogic(_chatGPTService);
            _currentUser = new User { id = 1 }; // Ejemplo: usa un usuario con ID 1 para pruebas si no tienes Session implementada
            LoadMessages();
        }

        private void LoadMessages()
        {
            var messages = _chatLogic.GetAllMessages();
            if (messages != null)
            {
                foreach (var message in messages)
                {
                    DisplayMessage(message);
                }
            }
        }

        private void DisplayMessage(ChatMessage message)
        {
            string sender = message.IsUserMessage ? "Tú" : "Bot";
            string displayLine = $"[{message.SendDate:HH:mm}] {sender}: {message.Message}\n";
            if (richTextBox1.InvokeRequired)
            {
                richTextBox1.Invoke(new MethodInvoker(delegate { richTextBox1.AppendText(displayLine); richTextBox1.ScrollToCaret(); }));
            }
            else
            {
                richTextBox1.AppendText(displayLine);
                richTextBox1.ScrollToCaret();
            }
        }

        private async void btbnSendMessage_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtMessage.Text)) return;

            string userText = txtMessage.Text;
            txtMessage.Clear();
            txtMessage.Enabled = false;
            btbnSendMessage.Enabled = false;

            var botMessage = await _chatLogic.ProcessUserMessageAsync(userText, _currentUser);
            
            DisplayMessage(botMessage);

            txtMessage.Enabled = true;
            btbnSendMessage.Enabled = true;
            txtMessage.Focus();
        }

        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {
            // Implementar validación o lógica adicional si es necesario
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {
            // Implementar lógica de pintado si es necesario
        }

        private void label1_Click(object sender, EventArgs e)
        {
            // Implementar lógica de clic si es necesario
        }

        private void frmBot_Load(object sender, EventArgs e)
        {
            // Implementar lógica de carga si es necesario
        }
    }
}
