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
        HashSet<DateTime> fechasConTareas = new HashSet<DateTime>();
        Panel panelTareasCalendario = new Panel();
        List<ENTITY.Task> listaTareas = new List<ENTITY.Task>();
        public frmMain()
        {
            InitializeComponent();
            timer1.Interval = 10;
            InitializeLayout();
            taskLogic = new TaskLogic(Configuration.ConnectionString);
            statisticsLogic = new StatisticsLogic();
            statisticsLogic.VerificarRacha();
            this.WindowState = FormWindowState.Maximized;
            MostrarTareasAgrupadas();
            cmbAnio.Visible = false;
            cmbMes.Visible = false;
            panelCalendario.Visible = false;
            panelTareas.Visible = true;
            panelTareasCalendario.BackColor = Color.White;
            panelTareasCalendario.BorderStyle = BorderStyle.FixedSingle;
            panelTareasCalendario.Size = new Size(200, 150);
            panelTareasCalendario.Visible = false;
            panelTareasCalendario.AutoScroll = true;
            panelTareasCalendario.AutoSize = true;
            this.Controls.Add(panelTareasCalendario);
            this.MouseDown += OcultarPanelTareas;
            panelTareasCalendario.Padding = new Padding(10);
            panelTareasCalendario.BringToFront();
            // También lo puedes hacer para cada control contenedor (como el calendario)
            foreach (Control ctrl in this.Controls)
            {
                ctrl.MouseDown += OcultarPanelTareas;

                // Y si tienes paneles anidados:
                foreach (Control child in ctrl.Controls)
                    child.MouseDown += OcultarPanelTareas;
            }
        }
        private void OcultarPanelTareas(object sender, MouseEventArgs e)
        {
            if (!panelTareasCalendario.Bounds.Contains(PointToClient(MousePosition)))
                panelTareasCalendario.Visible = false;
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
            btnAlternarVista.Visible = true;
            panelContenedor.Controls.Add(btnAlternarVista);
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

            LimpiarPanelContenedor();
            panelTareas.Visible = false;
            frmStats frmStats = new frmStats();
            CargarFormularioEnPanel(frmStats);
        }

        private void btnAddTask_Click(object sender, EventArgs e)
        {
            LimpiarPanelContenedor();
            frmAddTask addtaskForm = new frmAddTask();
            addtaskForm.ShowDialog();
        }

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
            panelTareas.Visible = false;
            frmNote calculoForm = new frmNote();
            CargarFormularioEnPanel(calculoForm);
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

        private void panelTareas_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panel3_Paint(object sender, PaintEventArgs e)
        {
        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnHome_Click(object sender, EventArgs e)
        {
            LimpiarPanelContenedor();
            panelTareas.Visible = false;
            frmHome homeForm = new frmHome();
            CargarFormularioEnPanel(homeForm);

        }

        private void btnAlternarVista_MouseClick(object sender, MouseEventArgs e)
        {
            if (panelCalendario.Visible)
            {
                panelCalendario.Visible = false;
                panelTareas.Visible = true;
                lblAlternarVista.Text = "Ver calendario";
                Icono.BackgroundImage = Properties.Resources.Calendario;
                cmbAnio.Visible = false;
                cmbMes.Visible = false;
                tblCalendario.Visible = false;
            }
            else
            {
                panelCalendario.Visible = true;
                panelTareas.Visible = false;
                tblCalendario.Visible = true;
                lblAlternarVista.Text = "Ver lista";
                Icono.BackgroundImage = Properties.Resources.Lista;
                panelContenedor.Controls.Add(panelCalendario);
                panelContenedor.Controls.Add(cmbAnio);
                panelContenedor.Controls.Add(cmbMes);
                cmbAnio.Visible = true;
                cmbMes.Visible = true;
                InicializarCombos();
                GenerarCalendario();
            }
        }
        private void GenerarCalendario()
        {
            if (cmbMes.SelectedIndex == -1 || cmbAnio.SelectedItem == null)
                return;

            tblCalendario.SuspendLayout(); // Mejora visual

            int mes = cmbMes.SelectedIndex + 1;
            int anio = (int)cmbAnio.SelectedItem;
            DateTime primerDia = new DateTime(anio, mes, 1);
            int diasEnMes = DateTime.DaysInMonth(anio, mes);
            int diaInicio = (int)primerDia.DayOfWeek;

            // Ajustar para que el lunes sea 0
            diaInicio = (diaInicio == 0) ? 6 : diaInicio - 1;

            int dia = 1;

            // Limpiar contenido de las celdas (desde fila 1)
            for (int fila = 1; fila < tblCalendario.RowCount; fila++)
            {
                for (int col = 0; col < tblCalendario.ColumnCount; col++)
                {
                    Control celda = tblCalendario.GetControlFromPosition(col, fila);
                    if (celda is Panel panel)
                    {
                        panel.Controls.Clear();
                        panel.BackColor = Color.Honeydew; 
                    }
                    else if (celda != null)
                    {
                        tblCalendario.Controls.Remove(celda);
                        celda.BackColor = Color.Honeydew;
                        celda.Dispose();
                    }
                }
            }

            // Llenar calendario con los días del mes
            for (int i = diaInicio; dia <= diasEnMes; i++)
            {
                int fila = (i / 7) + 1;
                int col = i % 7;

                Panel celda = tblCalendario.GetControlFromPosition(col, fila) as Panel;

                if (celda == null)
                {
                    celda = new Panel
                    {
                        BackColor = Color.Honeydew,
                        BorderStyle = BorderStyle.FixedSingle,
                        Dock = DockStyle.Fill,
                        Margin = new Padding(1)
                    };
                    tblCalendario.Controls.Add(celda, col, fila);
                }
                else
                {
                    celda.Controls.Clear();
                }

                Label lblDia = new Label
                {
                    Text = dia.ToString(),
                    AutoSize = true,
                    Location = new Point(5, 5),
                    Font = new Font("Segoe UI", 10, FontStyle.Bold)
                };

                celda.Controls.Add(lblDia);
                celda.Tag = new DateTime(anio, mes, dia);
                DateTime fechaActual = new DateTime(anio, mes, dia);
                var tareasPendientes = taskLogic.GetTaskIncompletedByUser();
                var tareasDelDia = tareasPendientes.Where(t => t.EndDate.Date == fechaActual.Date).ToList();
                if (tareasDelDia.Any())
                {
                    celda.BackColor = Color.LightBlue;

                    Label lblTareas = new Label
                    {
                        Text = $"• {tareasDelDia.Count} tarea(s)",
                        AutoSize = true,
                        Location = new Point(5, 25),
                        Font = new Font("Segoe UI", 9),
                        ForeColor = Color.DarkBlue
                    };
                    fechasConTareas.Add(fechaActual);
                    celda.Controls.Add(lblTareas);
                    ToolTip toolTip = new ToolTip();
                    string textoTareas = string.Join(Environment.NewLine, tareasDelDia.Select(t => "• " + t.Title));
                    toolTip.SetToolTip(celda, textoTareas);
                }
                celda.MouseEnter += (s, e) => {
                    celda.BackColor = Color.White;
                };
                celda.MouseLeave += (s, e) => {
                    DateTime fechaCelda = (DateTime)celda.Tag;
                    if (!fechasConTareas.Contains(fechaCelda))
                        celda.BackColor = Color.Honeydew;
                    else
                        celda.BackColor = Color.LightBlue;
                };
                celda.Click += (s, e) =>
                {
                    DateTime fecha = (DateTime)celda.Tag;
                    List<ENTITY.Task> tareas = ObtenerTareas(fecha);
                    if (tareas.Count == 0)
                        return;

                    panelTareasCalendario.Controls.Clear();

                    Label titulo = new Label();
                    titulo.Text = $"Tareas del {fecha:dd/MM/yyyy}";
                    titulo.Font = new Font("Segoe UI", 10, FontStyle.Bold);
                    titulo.Dock = DockStyle.Top;
                    panelTareasCalendario.Controls.Add(titulo);
                    int y =35;
                    // Agregar tareas como Labels
                    foreach (var tarea in tareas)
                    {
                        Label lbl = new Label();
                        lbl.Text = "• " + tarea.Title;
                        lbl.AutoSize = true;
                        lbl.Location = new Point(5, y);
                        lbl.Font = new Font("Segoe UI", 11, FontStyle.Regular);
                        panelTareasCalendario.Controls.Add(lbl);
                        y += lbl.Height + 5;
                    }

                    // Posicionar el panel cerca de la celda
                    Point pos = celda.PointToScreen(Point.Empty);
                    pos = this.PointToClient(pos);
                    panelTareasCalendario.Location = new Point(pos.X + celda.Width + 5, pos.Y);
                    //panelTareasCalendario.Location = new Point(pos.X + 80, pos.Y + 10);
                    panelTareasCalendario.BringToFront();
                    panelTareasCalendario.Visible = true;
                };
                
                celda.Cursor = Cursors.Hand;
                dia++;
            }
            tblCalendario.ResumeLayout(); // Reanuda redibujo
        }
        public List<ENTITY.Task> ObtenerTareas(DateTime fecha)
        {
            return taskLogic.GetTaskIncompletedByUser()
                .Where(t => t.EndDate.Date == fecha.Date)
                .ToList();
        }
        private void InicializarCombos()
        {
            // Cargar meses
            cmbMes.Items.Clear();
            for (int i = 1; i <= 12; i++)
            {
                cmbMes.Items.Add(CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i));
            }
            cmbMes.SelectedIndex = DateTime.Now.Month - 1;

            // Cargar años (5 hacia atrás y 5 adelante)
            cmbAnio.Items.Clear();
            int anioActual = DateTime.Now.Year;
            for (int i = anioActual - 5; i <= anioActual + 5; i++)
            {
                cmbAnio.Items.Add(i);
            }
            cmbAnio.SelectedItem = anioActual;

            cmbMes.SelectedIndexChanged += (sender, e) => GenerarCalendario();
            cmbAnio.SelectedIndexChanged += (sender, e) => GenerarCalendario();
        }

        private void tblCalendario_Layout(object sender, LayoutEventArgs e)
        {
            //GenerarEncabezados();
        }
    }
}
