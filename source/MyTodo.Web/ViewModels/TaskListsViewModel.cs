namespace Microsoft.Samples.MyTodo.Web.ViewModels
{
    using System.Collections.Generic;
    using Microsoft.Samples.MyTodo.Model;

    public class TaskListsViewModel
    {
        public IEnumerable<TaskList> Lists { get; set; }
    }
}