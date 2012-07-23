(function ($) {
    $.fn.listItem = function (options) {
        this.list = options.list;

        this.readMode = function () {
            this.find("input.title").fadeOut(200);
            this.find("a.title").slideDown(200);
        };
        this.simpleEditMode = function () {
            this.find("input.title").fadeIn(200).focus().select();
            this.find("a.title").slideUp(200);
        };
        this.confirmShare = function () {
            t.setShared(!t.getIsPublic());
            t.find("a.share span").text(t.getShared());
        };
        this.confirmDelete = function () {
            t.trigger({ type: "delete", control: t, list: t.list });
        };
        this.getShared = function () {
            if (this.list.IsPublic == 1) {
                return "Unshare";
            }
            else {
                return "Share";
            }
        };
        this.setShared = function (shared) {
            this.list.IsPublic = shared ? 1 : 0;
            this.trigger({ type: "update", control: this, list: this.list });
        };
        this.getTitle = function () { return this.list.Name; };
        this.setTitle = function (title) {
            this.list.Name = title;
            this.find("input.title").val(title);
            this.find("a.title").text(title);
            this.trigger({ type: "update", control: this, list: this.list });
        };
        this.getListId = function () { return this.list.Id; };
        this.getIsPublic = function () { return this.list.IsPublic == 1; };

        // build
        this.empty();
        this.append($($.fn.listItem.template)).trigger("create");

        // setup
        var t = this;

        this.find("a.title")
            .text(t.getTitle());

        if (options.enableEdit) {

            this.click(function () {
                if (!t.hasClass('editing')) {

                    t.addClass('editing');
                    $('div:first', t).hide();
                    var actionLinks = $($.fn.listItem.actionsTemplate);
                    $("a.share", actionLinks).text(t.getShared());

                    t.prepend(actionLinks).trigger("create");
                    $('a.delete', t).click(function () { t.confirmDelete(); });
                    $('a.share', t).click(function () { t.confirmShare(); }); 
                    $("a.go", t).click(function () { window.location.href = "/Todo/Tasks/" + t.getListId(); });
                }
                else {

                    t.removeClass('editing');
                    $('div', t).show();
                    $('fieldset', t).remove();
                }
            });

        } else {
            this.attr('data-role', 'read-only');
        }

        $('#lists').listview('refresh');

        return this;
    };

    $.fn.listItem.template = '<a class="title"></a>';
    $.fn.listItem.actionsTemplate = '<fieldset class="ui-grid-a">' +
                                        '<div data-role="controlgroup" data-type="horizontal" style="text-align:center">' +
                                            '<a href="#" data-role="button" data-theme="r" class="delete">X</a>' +
                                            '<a href="#" data-role="button" data-theme="c" class="share">Share</a>' +
                                            '<a href="#" data-role="button" data-theme="c" class="go">Tasks</a>' +
                                        '</div>' +
                                    '</fieldset>';
})(jQuery);