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
            this.FormBorderStyle = FormBorderStyle.None;
            this.MaximizedBounds = Screen.FromHandle(this.Handle).WorkingArea;

            InitializeComponent();
            statisticsLogic = new StatisticsLogic();
            taskLogic = new TaskLogic();
            LoadStats();
            TableLoad();
        }
        private void TableLoad()
        {
            var lista = taskLogic.GetAllCompleted();
            dataGridView1.Rows.Clear();
            foreach (var tareas in lista)
            {
                if (tareas.Description == null)
                {
                    dataGridView1.Rows.Add(tareas.Title, "", tareas.Category);
                }
                dataGridView1.Rows.Add(tareas.Title, tareas.Description, tareas.Category);
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

            var tareasCompletadas = statisticsLogic.GetByCurrentUser().CompletedTasks;
            var tareasHoy = taskLogic.GetCompletedTodayByUser();
            int rachaActual = statisticsLogic.GetByCurrentUser().Racha;
            txtTaskCompleted.Text = tareasCompletadas.ToString();
            txtObjetivoActual.Text = tareasHoy.Count.ToString();
            txtObjetivoProp.Text = objetivo.ToString();
            txtRacha.Text = rachaActual.ToString();
        }
    }
}
