namespace Microsoft.Samples.MyTodo.Model
{
    using System;
    using System.Collections.Generic;

    public class TaskList
    {
        public Guid Id { get; set; }

        public string UserName { get; set; }

        public string Name { get; set; }

        public byte IsPublic { get; set; }

        public ICollection<Task> Tasks { get; set; }
    }
}
