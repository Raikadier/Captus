using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public abstract class TaskGeneric : ClassTitle
    {
        public Category Category { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime EndDate { get; set; }
        public Priority Priority { get; set; }
        public bool State { get; set; }
        public User User { get; set; }

        protected TaskGeneric()
        {
            CreationDate = DateTime.Now;
            State = false;
        }
        public TaskGeneric(int id, string title, Category category, string description, DateTime creationDate, DateTime endDate, Priority priority, bool state, User user)
        {
            this.id = id;
            this.Title = title;
            this.Category = category;
            this.Description = description;
            this.CreationDate = creationDate;
            this.EndDate = endDate;
            this.Priority = priority;
            this.State = state;
            this.User = user;
        }
        
    }
}
