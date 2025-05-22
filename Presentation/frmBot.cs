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
        private readonly AIService _aiService;
        private readonly ChatLogic _chatLogic;
        private readonly User _currentUser;

        public frmBot()
        {
            InitializeComponent();
            //_aiService = new AIService("tu-api-key-de-openrouter-aquí");
            _aiService = new AIService("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");
            _chatLogic = new ChatLogic(_aiService);
            _currentUser = new User { id = 1 }; // Ejemplo: usa un usuario con ID 1 para pruebas si no tienes Session implementada
            LoadMessages();
            
            // Suscribir el evento KeyPress del txtMessage
            txtMessage.KeyPress += TxtMessage_KeyPress;
        }

        private void TxtMessage_KeyPress(object sender, KeyPressEventArgs e)
        {
            // Verificar si la tecla presionada es Enter
            if (e.KeyChar == (char)Keys.Enter)
            {
                // Prevenir el comportamiento por defecto (nueva línea)
                e.Handled = true;
                // Llamar al método de envío del mensaje
                btbnSendMessage_Click(sender, EventArgs.Empty);
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
                
                // Crear el texto con formato
                string displayLine = $"{timestamp} - {sender}\n{message.Message}\n\n";
                
                // Configurar el color y estilo según el remitente
                Color messageColor = message.IsUserMessage ? Color.FromArgb(0, 122, 0) : Color.FromArgb(64, 64, 64);
                Font messageFont = new Font("Segoe UI", 10F, FontStyle.Regular);
                Font timestampFont = new Font("Segoe UI", 8F, FontStyle.Italic);
                
                if (richTextBox1.InvokeRequired)
                {
                    richTextBox1.Invoke(new MethodInvoker(delegate 
                    {
                        richTextBox1.SelectionStart = richTextBox1.TextLength;
                        richTextBox1.SelectionLength = 0;
                        
                        // Establecer el color y estilo para la marca de tiempo
                        richTextBox1.SelectionColor = Color.Gray;
                        richTextBox1.SelectionFont = timestampFont;
                        richTextBox1.AppendText($"{timestamp} - {sender}\n");
                        
                        // Establecer el color y estilo para el mensaje
                        richTextBox1.SelectionColor = messageColor;
                        richTextBox1.SelectionFont = messageFont;
                        richTextBox1.AppendText($"{message.Message}\n\n");
                        
                        richTextBox1.ScrollToCaret();
                    }));
                }
                else
                {
                    richTextBox1.SelectionStart = richTextBox1.TextLength;
                    richTextBox1.SelectionLength = 0;
                    
                    // Establecer el color y estilo para la marca de tiempo
                    richTextBox1.SelectionColor = Color.Gray;
                    richTextBox1.SelectionFont = timestampFont;
                    richTextBox1.AppendText($"{timestamp} - {sender}\n");
                    
                    // Establecer el color y estilo para el mensaje
                    richTextBox1.SelectionColor = messageColor;
                    richTextBox1.SelectionFont = messageFont;
                    richTextBox1.AppendText($"{message.Message}\n\n");
                    
                    richTextBox1.ScrollToCaret();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al mostrar mensaje: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void btbnSendMessage_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtMessage.Text)) return;

            try
            {
                string userText = txtMessage.Text;
                txtMessage.Clear();
                txtMessage.Enabled = false;
                btbnSendMessage.Enabled = false;

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

        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {
            // Asegurarse de que el scroll siempre esté al final
            richTextBox1.ScrollToCaret();
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {
            // Dibujar una línea separadora en la parte inferior del panel
            using (Pen pen = new Pen(Color.FromArgb(0, 122, 0), 1))
            {
                e.Graphics.DrawLine(pen, 0, panel1.Height - 1, panel1.Width, panel1.Height - 1);
            }
        }

        private void label1_Click(object sender, EventArgs e)
        {
            // Implementar lógica de clic si es necesario
        }

        private void frmBot_Load(object sender, EventArgs e)
        {
            // Configurar el RichTextBox
            richTextBox1.BackColor = Color.White;
            richTextBox1.BorderStyle = BorderStyle.None;
            richTextBox1.ReadOnly = true;
            
            // Configurar el campo de mensaje
            txtMessage.Text = "Escribe tu mensaje aquí...";
            txtMessage.ForeColor = Color.Gray;
            txtMessage.Enter += TxtMessage_Enter;
            txtMessage.Leave += TxtMessage_Leave;
            txtMessage.KeyPress += TxtMessage_KeyPress;
            
            // Cargar mensajes
            LoadMessages();
        }

        private void TxtMessage_Enter(object sender, EventArgs e)
        {
            if (txtMessage.Text == "Escribe tu mensaje aquí...")
            {
                txtMessage.Text = "";
                txtMessage.ForeColor = Color.Black;
            }
        }

        private void TxtMessage_Leave(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtMessage.Text))
            {
                txtMessage.Text = "Escribe tu mensaje aquí...";
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
