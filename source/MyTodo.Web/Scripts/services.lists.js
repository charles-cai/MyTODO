function ListServiceProxy(uriService) {
    this.uriService = uriService;
}
  
ListServiceProxy.prototype.GetLists = function (callback) {
    log("ListServiceProxy.GetLists()");
    var $xhr = $.getJSON(
        this.uriService,
        function (data) {
            log("ListServiceProxy:GetLists_Response():");
            log(data);
            callback(data);
        });
    $xhr.error(this.serviceError);
}

ListServiceProxy.prototype.CreateList = function (list, callback) {
    log("ListServiceProxy.CreateList():");
    log(list);

    var $xhr = $.ajax({
        type: "POST",
        url: this.uriService,
        contentType: "application/json",
        data: JSON.stringify(list),
        success: function(data) {
            log("ListServiceProxy.CreateList_Response():");
            log(data);
            callback(data);
        }
    });
    $xhr.error(this.serviceError);
}

ListServiceProxy.prototype.UpdateList = function(list, callback) { 
    log("ListServiceProxy.UpdateList():");
    log(list);

    var $xhr = $.ajax({
        type: "PUT",
        url: this.uriService + "/" + list.Id,
        contentType: "application/json",
        data: JSON.stringify(list),
        success: function(data) {
            log("ListServiceProxy.UpdateList_Response():");
            log(data);
            callback(data);
        }
    });
    $xhr.error(this.serviceError);
}

ListServiceProxy.prototype.DeleteList = function(list, callback) {
    log("ListServiceProxy.DeleteList():");
    log(list);

    var $xhr = $.ajax({
        type: "DELETE",
        url: this.uriService + "/" + list.Id,
        success: function(data) {
            log("ListServiceProxy.DeleteList_Response():");
            callback();
        }
    });
    $xhr.error(this.serviceError);
}

ListServiceProxy.prototype.serviceError = function (err) {
    log("! ListServiceProxy::serviceError():");
    log(err);
}

function log(o) {
    if (window.console && console.log) console.log(o);
}