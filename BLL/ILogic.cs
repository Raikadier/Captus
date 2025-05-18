using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public interface ILogic<T>
    {
        OperationResult Save(T entidad);
        OperationResult Update(T entidad);
        OperationResult Delete(int id);
        T GetById(int id);
        List<T> GetAll();
    }
}
