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
    <div class="panel-title">单位查询</div>
    <div class="panel-body">
        <form action="">
            <div class="form-group">
                <div class="form-label">单位名称：</div>
                <input type="text" name="" class="form-control">
            </div>
            <button type="submit" class="btn btn-green search">查询</button>
        </form>
    </div>
</div>
<div class="panel-blue">
    <div class="panel-title">
        <ul>
            <li class="selected">全部单位</li>
        </ul>
        <div class="btns">
            <button class="btn btn-green fenpeikapian"
                    onclick="location.href='demo.jsp';"
            >分配卡片</button>
            <button class="btn btn-green tianjiadanwei">添加单位</button>
        </div>
    </div>
    <div class="panel-body">
        <table class="table">
            <tr>
                <th>单位名称</th>
                <th>联系电话</th>
                <th>账户余额(元)</th>
                <th>已分配卡片</th>
                <th>管理员</th>
                <th>是否开启审批</th>
                <th>是否开启短信</th>
                <th>操作</th>
            </tr>
            <tr>
                <td>财政局</td>
                <td>11111111111</td>
                <td>100</td>
                <td>123123</td>
                <td>1</td>
                <td>
                    已开启审批
                </td>
                <td>
                    开启短信
                </td>
                <td>
                    <button class="btn btn-green btn-sm edit" value="id">编辑</button>
                    <button class="btn btn-green btn-sm del">删除</button>
                    <button class="btn btn-green btn-sm"
                            onclick="location.href='';"
                    >管理员
                    </button>
                    <button class="btn btn-green btn-sm daoru">导入卡片</button>
                </td>
            </tr>
        </table>
        <!--这个地方放分页-->
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
            <button type="button" class="btn btn-green save">保存</button>
        </div>
    </form>
</div>
<script>
    $(function () {
        new ywx.tags.AjaxOverlay;

        var ywxConfirm=new ywx.Confirm();
        var ywxAlert=new ywx.Alert();
        /*添加,编辑单位*/
        var danweiD = ywx.createDialog('<div>', {width: 600});
        $('.tianjiadanwei').click(function () {
            $.get('danweiEdit.jsp', function (res) {
                danweiD.dialog('option','title','添加单位');
                danweiD.html(res).dialog('open');
                danweiD.find('form').validate({
                    submitHandler: function (f) {
                        ywx.ajaxSubmit(f);
                    }
                });
            });
        });
        $('.btn.edit').click(function () {
            $.get('danweiEdit.jsp', {id: this.value}, function (res) {
                danweiD.dialog('option','title','编辑单位');
                danweiD.html(res).dialog('open');
                danweiD.find('form').validate({
                    submitHandler: function (f) {
                        ywx.ajaxSubmit(f);
                    }
                });
            });
        });

        /*删除单位*/
        $('.btn.del').click(function () {
            ywxConfirm.open('删除后，该单位将不可使用租车业务确定要删除该单位吗？',{
                ok:['确定', function () {
                    $.post('',{id:this.value});
                }],
                cancel:['取消']
            });
        });

        /*导入卡片*/
        var daoruD=ywx.createDialog('#daoruD',{width:500});
        $('.daoru').click(function () {
            daoruD.dialog('open');
            /*按钮遮罩问题修正*/
            setTimeout(function () {
                $(window).resize();
            },0);
        });
        daoruD.on('click','.save', function () {
            ywx.ajaxSubmit($(this).closest('form'));
        });

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