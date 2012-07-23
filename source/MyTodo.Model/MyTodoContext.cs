namespace Microsoft.Samples.MyTodo.Model
{
    using System.Data.Entity;

    public class MyTodoContext : DbContext
    {
        public MyTodoContext()
            : base("MyTodoContext")
        {
        }

        public DbSet<Task> Tasks { get; set; }

        public DbSet<TaskList> TaskLists { get; set; }
    }
}
