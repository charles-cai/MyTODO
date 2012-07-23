namespace Microsoft.Samples.MyTodo.Web.ViewModels
{
    using Microsoft.Samples.MyTodo.Model;
    
    public class TaskListViewModel
    {
        public TaskList TaskList { get; set; }

        public bool IsOwner { get; set; }
    }
}