/**
 * validation 表单验证插件
 * @Author pangbin
 * @rely jQuery, bootstrap,
 */
(function validationPlugin($) {
    'use strict';

    var formState = false;
    var opt = {};


    var validationForm = function(formElement, options) {
        // var opt = $.extend({}, $.fn.validation.defaults, options);
        opt = options;
        var chkList = $(formElement).find('[data-checkType]');
        if (chkList.length <= 0) return true;
        formState = true;

        var err = false;
        // console.log(err);
        // 循环检查表单元素
        for (var i = 0; i < chkList.length; i++) {
            if (validationChk(chkList[i], formElement)) {
                err = true;
            }
        }

        formState = false;
        return err;
    };

    // 检查指定元素，检查项目从项目上的data-checkType属性获取
    var validationChk = function(el, formElement) {
        var type = $(el).attr('type');
        var checkItem = $(el).attr('data-checkType').split(',');
        var msgName = $(el).attr('data-checkName');
        if (checkItem[0] === '') return; // 空的检查列表就退出

        // 按元素类型获取值
        var val = '';
        if ('/checkbox, radio/'.search(type) > 0) {
            val = getCheckedVal($(formElement).find('input[name='+ el.name +']:checked'));
        }else{
            val = $(el).prop('value');
        }

        var errState = false;
        // 循环检查项
        for (var i = 0; i < checkItem.length; i++) {
            // console.log('==>',checkItem[i]);
            var task = $.trim(checkItem[i]).split(':');
            if (task[0] in filter) {
                if (filter[task[0]](val, task[1])) {
                    errState = true;
                    errorHandling(el, msgName, task, type);
                    break;
                }
            }
        }
        return  errState;
    };

    // 错误处理
    var errorHandling = function(el, msgName, chekItem, type) {
        // console.log(el, msgName, type, chekItem);
        var $formGroup = $(el).closest(opt.container);
        var msg = '';
        switch (chekItem[0]) {
            case 'required':
                msg = (!!msgName) && $.validation.lang.pleaseEnter + msgName || $.validation.lang.pleaseEnterContent;
                break;
            case 'maxlength':
                msg = (!!msgName) && msgName + $.validation.lang.text + $.validation.lang.notGreater + chekItem[1] + $.validation.lang.unit;
                break;
            case 'minilength':
                msg = (!!msgName) && msgName + $.validation.lang.text + $.validation.lang.notLess + chekItem[1] + $.validation.lang.unit;
                break;
            case 'number':
                msg = (!!msgName) && msgName + $.validation.lang.requiredNumber || $.validation.lang.enterNumber;
                break;
            case 'maxnumber':
                msg = (!!msgName) && msgName + $.validation.lang.notGreater + chekItem[1] || $.validation.lang.maximumLimit;
                break;
            case 'miniumber':
                msg = (!!msgName) && msgName + $.validation.lang.notLess  + chekItem[1] || $.validation.lang.minimumLimit;
                break;
            case 'mail':
                msg = $.validation.lang.enterEmail;
                break;
            case 'char':
                msg = $.validation.lang.enterChar;
                break;
            case 'chinese':
                msg = $.validation.lang.enterchinese;
                break;
            case 'phonenumber':
                msg = $.validation.lang.phonenumber;
                break;
            case 'specialchar':
                msg = (!!msgName) && msgName + $.validation.lang.specialchar;
                break;
            case 'pwspecialchar':
                msg = (!!msgName) && msgName + $.validation.lang.pwspecialchar;
                break;
            case 'password':
                msg = (!!msgName) && msgName + $.validation.lang.password;
                break;
            case 'repassword':
                msg = $.validation.lang.repassword;
                break;
            default:
                break;
        }

        $formGroup.addClass('has-error');
        if ('/checkbox, radio/'.search(type) > 0) {
            $formGroup.append('<span class="help-block">' + msg + '</span>');
        }else{
            var $pel = $(el).parent();
            if ($pel.hasClass('input-group')) {
                $pel.after('<span class="help-block">' + msg + '</span>');
            }else{
                $(el).after('<span class="help-block">' + msg + '</span>');
            }
        }
    };

    // 过滤器
    var filter = {
        // 必填检查
        required: function(value) {
            return ($.trim(value) === '' || $.trim(value) === 'no');
        },
        // 最大字符检查
        maxlength: function(value, maxNumber) {
            return (value.replace('/[^\x00-\xff]/g','rr').length > parseInt(maxNumber));
        },
        // 最小字符检查
        minilength: function(value, miniNumber) {
            return (value.replace('/[^\x00-\xff]/g','rr').length < parseInt(miniNumber));
        },
        // 数字类型检查
        number: function(value) {
            if (!value) {
                return false;
            }else{
                return (!/^[0-9]\d*$/.test(value));
            }
        },
        // 最大数字
        maxnumber: function(value, maxNumber) {
            if (!value || !maxNumber) return false;
            if (parseInt(value * 100) > parseInt(maxNumber * 100)) {
                return true;
            }
        },
        // 最小数字
        mininumber: function(value, miniNumber) {
            if (!value || !miniNumber) return false;
            if (parseInt(value * 100) < parseInt(miniNumber * 100)) {
                return true;
            }
        },
        // mail 邮箱地址检查
        mail: function(value) {
            return (!/^[a-zA-Z0-9]{1}([\._a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+){1,3}$/.test(value));
        },
        // 英文字符检查
        char: function(value) {
            return (!/^[a-z\_\-A-Z]*$/.test(value));
        },
        // 中文字符检查
        chinese: function(value) {
            return (!/^[\u4e00-\u9fff]$/.test(value));
        },
        // 手机号码检查
        phonenumber: function(value) {
            return (!/^1[0-9]{10}/.test(value));
        },
        specialchar: function(value) {
            return (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/.test(value));
        },
        pwspecialchar: function(value) {
            return (/[`!#()_+<>"{}\/[\]]/.test(value));
        },
        password: function(value) {
            return (!/^(?=.*[0-9])(?=.*[a-zA-Z])([@~:\\-\\*^%&',;=?$\\.\\x22]*).{8,16}$/.test(value));
        },
        repassword: function(value, selestr) {
            return value !== $(selestr).prop('value');
        },
    };

    function getCheckedVal(obj) {
        // console.log(obj);
        var v = [];
        if (obj.length) {
            for (var i = 0; i < obj.length; i++) {
                v.push( $(obj[i]).val() );
            }
        }
        return v.length > 0 && v || '';
    }

    // 删除表单里的错误提示信息html和class
    function removeFormErr(form) {
        if (!form) return;
        $(form).find(opt.container+'.has-error').removeClass('has-error').find('.help-block').remove();
    }

    $.validation = function fnv(options) {
        var opts = $.extend({}, $.validation.defaults, options);
        var ERR = false;
        $(opts.formSelectors).each(function() {
            // 表单提交
            if (opts.upDataType === 'form') {
                $(this).on('submit', function formSubmitActive(e) {
                    if (formState) return;
                    ERR = false;
                    removeFormErr(this);
                    if (validationForm(this, opts)) {
                        ERR = true;
                        e.preventDefault();
                    }
                });
            }

            // ajax提交
            if (opts.upDataType === 'ajax') {
                removeFormErr(this);
                // return validationForm(this, opts);
                if (validationForm(this, opts)) {
                    ERR = true;
                }else{
                    ERR = false;
                }
            }

        });
        return ERR;
    };


    $.validation.defaults = {
        /**
         * 表单选择符
         */
        formSelectors: 'form[data-validation]',
        /**
         * 默认表单错误处理方式,有三种方式 lineMsg, formMsg, noMsg
         * lineMsg：错误直接显示在行内
         * formMsg：显示在表单上方的 .error-message 的容器里
         * noMsg：不显示文字，只标红错误区域
         */
        formErrType: 'lineMsg',
        /**
         * 默认提交数据方式
         * form：表单提交
         * ajax: ajax 提交
         */
        upDataType: 'form',

        /**
         * 添加错误class的父容器
         */
        container: '.form-group',

    };

    $.validation.lang = {
        pleaseEnter: '请输入',
        pleaseEnterContent: '请输入内容',
        text: '字符',
        notGreater:'不能大于',
        notLess: '不能小于',
        unit: '位',
        requiredNumber: '必须是数字',
        enterNumber: '请输入数字',
        maximumLimit:'超出最大限制',
        minimumLimit:'超出最小限制',
        enterEmail: '请输入邮箱地址',
        enterChar: '请输入英文字符',
        enterchinese: '请输入汉字',
        phonenumber: '请输入正确的手机号码',
        specialchar: '不能包含特殊字符',
        pwspecialchar: '不能包含这些特殊字符',
        password: '必须是8至16位的大小写字母和数字组合',
        repassword: '两次密码不一致'
    };

    $.validation();

})(jQuery);
