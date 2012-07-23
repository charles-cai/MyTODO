var maxDate = new Date("December 31, 9999 23:59:59");

(function ($) {
    $.fn.taskItem = function (options) {
        this.task = options.task;
        this.editModeEnabled = false;

        this.refreshStatus = function () {
            var dueDate = this.getDueDate();

            if (dueDate != null && !this.getCompleted() && dueDate <= new Date()) {
                this.attr("data-theme", "r").attr("data-icon", "info");
                this.removeClass('ui-btn-up-r').removeClass('ui-btn-up-g').addClass('ui-btn-up-r');
                $('span', this).removeClass('ui-icon-arrow-r').removeClass('ui-icon-check').addClass('ui-icon-info');
            } else {            
                if (this.getCompleted()) {
                    this.attr("data-theme", "g").attr("data-icon", "check");
                    this.removeClass('ui-btn-up-r').removeClass('ui-btn-up-b').addClass('ui-btn-up-g');
                    $('span', this).removeClass('ui-icon-arrow-r').removeClass('ui-icon-info').addClass('ui-icon-check');
                } else {
                    this.removeAttr("data-theme").attr("data-icon", "arrow-r");
                    this.removeClass('ui-btn-up-r').removeClass('ui-btn-up-g').addClass('ui-btn-up-c');
                    $('span', this).removeClass('ui-icon-info').removeClass('ui-icon-check').addClass('ui-icon-arrow-r');
                }
            }
            
            $('#tasks').listview('refresh');
        };
        
        this.editMode = function () {
            if (this.hasClass('editing'))
                return false;

            this.addClass("taskEdit");
            $("#task-list").hide();
            $("#crud").show();
            $("#title").val(this.getTitle());
            $("#status").prop('checked', this.getCompleted()).checkboxradio("refresh");
            
            if (this.getStartDate() != null)
                $("#startDate").scroller('setDate', this.getStartDate(), true);
            if (this.getDueDate() != null)
                $("#dueDate").scroller('setDate', this.getDueDate(), true);

            $("input.save").unbind('click').click(function(){ t.commit(); } );
            $("input.delete").unbind('click').click(function(){ t.confirmDelete(); t.normalMode(); } );
            this.editModeEnabled = true;
            return false;
        };
        
        this.normalMode = function () {
            if (this.hasClass('editing'))
                return false;

            this.addClass("taskEdit");
            $("#task-list").show();
            $("#crud").hide();
            $("#title").val('');
            $("#status").removeAttr('checked').checkboxradio("refresh");
            this.editModeEnabled = false;
            return false;
        };
        
        this.confirmDelete = function () {
            t.trigger({ type: "delete", control: t, task: t.task });         
        };
        
        this.commit = function () {
            this.setTitle($("#title").val());
            this.setCompleted($("#status").prop('checked'));
                
            if ($("#startDate").val() != '')
                this.setStartDate($("#startDate").scroller('getDate'));
                
            if ($("#dueDate").val() != '')
                this.setDueDate($("#dueDate").scroller('getDate'));
                
            this.trigger({ type: "update", control: this, task: this.task });
            t.normalMode();

            this.refreshStatus();            
        };
        
        this.getCompleted = function () { return this.task.Status == 1; };
        this.setCompleted = function (completed) {
            this.task.Status = completed ? 1 : 0;
            this.refreshStatus();
        };
        
        this.getTitle = function () { return this.task.Name; };
        this.setTitle = function (title) {
            if (this.getTitle() == title) return;
            this.task.Name = title;
            this.find("a.title").text(title);
        };
        
        this.getStartDate = function () { return this.task.StartDate; };
        this.setStartDate = function (date) { this.task.StartDate = date; };
        this.getDueDate = function () {
            if (this.task.DueDate != null && 
                new Date(this.task.DueDate).toLocaleDateString() != maxDate.toLocaleDateString()) {
                //var localDueDate = new Date(this.task.DueDate);
                return this.task.DueDate;
            }
            return null;
        };
        
        this.setDueDate = function (date) { this.task.DueDate = date; };
        
        this.getCalendarConfiguration = function () {
            var theme = 'default';
            var mode = 'scroller';
            
            if(navigator.userAgent.match(/Android/i)) {
                theme = 'android';
            }
            else if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
                theme = 'ios';
            }
            else {
                mode = 'clickpick';
            }

            return {theme: theme, mode: mode };
        };
        
        // build
        this.empty();
        this.append($($.fn.taskItem.template));
        $('#startDate').scroller(this.getCalendarConfiguration());
        $('#dueDate').scroller(this.getCalendarConfiguration());

        // setup
        var t = this;

        this.find("a.title").text(t.getTitle());
        
        if (options.enableEdit) {
            t.click(function () {
                if (t.hasClass('editing'))
                    return;

                t.editMode();
            });

            $('#crud input.back').click(function () { t.normalMode(); });

        } else {
            t.attr('data-role', 'read-only');
        }

        this.refreshStatus();       
        
        return this;
    };

    $.fn.taskItem.template = '<a class="title"></a>';
})(jQuery);

