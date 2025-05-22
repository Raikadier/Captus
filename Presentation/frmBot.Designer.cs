namespace Presentation
{
    partial class frmBot
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
            this.panel1 = new System.Windows.Forms.Panel();
            this.label1 = new System.Windows.Forms.Label();
            this.richTextBox1 = new System.Windows.Forms.RichTextBox();
            this.btbnSendMessage = new Presentation.ButtonPersonal();
            this.txtMessage = new System.Windows.Forms.TextBox();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.label1);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(800, 76);
            this.panel1.TabIndex = 0;
            this.panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.panel1_Paint);
            // 
            // label1
            // 
            this.label1.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.ForeColor = System.Drawing.Color.Green;
            this.label1.Location = new System.Drawing.Point(8, 47);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(138, 19);
            this.label1.TabIndex = 0;
            this.label1.Text = "ChatBot - Captus";
            this.label1.Click += new System.EventHandler(this.label1_Click);
            // 
            // richTextBox1
            // 
            this.richTextBox1.Location = new System.Drawing.Point(12, 82);
            this.richTextBox1.Name = "richTextBox1";
            this.richTextBox1.Size = new System.Drawing.Size(776, 280);
            this.richTextBox1.TabIndex = 1;
            this.richTextBox1.Text = "";
            this.richTextBox1.TextChanged += new System.EventHandler(this.richTextBox1_TextChanged);
            // 
            // btbnSendMessage
            // 
            this.btbnSendMessage.BackColor = System.Drawing.Color.Green;
            this.btbnSendMessage.BackgroundColor = System.Drawing.Color.Green;
            this.btbnSendMessage.BorderColor = System.Drawing.Color.Honeydew;
            this.btbnSendMessage.BorderColor1 = System.Drawing.Color.Honeydew;
            this.btbnSendMessage.BorderRadius = 40;
            this.btbnSendMessage.BorderRadius1 = 40;
            this.btbnSendMessage.BorderSize = 0;
            this.btbnSendMessage.BorderSize1 = 0;
            this.btbnSendMessage.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btbnSendMessage.FlatAppearance.BorderSize = 0;
            this.btbnSendMessage.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btbnSendMessage.Font = new System.Drawing.Font("Century Gothic", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btbnSendMessage.ForeColor = System.Drawing.Color.White;
            this.btbnSendMessage.Location = new System.Drawing.Point(634, 394);
            this.btbnSendMessage.Name = "btbnSendMessage";
            this.btbnSendMessage.Size = new System.Drawing.Size(150, 40);
            this.btbnSendMessage.TabIndex = 2;
            this.btbnSendMessage.Text = "Send Message";
            this.btbnSendMessage.TextColor = System.Drawing.Color.White;
            this.btbnSendMessage.UseVisualStyleBackColor = false;
            this.btbnSendMessage.Click += new System.EventHandler(this.btbnSendMessage_Click);
            // 
            // txtMessage
            // 
            this.txtMessage.Location = new System.Drawing.Point(12, 368);
            this.txtMessage.Name = "txtMessage";
            this.txtMessage.Size = new System.Drawing.Size(616, 20);
            this.txtMessage.TabIndex = 3;
            // 
            // frmBot
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.txtMessage);
            this.Controls.Add(this.btbnSendMessage);
            this.Controls.Add(this.richTextBox1);
            this.Controls.Add(this.panel1);
            this.Name = "frmBot";
            this.Text = "frmBot";
            this.Load += new System.EventHandler(this.frmBot_Load);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.RichTextBox richTextBox1;
        private ButtonPersonal btbnSendMessage;
        private System.Windows.Forms.TextBox txtMessage;
    }
}