<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib prefix="pg" uri="/WEB-INF/tag/pagetag.tld"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<form action="">
    <table>
        <tr>
            <td class="form-label">单位名称:</td>
            <td>
                <input class="form-control" type="text">
            </td>
        </tr>
        <tr>
            <td class="form-label">账户余额:</td>
            <td>
                <input class="form-control" type="text">元
            </td>
        </tr>
        <tr>
            <td class="form-label">联系电话:</td>
            <td>
                <input  class="form-control" type="text">
            </td>
        </tr>
        <tr>
            <td class="form-label">审批权限:</td>
            <td>
                <label class="btn-check">
                    <input type="radio" name="a" value="1">
                    <span>开启审批</span>
                </label>
                <label class="btn-check">
                    <input type="radio" name="a" value="0">
                    <span>关闭审批</span>
                </label>
                <div class="ywx-tooltip">
                    <div class="box">
                        提示内容
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td class="form-label">短信开关:</td>
            <td>
                <label class="btn-check">
                    <input type="radio" name="b" value="1">
                    <span>开启短信</span>
                </label>
                <label class="btn-check">
                    <input type="radio" name="b" value="0">
                    <span>关闭短信</span>
                </label>
                <div class="ywx-tooltip">
                    <div class="box">
                        提示内容
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td class="form-label">申请用车限制:</td>
            <td>
                申请人最多可提前
                <input class="form-control" type="text" style="width:80px;" >
                分钟申请使用车辆
            </td>
        </tr>
        <tr>
            <td class="form-label" valign="top">备注:</td>
            <td>
                <textarea class="form-control" style="width:320px;height:60px;"></textarea>
            </td>
        </tr>
    </table>
    <div style="padding:5px;text-align: center;">
        <button type="submit" class="btn btn-green save">保存</button>
    </div>
</form>