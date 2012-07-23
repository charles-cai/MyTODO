function createList(list, fadeIn) {
    $.mobile.showPageLoadingMsg(); 
    listsService.CreateList(list, function(createdList) {
        if (createdList == null) return;
        addList(createdList, true);
        $.mobile.hidePageLoadingMsg(); 
    });
}

function addList(list, fadeIn) {
    $('#lists li[data-role="read-only"]').remove();
    
    var t = $("<li></li>").listItem({ list: list, enableEdit: authenticatedUser })
                          .bind("delete", function (e) { deleteList(e.list, e.control); })
                          .bind("update", function (e) { updateList(e.list, e.control); });

    t.appendTo($("#lists"));
    $('#lists').listview('refresh');
}

function deleteList(list, listControl) {
    $.mobile.showPageLoadingMsg(); 
    listsService.DeleteList(list, function(status) {
        $.mobile.hidePageLoadingMsg(); 
        listControl.slideUp(0, function() {
            $(this).remove();
            if ($('#lists li').length <= 1) {
                $("#lists").append('<li data-role="read-only" class="empty">No lists are available.</li>')
                           .listview('refresh');
            }

            $('#lists li').last().addClass('ui-corner-bottom');
        });
    });
}

function updateList(list, listControl) {
    $.mobile.showPageLoadingMsg(); 
    listsService.UpdateList(list, function(status) {
        $.mobile.hidePageLoadingMsg();
    });
}