using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Presentation
{
    public partial class TarjetTask: UserControl
    {
        public int algo;
        public TarjetTask()
        {
            InitializeComponent();
            this.Size = new Size(400, 100);
            this.BackColor = Color.WhiteSmoke;
            this.Margin = new Padding(10);
        }
        public void Configurar(ENTITY.Task tarea)
        {
            algo = 4;
            lblTitle.Text = tarea.Title;
            rtxtDescription.Text = tarea.Description;
            lblCategory.Text = tarea.Category.Name;

            cbCompleted.Enabled = !tarea.IsDelay;

            panelTarjetTask.BorderStyle = BorderStyle.FixedSingle;
            panelTarjetTask.BackColor = Color.White;
            panelTarjetTask.Padding = new Padding(2);
            panelTarjetTask.Margin = new Padding(5);

            Color colorPrioridad = GetColorByPriority(tarea.Priority.Name);
            panelTarjetTask.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, panelTarjetTask.ClientRectangle,
                    colorPrioridad, 3, ButtonBorderStyle.Solid,
                    colorPrioridad, 3, ButtonBorderStyle.Solid,
                    colorPrioridad, 3, ButtonBorderStyle.Solid,
                    colorPrioridad, 3, ButtonBorderStyle.Solid);
            };
        }
        private Color GetColorByPriority(string prioridad)
        {
            switch (prioridad.ToLower())
            {
                case "alta":
                    return Color.Red;
                case "media":
                    return Color.Orange;
                case "baja":
                    return Color.Green;
                default:
                    return Color.Gray;
            }
        }
    }
}
