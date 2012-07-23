function createList(list, fadeIn) {
    $("#newList").addClass("adding");
    listsService.CreateList(list, function(createdList) {
        if (createdList == null) return;
        addList(createdList, true);
        $("#newList").removeClass("adding");
        refreshStripes();
    });
}

function addList(list, fadeIn) {
    $("#lists li.empty").slideUp();
    var t = $("<li></li>").listItem({ list: list, enableEdit: authenticatedUser })
                          .bind("delete", function(e) { deleteList(e.list, e.control); })
                          .bind("update", function(e) { updateList(e.list, e.control); });
    t.appendTo($("#lists"));
    if (fadeIn && (!$.browser.msie || ($.browser.version > 7 || navigator.userAgent.indexOf("Trident/4.0") > -1))) t.hide().slideDown(200);
}

function deleteList(list, listControl) {
    listControl.addClass("deleting");
    listsService.DeleteList(list, function(status) {
        listControl.removeClass("deleting");
        listControl.slideUp(200, function() {
            $(this).remove();
            refreshStripes();
        });
    });
}

function updateList(list, listControl) {
    listControl.addClass("updating");
    listsService.UpdateList(list, function(status) {
        listControl.removeClass("updating");
    });
}

function refreshStripes() {
    $("#lists li").each(function(ix, el) {
        if (ix % 2 == 0) {
            $(this).removeClass("alter")
        } else {
            $(this).addClass("alter");
        }
    });

    if ($("#lists li").length == 1) $("#lists li.empty").slideDown();
}