using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public interface ICommand
    {
        string Name { get; }
        string Description { get; }
        string Pattern { get; }
        bool Matches(string input);
        Task<string> Execute(string input);
    }
}
