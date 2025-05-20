using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTITY
{
    public abstract class ClassId : IOperationEntity
    {
        public int id { get; set; }
        public abstract SqlCommand SQLCommandInsert(SqlConnection connection);

    }
}
