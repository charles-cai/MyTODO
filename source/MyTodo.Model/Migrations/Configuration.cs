namespace Microsoft.Samples.MyTodo.Model.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using System.Web.Security;

    internal sealed class Configuration : DbMigrationsConfiguration<Microsoft.Samples.MyTodo.Model.MyTodoContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(Microsoft.Samples.MyTodo.Model.MyTodoContext context)
        {
            var userName = "johndoe";

            if (Membership.GetUser(userName) != null)
                return;

            Membership.CreateUser(userName, "123456");

            // add 2 public lists
            TaskList wareHouseList = this.InsertTaskList(context, userName, "Warehouse List", 1);
            TaskList shoppingList = this.InsertTaskList(context, userName, "Shopping List", 1);

            // add tasks inside the lists
            this.InsertTask(context, wareHouseList.Id, userName, "Screwdriver", string.Empty, 1, DateTime.Now, null, DateTime.Now);
            this.InsertTask(context, wareHouseList.Id, userName, "LED Aluminum Flashlight", string.Empty, 0, DateTime.Now.Subtract(new TimeSpan(25, 0, 0)), null, DateTime.Now);
            this.InsertTask(context, wareHouseList.Id, userName, "Hammer", string.Empty, 0, DateTime.Now.Subtract(new TimeSpan(35, 0, 0)), null, DateTime.Now);
            this.InsertTask(context, wareHouseList.Id, userName, "Nails", string.Empty, 0, DateTime.Now.Subtract(new TimeSpan(45, 0, 0)), null, DateTime.Now);
            this.InsertTask(context, wareHouseList.Id, userName, "Red Tool Box", string.Empty, 1, DateTime.Now.Subtract(new TimeSpan(55, 0, 0)), null, DateTime.Now);

            this.InsertTask(context, shoppingList.Id, userName, "BBQ Sauce", string.Empty, 0, DateTime.Now.Subtract(new TimeSpan(65, 0, 0)), null, DateTime.Now);
            this.InsertTask(context, shoppingList.Id, userName, "Milk", string.Empty, 0, DateTime.Now, null, DateTime.Now);
            this.InsertTask(context, shoppingList.Id, userName, "Coffee", string.Empty, 0, DateTime.Now.Subtract(new TimeSpan(75, 0, 0)), null, DateTime.Now);
            this.InsertTask(context, shoppingList.Id, userName, "Bread", string.Empty, 0, DateTime.Now.Subtract(new TimeSpan(85, 0, 0)), null, DateTime.Now);
            this.InsertTask(context, shoppingList.Id, userName, "Coffee Mugs", string.Empty, 1, DateTime.Now, null, DateTime.Now);
            this.InsertTask(context, shoppingList.Id, userName, "Flour", string.Empty, 0, DateTime.Now.Subtract(new TimeSpan(95, 0, 0)), null, DateTime.Now);
            this.InsertTask(context, shoppingList.Id, userName, "Oranges", string.Empty, 1, DateTime.Now.Subtract(new TimeSpan(105, 0, 0)), null, DateTime.Now);
        }

        private TaskList InsertTaskList(MyTodoContext context, string userName, string taskListName, byte isPublic)
        {
            var taskList = new TaskList
            {
                Id = Guid.NewGuid(),
                UserName = userName,
                Name = taskListName,
                IsPublic = isPublic
            };

            context.TaskLists.Add(taskList);
            return taskList;
        }

        private Task InsertTask(MyTodoContext context, Guid taskListId, string userName, string name, string description, byte status, DateTime startDate, DateTime? dueDate, DateTime timestampUpdate)
        {
            var task = new Task
            {
                Id = Guid.NewGuid(),
                TaskListId = taskListId,
                UserName = userName,
                Name = name,
                Description = description,
                Status = status,
                StartDate = startDate,
                DueDate = dueDate,
                TimestampUpdate = timestampUpdate
            };

            context.Tasks.Add(task);
            return task;
        }
    }
}
