namespace Presentation
{
    partial class TarjetTask
    {
        /// <summary> 
        /// Variable del diseñador necesaria.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Limpiar los recursos que se estén usando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de componentes

        /// <summary> 
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido de este método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            this.cbCompleted = new System.Windows.Forms.CheckBox();
            this.lblCategory = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.lblTitle = new System.Windows.Forms.Label();
            this.rtxtDescription = new System.Windows.Forms.RichTextBox();
            this.panelTarjetTask = new System.Windows.Forms.Panel();
            this.panel1.SuspendLayout();
            this.panelTarjetTask.SuspendLayout();
            this.SuspendLayout();
            // 
            // cbCompleted
            // 
            this.cbCompleted.ForeColor = System.Drawing.Color.Red;
            this.cbCompleted.Location = new System.Drawing.Point(16, 8);
            this.cbCompleted.Name = "cbCompleted";
            this.cbCompleted.Size = new System.Drawing.Size(15, 15);
            this.cbCompleted.TabIndex = 0;
            this.cbCompleted.UseVisualStyleBackColor = true;
            // 
            // lblCategory
            // 
            this.lblCategory.AutoSize = true;
            this.lblCategory.Font = new System.Drawing.Font("Ink Free", 11.25F, ((System.Drawing.FontStyle)(((System.Drawing.FontStyle.Bold | System.Drawing.FontStyle.Italic) 
                | System.Drawing.FontStyle.Underline))), System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblCategory.Location = new System.Drawing.Point(459, 52);
            this.lblCategory.Name = "lblCategory";
            this.lblCategory.Size = new System.Drawing.Size(51, 19);
            this.lblCategory.TabIndex = 3;
            this.lblCategory.Text = "label1";
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.lblTitle);
            this.panel1.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.panel1.Location = new System.Drawing.Point(40, 3);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(489, 25);
            this.panel1.TabIndex = 4;
            // 
            // lblTitle
            // 
            this.lblTitle.AutoSize = true;
            this.lblTitle.Location = new System.Drawing.Point(4, 3);
            this.lblTitle.Name = "lblTitle";
            this.lblTitle.Size = new System.Drawing.Size(54, 19);
            this.lblTitle.TabIndex = 0;
            this.lblTitle.Text = "label1";
            // 
            // rtxtDescription
            // 
            this.rtxtDescription.BackColor = System.Drawing.Color.Honeydew;
            this.rtxtDescription.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.rtxtDescription.Font = new System.Drawing.Font("Segoe UI", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rtxtDescription.Location = new System.Drawing.Point(11, 37);
            this.rtxtDescription.Name = "rtxtDescription";
            this.rtxtDescription.Size = new System.Drawing.Size(443, 40);
            this.rtxtDescription.TabIndex = 5;
            this.rtxtDescription.Text = "";
            // 
            // panelTarjetTask
            // 
            this.panelTarjetTask.Controls.Add(this.rtxtDescription);
            this.panelTarjetTask.Controls.Add(this.panel1);
            this.panelTarjetTask.Controls.Add(this.lblCategory);
            this.panelTarjetTask.Controls.Add(this.cbCompleted);
            this.panelTarjetTask.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelTarjetTask.Location = new System.Drawing.Point(0, 0);
            this.panelTarjetTask.Name = "panelTarjetTask";
            this.panelTarjetTask.Size = new System.Drawing.Size(600, 90);
            this.panelTarjetTask.TabIndex = 6;
            // 
            // TarjetTask
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoSize = true;
            this.BackColor = System.Drawing.Color.Honeydew;
            this.Controls.Add(this.panelTarjetTask);
            this.Name = "TarjetTask";
            this.Size = new System.Drawing.Size(600, 90);
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panelTarjetTask.ResumeLayout(false);
            this.panelTarjetTask.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.CheckBox cbCompleted;
        private System.Windows.Forms.Label lblCategory;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label lblTitle;
        private System.Windows.Forms.RichTextBox rtxtDescription;
        private System.Windows.Forms.Panel panelTarjetTask;
    }
}
