using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Runtime.InteropServices;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using BLL;
using ENTITY;

namespace Presentation
{
    public partial class frmMain : Form
    {
        bool isExpanding = false;
        bool isCollapsing = false;
        int expandedWidth = 200;
        int collapsedWidth = 45;
        int step = 7; // velocidad de animación
        private readonly StatisticsLogic statisticsLogic;
        private readonly TaskLogic taskLogic;



        public frmMain()
        {
            InitializeComponent();
            timer1.Interval = 10;
            InitializeLayout();
            taskLogic = new TaskLogic(Configuration.ConnectionString);
            statisticsLogic = new StatisticsLogic();
            statisticsLogic.VerificarRacha();
            MostrarTareasAgrupadas();
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
        private void MostrarTareasAgrupadas()
        {
            panelTareas.Controls.Clear();
            var tareasPendientes = taskLogic.GetTaskIncompletedByUser();                         
            var tareasPorFecha = tareasPendientes
                .GroupBy(t => t.EndDate.Date)
                .OrderBy(g => g.Key);

            foreach (var grupo in tareasPorFecha)
            {
                string tituloFecha = ObtenerTituloFecha(grupo.Key);

                // Crear label para la fecha
                Label lblFecha = new Label
                {
                    Text = tituloFecha,
                    Font = new Font("Segoe UI", 12, FontStyle.Bold),
                    ForeColor = Color.DarkGreen,
                    Padding = new Padding(0, 10, 0, 5),
                    AutoSize = true
                };

                panelTareas.Controls.Add(lblFecha);

                // Mostrar tarjetas de tareas
                foreach (var tarea in grupo)
                {
                    Panel tarjeta = CrearTarjetaTarea(tarea);
                    tarjeta.Click += (s, e) =>
                    {
                        frmTaskDetails form = new frmTaskDetails(tarea);
                        form.ShowDialog();
                        MostrarTareasAgrupadas();
                    };
                    panelTareas.Controls.Add(tarjeta);
                }
            }
        }
        private void CargarFormularioEnPanel(Form formulario)
        {
            panelContenedor.Controls.Clear();
            formulario.TopLevel = false;
            formulario.FormBorderStyle = FormBorderStyle.None;
            formulario.Dock = DockStyle.Fill;
            panelContenedor.Controls.Add(formulario);
            formulario.Show();
        }
        private Panel CrearTarjetaTarea(ENTITY.Task tarea)
        {
            Panel panel = new Panel
            {
                Width = panelTareas.Width-40,
                Height = 90,
                BackColor = Color.Honeydew,
                Margin = new Padding(10),
                Padding = new Padding(10),
                Cursor = Cursors.Hand
            };

            Color colorPrioridad = ObtenerColorPrioridad(tarea.Priority.Name);
            panel.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, panel.ClientRectangle,
                    colorPrioridad, 3, ButtonBorderStyle.Solid,
                    colorPrioridad, 3, ButtonBorderStyle.Solid,
                    colorPrioridad, 3, ButtonBorderStyle.Solid,
                    colorPrioridad, 3, ButtonBorderStyle.Solid);
            };

            Label txtTitle = new Label
            {
                Text = tarea.Title,
                Font = new Font("Arial", 14, FontStyle.Bold),
                AutoSize = true,
                Location=new Point(75,8)
            };

            Label txtDescription = new Label
            {
                Text = string.IsNullOrEmpty(tarea.Description) ? string.Empty : (tarea.Description.Length > 60 ? tarea.Description.Substring(0, 57) + "..." : tarea.Description),
                Font = new Font("Segoe UI", 12),
                ForeColor = Color.Gray,
                AutoSize = true,
                Location = new Point(30, 40)
            };

            Label txtCategoria = new Label
            {
                Text = tarea.Category.Name,
                Font = new Font("Segoe UI", 10, FontStyle.Italic),
                ForeColor = Color.DarkSlateGray,
                AutoSize = true,
                Location = new Point(500, 60)
            };
            if (tarea.EndDate.Date >= DateTime.Now.Date)
            {
                CheckBox chkCompletar = new CheckBox
                {
                    Text = "✔",
                    Font = new Font("Segoe UI", 12),
                    AutoSize = true,
                    Location = new Point(10, 9),
                    ForeColor = Color.Green
                };
                chkCompletar.CheckedChanged += (s, e) =>
                {
                    if (chkCompletar.Checked)
                    {
                        tarea.State = true;
                        tarea.CreationDate = DateTime.Now;
                        taskLogic.Update(tarea);
                        MostrarTareasAgrupadas(); // refrescar vista
                    }
                };
                panel.Controls.Add(chkCompletar);
            }

            panel.Controls.Add(txtTitle);
            panel.Controls.Add(txtDescription);
            panel.Controls.Add(txtCategoria);
            
            return panel;
        }
        private string ObtenerTituloFecha(DateTime fecha)
        {
            DateTime hoy = DateTime.Today;
            if(fecha < hoy)
                return "Tareas Pasadas";
            else if (fecha == hoy)
                return "Hoy";
            else if (fecha == hoy.AddDays(1))
                return "Mañana";
            else
                return fecha.ToString("dddd, dd MMMM", new CultureInfo("es-ES"));
        }
        private Color ObtenerColorPrioridad(string prioridad)
        {
            switch(prioridad.ToLower())
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
        private void InitializeLayout()
        {
            picLogoCaptus.SizeMode = PictureBoxSizeMode.Zoom;
            label1.Visible = true;

            foreach (Control ctrl in panel1.Controls)
            {
                if (ctrl is Button btn)
                {
                    //btn.TextImageRelation = TextImageRelation.ImageAboveText;
                    ////btn.ImageAlign = ContentAlignment.MiddleCenter;
                    //btn.TextAlign = ContentAlignment.MiddleCenter;

                    //btn.TextImageRelation = TextImageRelation.ImageAboveText;
                    //btn.ImageAlign = ContentAlignment.MiddleCenter;
                    btn.TextAlign = ContentAlignment.MiddleCenter;
                }
            }
        }

        

        private void frmMain_Load(object sender, EventArgs e)
        {
            picLogoCaptus.SizeMode = PictureBoxSizeMode.Zoom;
            picLogoCaptus.Width = panel1.Width;


            // Establecer el tamaño inicial del panel (expandido)
            panel1.Width = expandedWidth;
            // Actualizar UI del panel al estado expandido
            UpdatePanelUI(true); // true = expandido
        }

        private void UpdatePanelUI(bool expanded)
        {
            // --- Ajustar tamaño del logo ---
            int logoSize = (int)(panel1.Width * 0.6);
            picLogoCaptus.Width = logoSize;
            picLogoCaptus.Height = logoSize;
            picLogoCaptus.Location = new Point(
                (panel1.Width - picLogoCaptus.Width) / 2,
                20
            );

            // --- Ajustar label debajo del logo ---
            //label1.Font = new Font("Segoe UI", expanded ? 12 : 8, FontStyle.Bold);
            label1.Visible = expanded;
            label1.Location = new Point(
                (panel1.Width - label1.PreferredWidth) / 2,
                picLogoCaptus.Bottom + 5
            );

            foreach (Control ctrl in panel1.Controls)
            {
                if (ctrl is Button btn)
                {
                    
                    btn.Width = expanded ? 180 : 50;

                    //btn.TextImageRelation = expanded ? TextImageRelation.ImageAboveText : TextImageRelation.Overlay;
                    //btn.ImageAlign = ContentAlignment.MiddleCenter;
                    btn.TextAlign = ContentAlignment.MiddleCenter;
                }
            }

            // --- Ajustar botones ---
            //foreach (Control ctrl in panel1.Controls)
            //{
            //    if (ctrl is Button btn)
            //    {
            //        //btn.Text = expanded ? btn.Tag?.ToString() ?? "" : "";
            //        //btn.TextImageRelation = expanded ? TextImageRelation.ImageBeforeText : TextImageRelation.Overlay;
            //        //btn.ImageAlign = ContentAlignment.MiddleCenter;
            //        //btn.TextAlign = ContentAlignment.MiddleLeft;

            //        //btn.Text = expanded ? btn.Tag?.ToString() ?? "" : "";
            //        btn.Width = expanded ? 180 : 50;
            //        btn.TextImageRelation = expanded ? TextImageRelation.ImageBeforeText : TextImageRelation.Overlay;
            //        btn.ImageAlign = ContentAlignment.MiddleLeft;
            //        btn.TextAlign = ContentAlignment.MiddleCenter;

            //    }
            //}
        }

        private void btnMinimizar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
        }

        private void btnRestaurar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Normal;
            btnRestaurar.Visible = false;
            btnMaximizar.Visible = true;
            btnMaximizar.BringToFront();  // Este botón va arriba
        }

        private void btnMaximizar_Click(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Maximized;
            btnMaximizar.Visible = false;
            btnRestaurar.Visible = true;
            btnRestaurar.BringToFront();  // Este botón va arriba
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void btnMenu_Click(object sender, EventArgs e)
        {
            if (panel1.Width == expandedWidth)
            {
                isCollapsing = true;
                isExpanding = false;
            }
            else
            {
                isExpanding = true;
                isCollapsing = false;
            }

            timer1.Start();
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (isExpanding)
            {
                if (panel1.Width < expandedWidth)
                {
                    panel1.Width += step;
                    if (panel1.Width >= expandedWidth)
                    {
                        panel1.Width = expandedWidth;
                        timer1.Stop();
                        isExpanding = false;
                    }
                }
            }
            else if (isCollapsing)
            {
                if (panel1.Width > collapsedWidth)
                {
                    panel1.Width -= step;
                    if (panel1.Width <= collapsedWidth)
                    {
                        panel1.Width = collapsedWidth;
                        timer1.Stop();
                        isCollapsing = false;
                    }
                }
            }

            picLogoCaptus.Width = panel1.Width;

            // Adaptar logo en tiempo real
            int logoSize = (int)(panel1.Width * 0.6); // Ejemplo: 60% del ancho del panel
            picLogoCaptus.Width = logoSize;
            picLogoCaptus.Height = logoSize;
            picLogoCaptus.Location = new Point(
                (panel1.Width - picLogoCaptus.Width) / 2,
                30 // margen superior
            );

            // Ajustar label debajo del logo
            label1.Font = new Font("Segoe UI", panel1.Width >= expandedWidth ? 12 : 8, FontStyle.Bold);
            label1.Visible = panel1.Width >= expandedWidth - 5;
            label1.Location = new Point(
                (panel1.Width - label1.PreferredWidth) / 2,
                picLogoCaptus.Bottom + 10 // justo debajo del logo
            );

            //// Ajustar label de los botones
            //txtTaskList.Font = new Font("Segoe UI", panel1.Width >= expandedWidth ? 12 : 8, FontStyle.Bold);
            //txtTaskList.Visible = panel1.Width >= expandedWidth;
            //txtTaskList.Location = new Point(
            //    (panel1.Width - txtTaskList.PreferredWidth) / 2,
            //    picLogoCaptus.Bottom + 5 // justo debajo del logo
            //);

            


        }

        //private void UpdatePanelContent(bool expanded)
        //{
        //    label1.Visible = expanded;

        //    foreach (Control ctrl in panel1.Controls)
        //    {
        //        if (ctrl is Button btn)
        //        {
        //            btn.Text = expanded ? btn.Tag?.ToString() ?? "" : "";
        //            btn.TextImageRelation = expanded ? TextImageRelation.ImageBeforeText : TextImageRelation.Overlay;
        //            btn.ImageAlign = ContentAlignment.MiddleCenter;
        //            btn.TextAlign = ContentAlignment.MiddleLeft;
        //        }
        //    }
        //}

        private void picLogoCaptus_Click(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void txtCalculo_Click(object sender, EventArgs e)
        {

        }

        private void txtUserP_Click(object sender, EventArgs e)
        {

        }

        private void txtTaskList_Click(object sender, EventArgs e)
        {

        }

        private void AbrirFormInPanel(object formhijo)
        {
            if (this.panelContenedor.Controls.Count > 0)
                this.panelContenedor.Controls.RemoveAt(0);
            Form fh = formhijo as Form;
            fh.TopLevel = false;
            fh.FormBorderStyle = FormBorderStyle.None;
            fh.Dock = DockStyle.Fill;
            this.panelContenedor.Controls.Add(fh);
            this.panelContenedor.Tag = fh;
            fh.Show();
        }

        private void btnTaskList_Click(object sender, EventArgs e)
        {
            LimpiarPanelContenedor();
            panelTareas.Visible = true;
            panelContenedor.Controls.Add(panelTareas);
            MostrarTareasAgrupadas();
        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            this.Dispose();
            frmLogin loginForm = new frmLogin();
            loginForm.Show();
        }

        private void Panel2_MouseDown(object sender, MouseEventArgs e)
        {
            ReleaseCapture();
            SendMessage(this.Handle, 0x112, 0xf012, 0);
        }

        private void panelContenedor_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnProfile_Click(object sender, EventArgs e)
        {
            frmStats frmStats = new frmStats();
            frmStats.ShowDialog();
        }

        private void btnAddTask_Click(object sender, EventArgs e)
        {
            LimpiarPanelContenedor();
            frmAddTask addtaskForm = new frmAddTask();
            addtaskForm.ShowDialog();
        }

        //private void btnChatBot_Click(object sender, EventArgs e)
        //{
        //    LimpiarPanelContenedor();
        //    panelTareas.Visible = false;
        //    FrmBot bot = new FrmBot();
        //    CargarFormularioEnPanel(bot);
        //}

        private void btnChatBot_Paint(object sender, PaintEventArgs e)
        {

        }
        private void LimpiarPanelContenedor()
        {
            foreach (Control ctrl in panelContenedor.Controls)
            {
                ctrl.Visible = false;
            }
        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void btnChatBot_Click_1(object sender, EventArgs e)
        {
            LimpiarPanelContenedor();
            panelTareas.Visible = false;
            FrmBot bot = new FrmBot();
            CargarFormularioEnPanel(bot);
        }

        private void btnCalcular_Click(object sender, EventArgs e)
        {
            LimpiarPanelContenedor();
            frmCalculo calculoForm = new frmCalculo();
            calculoForm.ShowDialog();
        }

        private void btnClse_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void btnMinimizar_Click_1(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;

        }

        private void btnMaximizar_Click_1(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Maximized;
            btnMaximizar.Visible = false;
            btnRestaurar.Visible = true;
            btnRestaurar.BringToFront();  // Este botón va arriba
        }

        private void btnRestaurar_Click_1(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Normal;
            btnRestaurar.Visible = false;
            btnMaximizar.Visible = true;
            btnMaximizar.BringToFront();  // Este botón va arriba
        }
    }
}
