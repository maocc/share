(function($) {
    var win = window;
    // 全局语言包对象
    var _LANG = win._lang || {};

    $.ajaxSetup({
        traditional: true,
        cache: false
    });

    /*
     * 挂载父框架上的工具函数
     * ---------------------------------------
     * - 可用方法 -
     * showAlert(text, outTime, type) type是提示信息类型 i: 普通提示信息（默认），w：警告，e：错误
     * openLoading() 打开全局遮罩层
     * closeLoading() 关闭全局遮罩层
     * storagesData(key, val) 保存数据到父框架
     * storagesData(key) 从父框架读取数据
     *
     */
    if (typeof self.parent.jQuery.ywx !== 'undefined') {
        win.tools = self.parent.jQuery.ywx;
    }


    /*
     * validator 插件全局配置
     */
    if (typeof $.validator !== 'undefined') {
        $.validator.setDefaults({
            // errorPlacement: function (error, element) {
            errorPlacement: function() {},
            errorClass: 'has-error'
        });
    }

    if (typeof $.datepicker !== 'undefined') {
        $.datepicker.setDefaults({
            dateFormat: _LANG.datepicker.dateFormat,
            monthNamesShort: _LANG.datepicker.monthNamesShort,
            monthNames: _LANG.datepicker.monthNames,
            dayNamesMin: _LANG.datepicker.dayNamesMin,
            changeYear: true,
            changeMonth: true,
            onClose: function() {
                var self = $(this);
                if (self.valid) {
                    self.valid();
                }
                //防止下次点击不open
                // console.info('blur')
                self.blur();
            }
        });
    }

    if (typeof $.timepicker !== 'undefined') {
        $.timepicker.setDefaults({
            timeText: _LANG.timepicker.timeText,
            hourText: _LANG.timepicker.hourText,
            minuteText: _LANG.timepicker.minuteText,
            currentText: _LANG.timepicker.currentText,
            closeText: _LANG.timepicker.closeText,
            timeFormat: _LANG.timepicker.timeFormat,
            timeInput: true,
            hourGrid: 0,
            minuteGrid: 0,
            onClose: function() {
                var self = $(this);
                //防止下次点击不open
                self.blur();
            }
        });
    }


    /**
     * Alert
     * 使用方式：
     * var ywxAlert = new window.Alert(可选配置参数);
     * ywxAlert.open(内容文本,回调)
     * */
    var Alert = function(opt) {
        var dialog = this.dialog = $('<div>').dialog($.extend({
            width: 400,
            modal: true,
            autoOpen: false,
            dialogClass: 'dialog-alert',
            title: _LANG.dialog.alertTitle
        }, opt));
        dialog.on('click', '.dialog-alert-ok', function() {
            dialog.dialog('close');
        });
    };

    Alert.prototype.open = function(content, callback) {
        var html = '<div style="min-height: 50px;">' + content + '</div>';
        html += '<div style=\'padding-top:10px;text-align: center;\'><button class="btn btn-green dialog-alert-ok">' + _LANG.button.success + '</button></div>';
        this.dialog.html(html);
        this.dialog.off('dialogclose');
        if (callback) {
            this.dialog.on('dialogclose', callback);
        }
        this.dialog.dialog('open');
    };

    /**
     * Confirm
     * 使用方式：
     * var ywxConfirm = new window.Confirm(可选配置参数);
     * ywxConfirm.open(内容文本,回调)
     */
    var Confirm = function(opt) {
        var dialog = this.dialog = $('<div>').dialog($.extend({
            width: 400,
            modal: true,
            autoOpen: false,
            dialogClass: 'dialog-confirm',
            title: _LANG.dialog.alertTitle
        }, opt));
        var self = this;
        dialog.on('click', '.btn-confirm-ok,.btn-confirm-cancel', function() {
            if ($(this).hasClass('btn-confirm-ok')) {
                self.okTrigger = true;
            }
            dialog.dialog('close');
        });

    };

    /* var opt = {
     ok: ['确定', handler],
     cancel: ['取消', handler]
     }*/
    Confirm.prototype.open = function(content, opt) {
        this.okTrigger = false;
        var html = '<div style="min-height: 50px;">' + content + '</div>';
        html += '<div style=\'padding-top:10px;text-align: center;\'>' +
            '<button class="btn btn-green btn-confirm-ok">' + opt.ok[0] + '</button> &nbsp;&nbsp;&nbsp;' +
            '<button class="btn btn-green btn-confirm-cancel">' + opt.cancel[0] + '</button>' +
            '</div>';
        this.dialog.html(html);
        this.dialog.off('dialogclose');

        this.dialog.on('dialogclose', function() {
            // console.dir(this);
            if (this.okTrigger) {
                opt.ok[1]();
            } else {
                if (opt.cancel[1]) {
                    opt.cancel[1]();
                }
            }
        }.bind(this));
        this.dialog.dialog('open');
    };




    // 创建全局YWX对象
    var _YWX = {

        Alert: Alert,
        Confirm: Confirm,

        //创建遮罩
        createOverlay: function() {
            var $overlay = $('<div class=\'ajaxOverlay\'><i class=\'fa fa-spinner fa-pulse\'></i></div>').css({
                display: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                background: 'rgba(0,0,0,.08)',
                textAlign: 'center',
                zIndex: 110 //jquery.ui.dialog是100
            });
            $overlay.find('.fa').css({
                display: 'inline-block',
                marginTop: 300,
                fontSize: '4em'
            });
            $overlay.appendTo('body');
            return $overlay;
        },

        /*加载中遮罩标签*/
        tags: {
            AjaxOverlay: function() {
                var $overlay = _YWX.createOverlay();
                this.$overlay = $overlay;
                jQuery.ajaxSetup({
                    global: true
                });
                $(document)
                    .ajaxComplete(function() {
                        setTimeout(function() {
                            $overlay.hide();
                        }, 300);
                    })
                    .ajaxStart(function() {
                        $overlay.show();
                    });
            }
        },

        /*全选反选*/
        selectAll: function(all, box) {
            var $all = $(all);
            var $box = $(box);
            var len = $box.length;
            $all.prop('checked', false);
            $box.prop('checked', false);
            if (len > 0) {
                $all.prop('checked', $box.filter(':checked').length === len);
                $all.click(function() {
                    $box.prop('checked', $(this).is(':checked'));
                });
                $box.click(function() {
                    $all.prop('checked', $box.filter(':checked').length === len);
                });
            }
        },

        /**
         * 标签页操作
         */
        //返回列表页
        backListPage: function() {
            //返回列表页(当详情页有切换链接时history.back()不准);
            var id = win.top.$('.frameMain:not(.hidden)').data('id');
            win.top.$('#menuLink_' + id).click();
        },

        //根据url打开对应标签页
        openPage: function(url) {
            win.top.$('.lastnode[data-href="' + url + '"]').click();
        },

        /**
         * 时间相关的操作
         */
        //获取对象月最大天数
        getMaxDay: function(year, month) {
            if (month !== undefined) {
                var maxday = new Date(year, month + 1, 0).getDate();
                // console.info('_YWX.getMaxDay('+year+','+(month)+')=>',maxday);
                return maxday;
            }
        },

        // 字符串转日期
        strToDate: function(str) {
            //年-月-日 时:分
            if (/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])\s([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(str)) {
                return new Date(str.replace(/-/g, '/') + ':00');
                //年-月-日 时:分:秒
            } else if (/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])\s([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(str)) {
                return new Date(str.replace(/-/g, '/'));
                //年-月-日
            } else if (/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(str)) {
                return new Date(str.replace(/-/g, '/'));
            }
            if (str === '') {
                return new Date();
            }
            return false;
        },

        // 日期转字符串
        // 转成 年-月-日 时:分 (date支持date/map)
        dateToStr: function(date) {
            var map;
            if (date instanceof Date) {
                map = _YWX.dateToMap(date);
            } else {
                map = _YWX.dateToMap(new Date(date.year, date.month, date.date, date.hours, date.minutes));
            }
            var month = map.month + 1 < 10 ? '0' + (map.month + 1) : map.month + 1;
            var d = map.date < 10 ? '0' + map.date : map.date;
            var hours = map.hours < 10 ? '0' + map.hours : map.hours;
            var minutes = map.minutes < 10 ? '0' + map.minutes : map.minutes;
            var str = map.year + '-' + month + '-' + d + ' ' + hours + ':' + minutes;
            // console.info('dateToStr',str);
            return str;
        },

        //date->map
        dateToMap: function(date) {
            var map = {
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate(),
                hours: date.getHours(),
                minutes: date.getMinutes()
            };
            //console.info('map',map);
            return map;
        },

        //日历:选择事件范围
        datepickerRange: function(begin, end) {
            var $begin = $(begin);
            var $end = $(end);
            $begin.datepicker({
                maxDate: $end.val(),
                onClose: function(selectedDate) {
                    $end.datepicker('option', 'minDate', selectedDate);
                    //手动关闭弹窗 防止默认隐藏动画造成 鼠标双击 同时设置了两个输入框的值
                    $('#ui-datepicker-div').hide();
                }
            });
            $end.datepicker({
                minDate: $begin.val(),
                onClose: function(selectedDate) {
                    $begin.datepicker('option', 'maxDate', selectedDate);
                    $('#ui-datepicker-div').hide();
                }
            });
            //做标记 用于reset
            $begin.data('datepickerRange', 'begin');
            $end.data('datepickerRange', 'end');
        },

        datetimepickerRange: function(begin, end) {
            var $begin = $(begin);
            var $end = $(end);
            var min = $begin.val() ? _YWX.strToDate($begin.val()) : null;
            var max = $end.val() ? _YWX.strToDate($end.val()) : null;
            $begin.datetimepicker({
                maxDate: max,
                maxDateTime: max,
                onClose: function(selectedDate) {
                    // console.info('datetimepicker:close');
                    if (selectedDate) {
                        $end.datetimepicker('option', 'minDate', _YWX.strToDate(selectedDate));
                        $end.datetimepicker('option', 'minDateTime', _YWX.strToDate(selectedDate));
                    }

                }
            });
            $end.datetimepicker({
                minDate: min,
                minDateTime: min,
                hour: 23,
                minute: 59,
                onClose: function(selectedDate) {
                    // console.info('datetimepicker:close')
                    if (selectedDate) {
                        $begin.datetimepicker('option', 'maxDate', _YWX.strToDate(selectedDate));
                        $begin.datetimepicker('option', 'maxDateTime', _YWX.strToDate(selectedDate));
                    }

                }
            });

            //做标记 用于reset
            $begin.data('datetimepickerRange', 'begin');
            $end.data('datetimepickerRange', 'end');
        },

        //ajax提交相关
        post: function(url, data, success, error) {
            $.post(url, data, function(res) {
                res = res.results || res.result || res;
                if (res.success) {
                    if (success) {
                        success(res);
                    } else {
                        location.reload(true);
                    }
                } else {
                    if (error) {
                        error(res);
                    } else {
                        if (res.errors.length > 0) {
                            alert(res.errors);
                        } else {
                            alert(res.returnValue);
                        }

                    }
                }
            });
        },

        ajaxSubmit: function(form, success, error) {
            var $form = $(form);
            _YWX.post($form.attr('action'), $form.serialize(), success, error);
        },

        //列表页排序
        sortableTable: function(form, table) {
            var $form = $(form),
                $table = $(table);
            var $sortFile = $form.find('.sortFile');
            var $sortType = $form.find('.sortType');
            var file = $sortFile.val(),
                type = $sortType.val();
            $table.on('click', '.letSort', function() {
                var _file = $(this).data('file');
                //排序字段
                $sortFile.val(_file);
                //排序规则
                if (file == _file) {
                    type !== 'DESC' ? $sortType.val('DESC') : $sortType.val('ASC');
                } else {
                    $sortType.val('DESC');
                }
                $form.submit();
            });
            if (file) {
                var $th = $table.find('.letSort[data-file=' + file + ']').addClass('active');
                if ($th.length == 1 && type == 'ASC') {
                    $th.find('i').addClass('fa-caret-up').removeClass('fa-caret-down');
                }
            }
        },

        //切换卡
        panelTabs: function(panel) {
            $(panel).each(function() {
                var $panel = $(this);
                if ($panel.prop('panelTabs')) { //防止重复绑定事件
                    return;
                } else {
                    $panel.prop('panelTabs', true);
                }
                var $title = $panel.children('.panel-title');
                var $bodys = $panel.children('.panel-body');

                $title.on('click', 'li', function() {
                    var self = $(this);
                    self.addClass('selected').siblings().removeClass('selected');
                    $bodys.hide().eq(self.index()).show();
                });
            });
        },

        // 上传
        upload: function(type, opt) {
            var options;
            if (type == 'img') {
                options = $.extend({}, imgUploadOpt, opt);
            } else if (type == 'file') {
                options = $.extend({}, fileUploadOpt, opt);
            }
            var uploader = win.WebUploader.create(options);
            bindUploadDefaultEvent(uploader);
            //html样式没写好时 有可能ie下调用的flash定位歪了没覆盖在按钮上，有时候调用resize会修复这个问题
            $(win).resize();
            return uploader;
        },

        /**
         * 依赖：jquery.ui(默认common4已引入)
         * 功能：封装对话窗组件，给$.fn.dialog提供一组默认值
         * 参数：
         *      tag:'<div>'或者selectior或者dom  || 'frame'
         *      opt:覆盖默认options
         * 返回：$(tag)
         * 说明：当tag='frame'时 返回一个iframe对话窗，并提供setSrc方法
         */

        createDialog: function(tag, opt) {
            var $dialog, iframeHeight;
            var def = {
                modal: true,
                autoOpen: false
                    /*open: function(e, ui) {
                    	$(document.body).css('overflow', 'hidden');
                    },
                    close: function(e, ui) {
                    	$(document.body).css('overflow', 'auto');
                    }*/
            };
            if (tag === 'frame') { //iframe弹窗必须有height属性
                $dialog = $('<div><iframe frameborder="0" style="width:100%;height:' + opt.height + 'px;"></iframe></div>');
                iframeHeight = opt.height;
                opt.height = 'auto';
                $dialog.setSrc = function(src) {
                    $dialog.html('<div><iframe frameborder="0" src="' + src + '" style="width:100%;height:' + iframeHeight + 'px;"></iframe></div>');
                };
            } else {
                $dialog = $(tag);
            }
            return $dialog.dialog($.extend(def, opt));
        },

        /**
         * 保存数据到本地sessionStorage
         * @param  string key 键名
         * @param  string val 值
         */
        setData: function(key, val) {
            return sessionStorage.setItem(key, val);
        },
        /**
         * 从sessionStorage读取数据
         * @param  string key 键名
         * @return string     值
         */
        getData: function(key) {
            return sessionStorage.getItem(key);
        },

        /**
         * 保存当前地址到本地
         */
        setUrl: function() {
            return _YWX.setData('back-url', win.location.href);
        },

        /**
         * 返回 setUrl 里设置的地址
         */
        backurl: function() {
            win.location.assign(_YWX.getData('back-url'));
        }
    };

    /**
     * 文件上传方法_YWX.upload(依赖，需要页面单独引入)
     * 依赖：webuploader组件
     * 功能：封装默认配置，绑定默认事件，并调用 WebUploader.create
     * 参数：
     *      type：用来提供img/file两组默认配置
     *      opt：用来覆盖type提供的默认配置
     * 返回：webuploader实例
     */
    //webupload默认事件
    function bindUploadDefaultEvent(uploader) {
        uploader.on('uploadBeforeSend ', function(object, data, headers) {
            headers['Access-Control-Allow-Origin'] = '*';
            headers['Access-Control-Request-Headers'] = 'content-type';
            headers['Access-Control-Request-Method'] = 'POST';
        });
        uploader.on('error', function(error) {
            switch (error) {
                case 'F_EXCEED_SIZE':
                    return alert(_LANG.upload.fileTooLarge);
                case 'Q_TYPE_DENIED':
                    return alert(_LANG.upload.fileTypeErr);
                case 'F_DUPLICATE':
                    return alert(_LANG.upload.fileUploading);
                default:
                    return alert(_LANG.upload.fileUploadErr + error);
            }
        });
    }

    //img上传配置
    var imgUploadOpt = {
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        swf: win.ywxURL + '/skin/webuploader/Uploader.swf',
        server: win.ywxURL + '/car/upload/image',
        fileSingleSizeLimit: 5 * 1024 * 1024,
        multiple: false,
        resize: false,
        auto: true
    };
    //file上传配置
    var fileUploadOpt = {
        swf: win.ywxURL + '/skin/webuploader/Uploader.swf',
        server: win.ywxURL + '/storeUser/uploadDrivingLicense',
        fileSingleSizeLimit: 5 * 1024 * 1024,
        multiple: false,
        resize: false,
        auto: true
    };

    /**
     * 验证相关
     */

    //验证规则表
    var map = {
        //金额类
        money: [{
            title: _LANG.validate.money,
            maxlength: 9
        }, function(value) {
            return /^\d{1,6}(\.\d{0,2})?$/.test(value);
        }],
        intMoney: [{
            title: _LANG.validate.intMoney,
            maxlength: 6
        }, function(value) {
            return /^[1-9]{1, 1}?([0-9])*$/.test(value);
        }],
        money2: [{
            title: _LANG.validate.money2,
            maxlength: 9
        }, function(value) {
            return /^-?\d{1,6}(\.\d{0,2})?$/.test(value);
        }],
        //备注类
        remark: [{
            title: _LANG.validate.remark,
            maxlength: 100
        }, function(value) {
            return value.length <= 100;
        }],
        //地址类
        address: [{
            title: _LANG.validate.address,
            maxlength: 50
        }, function(value) {
            return value.length <= 50;
        }],
        //名称类
        name: [{
            title: _LANG.validate.name,
            maxlength: 25
        }, function(value) {
            return value.length <= 25;
        }],
        //--订单号
        order: [{ //单号类
            title: _LANG.validate.order,
            maxlength: 30
        }, function(value) {
            return /^[0-9]{1,30}$/.test(value);
        }],
        date: [{
            title: _LANG.validate.date,
            maxlength: 10
        }, function(value) {
            return /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(value);
        }],
        datetime: [{
            title: _LANG.validate.dateTime,
            maxlength: 16
        }, function(value) {
            return /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])\s([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(value);
        }],
        //手机号
        cellphone: [{
            title: _LANG.validate.cellPhone,
            maxlength: 11
        }, function(value) {
            var phone = _LANG.validate.cellPhoneRegExp;
            return phone.test(value);
        }],
        //严格手机号
        cellphoneStrict: [{
            title: _LANG.validate.cellPhoneStrict,
            maxlength: 11
        }, function(value) {
            return /^[0-9]{11}?$/.test(value);
        }],
        //证件号
        ID: [{
            title: _LANG.validate.id,
            maxlength: 18,
            minlength: 15
        }, function(value) {
            // console.log(value, value.length, /^[0-9a-zA-Z]{1,18}?$/.test(value));
            // 身份证号码18位：第一位不为0，2-17位是数字，最后一位可数字、可X；15位：第一位不为0，15位全是数字；只能18位或15位
            var reg = _LANG.validate.idRegExp;
            if (value.length === 15 || value.length === 18) {
                return reg.test(value);
            } else {
                return false;
            }
        }],
        //联系电话
        phone: [{
            title: _LANG.validate.phone,
            maxlength: 16
        }, function(value) {
            return /^[0-9-—\(\)（）]{1,16}?$/.test(value);
        }],

        //设备编号
        deviceNo: [{ //单号类
            title: _LANG.validate.deviceNo,
            maxlength: 20
        }, function(value) {
            return /^[0-9]{1,20}$/.test(value);
        }],
        //qq号
        qq: [{
            title: _LANG.validate.qq,
            maxlength: 15
        }, function(value) {
            return /^[0-9]{1,15}?$/.test(value);
        }],
        //民族
        nation: [{
            title: _LANG.validate.nation,
            maxlength: 5
        }, function(value) {
            return /^[\u2E80-\u9FFF]{1,5}?$/.test(value);
        }],
        //车牌号
        license: [{
            title: _LANG.validate.license,
            maxlength: 9
        }, function(value) {
            return /^[0-9a-zA-Z\u2E80-\u9FFF]{1,9}?$/.test(value);
        }],
        //违章罚款
        breakMoney: [{
            title: _LANG.validate.breakMoney,
            maxlength: 6,
        }, function(value) {
            return /^[0-9]{1,6}?$/.test(value);
        }],
        //违章扣分
        breakScore: [{
            title: _LANG.validate.breakScore,
            maxlength: 2
        }, function(value) {
            return /^[0-9]{1,2}?$/.test(value) && parseInt(value) <= 12;
        }],
        //违章编号
        breakOrder: [{
            title: _LANG.validate.breakOrder,
            maxlength: 25
        }, function(value) {
            return /^[0-9a-zA-Z]{1,25}?$/.test(value);
        }],
        //匹配有效网址
        http: [{
            title: _LANG.validate.http
        }, function(value) {
            return /^(http|https):\/\/.{0,293}$/.test(value);
        }],
        //最新的手机号码验证
        newPhone: [{}, function(value) {
            return /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(value);
        }],

    };
    //提供规则的引用接口
    _YWX.checkMap = map;
    //添加到插件验证规则
    $.each(map, function(key, arr) {
        $.validator.addMethod('check_' + key, function(value, element) {
            var stauts = arr[1](value);
            return this.optional(element) || stauts;
        }, $.validator.format(arr[0].title));
    });
    //输入框添加title和length属性
    _YWX.setValidAttr = function() {
        $.each(map, function(key, arr) {
            var $inp = $('.check_' + key);
            $.each(arr[0], function(k, v) {
                if ($inp.not('[' + k + ']')) {
                    $inp.attr(k, v);
                }
            });
        });
    };

    //旧验证代码
    if (typeof $.validator !== 'undefined') {
        $.validator.addMethod('money', function(value, element) {
            return this.optional(element) || /^\d+(.\d{0,2})?$/.test(value);
        }, $.validator.format(_LANG.validateOld.money));

        $.validator.addMethod('intMoney', function(value, element) {
            return this.optional(element) || /^\d+?$/.test(value);
        }, $.validator.format(_LANG.validateOld.intMoney));

        $.validator.addMethod('money2', function(value, element) {
            return this.optional(element) || /^\-?\d+(.\d{0,2})?$/.test(value);
        }, $.validator.format(_LANG.validateOld.money2));

        $.validator.addMethod('datetime', function(value, element) {
            var reg = /^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])\s([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
            return this.optional(element) || reg.test(value);
        }, $.validator.format(_LANG.validateOld.dateTime));

        $.validator.addMethod('nickname', function(value, element) {
            var reg = /^[\u2E80-\u9FFF\w]{1,16}$/;
            return this.optional(element) || reg.test(value);
        }, jQuery.validator.format(_LANG.validateOld.nickname));

        $.validator.addMethod('cellphone', function(value, element) {
            var reg = /^1[0-9]{10}$/;
            return this.optional(element) || reg.test(value);
        }, jQuery.validator.format(_LANG.validateOld.cellPhone));

        $.validator.addMethod('identity', function(value, element) {
            var reg = /^[0-9a-zA-Z]{16,20}$/;
            return this.optional(element) || reg.test(value);
        }, jQuery.validator.format(_LANG.validateOld.identity));

        $.validator.addMethod('wzMoney', function(value, element) {
            var stauts = /^\d{1,6}(\.\d{0,2})?$/.test(value) && parseFloat(value) < 999999;
            return this.optional(element) || stauts;
        }, jQuery.validator.format(_LANG.validateOld.wzMoney));

        $.validator.addMethod('wzMoney-s', function(value, element) {
            var stauts = /^\d{1,6}$/.test(value);
            return this.optional(element) || stauts;
        }, jQuery.validator.format(_LANG.validateOld.wzMoneyS));

        $.validator.addMethod('wzOrder-s', function(value, element) {
            var stauts = /^\d{1,20}$/.test(value);
            return this.optional(element) || stauts;
        }, jQuery.validator.format(_LANG.validateOld.wzOrderS));

        $.validator.addMethod('wzLicense-s', function(value, element) {
            var stauts = /^[\u2E80-\u9FFF|\w]{1,7}$/.test(value);
            return this.optional(element) || stauts;
        }, jQuery.validator.format(_LANG.validateOld.wzLicenseS));

        $.validator.addMethod('wzUsername-s', function(value, element) {
            var stauts = /^[\u2E80-\u9FFF]|[a-zA-Z]{1,10}$/.test(value);
            return this.optional(element) || stauts;
        }, jQuery.validator.format(_LANG.validateOld.wzUsernameS));

        $.validator.addMethod('wzPhone-s', function(value, element) {
            var stauts = /^\d{1,13}$/.test(value);
            return this.optional(element) || stauts;
        }, jQuery.validator.format(_LANG.validateOld.wzPhoneS));

        $.validator.addMethod('wzCommon', function(value, element) {
            var stauts = /^[\w\u2E80-\u9FFF]+$/.test(value);
            return this.optional(element) || stauts;
        }, jQuery.validator.format(_LANG.validateOld.wzCommon));

        $.validator.addMethod('wordandnum', function(value, element) {
            var reg = /^[0-9a-zA-Z]+$/;
            return this.optional(element) || reg.test(value);
        }, jQuery.validator.format(_LANG.validateOld.wordandnum));

        //合作者身份ID
        $.validator.addMethod('collaborator', function(value, element) {
            var reg = /^2088\d{12}$/;
            return this.optional(element) || reg.test(value);
        }, jQuery.validator.format(_LANG.validateOld.collaborator));

    }

    /**
     * 一些初始化工作
     */

    _YWX.setValidAttr();
    var $doc = $(document);
    $doc.on('reset', 'form', function(e) {
        e.preventDefault();
        var form = $(this);
        form.find(':text,select').val('');
        form.find('select').selectmenu('refresh');
        if (form.valid) {
            form.valid();
        }
        form.find('.hasDatepicker').each(function() {
            var self = $(this);
            var datepicker = self.data('datepickerRange');
            var timepicker = self.data('datetimepickerRange');
            if (datepicker) {
                if (datepicker == 'begin') {
                    self.datepicker('option', 'maxDate', null);
                } else if (datepicker == 'end') {
                    self.datepicker('option', 'minDate', null);
                }
            } else if (timepicker) {
                if (timepicker == 'begin') {
                    self.datetimepicker('option', 'maxDate', null);
                } else if (timepicker == 'end') {
                    self.datetimepicker('option', 'minDate', null);
                }
            }
        });
    });

    $doc.on('click', 'a[href="#"]', function(e) {
        e.preventDefault();
    });

    // 过滤掉input和textarea里的一些字符
    $(document).on('blur', ':text,textarea', function() {
        var str = $(this).val();
        var isreverse = $(this).attr('isreverse');
        if (str != 'undefined' && str != null && isreverse != 'false') {
            $(this).val(str.replace(/</g, '《').replace(/>/g, '》').replace(/"/g, '!'));
        }
    });

    /*
     * 文件下载事件
     * -----------------------
     * 直接使用jquery触发
     * $(document).triggerHandler('downloadEvent', url)
     */
    $(document).on('downloadEvent', function(event, url) {
        var opt = {
            url: '',
            time: 3000
        }

        if ($.type(url) === 'string') {
            $.extend(opt, {url: url});
        } else {
            $.extend(opt, url);
        }

        var $frame = $('iframe#iframeRequest');
        if ($frame.length === 0) {
            $frame = $('<iframe>').attr({ 'id': 'iframeRequest', 'width': 0, 'height': 0 });
            $frame.appendTo('body');
        }
        $frame.attr('src', opt.url);
        win.tools.showAlert('开始请求下载请稍等...', {isOverlay: true, closeTime: opt.time - 0});
    });



    /*
     * 点击按钮下载绑定（通过触发 downloadEvent 事件）
     * 注意：只适合打开页面就已经确定好下载地址的点击下载功能
     */
    $(document).on('click', '.download-file', function(e) {
        e.preventdefault();
        $(document).triggerHandler('downloadEvent', $(this).data('url'));
    });

    // 把_YWX挂载到window对象上
    win.ywx = _YWX;

})(jQuery);