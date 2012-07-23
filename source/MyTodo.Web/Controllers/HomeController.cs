namespace Microsoft.Samples.MyTodo.Web.Controllers
{
    using System.Linq;
    using System.Web.Mvc;
    using System.Web.WebPages;

    using Microsoft.Samples.MyTodo.Model;
    using Microsoft.Samples.MyTodo.Web.ViewModels;

    public class HomeController : Controller
    {
        private readonly MyTodoContext model;

        public HomeController()
            : this(new MyTodoContext())
        {
        }

        public HomeController(MyTodoContext model)
        {
            this.model = model;
        }

        public ActionResult Index()
        {
            var lists = this.model.TaskLists.Where(o => o.IsPublic == 1).OrderBy(o => o.Name).ToArray();
            var viewModel = new TaskListsViewModel { Lists = lists };
            return View(viewModel);
        }

        public ActionResult About()
        {
            return View();
        }
    }
}