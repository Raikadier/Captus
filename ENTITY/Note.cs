using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTITY
{
    public abstract class Note
    {
        public double ValueNote { get; set; }
        public abstract double Calcular();
    }
}
