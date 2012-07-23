namespace MyTodo.Web.Controllers.Api
{
    using System;
    using System.Globalization;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Microsoft.Samples.MyTodo.Model;

    public class TasksController : ApiController
    {
        private readonly MyTodoContext model;

        public TasksController() :
            this(new MyTodoContext())
        {
        }

        public TasksController(MyTodoContext model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            this.model = model;
        }

        // Get tasks from a list
        // /api/lists/{taskListId}/Tasks
        public IQueryable<Task> Get(Guid taskListId)
        {
            var userName = this.Request.GetUserPrincipal().Identity.Name;
            return this.model.Tasks.Where(o => o.TaskListId == taskListId && (o.TaskList.UserName == userName || o.TaskList.IsPublic == 1));
        }

        // Get a task
        // /api/lists/{taskListId}/Tasks/{id}
        [Authorize]
        public Task Get(Guid taskListId, Guid id)
        {
            var userName = this.Request.GetUserPrincipal().Identity.Name;
            return this.model.Tasks.SingleOrDefault(o => o.TaskList.UserName == userName && o.TaskList.Id == taskListId && o.Id == id);
        }

        // New task
        // /api/lists/{taskListId}/Tasks
        [Authorize]
        public Task Post(Guid taskListId, Task task)
        {
            var userName = this.Request.GetUserPrincipal().Identity.Name;

            var listExists = this.model.TaskLists.Count(o => o.UserName == userName && o.Id == taskListId) == 1;
            if (!listExists)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            task.Id = Guid.NewGuid();
            task.UserName = userName;
            task.StartDate = DateTime.UtcNow;
            task.TimestampUpdate = DateTime.UtcNow;
            task.TaskListId = taskListId;

            this.model.Tasks.Add(task);
            this.model.SaveChanges();

            return task;
        }

        // Update task
        // /api/lists/{taskListId}/Tasks/{id}
        [Authorize]
        public Task Put(Guid taskListId, Task value)
        {
            var userName = this.Request.GetUserPrincipal().Identity.Name;

            var belongsToUser = this.model.Tasks.Count(o => o.Id == value.Id && o.TaskList.Id == taskListId && o.TaskList.UserName == userName) == 1;
            if (!belongsToUser)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            value.UserName = userName;
            value.TaskListId = taskListId;
            value.TimestampUpdate = DateTime.UtcNow;
            value.StartDate = value.StartDate != DateTime.MinValue ? value.StartDate : DateTime.UtcNow;
            value.DueDate = value.DueDate != DateTime.MinValue ? value.DueDate : null;

            this.model.Tasks.Attach(value);
            this.model.Entry<Task>(value).State = System.Data.EntityState.Modified;
            this.model.SaveChanges();

            return value;
        }

        // Delete task
        // /api/lists/{taskListId}/Tasks/{id}
        [Authorize]
        public void Delete(Guid taskListId, Guid id)
        {
            var userName = this.Request.GetUserPrincipal().Identity.Name;

            var originalTask = this.model.Tasks.SingleOrDefault(o => o.Id == id && o.TaskList.Id == taskListId && o.TaskList.UserName == userName);
            if (originalTask == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            this.model.Tasks.Remove(originalTask);
            this.model.SaveChanges();
        }
    }
}