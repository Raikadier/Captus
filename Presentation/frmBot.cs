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
    public partial class FrmBot : Form
    {
        private readonly AIService _aiService;
        private readonly ChatLogic _chatLogic;
        private readonly User _currentUser;

        // Constante para el texto del placeholder
        private const string PlaceholderText = "Escribe tu mensaje aquí...";

        public FrmBot()
        {
            InitializeComponent();

            // Clave de API del servicio de IA. REEMPLAZAR con clave real o usar configuración segura.

             _aiService = new AIService("YOUR_API_KEY_HERE");
             //_aiService = new AIService("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"); // Línea original comentada

            _chatLogic = new ChatLogic(_aiService);
            _currentUser = new User { id = 1 };
            LoadMessages();
            
            txtMessage.KeyPress += TxtMessage_KeyPress;
        }

        private void TxtMessage_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Enter)
            {
                e.Handled = true;
                BtnSendMessage_Click(sender, EventArgs.Empty);
            }
        }

        private void LoadMessages()
        {
            try
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
            catch (Exception ex)
            {
                MessageBox.Show($"Error al cargar mensajes: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void DisplayMessage(ChatMessage message)
        {
            try
            {
                string sender = message.IsUserMessage ? "Tú" : "Bot";
                string timestamp = message.SendDate.ToString("HH:mm");
                
                // Colores personalizados para cada tipo de mensaje
                Color messageColor = message.IsUserMessage ? Color.FromArgb(0, 122, 204) : Color.FromArgb(64, 64, 64);
                Color timestampColor = Color.FromArgb(128, 128, 128);
                Font messageFont = new Font("Segoe UI", 10F, FontStyle.Regular);
                Font timestampFont = new Font("Segoe UI", 8F, FontStyle.Italic);
                
                if (richTextBox1.InvokeRequired)
                {
                    richTextBox1.Invoke(new MethodInvoker(delegate 
                    {
                        AppendMessageToRichTextBox(timestamp, sender, message.Message, messageColor, timestampColor, messageFont, timestampFont);
                    }));
                }
                else
                {
                    AppendMessageToRichTextBox(timestamp, sender, message.Message, messageColor, timestampColor, messageFont, timestampFont);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al mostrar mensaje: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void AppendMessageToRichTextBox(string timestamp, string sender, string messageText, Color messageColor, Color timestampColor, Font messageFont, Font timestampFont)
        {
            richTextBox1.SelectionStart = richTextBox1.TextLength;
            richTextBox1.SelectionLength = 0;
            
            // Añadir timestamp
            richTextBox1.SelectionColor = timestampColor;
            richTextBox1.SelectionFont = timestampFont;
            richTextBox1.AppendText($"{timestamp} - {sender}\n");
            
            // Añadir mensaje
            richTextBox1.SelectionColor = messageColor;
            richTextBox1.SelectionFont = messageFont;
            richTextBox1.AppendText($"{messageText}\n\n");
            
            richTextBox1.ScrollToCaret();
        }

        private async void BtnSendMessage_Click(object sender, EventArgs e)
        {
            string userText = txtMessage.Text;

            // Verificar si el texto es el placeholder antes de procesar
            if (string.IsNullOrWhiteSpace(userText) || userText == PlaceholderText) return;

            try
            {
                txtMessage.Clear();
                txtMessage.Enabled = false;
                btbnSendMessage.Enabled = false;

                // Crear y mostrar el mensaje del usuario inmediatamente
                var userMessage = new ChatMessage
                {
                    Message = userText,
                    SendDate = DateTime.Now,
                    IsUserMessage = true,
                    User = _currentUser
                };
                DisplayMessage(userMessage);

                var botMessage = await _chatLogic.ProcessUserMessageAsync(userText, _currentUser);
                
                if (botMessage != null)
                {
                    DisplayMessage(botMessage);
                }
                else
                {
                    MessageBox.Show("No se pudo obtener una respuesta del asistente.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al procesar el mensaje: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                txtMessage.Enabled = true;
                btbnSendMessage.Enabled = true;
                txtMessage.Focus();
            }
        }

        private void RichTextBox1_TextChanged(object sender, EventArgs e)
        {
            richTextBox1.ScrollToCaret();
        }

        private void Panel1_Paint(object sender, PaintEventArgs e)
        {
            using (Pen pen = new Pen(Color.FromArgb(0, 122, 0), 1))
            {
                e.Graphics.DrawLine(pen, 0, panel1.Height - 1, panel1.Width, panel1.Height - 1);
            }
        }

        private void Label1_Click(object sender, EventArgs e)
        {
            // Implementar lógica de clic si es necesario
        }

        private void FrmBot_Load(object sender, EventArgs e)
        {
            richTextBox1.BackColor = Color.White;
            richTextBox1.BorderStyle = BorderStyle.None;
            richTextBox1.ReadOnly = true;
            
            txtMessage.Text = PlaceholderText;
            txtMessage.ForeColor = Color.Gray;
            txtMessage.Enter += TxtMessage_Enter;
            txtMessage.Leave += TxtMessage_Leave;
            txtMessage.KeyPress += TxtMessage_KeyPress;
            
            LoadMessages();
        }

        private void TxtMessage_Enter(object sender, EventArgs e)
        {
            if (txtMessage.Text == PlaceholderText)
            {
                txtMessage.Text = "";
                txtMessage.ForeColor = Color.Black;
            }
        }

        private void TxtMessage_Leave(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtMessage.Text))
            {
                txtMessage.Text = PlaceholderText;
                txtMessage.ForeColor = Color.Gray;
            }
        }

        private void ClearChat()
        {
            if (MessageBox.Show("¿Estás seguro de que deseas limpiar el chat?", "Limpiar Chat", 
                MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                richTextBox1.Clear();
            }
        }
    }
}
