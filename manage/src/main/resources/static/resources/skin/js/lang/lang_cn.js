/**************************
 * 全局js引用语言包
 **************************/

window._lang = {
    /**
     * skin/ywx/base.js
     */

    datepicker: {
        dateFormat: 'yy-mm-dd',
        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六']
    },
    timepicker: {
        timeText: '时间',
        hourText: '小时',
        minuteText: '分钟',
        currentText: '现在时间',
        closeText: '关闭',
        timeFormat: 'HH:mm',
    },
    dialog: {
        alertTitle: '提示信息'
    },
    button: {
        success: '确认',
        cancel: '取消',
        close: '关闭',
        submit: '提交'
    },
    upload: {
        fileTooLarge: '文件过大',
        fileTypeErr: '文件格式不支持！',
        fileUploading: '文件上传中,不可重复添加',
        fileUploadErr: '文件添加失败：'
    },
    validate: {
        money: '0≤x<1000000,最多两位小数',
        intMoney: '0≤x<999999',
        money2: '-1000000<x<1000000',
        remark: '≤100位字符',
        address: '≤50位字符',
        name: '≤25位字符',
        order: '≤30位数字',
        date: '年-月-日',
        dateTime: '年-月-日 时:分',
        cellPhone: '<=11位数字',
        cellPhoneRegExp: /^[0-9]{1,11}?$/,
        cellPhoneStrict: '11位数字',
        id: '请输入正确的身份证号',
        idRegExp: /(^[1-9]\d{14}$)|(^[1-9]\d{16}(\d|X|x)$)/,
        phone: '只可输入数字以及符号()- 例如(010)-88888888',
        deviceNo: '≤20位数字',
        qq: '<=15位数字',
        nation: '<=5位汉字',
        license: '只可输入数字、字母、汉字',
        breakMoney: '0≤x<1000000的整数',
        breakScore: '0-12分',
        breakOrder: '只可输入数字、字母',
        http: 'http://开头≤300个字符',
    },
    validateOld: {
        money: '保留两位小数',
        intMoney: '0<x<=999999',
        money2: '保留两位小数',
        dateTime: '日期到分钟',
        nickname: '姓名',
        cellPhone: '手机号',
        identity: '身份证',
        wzMoney: '金额字段格式验证 ',
        wzMoneyS: '金额字段格式验证 ',
        wzOrderS: '订单号 十五位数字组成',
        wzLicenseS: '车牌号 7位中文+字母+数字组成，如：京QWB058',
        wzUsernameS: '用户名',
        wzPhoneS: '联系电话',
        wzCommon: '数字字母_+中文',
        wordandnum: '数字字母',
        collAborator: '须是2088开头的数字'
    },

    /**
     * skin V2 javascript
     */
    validation: {
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
    }
};
