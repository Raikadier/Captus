namespace Presentation
{
    partial class ValideCode
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ValideCode));
            this.label1 = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.txtValideCode = new System.Windows.Forms.TextBox();
            this.btnValidar = new System.Windows.Forms.Panel();
            this.lblValidar = new System.Windows.Forms.Label();
            this.imgInfo = new System.Windows.Forms.PictureBox();
            this.btnClose = new System.Windows.Forms.PictureBox();
            this.toolEmail = new System.Windows.Forms.ToolTip(this.components);
            this.panel1.SuspendLayout();
            this.btnValidar.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.imgInfo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnClose)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Segoe UI", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(119, 30);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(165, 25);
            this.label1.TabIndex = 0;
            this.label1.Text = "Validar tu código";
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.Honeydew;
            this.panel1.Controls.Add(this.btnValidar);
            this.panel1.Controls.Add(this.txtValideCode);
            this.panel1.Location = new System.Drawing.Point(57, 80);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(294, 95);
            this.panel1.TabIndex = 1;
            // 
            // txtValideCode
            // 
            this.txtValideCode.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtValideCode.Location = new System.Drawing.Point(22, 18);
            this.txtValideCode.Name = "txtValideCode";
            this.txtValideCode.Size = new System.Drawing.Size(255, 20);
            this.txtValideCode.TabIndex = 0;
            this.txtValideCode.Click += new System.EventHandler(this.txtValideCode_Click);
            this.txtValideCode.Leave += new System.EventHandler(this.txtValideCode_Leave);
            // 
            // btnValidar
            // 
            this.btnValidar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(128)))));
            this.btnValidar.Controls.Add(this.lblValidar);
            this.btnValidar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnValidar.Location = new System.Drawing.Point(53, 53);
            this.btnValidar.Name = "btnValidar";
            this.btnValidar.Size = new System.Drawing.Size(185, 29);
            this.btnValidar.TabIndex = 1;
            this.btnValidar.Click += new System.EventHandler(this.btnValidar_Click);
            this.btnValidar.MouseEnter += new System.EventHandler(this.btnValidar_MouseEnter);
            this.btnValidar.MouseLeave += new System.EventHandler(this.btnValidar_MouseLeave);
            // 
            // lblValidar
            // 
            this.lblValidar.AutoSize = true;
            this.lblValidar.Font = new System.Drawing.Font("Segoe UI", 9.75F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblValidar.Location = new System.Drawing.Point(45, 6);
            this.lblValidar.Name = "lblValidar";
            this.lblValidar.Size = new System.Drawing.Size(89, 17);
            this.lblValidar.TabIndex = 0;
            this.lblValidar.Text = "Validar código";
            this.lblValidar.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.lblValidar.Click += new System.EventHandler(this.btnValidar_Click);
            this.lblValidar.MouseEnter += new System.EventHandler(this.btnValidar_MouseEnter);
            // 
            // imgInfo
            // 
            this.imgInfo.BackgroundImage = global::Presentation.Properties.Resources.MasInfo;
            this.imgInfo.Cursor = System.Windows.Forms.Cursors.Hand;
            this.imgInfo.Location = new System.Drawing.Point(7, 7);
            this.imgInfo.Name = "imgInfo";
            this.imgInfo.Size = new System.Drawing.Size(25, 25);
            this.imgInfo.TabIndex = 31;
            this.imgInfo.TabStop = false;
            // 
            // btnClose
            // 
            this.btnClose.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnClose.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnClose.Image = global::Presentation.Properties.Resources.icons8_close_window_50__2_;
            this.btnClose.Location = new System.Drawing.Point(364, 3);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(30, 26);
            this.btnClose.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnClose.TabIndex = 30;
            this.btnClose.TabStop = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // ValideCode
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(400, 227);
            this.Controls.Add(this.imgInfo);
            this.Controls.Add(this.btnClose);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "ValideCode";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Validar Codigo";
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.btnValidar.ResumeLayout(false);
            this.btnValidar.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.imgInfo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.btnClose)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.PictureBox btnClose;
        private System.Windows.Forms.TextBox txtValideCode;
        private System.Windows.Forms.Panel btnValidar;
        private System.Windows.Forms.Label lblValidar;
        private System.Windows.Forms.PictureBox imgInfo;
        private System.Windows.Forms.ToolTip toolEmail;
    }
}