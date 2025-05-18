using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class NotePercentage : Note
    {
        public double Percentage { get; set; }
        public override double Calcular()
        {
            return ValueNote*(Percentage/100);
        }
    }
}
