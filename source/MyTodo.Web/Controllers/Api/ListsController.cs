namespace MyTodo.Web.Controllers.Api
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Web.Http;
    using Microsoft.Samples.MyTodo.Model;

    public class ListsController : ApiController
    {
        private readonly MyTodoContext model;

        public ListsController() :
            this(new MyTodoContext())
        {
        }

        public ListsController(MyTodoContext model)
        {
            if (model == null)
            {
                throw new ArgumentNullException("model");
            }

            this.model = model;
        }

        // Get User Lists
        // GET /api/lists
        [Authorize]
        public IQueryable<TaskList> Get()
        {
            var userName = this.Request.GetUserPrincipal().Identity.Name;
            return this.model.TaskLists.Where(o => o.UserName == userName)
                                       .OrderBy(o => o.Name);
        }

        // Get single List
        // GET /api/lists/5
        [Authorize]
        public TaskList Get(Guid id)
        {
            var userName = Request.GetUserPrincipal().Identity.Name;
            return this.model.TaskLists.SingleOrDefault(o => o.UserName == userName && o.Id == id);
        }

        // New list
        // POST /api/lists
        [Authorize]
        public TaskList Post(TaskList value)
        {
            var userName = Request.GetUserPrincipal().Identity.Name;

            value.Id = Guid.NewGuid();
            value.UserName = userName;

            this.model.TaskLists.Add(value);
            this.model.SaveChanges();

            return value;
        }

        // Update list
        // PUT /api/lists/5
        [Authorize]
        public TaskList Put(Guid id, TaskList value)
        {
            var userName = Request.GetUserPrincipal().Identity.Name;

            var belongsToUser = this.model.TaskLists.Count(o => o.Id == id && o.UserName == userName) == 1;
            if (!belongsToUser)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            // Don't allow to change username
            value.UserName = userName;

            this.model.TaskLists.Attach(value);
            this.model.Entry<TaskList>(value).State = System.Data.EntityState.Modified;
            this.model.SaveChanges();

            return value;
        }

        // Delete list
        // DELETE /api/lists/5
        [Authorize]
        public void Delete(Guid id)
        {
            var userName = Request.GetUserPrincipal().Identity.Name;

            var originalList = this.model.TaskLists.SingleOrDefault(o => o.Id == id && o.UserName == userName);
            if (originalList != null)
            {
                this.model.TaskLists.Remove(originalList);
                this.model.SaveChanges();
            }
        }
    }
}
