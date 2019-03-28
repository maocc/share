<!DOCTYPE html>
<html>
<head>
    <%@ page language="java" pageEncoding="UTF-8"%>
    <%@ page contentType="text/html; charset=UTF-8"%>
    <%@ include file="/pages/common/common4.jsp"%>

    <script src="${pageContext.request.contextPath}/skin/webuploader/webuploader.js"></script>
</head>
<body>
<div class="panel-search">
    <div class="panel-title">卡片查询</div>
    <div class="panel-body">
        <form action="">
            <div class="form-group">
                <div class="form-label">卡片号码：</div>
                <input type="text" name="" class="form-control">
            </div>
            <div class="form-group">
                <div class="form-label">所属单位：</div>
                <select class="form-control" name="">
                    <option value="">请选择</option>
                </select>
            </div>
            <button type="submit" class="btn btn-green search">查询</button>
        </form>
    </div>
</div>
<div class="panel-blue">
    <div class="panel-title">
        <ul>
            <!--后台判断 那个标签 selected -->
            <li class="selected">未分配卡片</li>
            <li onclick="location.href='';">已注销卡片</li> <!--这里切换链接-->
            <li onclick="location.href='';">已分配卡片</li>
        </ul>
        <div class="btns">
            <button class="btn btn-green daoru">卡片导入</button>
            <button class="btn btn-green piliangfenpei">批量分配</button>
        </div>
    </div>
    <div class="panel-body">
        <table class="table">
            <tr>
                <th><input type="checkbox" class="checkboxAll"></th>
                <th>卡片号码</th>
                <th>操作</th>
            </tr>
            <tr>
                <td><input type="checkbox" class="checkboxItem" value="卡号1"></td>
                <td>号码</td>
                <td>
                    <!--后台判断显示哪些按钮-->
                    <button class="btn btn-green btn-sm fenpei" value="卡号1">分配</button>
                    <button class="btn btn-green btn-sm zhuxiao" value="卡号1">注销</button>
                    <button class="btn btn-green btn-sm qiyong" value="卡号1">启用</button>
                    <button class="btn btn-green btn-sm chongxinfenpei" value="卡号1">重新分配</button>
                </td>
            </tr>
            <tr>
                <td><input type="checkbox" class="checkboxItem" value="卡号2"></td>
                <td>号码</td>
                <td>
                    <!--后台判断显示哪些按钮-->
                    <button class="btn btn-green btn-sm fenpei" value="卡号2">分配</button>
                    <button class="btn btn-green btn-sm zhuxiao" value="卡号2">注销</button>
                    <button class="btn btn-green btn-sm qiyong" value="卡号2">启用</button>
                    <button class="btn btn-green btn-sm chongxinfenpei" value="卡号2">重新分配</button>
                </td>
            </tr>
        </table>
        <!--这个地方放分页-->
    </div>
</div>

<div id="fenpeiD" title="卡片分配" style="display: none">
    <form action="">
        <table>
            <tr>
                <th class="form-label">卡片号码</th>
                <td class="cards"></td>
            </tr>
            <tr>
                <th class="form-label">分配单位</th>
                <td>
                    <select class="form-control">
                        <option>请选择</option>
                    </select>
                </td>
            </tr>
        </table>
        <div style="padding:5px;text-align: center;">
            <button type="button" class="btn btn-green save">确认</button>
        </div>
    </form>
</div>

<div id="piliangfenpeiD" title="批量卡片分配" style="display: none">
    <form action="">
        <table>
            <tr>
                <th class="form-label">卡片号码:</th>
                <td class="cards"></td>
            </tr>
            <tr>
                <th class="form-label">卡片数量:</th>
                <td class="num"></td>
            </tr>
            <tr>
                <th class="form-label">分配单位:</th>
                <td>
                    <select class="form-control">
                        <option>请选择</option>
                    </select>
                </td>
            </tr>
        </table>
    </form>
    <div style="padding:5px;text-align: center;">
        <button type="button" class="btn btn-green save">确认</button>
    </div>
</div>

<div id="daoruD" title="文件上传" style="display: none">
    <form action="">
        <table>
            <tr>
                <td class="form-label">数据倒入:</td>
                <td>
                    <span class="fileTarget"></span>
                    <div id="file" class="btn btn-green upload-btn">
                        <i class="fa fa-cloud-upload"></i>上传
                    </div>
                    <a href="#">下载模板</a>
                </td>
            </tr>
        </table>
        <div style="padding:5px;text-align: center;">
            <button type="button" class="btn btn-green save">确认</button>
        </div>
    </form>

</div>


<script>
    $(function () {
        new ywx.tags.AjaxOverlay;
        /*全选反选*/
        ywx.selectAll('.checkboxAll', '.checkboxItem');
        /*selectmenu组件*/
        $('.select').selectmenu();

        var ywxAlert = new ywx.Alert;
        var ywxConfirm = new ywx.Confirm;

        /*卡片分配&重新分配*/
        var fenpeiD = ywx.createDialog('#fenpeiD', {width: 400});
        $('.fenpei,.chongxinfenpei').click(function () {
            fenpeiD.dialog('open');
            //设置选中卡号
            fenpeiD.find('.cards').html(getIdsHtml(this.value));
            //设置卡片数量
        });


        /*卡片批量分配*/
        var piliangfenpeiD = ywx.createDialog('#piliangfenpeiD', {width: 400});
        $('.piliangfenpei').click(function () {
            var ids = getIds();
            if (ids.length > 0) {
                piliangfenpeiD.dialog('open');
                //设置选中卡号
                piliangfenpeiD.find('.cards').html(getIdsHtml(ids));
                piliangfenpeiD.find('.num').html(ids.length + ' 张');
            }
        });

        /*导入卡片*/
        var daoruD = ywx.createDialog('#daoruD', {width: 500});
        $('.daoru').click(function () {
            daoruD.dialog('open');
            /*按钮遮罩问题修正*/
            setTimeout(function () {
                $(window).resize();
            },0);
        });

        /*注销卡片*/
        $('.zhuxiao').click(function () {
            var id = this.value;
            var html = '<p>卡片号码：' + id + '</p>' +
                    '<p>卡片注销后将不可分配单位<br/>确实要注销此卡片吗？</p>';
            ywxConfirm.open(html, {
                ok: ['确定', function () {
                    ywx.post('注销地址', {id: id});
                }],
                cancel: ['取消']
            });
        });

        /*卡片启用*/
        $('.qiyong').click(function () {
            var id = this.value;
            var html = '<p>卡片号码：' + id + '</p>' +
                    '<p>确定要启用该卡片吗？</p>';

            ywxConfirm.open(html, {
                ok: ['确定', function () {
                    ywx.post('启用地址地址', {id: id});
                }],
                cancel: ['取消']
            });
        });

        /*所有弹窗表单提交*/
        $('.save').click(function () {
            var form = $(this).closest('form');
            ywx.ajaxSubmit(form);
        });


        //获取 选择的卡号列表
        function getIds() {
            var ids = [];
            $('.checkboxItem:checked').each(function () {
                ids.push(this.value);
            });
            if (ids.length == 0) {
                ywxAlert.open('请选择卡片');
            }
            return ids;
        }

        /*卡片号html*/
        function getIdsHtml(ids) {
            if (typeof ids === "string") {
                return '<span>' +
                        ids + '<input type="hidden" name="id" value="' + ids + '"/>'
                '</span>';
            } else {
                return ids.map(function (e) {
                    return '<span>' +
                            e + '<input type="hidden" name="id" value="' + e + '"/>'
                    '</span>';
                }).join(' , ');
            }
        }


        /*文件上传*/
        var upload = ywx.upload('file', {
            pick: '#file',
            server: '上传地址'
        });

        upload.on('uploadSuccess', function (file, response) {
            this.removeFile(file, true);
            if (response.result.success) {
                var str = response.data.fileName +
                        '<input type="hidden" name="file" value="' + response.data.fileName + '"/>';
                $('.fileTarget').html(str);
            } else {
                ywxAlert.open(response.result.errors);
            }
        });


    });
</script>
</body>
</html>