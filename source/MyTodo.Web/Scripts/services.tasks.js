function TaskServiceProxy(uriService) {
    this.uriService = uriService;
}

TaskServiceProxy.prototype.GetTasks = function (taskListId, callback) {
    log("TaskServiceProxy:GetTasks(" + taskListId + ")");
    var $xhr = $.getJSON(
        this.uriService + "/" + taskListId + "/Tasks",
        function (data) {
            log("TaskServiceProxy:GetTasks(" + taskListId + ")_Response():");
            log(data);
            callback(data);
        });
    $xhr.error(this.serviceError);
}

TaskServiceProxy.prototype.CreateTask = function (task, taskListId, callback) {
    var entityTask = {
        Name: task.Subject,
        Description: "",
        TaskListId: taskListId
    };

    log("TaskServiceProxy:CreateTask():");
    log(entityTask);

    var $xhr = $.ajax({
        type: "POST",
        url: this.uriService + "/" + taskListId + "/Tasks",
        contentType: "application/json",
        data: JSON.stringify(entityTask),
        success: function (data) {
            log("TaskServiceProxy.CreateTask_Response():");
            log(data);
            callback(data);
        }
    });
    $xhr.error(this.serviceError);
}

TaskServiceProxy.prototype.UpdateTask = function (task, callback) {
    log("TaskServiceProxy:UpdateTask():");
    log(task);
    
    var $xhr = $.ajax({
        type: "PUT",
        url: this.uriService + "/" + task.TaskListId + "/Tasks/" + task.Id,
        contentType: "application/json",
        data: JSON.stringify(task),
        success: function (data) {
            log("TaskServiceProxy.UpdateTask_Response():");
            log(data);
            callback(data);
        }
    });
    $xhr.error(this.serviceError);
}

TaskServiceProxy.prototype.DeleteTask = function (task, callback) {
    log("TaskServiceProxy:DeleteTask():");
    log(task);

    var $xhr = $.ajax({
        type: "DELETE",
        url: this.uriService + "/" + task.TaskListId + "/Tasks/" + task.Id,
        success: function (data) {
            log("TaskServiceProxy.DeleteTask_Response():");
            callback(true);
        }
    });
    $xhr.error(this.serviceError);
}

TaskServiceProxy.prototype.serviceError = function (err) {
    log("! TaskServiceProxy::serviceError():");
    log(err);
}

function log(o) {
    if (window.console && console.log) console.log(o);
}
