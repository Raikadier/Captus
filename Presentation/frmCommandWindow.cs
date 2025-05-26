using System;
using System.Windows.Forms;
using BLL;
using System.Threading.Tasks;

namespace Presentation
{
    public partial class frmCommandWindow : Form
    {
        private readonly CommandProcessor _commandProcessor;

        public frmCommandWindow()
        {
            InitializeComponent();
            _commandProcessor = new CommandProcessor();
            InitializeUI();
        }

        private void InitializeUI()
        {
            this.Text = "Captus - Ventana de Comandos";
            this.Size = new System.Drawing.Size(600, 400);
            this.StartPosition = FormStartPosition.CenterScreen;

            // Crear controles
            var txtCommand = new TextBox
            {
                Location = new System.Drawing.Point(12, 12),
                Size = new System.Drawing.Size(460, 23),
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
            };

            var btnExecute = new Button
            {
                Text = "Ejecutar",
                Location = new System.Drawing.Point(478, 11),
                Size = new System.Drawing.Size(100, 25),
                Anchor = AnchorStyles.Top | AnchorStyles.Right
            };

            var txtOutput = new TextBox
            {
                Location = new System.Drawing.Point(12, 41),
                Size = new System.Drawing.Size(566, 308),
                Multiline = true,
                ScrollBars = ScrollBars.Vertical,
                ReadOnly = true,
                Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Bottom
            };

            // Agregar controles al formulario
            this.Controls.AddRange(new Control[] { txtCommand, btnExecute, txtOutput });

            // Eventos
            btnExecute.Click += async (s, e) => await ExecuteCommand(txtCommand, txtOutput);
            txtCommand.KeyPress += async (s, e) =>
            {
                if (e.KeyChar == (char)Keys.Enter)
                {
                    e.Handled = true;
                    await ExecuteCommand(txtCommand, txtOutput);
                }
            };

            // Mostrar comandos disponibles
            var commands = _commandProcessor.GetAvailableCommands();
            txtOutput.Text = "Comandos disponibles:\r\n\r\n" + string.Join("\r\n", commands);
        }

        private async Task ExecuteCommand(TextBox txtCommand, TextBox txtOutput)
        {
            if (string.IsNullOrWhiteSpace(txtCommand.Text))
                return;

            var command = txtCommand.Text;
            txtCommand.Clear();

            // Agregar comando al output
            txtOutput.AppendText($"\r\n> {command}\r\n");

            try
            {
                var result = await _commandProcessor.ProcessCommandAsync(command);
                txtOutput.AppendText($"{result}\r\n");
            }
            catch (Exception ex)
            {
                txtOutput.AppendText($"Error: {ex.Message}\r\n");
            }

            // Scroll al final
            txtOutput.SelectionStart = txtOutput.Text.Length;
            txtOutput.ScrollToCaret();
        }

        private void frmCommandWindow_Load(object sender, EventArgs e)
        {

        }
    }
} 