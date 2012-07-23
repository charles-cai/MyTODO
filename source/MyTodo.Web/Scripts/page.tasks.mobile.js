function createTask(task, listId) {
    $.mobile.showPageLoadingMsg(); 
    tasksService.CreateTask(transformDatesToService(task), listId, function (createdTask) {
        if (createdTask == null) return;
        addTaskToUI(createdTask, true);
        $.mobile.hidePageLoadingMsg(); 
    });
}

function updateTask(task) {
    $.mobile.showPageLoadingMsg(); 
    tasksService.UpdateTask(transformDatesToService(task), function(status) {
        $.mobile.hidePageLoadingMsg(); 
    });
}

function deleteTask(task, taskControl) {
    $.mobile.showPageLoadingMsg(); 
    tasksService.DeleteTask(task, function(status) {
        $.mobile.hidePageLoadingMsg(); 
        if (!status) return;
        taskControl.slideUp(200, function() {
            $(this).remove();
            if ($('#tasks li').length <= 1) {
                $("#tasks").append('<li data-role="read-only" class="empty">No tasks here.</li>')
                           .listview('refresh');
            }
            
            $('#tasks li').last().addClass('ui-corner-bottom');
        });
    });
}

function addTaskToUI(task) {
    $('#tasks li[data-role="read-only"].empty').remove();

    var t = $("<li></li>").taskItem({ task: transformDatesFromService(task), enableEdit: isOwner })
                          .bind("delete", function(e) { deleteTask(e.task, e.control); })
                          .bind("update", function(e) { updateTask(e.task, e.control); });
    t.appendTo($("#tasks"));
    $('#tasks').listview('refresh');
}

function transformDatesFromService(serviceTask) {
    var task = {};
    for (var p in serviceTask) task[p] = serviceTask[p];
    task.StartDate = (task.StartDate) ? removeTimezoneOffset(new Date(parseInt(task.StartDate.replace("/Date(", "").replace(")/", ""), 10))) : null;
    task.DueDate = (task.DueDate) ? removeTimezoneOffset(new Date(parseInt(task.DueDate.replace("/Date(", "").replace(")/", ""), 10))) : null;
    return task;
}

function transformDatesToService(jsonTask) {
    var task = {};
    for (var p in jsonTask) task[p] = jsonTask[p];
    if (task.StartDate) task.StartDate = task.StartDate.addTimezoneOffset();
    if (task.DueDate) task.DueDate = task.DueDate.addTimezoneOffset();
    return task;
}

function removeTimezoneOffset(msDate) {
    try {
        if (!msDate) return null;
        var convertedDate = new Date(msDate);
        convertedDate.setMinutes(convertedDate.getMinutes() + convertedDate.getTimezoneOffset());
        return convertedDate;
    }
    catch (e) { return null; }
}

Date.prototype.addTimezoneOffset = function () {
    var convertedDate = new Date(this);
    convertedDate.setMinutes(convertedDate.getMinutes() - convertedDate.getTimezoneOffset());
    return convertedDate;
};