using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using Entity;
namespace DAL
{
    public static class SearchEntity
    {
        public static User SearchUserById(List<User> users, int id)
            => users.FirstOrDefault<User>(u => u.id == id);
        public static Statistics SearchStatisticsById(List<Statistics> statistics, int id)
            => statistics.FirstOrDefault<Statistics>(s => s.id == id);
        public static Entity.Task SearchTaskById(List<Entity.Task> tasks, int id)
            => tasks.FirstOrDefault<Entity.Task>(t => t.id == id);
        public static Priority SearchPriorityById(List<Priority> priorities, int id)
            => priorities.FirstOrDefault<Priority>(p => p.Id_Priority == id);
        public static Category SearchCategoryById(List<Category> categories, int id)
            => categories.FirstOrDefault<Category>(c => c.id == id);
    }
}
