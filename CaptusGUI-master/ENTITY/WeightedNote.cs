using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTITY
{
    public class WeightedNote : Note
    {
        public int Credito { get; set; }
        public override double Calcular()
        {
            return ValueNote * Credito;
        }
    }
}
