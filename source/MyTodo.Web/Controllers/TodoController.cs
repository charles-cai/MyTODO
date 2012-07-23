namespace Microsoft.Samples.MyTodo.Web.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using System.Web.Routing;
    using System.Web.UI;
    using Microsoft.Samples.MyTodo.Model;
    using Microsoft.Samples.MyTodo.Web.ViewModels;

    [OutputCache(Location = OutputCacheLocation.None, NoStore = true, Duration = 0, VaryByParam = "*")]
    public class TodoController : Controller
    {
        private readonly MyTodoContext model;

        public TodoController()
            : this(new MyTodoContext())
        {
        }

        public TodoController(MyTodoContext model)
        {
            this.model = model;
        }

        private string UserId
        {
            get
            {
                if (Request.IsAuthenticated)
                {
                    return User.Identity.Name;
                }

                return null;
            }
        }

        public ActionResult Index()
        {
            return View("Lists");
        }

        public ActionResult Tasks(Guid id)
        {
            var list = this.model.TaskLists.FirstOrDefault(o => o.Id == id);

            if (list != null && ((Request.IsAuthenticated && list.UserName == this.UserId) || list.IsPublic == 1))
            {
                var viewModel = new TaskListViewModel
                {
                    TaskList = list,
                    IsOwner = list.UserName == this.UserId
                };

                return View("Tasks", viewModel);
            }

            return RedirectToAction("Index");
        }

        public ActionResult Rss(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                // lists
                TaskList[] lists;
                if (!this.Request.IsAuthenticated)
                {
                    lists = this.model.TaskLists.Where(o => o.IsPublic == 1).ToArray();
                }
                else
                {
                    lists = this.model.TaskLists.Where(o => o.UserName == this.UserId).ToArray();
                }

                var feedItems = lists.Select(p => new FeedItem
                {
                    Creator = p.UserName,
                    Title = p.Name,
                    Description = p.IsPublic == 0 ? "Private List" : "Public List",
                    Url = new Uri(this.GetAbsoluteUrl(p.Id)),
                }).ToArray();

                var feed = new Feed(feedItems)
                {
                    Title = "Lists",
                };

                return View(feed);
            }
            else
            {
                var listId = new Guid(id);
                var list = this.model.TaskLists.Include("Tasks").Where(o => o.Id == listId).FirstOrDefault();

                if (list != null && ((Request.IsAuthenticated && list.UserName == this.UserId) || list.IsPublic == 1))
                {
                    IList<FeedItem> feedItems = list.Tasks.Select(p => new FeedItem
                    {
                        Creator = p.UserName,
                        Title = p.Name,
                        Description = string.Concat(p.Status == 1 ? "The task is completed" : "The task is pending", (p.Status != 1 && p.DueDate < DateTime.UtcNow) ? " and overdue." : "."),
                        Url = new Uri(this.GetAbsoluteUrl(listId)),
                        Published = p.StartDate
                    }).ToList();

                    Feed feed = new Feed(feedItems)
                    {
                        Title = list.Name,
                        Description = list.IsPublic == 0 ? "Private List" : "Public List",
                        Url = new Uri(this.GetAbsoluteUrl(listId)),
                    };

                    return View(feed);
                }

                return new EmptyResult();
            }
        }

        private string GetAbsoluteUrl(Guid listId)
        {
            return Url.Action("Tasks", "Todo", new { id = listId }, this.Request.Url.Scheme)
                      .Replace(this.Request.Url.Host + ":" + this.Request.Url.Port, this.Request.ServerVariables["HTTP_HOST"]);
        }
    }
}