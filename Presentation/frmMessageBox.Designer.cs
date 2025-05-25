namespace Presentation
{
    partial class frmMessageBox
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
            this.panelTitleBar = new System.Windows.Forms.Panel();
            this.labelCaption = new System.Windows.Forms.Label();
            this.panelButtons = new System.Windows.Forms.Panel();
            this.panelBody = new System.Windows.Forms.Panel();
            this.labelMessage = new System.Windows.Forms.Label();
            this.btnClse = new System.Windows.Forms.Button();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.pictureBox2 = new System.Windows.Forms.PictureBox();
            this.buttonPersonal1 = new Presentation.ButtonPersonal();
            this.labelTitle = new System.Windows.Forms.Label();
            this.panelTitleBar.SuspendLayout();
            this.panelButtons.SuspendLayout();
            this.panelBody.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).BeginInit();
            this.SuspendLayout();
            // 
            // panelTitleBar
            // 
            this.panelTitleBar.BackColor = System.Drawing.Color.Honeydew;
            this.panelTitleBar.Controls.Add(this.btnClse);
            this.panelTitleBar.Controls.Add(this.pictureBox1);
            this.panelTitleBar.Controls.Add(this.labelCaption);
            this.panelTitleBar.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelTitleBar.Location = new System.Drawing.Point(0, 0);
            this.panelTitleBar.Name = "panelTitleBar";
            this.panelTitleBar.Size = new System.Drawing.Size(352, 47);
            this.panelTitleBar.TabIndex = 3;
            this.panelTitleBar.Paint += new System.Windows.Forms.PaintEventHandler(this.panelTitleBar_Paint);
            // 
            // labelCaption
            // 
            this.labelCaption.AutoSize = true;
            this.labelCaption.BackColor = System.Drawing.Color.Honeydew;
            this.labelCaption.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelCaption.ForeColor = System.Drawing.Color.Green;
            this.labelCaption.Location = new System.Drawing.Point(56, 16);
            this.labelCaption.Name = "labelCaption";
            this.labelCaption.Size = new System.Drawing.Size(86, 17);
            this.labelCaption.TabIndex = 4;
            this.labelCaption.Text = "labelCaption";
            this.labelCaption.Click += new System.EventHandler(this.labelCaption_Click);
            // 
            // panelButtons
            // 
            this.panelButtons.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(235)))), ((int)(((byte)(235)))), ((int)(((byte)(235)))));
            this.panelButtons.Controls.Add(this.buttonPersonal1);
            this.panelButtons.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.panelButtons.Location = new System.Drawing.Point(0, 96);
            this.panelButtons.Name = "panelButtons";
            this.panelButtons.Size = new System.Drawing.Size(352, 47);
            this.panelButtons.TabIndex = 4;
            this.panelButtons.Paint += new System.Windows.Forms.PaintEventHandler(this.panelButtons_Paint);
            // 
            // panelBody
            // 
            this.panelBody.BackColor = System.Drawing.Color.WhiteSmoke;
            this.panelBody.Controls.Add(this.labelTitle);
            this.panelBody.Controls.Add(this.pictureBox2);
            this.panelBody.Controls.Add(this.labelMessage);
            this.panelBody.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelBody.Location = new System.Drawing.Point(0, 0);
            this.panelBody.Name = "panelBody";
            this.panelBody.Padding = new System.Windows.Forms.Padding(10, 10, 0, 0);
            this.panelBody.Size = new System.Drawing.Size(352, 143);
            this.panelBody.TabIndex = 5;
            this.panelBody.Paint += new System.Windows.Forms.PaintEventHandler(this.panelBody_Paint);
            // 
            // labelMessage
            // 
            this.labelMessage.AutoSize = true;
            this.labelMessage.Dock = System.Windows.Forms.DockStyle.Fill;
            this.labelMessage.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelMessage.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(85)))), ((int)(((byte)(85)))), ((int)(((byte)(85)))));
            this.labelMessage.Location = new System.Drawing.Point(10, 10);
            this.labelMessage.MaximumSize = new System.Drawing.Size(600, 0);
            this.labelMessage.Name = "labelMessage";
            this.labelMessage.Padding = new System.Windows.Forms.Padding(5, 5, 10, 15);
            this.labelMessage.Size = new System.Drawing.Size(110, 37);
            this.labelMessage.TabIndex = 1;
            this.labelMessage.Text = "labelMessage";
            this.labelMessage.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
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
            this.btnClse.Location = new System.Drawing.Point(313, 9);
            this.btnClse.Name = "btnClse";
            this.btnClse.Size = new System.Drawing.Size(28, 28);
            this.btnClse.TabIndex = 32;
            this.btnClse.UseVisualStyleBackColor = true;
            this.btnClse.Click += new System.EventHandler(this.btnClse_Click);
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = global::Presentation.Properties.Resources.lgCaptus;
            this.pictureBox1.Location = new System.Drawing.Point(0, 0);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(50, 47);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBox1.TabIndex = 5;
            this.pictureBox1.TabStop = false;
            // 
            // pictureBox2
            // 
            this.pictureBox2.Image = global::Presentation.Properties.Resources.iconSpeech;
            this.pictureBox2.Location = new System.Drawing.Point(7, 50);
            this.pictureBox2.Name = "pictureBox2";
            this.pictureBox2.Size = new System.Drawing.Size(38, 40);
            this.pictureBox2.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBox2.TabIndex = 2;
            this.pictureBox2.TabStop = false;
            // 
            // buttonPersonal1
            // 
            this.buttonPersonal1.BackColor = System.Drawing.Color.Green;
            this.buttonPersonal1.BackgroundColor = System.Drawing.Color.Green;
            this.buttonPersonal1.BorderColor = System.Drawing.Color.Honeydew;
            this.buttonPersonal1.BorderColor1 = System.Drawing.Color.Honeydew;
            this.buttonPersonal1.BorderRadius = 40;
            this.buttonPersonal1.BorderRadius1 = 40;
            this.buttonPersonal1.BorderSize = 0;
            this.buttonPersonal1.BorderSize1 = 0;
            this.buttonPersonal1.FlatAppearance.BorderSize = 0;
            this.buttonPersonal1.FlatAppearance.MouseOverBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.buttonPersonal1.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.buttonPersonal1.Font = new System.Drawing.Font("Century Gothic", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonPersonal1.ForeColor = System.Drawing.Color.White;
            this.buttonPersonal1.Location = new System.Drawing.Point(126, 3);
            this.buttonPersonal1.Name = "buttonPersonal1";
            this.buttonPersonal1.Size = new System.Drawing.Size(111, 40);
            this.buttonPersonal1.TabIndex = 2;
            this.buttonPersonal1.Text = "Aceptar";
            this.buttonPersonal1.TextColor = System.Drawing.Color.White;
            this.buttonPersonal1.UseVisualStyleBackColor = false;
            this.buttonPersonal1.Click += new System.EventHandler(this.buttonPersonal1_Click);
            // 
            // labelTitle
            // 
            this.labelTitle.AutoSize = true;
            this.labelTitle.Location = new System.Drawing.Point(51, 65);
            this.labelTitle.Name = "labelTitle";
            this.labelTitle.Size = new System.Drawing.Size(35, 13);
            this.labelTitle.TabIndex = 3;
            this.labelTitle.Text = "label1";
            // 
            // frmMessageBox
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(352, 143);
            this.Controls.Add(this.panelTitleBar);
            this.Controls.Add(this.panelButtons);
            this.Controls.Add(this.panelBody);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frmMessageBox";
            this.Text = "frmMessageBox";
            this.Load += new System.EventHandler(this.frmMessageBox_Load);
            this.panelTitleBar.ResumeLayout(false);
            this.panelTitleBar.PerformLayout();
            this.panelButtons.ResumeLayout(false);
            this.panelBody.ResumeLayout(false);
            this.panelBody.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox2)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panelTitleBar;
        private System.Windows.Forms.Label labelCaption;
        private System.Windows.Forms.Panel panelButtons;
        private System.Windows.Forms.Panel panelBody;
        private System.Windows.Forms.Label labelMessage;
        private System.Windows.Forms.PictureBox pictureBox1;
        private ButtonPersonal buttonPersonal1;
        private System.Windows.Forms.Button btnClse;
        private System.Windows.Forms.PictureBox pictureBox2;
        private System.Windows.Forms.Label labelTitle;
    }
}