namespace Microsoft.Samples.MyTodo.Model
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Runtime.Serialization;

    public class Task
    {
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Description { get; set; }

        public Guid Id { get; set; }

        public Guid TaskListId { get; set; }

        public TaskList TaskList { get; set; }

        public string UserName { get; set; }

        public string Name { get; set; }

        public byte Status { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime TimestampUpdate { get; set; }
    }
}
