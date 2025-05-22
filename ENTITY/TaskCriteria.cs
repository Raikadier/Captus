using System;

namespace ENTITY
{
    public class TaskCriteria
    {
        public int? CategoryId { get; set; }
        public int? PriorityId { get; set; }
        public bool? State { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string SearchText { get; set; }
        public bool? IsOverdue { get; set; }
    }
} 