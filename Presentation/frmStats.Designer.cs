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
            this.Column2 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column1 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.Column3 = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.label7 = new System.Windows.Forms.Label();
            this.txtRacha = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.btnGuardar = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.txtEditObjetivo = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.txtObjetivoProp = new System.Windows.Forms.TextBox();
            this.txtObjetivoActual = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.txtTaskCompleted = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            this.SuspendLayout();
            // 
            // Column2
            // 
            this.Column2.HeaderText = "Descripcion";
            this.Column2.Name = "Column2";
            this.Column2.ReadOnly = true;
            // 
            // Column1
            // 
            this.Column1.HeaderText = "Titulo";
            this.Column1.Name = "Column1";
            this.Column1.ReadOnly = true;
            // 
            // Column3
            // 
            this.Column3.HeaderText = "Categoria";
            this.Column3.Name = "Column3";
            this.Column3.ReadOnly = true;
            // 
            // dataGridView1
            // 
            this.dataGridView1.AllowUserToAddRows = false;
            this.dataGridView1.AllowUserToDeleteRows = false;
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.Column1,
            this.Column2,
            this.Column3});
            this.dataGridView1.Location = new System.Drawing.Point(44, 384);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.ReadOnly = true;
            this.dataGridView1.Size = new System.Drawing.Size(344, 150);
            this.dataGridView1.TabIndex = 27;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(31, 357);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(148, 13);
            this.label7.TabIndex = 26;
            this.label7.Text = "Todas las tareas completadas";
            // 
            // txtRacha
            // 
            this.txtRacha.Enabled = false;
            this.txtRacha.Location = new System.Drawing.Point(171, 303);
            this.txtRacha.Name = "txtRacha";
            this.txtRacha.Size = new System.Drawing.Size(100, 20);
            this.txtRacha.TabIndex = 25;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(205, 275);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(39, 13);
            this.label6.TabIndex = 24;
            this.label6.Text = "Racha";
            // 
            // btnGuardar
            // 
            this.btnGuardar.Location = new System.Drawing.Point(330, 231);
            this.btnGuardar.Name = "btnGuardar";
            this.btnGuardar.Size = new System.Drawing.Size(100, 23);
            this.btnGuardar.TabIndex = 23;
            this.btnGuardar.Text = "Guardar Objetivo";
            this.btnGuardar.UseVisualStyleBackColor = true;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(88, 234);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(104, 13);
            this.label5.TabIndex = 22;
            this.label5.Text = "Editar Objetivo diario";
            // 
            // txtEditObjetivo
            // 
            this.txtEditObjetivo.Location = new System.Drawing.Point(208, 231);
            this.txtEditObjetivo.Name = "txtEditObjetivo";
            this.txtEditObjetivo.Size = new System.Drawing.Size(100, 20);
            this.txtEditObjetivo.TabIndex = 21;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(268, 181);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(40, 13);
            this.label4.TabIndex = 20;
            this.label4.Text = "Tareas";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(201, 180);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(12, 13);
            this.label3.TabIndex = 19;
            this.label3.Text = "/";
            // 
            // txtObjetivoProp
            // 
            this.txtObjetivoProp.Enabled = false;
            this.txtObjetivoProp.Location = new System.Drawing.Point(215, 176);
            this.txtObjetivoProp.Name = "txtObjetivoProp";
            this.txtObjetivoProp.Size = new System.Drawing.Size(28, 20);
            this.txtObjetivoProp.TabIndex = 18;
            // 
            // txtObjetivoActual
            // 
            this.txtObjetivoActual.Enabled = false;
            this.txtObjetivoActual.Location = new System.Drawing.Point(171, 176);
            this.txtObjetivoActual.Name = "txtObjetivoActual";
            this.txtObjetivoActual.Size = new System.Drawing.Size(28, 20);
            this.txtObjetivoActual.TabIndex = 17;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(86, 179);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(79, 13);
            this.label2.TabIndex = 16;
            this.label2.Text = "Obejtivo Diario:";
            // 
            // txtTaskCompleted
            // 
            this.txtTaskCompleted.Enabled = false;
            this.txtTaskCompleted.Location = new System.Drawing.Point(21, 11);
            this.txtTaskCompleted.Name = "txtTaskCompleted";
            this.txtTaskCompleted.Size = new System.Drawing.Size(34, 20);
            this.txtTaskCompleted.TabIndex = 15;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(61, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(104, 13);
            this.label1.TabIndex = 14;
            this.label1.Text = "Tareas Completadas";
            // 
            // frmStats
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(444, 596);
            this.Controls.Add(this.dataGridView1);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.txtRacha);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.btnGuardar);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.txtEditObjetivo);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.txtObjetivoProp);
            this.Controls.Add(this.txtObjetivoActual);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.txtTaskCompleted);
            this.Controls.Add(this.label1);
            this.Name = "frmStats";
            this.Text = "frmStats";
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridViewTextBoxColumn Column2;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column1;
        private System.Windows.Forms.DataGridViewTextBoxColumn Column3;
        private System.Windows.Forms.DataGridView dataGridView1;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.TextBox txtRacha;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button btnGuardar;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox txtEditObjetivo;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox txtObjetivoProp;
        private System.Windows.Forms.TextBox txtObjetivoActual;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox txtTaskCompleted;
        private System.Windows.Forms.Label label1;
    }
}