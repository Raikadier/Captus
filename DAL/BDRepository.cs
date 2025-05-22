﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTITY;

namespace DAL
{
    public abstract class BDRepository<T> : IRepository<T> where T : IOperationEntity
    {
        protected readonly BD bd;

        public BDRepository()
        {
            bd = new BD();
        }
        public virtual bool Save(T entity)
        {
            try
            {
                bd.OpenConection();
                SqlCommand cmd = entity.SQLCommandInsert(bd.connection);
                int affectedRows = cmd.ExecuteNonQuery();
                if (affectedRows > 0) return true;
                return false;
            }
            catch (SqlException a)
            {
                Console.WriteLine("SQL Error: " + a.Message);
                return false;
            }
            catch (Exception a)
            {
                Console.WriteLine("Error: " + a.Message);
                return false;
            }
            finally
            {
                bd.CloseConection();
            }

        }
        public abstract bool Delete(int id);
        public abstract List<T> GetAll();
        public abstract T GetById(int id);
        public abstract T MappingType(SqlDataReader reader);
        public abstract bool Update(T entity);
    }
}
