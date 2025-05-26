using BLL;
using ENTITY;
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
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace Presentation
{
    public partial class frmAddTask : Form
    {
        private readonly CategoryLogic categoryService;
        private readonly PriorityLogic priorityService;
        private readonly TaskLogic taskLogic;
        public frmAddTask()
        {
            InitializeComponent();
            this.StartPosition = FormStartPosition.CenterScreen;
            categoryService = new CategoryLogic();
            priorityService = new PriorityLogic();
            taskLogic = new TaskLogic(Configuration.ConnectionString);
            LoadPriorities();
            LoadCategories();
            RandomTitle();
            ConfigureTools();
            ConfigureCalendar();
        }
        private void ConfigureTools()
        {
            toolRefresh.SetToolTip(pnlRefresh, "Refrescar tarea");
            toolToday.SetToolTip(btnToday, "Establecer para hoy");
            toolTomorrow.SetToolTip(btnTomorrow, "Establecer para mañana");
            toolWeekend.SetToolTip(btnWeekend, "Establecer para el fin de semana");
            toolNextWeek.SetToolTip(btnNextWeek, "Establecer para la próxima semana");
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
        private void ConfigureCalendar()
        {
            dtmEndDate.MinDate = DateTime.Today;
            dtmEndDate.MaxDate = DateTime.Today.AddYears(1);
            dtmEndDate.Value = DateTime.Today;
            dtmEndDate.Format = DateTimePickerFormat.Custom;
            dtmEndDate.CustomFormat = "dddd, dd MMMM yyyy";
            dtmEndDate.Font = new Font("Segoe UI", 10F, FontStyle.Regular);
            dtmEndDate.CalendarTitleBackColor = Color.LightGreen;
            dtmEndDate.CalendarTitleForeColor = Color.DarkGreen;
            dtmEndDate.CalendarMonthBackground = Color.Honeydew;
        }
        private void LoadPriorities()
        {
            var priorities = priorityService.GetAll();

            cbPriority.DataSource = priorities;
            cbPriority.DisplayMember = "Name";
            cbPriority.ValueMember = "Id_Priority";
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
        string[] TitleTaskRandom = new string[]
        {
            "Estudiar para el parcial de Programacion III",
            "Estudiar para el parcial de Electromagnetismo",
            "Organizar apuntes de clase",
            "Limpiar mi sitio de estudio",
            "Ir al gym",
            "Leer un capítulo del libro de programación",
            "Preparar presentación para la clase",
            "Lavar la ropa",
            "Ver API's para implementar a mi proyecto",
            "Hacer presupuesto semanal",
            "Revisar tareas en AulaWeb",
            "Asistir a clase virtual de Ingeniería de Software",
            "Realizar el proyecto de seminario",
            "Organizar horario semanal",
            "Planear comidas de la semana",
            "Hacer lista de compras",
            "Limpiar la habitación",
            "Preparar la presentación del proyecto",
            "Revisar correos electrónicos",
            "Hacer seguimiento a tareas pendientes"
        };
        string[] DescriptionsTaskRandom = new string[]
        {
            "Aquí puedes describir mejor tus ideas...",
            "Pasos que debo seguir para esta tarea...",
            "Aquí puedes colocar puntos clave de la tarea...",
            "Resumen del tema para estudiar..."
        };
        private void RandomTitle()
        {
            Random random = new Random();
            int index = random.Next(TitleTaskRandom.Length);
            txtTitle.Text = TitleTaskRandom[index];
            txtTitle.Font = new Font("Javanese Text", 12, FontStyle.Italic);
            txtTitle.ForeColor = Color.Gray;
            RandomDescription();
        }
        private void RandomDescription()
        {
            Random random = new Random();
            int indexDescription = random.Next(DescriptionsTaskRandom.Length);
            txtDescription.Text = DescriptionsTaskRandom[indexDescription];
            txtDescription.Font = new Font("Javanese Text", 12, FontStyle.Italic);
            txtDescription.ForeColor = Color.Gray;
        }

        private void txtTitle_MouseEnter(object sender, EventArgs e)
        {

        }

        private void txtTitle_MouseClick(object sender, MouseEventArgs e)
        {
            if(txtTitle.ForeColor == Color.Gray)
            {
                txtTitle.Text = "";
                txtTitle.ForeColor = Color.Black;
                txtTitle.Font = new Font("Arial", 11, FontStyle.Regular);
            }
        }

        private void txtTitle_Click(object sender, EventArgs e)
        {

        }

        private void txtTitle_Leave(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtTitle.Text))
            {
                string tareaRandom = TitleTaskRandom[new Random().Next(TitleTaskRandom.Length)];
                txtTitle.Text = tareaRandom;
                txtTitle.ForeColor = Color.Gray;
                txtTitle.Font = new Font("Javanese Text", 12, FontStyle.Italic);
            }
        }

        private void panel3_MouseClick(object sender, MouseEventArgs e)
        {
            string nuevaTarea = TitleTaskRandom[new Random().Next(TitleTaskRandom.Length)];
            txtTitle.Text = nuevaTarea;
            txtTitle.ForeColor = Color.Gray;
            txtTitle.Font = new Font("Javanese Text", 12, FontStyle.Italic);
        }
        private bool ValideTask()
        {
            string titulo = txtTitle.Text.Trim();
            string descripcion = string.IsNullOrWhiteSpace(txtDescription.Text) ? null : txtDescription.Text.Trim();
            DateTime fecha = dtmEndDate.Value.Date;
            string prioridad = cbPriority.SelectedItem?.ToString();
            string categoria = cbCategories.SelectedItem?.ToString();

            if (string.IsNullOrEmpty(titulo))
            {
                MessageBox.Show("El título es obligatorio.", "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return false;
            }
            if (cbPriority.SelectedValue == null || cbCategories.SelectedValue == null)
            {
                MessageBox.Show("Selecciona correctamente una prioridad y una categoría.");
                return false;
            }
            return true;
        }

        private void txtDescription_MouseClick(object sender, MouseEventArgs e)
        {
            if (txtDescription.ForeColor == Color.Gray)
            {
                txtDescription.Text = "";
                txtDescription.ForeColor = Color.Black;
            }
        }

        private void txtDescription_Leave(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtDescription.Text))
            {
                RandomDescription();
            }
        }

        private void btnToday_MouseClick(object sender, MouseEventArgs e)
        {
            dtmEndDate.Value = DateTime.Today;
        }

        private void btnTomorrow_MouseClick(object sender, MouseEventArgs e)
        {
            dtmEndDate.Value = DateTime.Today.AddDays(1);
        }

        private void btnWeekend_MouseClick(object sender, MouseEventArgs e)
        {
            int diasHastaSabado = ((int)DayOfWeek.Saturday - (int)DateTime.Today.DayOfWeek + 7) % 7;
            if (diasHastaSabado == 0) diasHastaSabado = 7;
            dtmEndDate.Value = DateTime.Today.AddDays(diasHastaSabado);
        }

        private void btnNextWeek_MouseClick(object sender, MouseEventArgs e)
        {
            dtmEndDate.Value = DateTime.Today.AddDays(7);
        }

        private void cbPriority_SelectedIndexChanged(object sender, EventArgs e)
        {
            switch (cbPriority.SelectedItem)
            {
                case 0:
                    cbPriority.BackColor = Color.LightCoral;
                    cbPriority.ForeColor = Color.White;
                    
                    break;
                case 1:
                    cbPriority.BackColor = Color.SandyBrown;
                    cbPriority.ForeColor = Color.Black;
                    break;
                case 2:
                    cbPriority.BackColor = Color.LightBlue;
                    cbPriority.ForeColor = Color.Black;
                    break;
                default:
                    cbPriority.BackColor = SystemColors.Window;
                    cbPriority.ForeColor = Color.Black;
                    break;
            }
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.Dispose();
        }

        private void btnAddTask_Click(object sender, EventArgs e)
        {
            ProcessAddTask();
        }
        private async void ProcessAddTask()
        {
            if (ValideTask())
            {
                try
                {
                    if (Session.CurrentUser == null)
                        throw new InvalidOperationException("No hay una sesión de usuario activa.");

                    string titulo = txtTitle.Text.Trim();
                    string descripcion = string.IsNullOrWhiteSpace(txtDescription.Text) ? null : txtDescription.Text.Trim();
                    DateTime fecha = dtmEndDate.Value.Date;
                    int prioridad = Convert.ToInt32(cbPriority.SelectedValue);
                    int categoria = Convert.ToInt32(cbCategories.SelectedValue);

                    ENTITY.Task nuevaTarea = new ENTITY.Task
                    {
                        Title = titulo,
                        Category = categoryService.GetById(categoria),
                        Description = descripcion,
                        CreationDate = DateTime.Now,
                        EndDate = fecha,
                        Priority = priorityService.GetById(prioridad),
                        State = false,
                        User = Session.CurrentUser
                    };

                    var result = taskLogic.Save(nuevaTarea);
                    if (result.Success)
                    {
                        await BLL.NotificationService.Instance.SendTaskNotificationAsync(nuevaTarea, "creada");
                        MessageBox.Show("✅ Tarea agregada exitosamente.", "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        Clean();
                        this.Dispose();
                    }
                    else
                    {
                        MessageBox.Show(result.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
                catch (InvalidOperationException ex)
                {
                    MessageBox.Show($"Error de sesión: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                catch (FormatException ex)
                {
                    MessageBox.Show($"Error de formato: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"❌ Error inesperado al guardar la tarea:\n{ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }
        private void Clean()
        {
            txtTitle.Text = "";
            txtDescription.Text = "";
            dtmEndDate.Value = DateTime.Today;
            RandomTitle();
            RandomDescription();
            RandomTitle();
        }

        private void pnlRefresh_Paint(object sender, PaintEventArgs e)
        {

        }

        private void toolRefresh_Popup(object sender, PopupEventArgs e)
        {

        }

        private void btnClse_Click(object sender, EventArgs e)
        {
            this.Close();

        }

        private void btnCancelar_Click(object sender, EventArgs e)
        {
            this.Dispose();
        }

        private void btnAddTsk_Click(object sender, EventArgs e)
        {
            ProcessAddTask();
        }

        private void btnNextWeek_Paint(object sender, PaintEventArgs e)
        {

        }

        private void txtDescription_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
