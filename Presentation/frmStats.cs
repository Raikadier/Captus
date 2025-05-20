using BLL;
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
        public frmStats()
        {
            InitializeComponent();
            statisticsLogic = new StatisticsLogic();
            taskLogic = new TaskLogic();
            LoadStats();
            TableLoad();
            txtEditObjetivo.Text = statisticsLogic.GetByCurrentUser().DailyGoal.ToString();
        }
        private void TableLoad()
        {
            var lista = taskLogic.GetAllCompleted();
            dataGridView1.Rows.Clear();
            foreach (var tareas in lista)
            {
                dataGridView1.Rows.Add(tareas.Title, tareas.Description ?? "", tareas.Category.Name);
            }
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
            lblTaskCompleted.Text = stat.CompletedTasks.ToString();
            txtObjetivoActual.Text = taskLogic.GetCompletedTodayByUser().Count.ToString();
            ObjetiveDaily.Text = $"{completadasHoy} / {objetivo} tareas";
            UpdateLogoProgress(completadasHoy, objetivo);
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
