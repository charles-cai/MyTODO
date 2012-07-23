(function($) {
    $.fn.listItem = function(options) {
        this.list = options.list;

        this.readMode = function() {
            this.find("input.title").fadeOut(200);
            this.find("a.title").slideDown(200);
        }

        this.simpleEditMode = function() {
            this.find("input.title").fadeIn(200).focus().select();
            this.find("a.title").slideUp(200);
        }

        this.confirmShare = function() {
            var t = this;
            var removeConfirm = function() {
                t.find(".confirm").slideUp(function() { $(this).remove(); });
                t.find(".share").blur();
            }

            if (this.find(".confirm").length > 0) {
                removeConfirm();
                return;
            }

            var box = $($.fn.listItem.confirmTemplate);
            box.addClass("shareConfirm");
            box.find("a:first").click(function(e) {
                removeConfirm();
                t.setShared(!t.getIsPublic());
                t.find("a.share span").text(t.getShared());
            });
            box.find("a:last").click(function(e) { removeConfirm(); });

            box.appendTo(this)
               .hide().slideDown();
               
            t.find(".share").blur();
        }

        this.confirmDelete = function() {
            var t = this;
            var removeConfirm = function() {
                t.find(".confirm").slideUp(function() { $(this).remove(); });
                t.find(".delete").blur();
            }

            if (this.find(".confirm").length > 0) {
                removeConfirm();
                return;
            }

            var box = $($.fn.listItem.confirmTemplate);
            box.addClass("deleteConfirm");
            box.find("a:first").click(function(e) {
                removeConfirm();
                t.trigger({ type: "delete", control: t, list: t.list });
            });
            box.find("a:last").click(function(e) { removeConfirm(); });

            box.appendTo(this)
               .hide().slideDown();
        }

        this.getShared = function() {
            if (this.list.IsPublic == 1) {
                return "Unshare";
            }
            else {
                return "Share";
            }
        }

        this.setShared = function(shared) {
            this.list.IsPublic = shared ? 1 : 0;
            this.trigger({ type: "update", control: this, list: this.list });
        }

        this.getTitle = function() { return this.list.Name; }
        this.setTitle = function(title) {
            this.list.Name = title;
            this.find("input.title").val(title);
            this.find("a.title").text(title);
            this.trigger({ type: "update", control: this, list: this.list });
        }

        this.getListId = function() { return this.list.Id; }

        this.getIsPublic = function() { return this.list.IsPublic == 1; }

        // build
        this.empty();
        this.addClass("list");
        this.append($($.fn.listItem.template));

        // setup
        var t = this;
        this.find("a.share span").text(t.getShared());

        this.find("a.title")
            .attr("href", "/Todo/Tasks/" + t.getListId())
            .text(t.getTitle());

        this.find("input.title")
            .css("display", "none")
            .val(t.getTitle());

        if (options.enableEdit) {
            this.addClass("editable");

            this.find("a.share").click(function() { t.confirmShare(); });
            //this.find("span.title").click(function(e) { t.simpleEditMode(); })

            var doCommit = function() {
                var val = t.find("input.title").val();
                if (val.length > 0) t.setTitle(val);
                t.readMode();
            };

            this.find("input.title")
                .bind("blur", function() { setTimeout(doCommit, 250); })
                .keydown(function(e) { if (e.keyCode == 13) doCommit(); })

            this.find("a.delete").click(function() { t.confirmDelete() });

        } else {
            this.find("a.delete").hide();
            this.find("a.share").hide();
        }

        return this;
    };

    $.fn.listItem.template =
                '<p><input type="text" class="title" />' +
                '<a class="title"></a>' +
                '<span class="options">' +
                    '<span class="sep">(</span>' +
                    '<a class="btn share" href="javascript:void(0)"><span>Share</span></a>' +
                    '<span class="sep"> | </span>' +
                    '<a class="btn delete" href="javascript:void(0)"><span>Delete</span></a>' +
                    '<span class="sep">)</span>' +
                '</span>' +
                '<span class="break"></span></p>';

    $.fn.listItem.confirmTemplate = '<div class="confirm"><a href="javascript:void(0)">Yes</a><span class="sep"> | </span><a href="javascript:void(0)">No</a></div>';
})(jQuery);