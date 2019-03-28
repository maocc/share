(function () {
    var Dropmenu = function (selector) {
        this.ui = $(selector);
        this.renderUI();
        this.bindUI();
    }
    Dropmenu.prototype.renderUI = function () {
        var ui = this.ui;
        ui.addClass('dropmenu').show();
        ui.find('.item').each(function () {
            var item = $(this);
            var ul = item.next('ul');
            if (ul.length === 0) {
                item.addClass('lastnode');
            } else {
                item.addClass('dirnode')
            }
        });
    }
    Dropmenu.prototype.bindUI = function () {
        var _this = this;
        var ui = this.ui;
        ui.on('click', '.lastnode', function (e) {
            e.preventDefault();
            _this.ui.find('.lastnode').removeClass('active');
            $(this).addClass('active');
        });
        ui.on('click', '.dirnode', function (e) {
            e.preventDefault();
            var a = $(this);
            var li = a.parent();
            var ul = a.next('ul');
            if (a.hasClass('active')) {
                a.removeClass('active');
                li.removeClass('active');
                ul.removeClass('active');
            } else {
                a.addClass('active');
                li.addClass('active');
                ul.addClass('active');
            }
        });
    }
    //展开所有父级
    Dropmenu.prototype.openParents = function ($target) {
        $($target).parentsUntil('.dropmenu').filter('li,ul').addClass('active');
    }
    Dropmenu.prototype.searchNode = function (selector) {
        var nodelist = this.ui.find(selector);
        if (nodelist.length > 0) {
            var _this = this;
            _this.ui.find('.searching').removeClass('searching');
            nodelist.addClass('searching');
            nodelist.each(function () {
                _this.openParents(this);
            });
            this.ui.find('ul.active').siblings('.item').addClass('active');
        }
    }

    function Event() {
        this.handlers = {}
    }
    Event.prototype.on = function (type, handler) {
        this.handlers[type] === undefined && (this.handlers[type] = []);
        this.handlers[type].push(handler)
    }
    Event.prototype.trigger = function (type, data) {
        var arr = this.handlers[type];
        if (arr instanceof Array) {
            arr.forEach(function (e) {
                e(data);
            });
        }
    }
    $.extend(Dropmenu.prototype, new Event());
    window.Dropmenu = Dropmenu;
})();
