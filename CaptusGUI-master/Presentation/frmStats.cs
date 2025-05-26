using BLL;
using ENTITY;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Presentation
{
    public partial class frmStats: Form
    {
        private readonly StatisticsLogic statisticsLogic;
        private readonly TaskLogic taskLogic;
        private Dictionary<string, Color> coloresCategoria = new Dictionary<string, Color>();
        public frmStats()
        {
            InitializeComponent();
            statisticsLogic = new StatisticsLogic();
            taskLogic = new TaskLogic(Configuration.ConnectionString);
            LoadStats();
            CargarTareasCompletadasEnPanel();
            MostrarFraseMotivadora();
        }
        private void CentrarFrase(Label lbl)
        {
            lbl.Left = (lbl.Parent.Width - lbl.Width) / 2;
        }
        private void MostrarFraseMotivadora()
        {
            string[] frases = new string[]
            {
        "Una tarea a la vez, un paso más cerca de tu meta.",
        "Completa hoy, conquista mañana.",
        "Cada tarea hecha, una preocupación menos.",
        "Hazlo hoy, para estar libre mañana.",
        "Pequeños pasos crean grandes logros.",
        "Tu esfuerzo de hoy, es tu éxito de mañana.",
        "Cumple tu meta, no tu excusa.",
        "Tú puedes con esto y más.",
        "Una tarea menos, una sonrisa más.",
        "Hoy es un buen día para avanzar."
            };

            Random random = new Random();
            int index = random.Next(frases.Length);
            lblMotivation.Text = frases[index];
            CentrarFrase(lblMotivation);
        }
        private void AsignarColoresPorCategoria()
        {
            var tareas = taskLogic.GetAllCompleted()
                         .OrderByDescending(t => t.CreationDate)
                         .ToList();
            var categorias = tareas.Select(t => t.Category.Name).Distinct();
            Random rnd = new Random();

            foreach (var cat in categorias)
            {
                if (!coloresCategoria.ContainsKey(cat))
                {
                    coloresCategoria[cat] = Color.FromArgb(rnd.Next(150, 255), rnd.Next(150), rnd.Next(150)); // Colores suaves
                }
            }
        }

        private Color GetColorPorCategoria(string categoria)
        {
            return coloresCategoria.ContainsKey(categoria) ? coloresCategoria[categoria] : Color.LightGray;
        }
        private void LoadStats()
        {
            var stat = statisticsLogic.GetByCurrentUser();
            if (stat == null)
            {
                MessageBox.Show("No hay estadísticas registradas para este usuario.");
                return;
            }
            int objetivo = stat.DailyGoal;
            var tareasHoy = taskLogic.GetCompletedTodayByUser();
            int completadasHoy = tareasHoy.Count;
            lblTaskCompleted.Text = taskLogic.GetAllCompleted().Count().ToString();
            ObjetiveDaily.Text = $"{completadasHoy} / {objetivo} tareas";
            lblRacha.Text = stat.Racha.ToString();
            UpdateLogoProgress(completadasHoy, objetivo);
        }
        private void CargarTareasCompletadasEnPanel()
        {
            tblTaskCompleted.Controls.Clear();

            var tareas = taskLogic.GetAllCompleted()
                         .OrderByDescending(t => t.CreationDate)
                         .ToList();
            AsignarColoresPorCategoria();
            foreach (var tarea in tareas)
            {
                Panel panelTarea = new Panel
                {
                    Width = tblTaskCompleted.Width - 30,
                    Height = 90,
                    BackColor = GetColorPorCategoria(tarea.Category.Name),
                    BorderStyle = BorderStyle.FixedSingle,
                    Margin = new Padding(5)
                };

                panelTarea.MouseEnter += (s, e) => panelTarea.BackColor = Color.LightGoldenrodYellow;
                panelTarea.MouseLeave += (s, e) => panelTarea.BackColor = GetColorPorCategoria(tarea.Category.Name);

                Label lblTitulo = new Label
                {
                    Text = tarea.Title,
                    Font = new Font("Segoe UI", 10, FontStyle.Bold),
                    Location = new Point(10, 5),
                    AutoSize = true
                };

                Label lblDescripcion = new Label
                {
                    Text = tarea.Description,
                    Font = new Font("Segoe UI", 9),
                    Location = new Point(10, 30),
                    AutoSize = true
                };

                Label lblFecha = new Label
                {
                    Text = tarea.CreationDate.ToShortDateString(),
                    Font = new Font("Segoe UI", 8, FontStyle.Italic),
                    ForeColor = Color.Gray,
                    Location = new Point(panelTarea.Width - 100, 5),
                    AutoSize = true
                };

                Button btnVerMas = new Button
                {
                    Text = "Subtareas",
                    Font = new Font("Segoe UI", 8),
                    Location = new Point(panelTarea.Width - 90, panelTarea.Height - 35),
                    Size = new Size(75, 25),
                    BackColor = Color.WhiteSmoke
                };
                btnVerMas.Click += (s, e) =>
                {
                    MessageBox.Show($"En el futuro aquí verás subtareas de: {tarea.Title}");
                };

                panelTarea.Controls.Add(lblTitulo);
                panelTarea.Controls.Add(lblDescripcion);
                panelTarea.Controls.Add(lblFecha);
                panelTarea.Controls.Add(btnVerMas);

                tblTaskCompleted.Controls.Add(panelTarea);
            }
        }
        private void UpdateLogoProgress(int completadas, int objetivo)
        {
            if (objetivo == 0) return;

            float porcentaje = Math.Min(1f, (float)completadas / objetivo); // Máximo 100%

            Bitmap imgGris = Properties.Resources.LogoCaptusGris_removebg_preview1;
            Bitmap imgColor = Properties.Resources.LOGOCaptus_removebg_preview1;

            Bitmap resultado = new Bitmap(imgGris.Width, imgGris.Height);
            using (Graphics g = Graphics.FromImage(resultado))
            {
                g.DrawImage(imgGris, 0, 0);

                Rectangle rectColor = new Rectangle(0, 0, (int)(imgColor.Width * porcentaje), imgColor.Height);
                g.DrawImage(imgColor, rectColor, rectColor, GraphicsUnit.Pixel);
            }

            picLogoProgress.Image = resultado;
        }
    }
}
