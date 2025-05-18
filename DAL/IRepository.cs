using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public interface IRepository<T>
    {
        bool Save(T entity);
        bool Update(T entity);
        bool Delete(int id);
        T GetById(int id);
        List<T> GetAll();
        T MappingType(SqlDataReader reader);
    }
}
