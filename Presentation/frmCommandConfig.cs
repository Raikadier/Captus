using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using BLL;
using ENTITY;
using System.Linq;

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

        private async void OkButton_Click(object sender, EventArgs e)
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
                if (Session.CurrentUser == null)
                    throw new InvalidOperationException("No hay una sesión de usuario activa.");

                var taskLogic = new TaskLogic();
                switch (_command.Name)
                {
                    case "Crear Tarea":
                        if (parameters.Count < 1)
                            throw new ArgumentException("Se requiere al menos el título de la tarea.");

                        var categoryService = new CategoryLogic();
                        var priorityService = new PriorityLogic();
                        string titulo = parameters[0];
                        string descripcion = parameters.Count > 1 ? parameters[1] : null;
                        DateTime fecha = parameters.Count > 2 ? DateTime.Parse(parameters[2]) : DateTime.Now.AddDays(7);
                        string prioridadTexto = parameters.Count > 3 ? parameters[3].ToLower() : "media";
                        string categoriaTexto = parameters.Count > 4 ? parameters[4].ToLower() : "personal";

                        // Buscar ID de prioridad
                        int prioridad = priorityService.GetAll().FirstOrDefault(p => p.Name.ToLower() == prioridadTexto)?.Id_Priority ?? 2;
                        // Buscar ID de categoría
                        int categoria = categoryService.GetAll().FirstOrDefault(c => c.Name.ToLower() == categoriaTexto)?.id ?? 4;

                        ENTITY.Task nuevaTarea;
                        var resultSave = taskLogic.CreateAndSaveTask(
                            titulo,
                            descripcion,
                            fecha,
                            prioridadTexto,
                            categoriaTexto,
                            Session.CurrentUser,
                            out nuevaTarea
                        );
                        if (!resultSave.Success)
                            throw new Exception(resultSave.Message);
                        await BLL.NotificationService.Instance.SendTaskNotificationAsync(nuevaTarea, "creada");
                        break;

                    case "Actualizar Tarea":
                        if (parameters.Count < 2)
                            throw new ArgumentException("Se requiere el ID y el nuevo título de la tarea.");

                        if (!int.TryParse(parameters[0], out int taskId))
                            throw new FormatException("El ID de la tarea debe ser un número válido.");

                        var tareaActualizar = new ENTITY.Task
                        {
                            Id_Task = taskId,
                            Title = parameters[1],
                            Description = parameters.Count > 2 ? parameters[2] : null,
                            EndDate = parameters.Count > 3 ? DateTime.Parse(parameters[3]) : DateTime.Now.AddDays(7)
                        };

                        var resultUpdate = taskLogic.Update(tareaActualizar);
                        if (!resultUpdate.Success)
                            throw new Exception(resultUpdate.Message);
                        await BLL.NotificationService.Instance.SendTaskUpdateNotificationAsync(tareaActualizar);
                        break;

                    case "Eliminar Tarea":
                        if (parameters.Count < 1)
                            throw new ArgumentException("Se requiere el ID de la tarea a eliminar.");

                        if (!int.TryParse(parameters[0], out int idToDelete))
                            throw new FormatException("El ID de la tarea debe ser un número válido.");

                        var tareaEliminada = taskLogic.GetById(idToDelete);
                        var resultDelete = taskLogic.Delete(idToDelete);
                        if (!resultDelete.Success)
                            throw new Exception(resultDelete.Message);
                        await BLL.NotificationService.Instance.SendTaskDeleteNotificationAsync(tareaEliminada);
                        break;

                    default:
                        _command.Handler(string.Join(" ", parameters));
                        break;
                }
            }
            catch (ArgumentException ex)
            {
                MessageBox.Show($"Error de validación: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                this.DialogResult = DialogResult.None;
            }
            catch (FormatException ex)
            {
                MessageBox.Show($"Error de formato: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                this.DialogResult = DialogResult.None;
            }
            catch (InvalidOperationException ex)
            {
                MessageBox.Show($"Error de operación: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                this.DialogResult = DialogResult.None;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error inesperado: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                this.DialogResult = DialogResult.None;
            }
        }

        private void FrmCommandConfig_Load(object sender, EventArgs e)
        {

        }
    }
} 