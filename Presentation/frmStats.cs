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
            txtTaskCompleted.Text = stat.CompletedTasks.ToString();
            txtObjetivoActual.Text = taskLogic.GetCompletedTodayByUser().Count.ToString();
            txtObjetivoProp.Text = stat.DailyGoal.ToString();
            txtRacha.Text = stat.Racha.ToString();
        }
    }
}
