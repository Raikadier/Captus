namespace Presentation
{
    partial class frmStats
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(frmStats));
            this.panel1 = new System.Windows.Forms.Panel();
            this.panel5 = new System.Windows.Forms.Panel();
            this.lblMotivation = new System.Windows.Forms.Label();
            this.lblRacha = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.panel6 = new System.Windows.Forms.Panel();
            this.tblTaskCompleted = new System.Windows.Forms.FlowLayoutPanel();
            this.panel4 = new System.Windows.Forms.Panel();
            this.ObjetiveDaily = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.picLogoProgress = new System.Windows.Forms.PictureBox();
            this.panel3 = new System.Windows.Forms.Panel();
            this.label8 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.lblTaskCompleted = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.panel2 = new System.Windows.Forms.Panel();
            this.label4 = new System.Windows.Forms.Label();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.btnClse = new System.Windows.Forms.Button();
            this.panel1.SuspendLayout();
            this.panel5.SuspendLayout();
            this.panel4.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogoProgress)).BeginInit();
            this.panel3.SuspendLayout();
            this.panel2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.FromArgb(245, 246, 250);
            this.panel1.Controls.Add(this.panel5);
            this.panel1.Controls.Add(this.lblRacha);
            this.panel1.Controls.Add(this.label3);
            this.panel1.Controls.Add(this.panel6);
            this.panel1.Controls.Add(this.tblTaskCompleted);
            this.panel1.Controls.Add(this.panel4);
            this.panel1.Controls.Add(this.picLogoProgress);
            this.panel1.Controls.Add(this.panel3);
            this.panel1.Controls.Add(this.panel2);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(625, 590);
            this.panel1.TabIndex = 28;
            // 
            // panel5
            // 
            this.panel5.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.panel5.BackColor = System.Drawing.Color.White;
            this.panel5.Controls.Add(this.lblMotivation);
            this.panel5.Font = new System.Drawing.Font("Ink Free", 9F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.panel5.Location = new System.Drawing.Point(82, 270);
            this.panel5.Name = "panel5";
            this.panel5.Size = new System.Drawing.Size(460, 22);
            this.panel5.TabIndex = 36;
            // 
            // lblMotivation
            // 
            this.lblMotivation.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.lblMotivation.AutoSize = true;
            this.lblMotivation.Location = new System.Drawing.Point(193, 4);
            this.lblMotivation.Name = "lblMotivation";
            this.lblMotivation.Size = new System.Drawing.Size(43, 15);
            this.lblMotivation.TabIndex = 0;
            this.lblMotivation.Text = "label4";
            this.lblMotivation.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // lblRacha
            // 
            this.lblRacha.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.lblRacha.AutoSize = true;
            this.lblRacha.Font = new System.Drawing.Font("Segoe UI Semibold", 15.75F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblRacha.Location = new System.Drawing.Point(286, 322);
            this.lblRacha.Name = "lblRacha";
            this.lblRacha.Size = new System.Drawing.Size(22, 30);
            this.lblRacha.TabIndex = 35;
            this.lblRacha.Text = "1";
            // 
            // label3
            // 
            this.label3.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Algerian", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(267, 298);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(65, 14);
            this.label3.TabIndex = 0;
            this.label3.Text = "Tu racha";
            // 
            // panel6
            // 
            this.panel6.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.panel6.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.panel6.Location = new System.Drawing.Point(82, 366);
            this.panel6.Name = "panel6";
            this.panel6.Size = new System.Drawing.Size(460, 10);
            this.panel6.TabIndex = 34;
            // 
            // tblTaskCompleted
            // 
            this.tblTaskCompleted.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.tblTaskCompleted.AutoScroll = true;
            this.tblTaskCompleted.FlowDirection = System.Windows.Forms.FlowDirection.TopDown;
            this.tblTaskCompleted.Location = new System.Drawing.Point(94, 382);
            this.tblTaskCompleted.Name = "tblTaskCompleted";
            this.tblTaskCompleted.Size = new System.Drawing.Size(436, 199);
            this.tblTaskCompleted.TabIndex = 32;
            this.tblTaskCompleted.WrapContents = false;
            // 
            // panel4
            // 
            this.panel4.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.panel4.BackColor = System.Drawing.Color.White;
            this.panel4.Controls.Add(this.ObjetiveDaily);
            this.panel4.Controls.Add(this.label2);
            this.panel4.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.panel4.Location = new System.Drawing.Point(188, 239);
            this.panel4.Name = "panel4";
            this.panel4.Size = new System.Drawing.Size(224, 27);
            this.panel4.TabIndex = 31;
            // 
            // ObjetiveDaily
            // 
            this.ObjetiveDaily.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.ObjetiveDaily.AutoSize = true;
            this.ObjetiveDaily.Font = new System.Drawing.Font("Arial Black", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.ObjetiveDaily.Location = new System.Drawing.Point(117, 2);
            this.ObjetiveDaily.Name = "ObjetiveDaily";
            this.ObjetiveDaily.Size = new System.Drawing.Size(64, 23);
            this.ObjetiveDaily.TabIndex = 1;
            this.ObjetiveDaily.Text = "label3";
            // 
            // label2
            // 
            this.label2.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(3, 4);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(113, 18);
            this.label2.TabIndex = 0;
            this.label2.Text = "Objetivo diario:";
            // 
            // picLogoProgress
            // 
            this.picLogoProgress.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.picLogoProgress.Location = new System.Drawing.Point(241, 108);
            this.picLogoProgress.Name = "picLogoProgress";
            this.picLogoProgress.Size = new System.Drawing.Size(120, 120);
            this.picLogoProgress.TabIndex = 30;
            this.picLogoProgress.TabStop = false;
            // 
            // panel3
            // 
            this.panel3.BackColor = System.Drawing.Color.FromArgb(33, 150, 83);
            this.panel3.Controls.Add(this.label8);
            this.panel3.Controls.Add(this.label7);
            this.panel3.Controls.Add(this.lblTaskCompleted);
            this.panel3.Controls.Add(this.label1);
            this.panel3.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));

            this.panel3.ForeColor = System.Drawing.Color.White;
            this.panel3.Location = new System.Drawing.Point(0, 0);

            this.panel3.ForeColor = System.Drawing.Color.Gray;
            this.panel3.Location = new System.Drawing.Point(0, 59);

            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(625, 25);
            this.panel3.TabIndex = 29;
            // 
            // label8
            // 
            this.label8.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.label8.AutoEllipsis = true;
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Arial", 12F, ((System.Drawing.FontStyle)((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Strikeout))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label8.Location = new System.Drawing.Point(238, 3);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(107, 19);
            this.label8.TabIndex = 33;
            this.label8.Text = "completadas";
            // 
            // label7
            // 
            this.label7.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(183, 3);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(56, 19);
            this.label7.TabIndex = 32;
            this.label7.Text = "tareas";
            // 
            // lblTaskCompleted
            // 
            this.lblTaskCompleted.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.lblTaskCompleted.AutoSize = true;
            this.lblTaskCompleted.Location = new System.Drawing.Point(118, 3);
            this.lblTaskCompleted.Name = "lblTaskCompleted";
            this.lblTaskCompleted.Size = new System.Drawing.Size(54, 19);
            this.lblTaskCompleted.TabIndex = 31;
            this.lblTaskCompleted.Text = "#Task";
            // 
            // label1
            // 
            this.label1.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(85, 3);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(26, 19);
            this.label1.TabIndex = 30;
            this.label1.Text = "✅";
            // 
            // panel2
            // 
            this.panel2.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.panel2.Controls.Add(this.btnClse);
            this.panel2.Controls.Add(this.label4);
            this.panel2.Controls.Add(this.pictureBox1);
            this.panel2.Location = new System.Drawing.Point(0, 0);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(622, 59);
            this.panel2.TabIndex = 28;
            this.panel2.MouseDown += new System.Windows.Forms.MouseEventHandler(this.panel2_MouseDown);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Gadugi", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(63, 19);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(213, 21);
            this.label4.TabIndex = 1;
            this.label4.Text = "Estadisticas del usuario";
            this.label4.MouseDown += new System.Windows.Forms.MouseEventHandler(this.panel2_MouseDown);
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = global::Presentation.Properties.Resources.LogoCaptusAddTask;
            this.pictureBox1.Location = new System.Drawing.Point(3, -1);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(54, 60);
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            this.pictureBox1.MouseDown += new System.Windows.Forms.MouseEventHandler(this.panel2_MouseDown);
            // 
            // btnClse
            // 
            this.btnClse.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnClse.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnClse.FlatAppearance.BorderSize = 0;
            this.btnClse.FlatAppearance.MouseDownBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(128)))), ((int)(((byte)(128)))));
            this.btnClse.FlatAppearance.MouseOverBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(192)))), ((int)(((byte)(192)))));
            this.btnClse.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnClse.Image = global::Presentation.Properties.Resources.icons8_close_window_50__2_;
            this.btnClse.Location = new System.Drawing.Point(585, 12);
            this.btnClse.Name = "btnClse";
            this.btnClse.Size = new System.Drawing.Size(28, 28);
            this.btnClse.TabIndex = 37;
            this.btnClse.UseVisualStyleBackColor = true;
            this.btnClse.Click += new System.EventHandler(this.btnClse_Click);
            // 
            // frmStats
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;

            this.ClientSize = new System.Drawing.Size(764, 479);
            this.Controls.Clear();
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.panel3);

            this.ClientSize = new System.Drawing.Size(625, 590);
            this.ControlBox = false;
            this.Controls.Add(this.panel1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;

            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "frmStats";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "frmStats";
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel5.ResumeLayout(false);
            this.panel5.PerformLayout();
            this.panel4.ResumeLayout(false);
            this.panel4.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogoProgress)).EndInit();
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.panel2.ResumeLayout(false);
            this.panel2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label lblTaskCompleted;
        private System.Windows.Forms.PictureBox picLogoProgress;
        private System.Windows.Forms.Panel panel4;
        private System.Windows.Forms.Label ObjetiveDaily;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.FlowLayoutPanel tblTaskCompleted;
        private System.Windows.Forms.Panel panel6;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label lblRacha;
        private System.Windows.Forms.Panel panel5;
        private System.Windows.Forms.Label lblMotivation;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button btnClse;
    }
}