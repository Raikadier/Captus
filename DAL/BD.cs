using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class BD : IDisposable
    {
        private SqlConnection Connection;
        private bool _disposed = false;
        public BD()
        {
            try
            {
                string connectionString = "Server=.\\SQLEXPRESS;Database=Captus;Trusted_Connection=True;";
                Connection = new SqlConnection(connectionString);
            }
            catch (Exception ex) { Console.WriteLine("Aver"); }
            
        }
        public SqlConnection connection
        {
            get { return Connection; }
        }
        public ConnectionState OpenConection()
        {
            try
            {
                if (Connection.State != ConnectionState.Open)
                {
                    Connection.Open();
                }
                return Connection.State;
            }
            catch (SqlException ex)
            {
                Console.WriteLine("SQL Error: " + ex.Message);
                return ConnectionState.Broken;
            }
            catch (Exception e)
            {
                Console.WriteLine("Error: " + e.Message);
                return ConnectionState.Broken;
            }
        }
        public ConnectionState CloseConection()
        {
            try
            {
                if (Connection.State == ConnectionState.Open)
                {
                    Connection.Close();
                }
                return Connection.State;
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"SQL Error: {ex.Message}");
                return ConnectionState.Broken;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return ConnectionState.Broken;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                if (Connection.State != ConnectionState.Closed)
                {
                    Connection.Close();
                }
                Connection.Dispose();
            }
            _disposed = true;
        }
    }
}
