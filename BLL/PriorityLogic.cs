using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity;
namespace BLL
{
    public class PriorityLogic
    {
        private readonly PriorityRepository priorityRepository;
        public PriorityLogic()
        {
            priorityRepository = new PriorityRepository();
        }
        public List<Priority> GetAll()
        {
            try
            {
                return priorityRepository.GetAll();
            }
            catch (Exception)
            {
                
                return null;
            }
            
        }
        public Priority GetById(int id)
        {
            try
            {
                return priorityRepository.GetById(id);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
