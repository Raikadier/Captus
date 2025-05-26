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
        private readonly CommandProcessor _commandProcessor;
        private readonly User _currentUser;
        private Form _suggestionForm;
        private bool _isShowingSuggestions = false;
        private bool commandSelected = false;
        private System.Windows.Forms.Label lblThinking;
        private System.Windows.Forms.Timer thinkingTimer;
        private int thinkingDotCount = 0;
        private ListBox _commandListBox; // Guardar referencia para eventos de teclado
        private bool isSendingMessage = false; // Flag para evitar envíos simultáneos
        private bool isCommandFromUI = false; // Flag para saber si el comando viene de la mini ventana

        // Diccionario de iconos por comando
        private readonly Dictionary<string, string> commandIcons = new Dictionary<string, string>
        {
            { "Crear Tarea", "📝" },
            { "Actualizar Tarea", "✏️" },
            { "Eliminar Tarea", "🗑️" },
            { "Consultar Tareas", "📋" },
            { "Calcular Nota", "🧮" },
            { "Calcular Promedio", "📊" }
        };

        // Constante para el texto del placeholder
        private const string PlaceholderText = "Escribe / para abrir los comandos o usa @Captus para pedir a Captus";
        private const string CaptusPlaceholder = "Para usar comandos, llama a @Captus";

        // --- PERSONALIZACIÓN DE MENSAJES Y FIX DE CRASH ---
        // 1. Colores personalizados para usuario e IA
        private readonly Color userMessageColor = Color.FromArgb(220, 255, 220); // Verde muy claro
        private readonly Color botMessageColor = Color.FromArgb(245, 246, 250); // Gris claro
        private readonly Color userTextColor = Color.FromArgb(33, 150, 83); // Verde principal
        private readonly Color botTextColor = Color.FromArgb(34, 40, 49); // Negro suave
        private readonly Color borderColor = Color.FromArgb(189, 189, 189); // Gris medio

        public FrmBot()
        {
            InitializeComponent();

            _aiService = new AIService(ENTITY.Configuration.OpenRouterKey);

            _chatLogic = new ChatLogic(_aiService);
            _commandProcessor = new CommandProcessor();
            _currentUser = new User { id = 1 };
            
            InitializeUI();
            LoadMessages();
            
            // En el constructor, después de InitializeComponent():
            lblThinking = new Label
            {
                Text = "",
                AutoSize = true,
                Font = new Font("Segoe UI", 12F, FontStyle.Bold | FontStyle.Italic),
                ForeColor = Color.FromArgb(33, 150, 83), // Verde principal
                BackColor = Color.White,
                Padding = new Padding(8),
                TextAlign = ContentAlignment.MiddleLeft,
                Visible = false
            };
            // Agrega el label al formulario principal, dockeado abajo (pero antes del panelBottom)
            this.Controls.Add(lblThinking);
            lblThinking.BringToFront();
            lblThinking.Dock = DockStyle.Bottom;
            this.Controls.SetChildIndex(lblThinking, 1); // Lo coloca justo encima del panelBottom
            thinkingTimer = new Timer { Interval = 400 };
            thinkingTimer.Tick += (s, e) =>
            {
                thinkingDotCount = (thinkingDotCount + 1) % 4;
                lblThinking.Text = "Pensando" + new string('.', thinkingDotCount);
            };

            // En el constructor o InitializeComponent, asegúrate de:
            // this.FormBorderStyle = FormBorderStyle.Sizable;
            // richTextBox1.Dock = DockStyle.Fill;
            // txtMessage.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Bottom;
            // btbnSendMessage.Anchor = AnchorStyles.Right | AnchorStyles.Bottom;
            // panel1.Dock = DockStyle.Top;
        }

        private void InitializeUI()
        {
            txtMessage.Text = PlaceholderText;
            txtMessage.ForeColor = Color.Gray;
            txtMessage.Enter += TxtMessage_Enter;
            txtMessage.Leave += TxtMessage_Leave;
            txtMessage.KeyPress += TxtMessage_KeyPress;
            txtMessage.TextChanged += TxtMessage_TextChanged;
        }

        private void TxtMessage_TextChanged(object sender, EventArgs e)
        {
            string text = txtMessage.Text;
            // Trigger de comandos con '/'
            if (text == "/" && !_isShowingSuggestions)
            {
                ShowCommandSuggestions();
            }
            else if (_isShowingSuggestions && !text.StartsWith("/"))
            {
                HideCommandSuggestions();
            }
            // El color parcial para @Captus se omite porque TextBox no lo soporta
        }

        private void ShowCommandSuggestions()
        {
            if (_suggestionForm == null)
            {
                _suggestionForm = new Form
                {
                    FormBorderStyle = FormBorderStyle.None,
                    StartPosition = FormStartPosition.Manual,
                    BackColor = Color.White,
                    Size = new Size(300, 200),
                    ShowInTaskbar = false
                };

                _commandListBox = new ListBox
                {
                    Dock = DockStyle.Fill,
                    BorderStyle = BorderStyle.None,
                    BackColor = Color.White,
                    Font = new Font("Segoe UI", 10F)
                };

                // Manejar selección con doble clic o Enter
                _commandListBox.MouseDoubleClick += (s, e) => SeleccionarComandoSugerido();
                _commandListBox.KeyDown += CommandListBox_KeyDown;
                _commandListBox.SelectedIndexChanged += (s, e) => { };

                _suggestionForm.Controls.Add(_commandListBox);
            }

            var commands = _commandProcessor.GetAvailableCommands();
            _commandListBox.Items.Clear();
            foreach (var c in commands)
            {
                // Si el comando tiene icono, úsalo; si no, asigna uno por defecto
                var icon = commandIcons.ContainsKey(c) ? commandIcons[c] : "⚡";
                _commandListBox.Items.Add($"{icon} {c}");
            }
            if (_commandListBox.Items.Count > 0)
                _commandListBox.SelectedIndex = 0;

            // Calcula la posición del último mensaje en el RichTextBox
            int lastChar = richTextBox1.TextLength > 0 ? richTextBox1.TextLength - 1 : 0;
            Point lastPos = richTextBox1.GetPositionFromCharIndex(lastChar);
            Point screenPos = richTextBox1.PointToScreen(new Point(lastPos.X, lastPos.Y + 30));
            _suggestionForm.Location = screenPos;
            _suggestionForm.Show();
            _isShowingSuggestions = true;
            _commandListBox.Focus(); // Dar foco para navegación con teclado
        }

        private void CommandListBox_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                SeleccionarComandoSugerido();
                e.Handled = true;
            }
            else if (e.KeyCode == Keys.Escape)
            {
                HideCommandSuggestions();
                txtMessage.Focus();
                e.Handled = true;
            }
            // Flechas arriba/abajo ya son manejadas por el ListBox
        }

        private void SeleccionarComandoSugerido()
        {
            if (_commandListBox.SelectedItem != null)
            {
                string selected = _commandListBox.SelectedItem.ToString();
                // Extraer el nombre del comando quitando el icono y espacios
                string nombreComando = selected.Substring(selected.IndexOf(' ') + 1).Trim();

                string plantilla;
                switch (nombreComando)
                {
                    case "Crear Tarea":
                        plantilla = "crear tarea [título] descripción [descripción] para [fecha YYYY-MM-DD] prioridad [alta|media|baja] categoría [universidad|trabajo|personal]";
                        break;
                    case "Actualizar Tarea":
                        plantilla = "actualizar tarea [id] título [nuevo título] descripción [nueva descripción] para [nueva fecha YYYY-MM-DD] prioridad [nueva prioridad alta|media|baja] categoría [nueva categoría universidad|trabajo|personal]";
                        break;
                    case "Eliminar Tarea":
                        plantilla = "eliminar tarea [id]";
                        break;
                    case "Consultar Tareas":
                        plantilla = "consultar tareas [filtro opcional]";
                        break;
                    case "Calcular Nota":
                         plantilla = "calcular nota [materia] con [notas separadas por coma]";
                         break;
                    case "Calcular Promedio":
                         plantilla = "calcular promedio [semestral|acumulado]";
                         break;
                    default:
                        plantilla = "Escribe un comando válido o selecciona una opción de la lista.";
                        break;
                }

                txtMessage.Text = plantilla;
                // Posicionar el cursor al inicio del primer parámetro esperado (el primer '[')
                int primerCorchete = plantilla.IndexOf('[');
                if (primerCorchete >= 0)
                {
                    txtMessage.SelectionStart = primerCorchete;
                }
                else
                {
                    // Si no hay corchetes, posicionar al final del texto.
                    txtMessage.SelectionStart = plantilla.Length;
                }
                txtMessage.SelectionLength = 0; // Asegurar que no haya texto seleccionado

                HideCommandSuggestions();
                commandSelected = true; // Indicar que se seleccionó un comando de la UI
                isCommandFromUI = true; // Flag para saber si el comando viene de la mini ventana
                txtMessage.Focus();
            }
        }

        private void HideCommandSuggestions()
        {
            if (_suggestionForm != null)
            {
                _suggestionForm.Hide();
                _isShowingSuggestions = false;
            }
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
            HideCommandSuggestions(); // Oculta sugerencias al perder foco
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

                    // Mostrar los mensajes más nuevos primero
                    foreach (var message in messages.OrderByDescending(m => m.SendDate))

                    foreach (var message in messages.OrderBy(m => m.SendDate))

                    {
                        DisplayMessage(message);
                    }
                }
            }
            catch (Exception ex)
            {
                frmMessageBox.Show("Error al cargar mensajes", "Error");
            }
        }

        private void DisplayMessage(ChatMessage message, bool isError = false, bool isQuestion = false)
        {
            // Alineación: usuario a la derecha, IA a la izquierda
            string sender = message.IsUserMessage ? "Tú" : "IA";
            string timestamp = message.SendDate.ToString("HH:mm");
            Color messageColor = message.IsUserMessage ? userMessageColor : botMessageColor;
            Color textColor = message.IsUserMessage ? userTextColor : botTextColor;
            Color timestampColor = Color.FromArgb(128, 128, 128);
            Font messageFont = new Font("Segoe UI", 11F, FontStyle.Regular);
            Font timestampFont = new Font("Segoe UI", 8F, FontStyle.Italic);
            bool isUser = message.IsUserMessage;
            PrependBubbleToRichTextBox(timestamp, sender, message.Message, messageColor, borderColor, timestampColor, messageFont, timestampFont, isUser);
        }

        private void PrependBubbleToRichTextBox(string timestamp, string sender, string messageText, Color messageColor, Color borderColor, Color timestampColor, Font messageFont, Font timestampFont, bool isUser)
        {
            // Guardar el texto actual y la posición del scroll
            string currentText = richTextBox1.Text;
            int oldScroll = richTextBox1.GetPositionFromCharIndex(0).Y;
            
            // Limpiar solo si es el primer mensaje, para evitar perder mensajes anteriores
            if (string.IsNullOrWhiteSpace(currentText))
                richTextBox1.Clear();
            
            // Insertar el nuevo mensaje al final (para evitar sobrescribir)
            richTextBox1.SelectionStart = richTextBox1.TextLength;
            richTextBox1.SelectionLength = 0;
            richTextBox1.SelectionColor = timestampColor;
            richTextBox1.SelectionFont = timestampFont;
            richTextBox1.AppendText($"{timestamp} - {sender}\n");
            richTextBox1.SelectionBackColor = isUser ? userMessageColor : botMessageColor;
            richTextBox1.SelectionColor = isUser ? userTextColor : botTextColor;
            richTextBox1.SelectionFont = messageFont;
            richTextBox1.AppendText($"{messageText}\n\n");
            richTextBox1.SelectionBackColor = richTextBox1.BackColor;
            richTextBox1.SelectionColor = Color.Black;
            
            // Scroll al final
            richTextBox1.ScrollToCaret();
        }

        private void DisplayMessage(string message, bool isError = false, bool isQuestion = false)
        {
            Color color = isError ? Color.OrangeRed : isQuestion ? Color.Goldenrod : botTextColor;
            string prefix = isError ? "⚠️ " : isQuestion ? "❓ " : "";
            richTextBox1.SelectionColor = color;
            richTextBox1.AppendText($"{prefix}{message}\n\n");
            richTextBox1.SelectionColor = Color.Black;
        }

        private async void BtnSendMessage_Click(object sender, EventArgs e)
        {
            if (isSendingMessage) return;
            isSendingMessage = true;
            try
            {
                string userText = txtMessage.Text;
                if (string.IsNullOrWhiteSpace(userText) || userText == PlaceholderText)
                {
                    isSendingMessage = false;
                    return;
                }

                txtMessage.Clear();
                txtMessage.Enabled = false;
                btbnSendMessage.Enabled = false;

                // Mostrar mensaje del usuario a la derecha y guardarlo
                var userMessage = new ChatMessage
                {
                    Message = userText,
                    SendDate = DateTime.Now,
                    IsUserMessage = true,
                    User = _currentUser
                };
                DisplayMessage(userMessage, false, false);

                // Mostrar animación de "Pensando..."
                thinkingDotCount = 0;
                lblThinking.Text = "Pensando";
                lblThinking.Visible = true;
                thinkingTimer.Start();

                string response = null;
                try
                {
                    if (isCommandFromUI)
                    {
                        // Solo ejecutar comandos si vienen de la mini ventana
                        response = await _commandProcessor.ProcessCommandAsync(userText);
                    }
                    else if (userText.TrimStart().StartsWith("@Captus", StringComparison.OrdinalIgnoreCase))
                    {
                        // Trigger + lenguaje natural (NO comando)
                        response = await _commandProcessor.ProcessCommandAsync(userText);
                    }
                    else
                    {
                        // Flujo conversacional
                        var botMessage = await _chatLogic.ProcessUserMessageAsync(userText, _currentUser);
                        response = botMessage?.Message ?? "No se pudo obtener una respuesta.";
                    }
                }
                catch (Exception ex)
                {
                    response = $"Error inesperado: {ex.Message}";
                }
                finally
                {
                    thinkingTimer.Stop();
                    lblThinking.Visible = false;
                }

                // Detectar si es pregunta o error
                bool isError = response.StartsWith("Error") || response.Contains("no se pudo") || response.Contains("no pude");
                bool isQuestion = response.Contains("¿") && response.Contains("?") && !isError;

                // Mostrar mensaje de la IA a la izquierda
                DisplayMessage(response, isError, isQuestion);

                if (isError)
                {
                    MessageBox.Show(response, "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                if (isQuestion)
                {
                    txtMessage.Focus();
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
                isSendingMessage = false;
                isCommandFromUI = false; // Resetear flag después de cada envío
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
            richTextBox1.Clear(); // Borra historial automáticamente
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

        private void FrmBot_FormClosing(object sender, FormClosingEventArgs e)
            {
                richTextBox1.Clear();
            }

        private void BtnClose_Click(object sender, EventArgs e)
        {
            this.Close();

        }


        

        //private void btnMinimizar_Click(object sender, EventArgs e)
        //{
        //    this.WindowState = FormWindowState.Minimized;

        //}

        

        
    }
}
