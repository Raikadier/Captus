namespace Presentation
{
    partial class frmAddTask
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
            this.btnClose = new System.Windows.Forms.PictureBox();
            this.panel2 = new System.Windows.Forms.Panel();
            this.btnAddTask = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.cbCategories = new System.Windows.Forms.ComboBox();
            this.cbPriority = new System.Windows.Forms.ComboBox();
            this.dateTimePicker1 = new System.Windows.Forms.DateTimePicker();
            this.txtTitle = new System.Windows.Forms.RichTextBox();
            this.txtDescription = new System.Windows.Forms.RichTextBox();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.btnClose)).BeginInit();
            this.panel2.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.Honeydew;
            this.panel1.Controls.Add(this.btnClose);
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(690, 67);
            this.panel1.TabIndex = 0;
            this.panel1.Paint += new System.Windows.Forms.PaintEventHandler(this.panel1_Paint);
            this.panel1.MouseDown += new System.Windows.Forms.MouseEventHandler(this.Panel1_MouseDown);
            // 
            // btnClose
            // 
            this.btnClose.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnClose.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnClose.Image = global::Presentation.Properties.Resources.icons8_close_window_50__2_;
            this.btnClose.Location = new System.Drawing.Point(647, 14);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(30, 26);
            this.btnClose.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.btnClose.TabIndex = 29;
            this.btnClose.TabStop = false;
            this.btnClose.Click += new System.EventHandler(this.btnClose_Click);
            // 
            // panel2
            // 
            this.panel2.BackColor = System.Drawing.Color.Honeydew;
            this.panel2.Controls.Add(this.btnAddTask);
            this.panel2.Controls.Add(this.btnCancel);
            this.panel2.Controls.Add(this.cbCategories);
            this.panel2.Controls.Add(this.cbPriority);
            this.panel2.Controls.Add(this.dateTimePicker1);
            this.panel2.Controls.Add(this.txtTitle);
            this.panel2.Controls.Add(this.txtDescription);
            this.panel2.Location = new System.Drawing.Point(0, 67);
            this.panel2.Name = "panel2";
            this.panel2.Size = new System.Drawing.Size(690, 308);
            this.panel2.TabIndex = 1;
            // 
            // btnAddTask
            // 
            this.btnAddTask.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnAddTask.FlatAppearance.MouseDownBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.btnAddTask.FlatAppearance.MouseOverBackColor = System.Drawing.Color.ForestGreen;
            this.btnAddTask.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAddTask.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAddTask.ForeColor = System.Drawing.Color.ForestGreen;
            this.btnAddTask.Location = new System.Drawing.Point(572, 262);
            this.btnAddTask.Name = "btnAddTask";
            this.btnAddTask.Size = new System.Drawing.Size(92, 32);
            this.btnAddTask.TabIndex = 6;
            this.btnAddTask.Text = "Add Task";
            this.btnAddTask.UseVisualStyleBackColor = true;
            // 
            // btnCancel
            // 
            this.btnCancel.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.btnCancel.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnCancel.FlatAppearance.MouseDownBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
            this.btnCancel.FlatAppearance.MouseOverBackColor = System.Drawing.Color.ForestGreen;
            this.btnCancel.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnCancel.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnCancel.ForeColor = System.Drawing.Color.ForestGreen;
            this.btnCancel.Location = new System.Drawing.Point(483, 263);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(81, 32);
            this.btnCancel.TabIndex = 5;
            this.btnCancel.Text = "Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            // 
            // cbCategories
            // 
            this.cbCategories.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cbCategories.ForeColor = System.Drawing.SystemColors.WindowFrame;
            this.cbCategories.FormattingEnabled = true;
            this.cbCategories.Location = new System.Drawing.Point(12, 227);
            this.cbCategories.Name = "cbCategories";
            this.cbCategories.Size = new System.Drawing.Size(121, 29);
            this.cbCategories.TabIndex = 4;
            this.cbCategories.Text = "Categories";
            // 
            // cbPriority
            // 
            this.cbPriority.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cbPriority.ForeColor = System.Drawing.SystemColors.WindowFrame;
            this.cbPriority.FormattingEnabled = true;
            this.cbPriority.Location = new System.Drawing.Point(248, 178);
            this.cbPriority.Name = "cbPriority";
            this.cbPriority.Size = new System.Drawing.Size(121, 29);
            this.cbPriority.TabIndex = 3;
            this.cbPriority.Text = "Priority";
            // 
            // dateTimePicker1
            // 
            this.dateTimePicker1.Location = new System.Drawing.Point(12, 182);
            this.dateTimePicker1.Name = "dateTimePicker1";
            this.dateTimePicker1.Size = new System.Drawing.Size(212, 20);
            this.dateTimePicker1.TabIndex = 2;
            // 
            // txtTitle
            // 
            this.txtTitle.BackColor = System.Drawing.Color.Honeydew;
            this.txtTitle.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txtTitle.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtTitle.ForeColor = System.Drawing.SystemColors.WindowFrame;
            this.txtTitle.Location = new System.Drawing.Point(12, 15);
            this.txtTitle.Name = "txtTitle";
            this.txtTitle.Size = new System.Drawing.Size(520, 40);
            this.txtTitle.TabIndex = 1;
            this.txtTitle.Text = "Title. . .";
            // 
            // txtDescription
            // 
            this.txtDescription.Font = new System.Drawing.Font("Century Gothic", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtDescription.ForeColor = System.Drawing.SystemColors.WindowFrame;
            this.txtDescription.Location = new System.Drawing.Point(12, 61);
            this.txtDescription.Name = "txtDescription";
            this.txtDescription.Size = new System.Drawing.Size(520, 103);
            this.txtDescription.TabIndex = 0;
            this.txtDescription.Text = "Description";
            // 
            // frmAddTask
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(689, 375);
            this.Controls.Add(this.panel2);
            this.Controls.Add(this.panel1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "frmAddTask";
            this.Text = "frmAddTask";
            this.panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.btnClose)).EndInit();
            this.panel2.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panel2;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.ComboBox cbCategories;
        private System.Windows.Forms.ComboBox cbPriority;
        private System.Windows.Forms.DateTimePicker dateTimePicker1;
        private System.Windows.Forms.RichTextBox txtTitle;
        private System.Windows.Forms.RichTextBox txtDescription;
        private System.Windows.Forms.Button btnAddTask;
        private System.Windows.Forms.PictureBox btnClose;
    }
}