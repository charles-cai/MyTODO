var maxDate = new Date("December 31, 9999 23:59:59");

(function ($) {
    $.fn.taskItem = function (options) {
        this.task = options.task;
        this.extendedMode = false;

        this.refreshStatus = function () {
            var overDue = false;
            var dueDate = this.getDueDate();
            if (dueDate != null && !this.getCompleted() && dueDate <= new Date()) {
                this.addClass("overdue");
            } else {
                this.removeClass("overdue");
            }
        }

        this.readMode = function () {
            this.removeClass("taskEdit");
            this.find("input.title").fadeOut(200);
            this.find("span.title").slideDown(200);
            this.find("span.completed input")
                .attr("checked", t.getCompleted());
            this.extendedMode = false;
            this.refreshStatus();
        }

        this.simpleEditMode = function () {
            this.addClass("taskEdit");
            this.find("input.title").fadeIn(200).focus().select();
            this.find("span.title").slideUp(200);
            this.extendedMode = false;
        }

        this.extendedEditMode = function () {
            this.addClass("taskEdit");
            this.find("input.title").fadeIn(200).focus().select();
            this.find("span.title").slideUp(200);
            this.find("p.extended").slideDown();
            this.find("a.save").show();
            this.find("a.edit").hide();
            this.find("input.startDate").datepicker("setDate", this.getStartDate());
            this.find("input.dueDate").datepicker("setDate", this.getDueDate());
            this.extendedMode = true;
        }

        this.confirmDelete = function () {
            var t = this;
            var removeConfirm = function () {
                t.find(".confirm").slideUp(function () { $(this).remove(); });
                t.find(".delete").blur();
            }

            if (this.find(".confirm").length > 0) {
                removeConfirm();
                return;
            }

            var box = $($.fn.taskItem.confirmTemplate);
            box.addClass("deleteConfirm");
            box.find("a:first").click(function (e) {
                removeConfirm();
                t.trigger({ type: "delete", control: t, task: t.task });
            });
            box.find("a:last").click(function (e) { removeConfirm(); });

            box.appendTo(this)
               .hide().slideDown();
        }

        this.commit = function () {
            var newTitle = this.find("input.title").val();
            var newCompleted = this.find("span.completed input").is(":checked");

            if (!this.extendedMode && newTitle == this.getTitle() && newCompleted == this.getCompleted()) {
                this.readMode();
                return;
            }

            if (this.extendedMode) {
                this.setStartDate(this.find("input.startDate").datepicker("getDate"));
                this.setDueDate(this.find("input.dueDate").datepicker("getDate"));
                this.find("p.extended").slideUp();
                this.find("a.save").hide();
                this.find("a.edit").show();
            }

            if (newTitle.length > 0) this.setTitle(newTitle)
            this.setCompleted(newCompleted);
            this.trigger({ type: "update", control: this, task: this.task });

            this.readMode();
        }

        this.getCompleted = function () { return this.task.Status == 1; }
        this.setCompleted = function (completed) {
            this.task.Status = completed ? 1 : 0;
            if (completed) {
                this.addClass("isComplete");
            } else {
                this.removeClass("isComplete");
            };
        }

        this.getTitle = function () { return this.task.Name; }
        this.setTitle = function (title) {
            if (this.getTitle() == title) return;
            this.task.Name = title;
            this.find("input.title").val(title);
            this.find("span.title").text(title);
        }

        this.getStartDate = function () { return this.task.StartDate; }
        this.setStartDate = function (date) { this.task.StartDate = date; }

        this.getDueDate = function () {

            if (this.task.DueDate != null && 
                new Date(this.task.DueDate).toLocaleDateString() != maxDate.toLocaleDateString()) {
                //var localDueDate = new Date(this.task.DueDate);
                return this.task.DueDate;
            }
            return null;
        }
        this.setDueDate = function (date) { this.task.DueDate = date; }

        // build
        this.empty();
        this.addClass("task");
        this.append($($.fn.taskItem.template));
        this.find("input.startDate").datepicker();
        this.find("input.dueDate").datepicker();

        // setup
        var t = this;
        this.find("span.completed input")
            .attr("checked", t.getCompleted());
        if (t.getCompleted()) this.addClass("isComplete");

        this.find("span.title")
            .text(t.getTitle());

        this.find("input.title")
            .css("display", "none")
            .val(t.getTitle());

        if (options.enableEdit) {
            this.addClass("editable");
            this.find("span.completed input").bind("click", function () {
                setTimeout(function () { if (!t.extendedMode) t.commit() }, 250);
            })
            this.find("span.title").click(function (e) { t.simpleEditMode(); })
            this.find("input.title")
                .bind("blur", function () { setTimeout(function () { if (!t.extendedMode) t.commit() }, 250); })
                .keydown(function (e) { if (e.keyCode == 13) t.commit(); })
            this.find("a.edit").click(function () { t.extendedEditMode() });
            this.find("a.save").click(function () { t.commit() });
            this.find("a.delete").click(function () { t.confirmDelete() });
        } else {
            this.find("a.delete").hide();
            this.find("a.edit").hide();
            this.find("span.completed input").attr("disabled", true);
        }

        this.find("input:checkbox").checkbox();

        this.refreshStatus();

        return this;
    };

    $.fn.taskItem.template =
                '<p><span class="completed"><input type="checkbox" value="1" /></span>' +
                '<input type="text" class="title" />' +
                '<span class="title"></span>' +
                '<span class="options">' +
                    '<span class="sep">(</span>' +
                    '<a class="btn save" href="javascript:void(0)"><span>Save</span></a>' +
                    '<span class="sep">(</span>' +
                    '<a class="btn edit" href="javascript:void(0)"><span>Edit</span></a>' +
                    '<span class="sep"> | </span>' +
                    '<a class="btn delete" href="javascript:void(0)"><span>Delete</span></a>' +
                    '<span class="sep">)</span>' +
                '</span>' +
                '<span class="break"></span></p>' +
                '<p class="extended">' +
                    '<label class="startDate">Start Date: <input type="text" class="startDate" /></label>' +
                    '<label class="dueDate">Due Date: <input type="text" class="dueDate" /></label>' +
                '</p>';

    $.fn.taskItem.confirmTemplate = '<div class="confirm"><a href="javascript:void(0)">Yes</a><span class="sep"> | </span><a href="javascript:void(0)">No</a></div>';
})(jQuery);

