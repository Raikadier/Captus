using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using BLL;
using ENTITY;

namespace Presentation
{
    public partial class FrmCommandConfig : Form
    {
        private readonly ENTITY.Command _command;
        private readonly Dictionary<string, Control> _parameterControls;

        public FrmCommandConfig(ENTITY.Command command)
        {
            InitializeComponent();
            _command = command;
            _parameterControls = new Dictionary<string, Control>();
            
            InitializeUI();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            // 
            // FrmCommandConfig
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(400, 300);
            this.Name = "FrmCommandConfig";
            this.Text = "Configurar Comando";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.ResumeLayout(false);
        }

        private void InitializeUI()
        {
            this.Text = $"Configurar {_command.Name}";
            this.Size = new Size(400, 300);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.StartPosition = FormStartPosition.CenterParent;

            var panel = new Panel
            {
                Dock = DockStyle.Fill,
                Padding = new Padding(10)
            };

            var titleLabel = new Label
            {
                Text = _command.Name,
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                AutoSize = true,
                Location = new Point(10, 10)
            };
            panel.Controls.Add(titleLabel);

            var descriptionLabel = new Label
            {
                Text = _command.Description,
                Font = new Font("Segoe UI", 9),
                AutoSize = true,
                Location = new Point(10, 40)
            };
            panel.Controls.Add(descriptionLabel);

            var yOffset = 70;
            var parameters = ExtractParameters(_command.Pattern);
            foreach (var param in parameters)
            {
                var label = new Label
                {
                    Text = param,
                    AutoSize = true,
                    Location = new Point(10, yOffset)
                };
                panel.Controls.Add(label);

                var textBox = new TextBox
                {
                    Location = new Point(10, yOffset + 25),
                    Width = panel.Width - 40
                };
                panel.Controls.Add(textBox);
                _parameterControls[param] = textBox;

                yOffset += 60;
            }

            var buttonPanel = new Panel
            {
                Dock = DockStyle.Bottom,
                Height = 50,
                Padding = new Padding(10)
            };

            var cancelButton = new Button
            {
                Text = "Cancelar",
                DialogResult = DialogResult.Cancel,
                Location = new Point(buttonPanel.Width - 180, 10)
            };
            buttonPanel.Controls.Add(cancelButton);

            var okButton = new Button
            {
                Text = "Aceptar",
                DialogResult = DialogResult.OK,
                Location = new Point(buttonPanel.Width - 90, 10)
            };
            okButton.Click += OkButton_Click;
            buttonPanel.Controls.Add(okButton);

            this.Controls.Add(panel);
            this.Controls.Add(buttonPanel);
        }

        private List<string> ExtractParameters(string pattern)
        {
            var parameters = new List<string>();
            var matches = System.Text.RegularExpressions.Regex.Matches(pattern, @"\(([^)]+)\)");
            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                parameters.Add(match.Groups[1].Value);
            }
            return parameters;
        }

        private void OkButton_Click(object sender, EventArgs e)
        {
            var parameters = new List<string>();
            foreach (var control in _parameterControls.Values)
            {
                if (control is TextBox textBox)
                {
                    parameters.Add(textBox.Text);
                }
            }

            try
            {
                _command.Handler(string.Join(" ", parameters));
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al ejecutar el comando: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                this.DialogResult = DialogResult.None;
            }
        }
    }
} 