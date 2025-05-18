namespace Presentation
{
    partial class frmMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.panel1 = new System.Windows.Forms.Panel();
            this.panel2 = new System.Windows.Forms.Panel();
            this.label1 = new System.Windows.Forms.Label();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.txtTaskList = new System.Windows.Forms.Label();
            this.txtCalculo = new System.Windows.Forms.Label();
            this.btnMenu = new System.Windows.Forms.PictureBox();
            this.btnClose = new System.Windows.Forms.PictureBox();
            this.btnRestaurar = new System.Windows.Forms.PictureBox();
            this.btnMaximizar = new System.Windows.Forms.PictureBox();
            this.btnMinimizar = new System.Windows.Forms.PictureBox();
            this.picToDoList = new System.Windows.Forms.PictureBox();
            this.picCalculo = new System.Windows.Forms.PictureBox();
            this.btnCalculo = new System.Windows.Forms.PictureBox();
            this.btnTaskList = new System.Windows.Forms.PictureBox();
            this.picLogoCaptus = new System.Windows.Forms.PictureBox();
            this.panel1.SuspendLayout();
            this.panel2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.btnMenu)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnClose)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnRestaurar)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnMaximizar)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnMinimizar)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picToDoList)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picCalculo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnCalculo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnTaskList)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picLogoCaptus)).BeginInit();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.Green;
            this.panel1.Controls.Add(this.picToDoList);
            this.panel1.Controls.Add(this.picCalculo);
            this.panel1.Controls.Add(this.txtCalculo);
            this.panel1.Controls.Add(this.btnCalculo);
            this.panel1.Controls.Add(this.txtTaskList);
            this.panel1.Controls.Add(this.btnTaskList);
            this.panel1.Controls.Add(this.label1);
            this.panel1.Controls.Add(this.picLogoCaptus);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Left;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(200, 561);
            this.panel1.TabIndex = 0;
            // 
            // panel2
            // 
            this.panel2.Controls.Add(this.btnMenu);
            this.panel2.Controls.Add(this.btnClose);
            this.panel2.Controls.Add(this.btnRestaurar);
            this.panel2.Controls.Add(this.btnMaximizar);
            this.panel2.Controls.Add(this.btnMinimizar);
            this.panel2.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel2.Location = new System.Drawing.Point(200, 0);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(790, 43);
            this.panel2.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.Color.Honeydew;
            this.label1.Location = new System.Drawing.Point(57, 100);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(87, 19);
            this.label1.TabIndex = 31;
            this.label1.Text = "C A P T U S";
            this.label1.Click += new System.EventHandler(this.label1_Click);
            // 
            // timer1
            // 
            this.timer1.Tick += new System.EventHandler(this.timer1_Tick);
            // 
            // txtTaskList
            // 
            this.txtTaskList.AutoSize = true;
            this.txtTaskList.BackColor = System.Drawing.Color.WhiteSmoke;
            this.txtTaskList.Cursor = System.Windows.Forms.Cursors.Hand;
            this.txtTaskList.Font = new System.Drawing.Font("Century Gothic", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtTaskList.Location = new System.Drawing.Point(71, 179);
            this.txtTaskList.Name = "txtTaskList";
            this.txtTaskList.Size = new System.Drawing.Size(59, 20);
            this.txtTaskList.TabIndex = 33;
            this.txtTaskList.Text = "TaskList";
            // 
            // txtCalculo
            // 
            this.txtCalculo.AutoSize = true;
            this.txtCalculo.BackColor = System.Drawing.Color.WhiteSmoke;
            this.txtCalculo.Cursor = System.Windows.Forms.Cursors.Hand;
            this.txtCalculo.Font = new System.Drawing.Font("Century Gothic", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtCalculo.Location = new System.Drawing.Point(64, 230);
            this.txtCalculo.Name = "txtCalculo";
            this.txtCalculo.Size = new System.Drawing.Size(118, 17);
            this.txtCalculo.TabIndex = 35;
            this.txtCalculo.Text = "Grade Calculation";
            // 
            // btnMenu
            // 
            this.btnMenu.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnMenu.Image = global::Presentation.Properties.Resources.menu_hamburguesa;
            this.btnMenu.Location = new System.Drawing.Point(3, 3);
            this.btnMenu.Name = "btnMenu";
            this.btnMenu.Size = new System.Drawing.Size(50, 38);
            this.btnMenu.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnMenu.TabIndex = 29;
            this.btnMenu.TabStop = false;
            this.btnMenu.Click += new System.EventHandler(this.btnMenu_Click);
            // 
            // btnClose
            // 
            this.btnClose.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnClose.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnClose.Image = global::Presentation.Properties.Resources.icons8_close_window_50__2_;
            this.btnClose.Location = new System.Drawing.Point(753, 7);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(30, 26);
            this.btnClose.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnClose.TabIndex = 28;
            this.btnClose.TabStop = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // btnRestaurar
            // 
            this.btnRestaurar.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnRestaurar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnRestaurar.Image = global::Presentation.Properties.Resources.btnRestaurar;
            this.btnRestaurar.Location = new System.Drawing.Point(717, 7);
            this.btnRestaurar.Name = "btnRestaurar";
            this.btnRestaurar.Size = new System.Drawing.Size(30, 26);
            this.btnRestaurar.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnRestaurar.TabIndex = 27;
            this.btnRestaurar.TabStop = false;
            this.btnRestaurar.Visible = false;
            this.btnRestaurar.Click += new System.EventHandler(this.btnRestaurar_Click);
            // 
            // btnMaximizar
            // 
            this.btnMaximizar.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnMaximizar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnMaximizar.Image = global::Presentation.Properties.Resources.icons8_maximize_window_50__1_;
            this.btnMaximizar.Location = new System.Drawing.Point(717, 7);
            this.btnMaximizar.Name = "btnMaximizar";
            this.btnMaximizar.Size = new System.Drawing.Size(30, 26);
            this.btnMaximizar.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnMaximizar.TabIndex = 26;
            this.btnMaximizar.TabStop = false;
            this.btnMaximizar.Click += new System.EventHandler(this.btnMaximizar_Click);
            // 
            // btnMinimizar
            // 
            this.btnMinimizar.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnMinimizar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnMinimizar.Image = global::Presentation.Properties.Resources.btnMinimizar;
            this.btnMinimizar.Location = new System.Drawing.Point(681, 7);
            this.btnMinimizar.Name = "btnMinimizar";
            this.btnMinimizar.Size = new System.Drawing.Size(30, 26);
            this.btnMinimizar.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnMinimizar.TabIndex = 25;
            this.btnMinimizar.TabStop = false;
            this.btnMinimizar.Click += new System.EventHandler(this.btnMinimizar_Click);
            // 
            // picToDoList
            // 
            this.picToDoList.BackColor = System.Drawing.Color.WhiteSmoke;
            this.picToDoList.Image = global::Presentation.Properties.Resources.iconToDoList;
            this.picToDoList.Location = new System.Drawing.Point(21, 175);
            this.picToDoList.Name = "picToDoList";
            this.picToDoList.Size = new System.Drawing.Size(40, 27);
            this.picToDoList.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picToDoList.TabIndex = 37;
            this.picToDoList.TabStop = false;
            // 
            // picCalculo
            // 
            this.picCalculo.BackColor = System.Drawing.Color.WhiteSmoke;
            this.picCalculo.Image = global::Presentation.Properties.Resources.iconComputer;
            this.picCalculo.Location = new System.Drawing.Point(20, 224);
            this.picCalculo.Name = "picCalculo";
            this.picCalculo.Size = new System.Drawing.Size(40, 27);
            this.picCalculo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picCalculo.TabIndex = 36;
            this.picCalculo.TabStop = false;
            // 
            // btnCalculo
            // 
            this.btnCalculo.Image = global::Presentation.Properties.Resources.banner;
            this.btnCalculo.Location = new System.Drawing.Point(6, 211);
            this.btnCalculo.Name = "btnCalculo";
            this.btnCalculo.Size = new System.Drawing.Size(188, 60);
            this.btnCalculo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnCalculo.TabIndex = 34;
            this.btnCalculo.TabStop = false;
            // 
            // btnTaskList
            // 
            this.btnTaskList.Image = global::Presentation.Properties.Resources.banner;
            this.btnTaskList.Location = new System.Drawing.Point(6, 170);
            this.btnTaskList.Name = "btnTaskList";
            this.btnTaskList.Size = new System.Drawing.Size(188, 44);
            this.btnTaskList.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnTaskList.TabIndex = 32;
            this.btnTaskList.TabStop = false;
            // 
            // picLogoCaptus
            // 
            this.picLogoCaptus.Image = global::Presentation.Properties.Resources.lgCaptus;
            this.picLogoCaptus.Location = new System.Drawing.Point(34, 0);
            this.picLogoCaptus.Name = "picLogoCaptus";
            this.picLogoCaptus.Size = new System.Drawing.Size(132, 97);
            this.picLogoCaptus.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picLogoCaptus.TabIndex = 30;
            this.picLogoCaptus.TabStop = false;
            this.picLogoCaptus.Click += new System.EventHandler(this.picLogoCaptus_Click);
            // 
            // frmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.Honeydew;
            this.ClientSize = new System.Drawing.Size(990, 561);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frmMain";
            this.Text = "frmMain";
            this.Load += new System.EventHandler(this.frmMain_Load);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.btnMenu)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnClose)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnRestaurar)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnMaximizar)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnMinimizar)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picToDoList)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picCalculo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnCalculo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnTaskList)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picLogoCaptus)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.PictureBox btnMenu;
        private System.Windows.Forms.PictureBox btnClose;
        private System.Windows.Forms.PictureBox btnRestaurar;
        private System.Windows.Forms.PictureBox btnMaximizar;
        private System.Windows.Forms.PictureBox btnMinimizar;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.PictureBox picLogoCaptus;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.PictureBox btnTaskList;
        private System.Windows.Forms.Label txtCalculo;
        private System.Windows.Forms.PictureBox btnCalculo;
        private System.Windows.Forms.Label txtTaskList;
        private System.Windows.Forms.PictureBox picCalculo;
        private System.Windows.Forms.PictureBox picToDoList;
    }
}