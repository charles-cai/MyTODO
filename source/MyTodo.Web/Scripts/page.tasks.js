function createTask(task, listId, fadeIn) {
    $("#newTask").addClass("adding");
    tasksService.CreateTask(transformDatesToService(task), listId, function (createdTask) {
        if (createdTask == null) return;
        addTaskToUI(createdTask, true);
        $("#newTask").removeClass("adding");
        refreshStripes();
    });
}

function updateTask(task, taskControl) {
    taskControl.addClass("saving");
    tasksService.UpdateTask(transformDatesToService(task), function(status) {
        taskControl.removeClass("saving");
    });
}

function deleteTask(task, taskControl) {
    taskControl.addClass("deleting");
    tasksService.DeleteTask(task, function(status) {
        taskControl.removeClass("deleting");
        if (!status) return;
        taskControl.slideUp(200, function() {
            $(this).remove();
            refreshStripes();
        });
    });
}

function addTaskToUI(task, fadeIn) {
    $("#tasks li.empty").slideUp();
    var t = $("<li></li>").taskItem({ task: transformDatesFromService(task), enableEdit: isOwner })
                          .bind("delete", function(e) { deleteTask(e.task, e.control); })
                          .bind("update", function(e) { updateTask(e.task, e.control); });
    t.appendTo($("#tasks"));
    if (fadeIn && (!$.browser.msie || ($.browser.version > 7 || navigator.userAgent.indexOf("Trident/4.0") > -1))) t.hide().slideDown(200);
}

function transformDatesFromService(serviceTask) {
    var task = {};
    for (var p in serviceTask) task[p] = serviceTask[p];
    task.StartDate = (task.StartDate) ? removeTimezoneOffset(new Date(parseInt(task.StartDate.replace("/Date(", "").replace(")/", ""), 10))) : null;
    task.DueDate = (task.DueDate)? removeTimezoneOffset(new Date(parseInt(task.DueDate.replace("/Date(", "").replace(")/",""), 10))) : null;
    return task;
}

function transformDatesToService(jsonTask) {
    var task = {};
    for (var p in jsonTask) task[p] = jsonTask[p];
    if (task.StartDate) task.StartDate = task.StartDate.addTimezoneOffset();
    if (task.DueDate) task.DueDate = task.DueDate.addTimezoneOffset();
    return task;
}

function refreshStripes() {
    $("#tasks li").each(function(ix, el) {
        if (ix % 2 == 0) {
            $(this).removeClass("alter");
        } else {
            $(this).addClass("alter");
        }
    });

    if ($("#tasks li").length == 1) $("#tasks li.empty").slideDown();
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
