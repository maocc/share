//订单管理页面功能
(function () {
	var $overlay=new ywx.tags.AjaxOverlay;
	
    var order = yc.order = {};
    var $searchdialog =order.searchdialog= $('<div>').dialog($.extend({}, yc.dialog, {
        width: 900,
        position:{
        	my: "center top", at: "center top"
        }
    }));
    var curSearchInp;//缓存触发弹窗当前input
    //查询弹窗open
    order.showDialog = function (action, formdata,input) {
        $.post(action, formdata, function (data) {
            $searchdialog
                .html(data)
                .dialog('option', 'title', input.data('title'))
                .dialog('open')
                .find('select').selectmenu();
            curSearchInp=input;
        });
    }
  //选择
    order.searchdialogChoose=function(chooseBtn){
    	var json=chooseBtn.data('json');
        var prename=chooseBtn.data('inp_prename');
        $.each(json,function(key,value){
            $('input[name="'+key+'"]').val(value);
            prename&&$('input[name="'+prename+'.'+key+'"]').val(value);
        });
        if(json.storeUserType!=undefined){
        	if(json.storeUserType==0){//个人
        		$('#usersearch').val(json.userName);
        	}else{//gongsi
        		$('#usersearch').val(json.companyName);
        	}
        	
        }else if(prename=='carDTO'){
            $.post(window.ywxURL+'/addStoreOrder/getCarPrice',{storeCartypeId:json.vehiclesId},function(data){
                if(data.itemDTO){
                    $.each(data.itemDTO,function(key,value){
                        $('input[name="itemDTO.'+key.toUpperCase()+'"]').val(value);
                    });
                }
                if(data.holItemDTO){
                    $.each(data.holItemDTO,function(key,value){
                        $('input[name="holItemDTO.'+key.toUpperCase()+'"]').val(value);
                    });
                }
                if(data.comCartypeDTO){
                    $.each(data.comCartypeDTO,function(key,value){
                        $('input[name="comCartypeDTO.'+key.toUpperCase()+'"]').val(value);
                    });
                }
            });
        }
    }
    
    //弹窗内事件
    $searchdialog.on('click','.choose',function(){
        var chooseBtn=$(this);
        order.searchdialogChoose(chooseBtn);
        $searchdialog.dialog('close');
        curSearchInp&&curSearchInp.valid();
    });
    $searchdialog.on('click', '.yc-pager a', function (e) {
        e.preventDefault();
        var href=$(this).attr('href');
        if(href!=''&&href!='#'){
            $.get($(this).attr('href'),function(data){
                $searchdialog.html(data).find('select').selectmenu();
            });
        }
    });
    $searchdialog.on('submit','form',function(){
        var form=$(this);
        $.post(form.attr('action'),form.serialize(),function(data){
            $searchdialog.html(data).find('select').selectmenu();
        });
        return false;
    });
    $searchdialog.on('click', '.search', function (e) {
        var form=$(this).closest('form');
        $.post(form.attr('action'),form.serialize(),function(data){
            $searchdialog.html(data).find('select').selectmenu();
        });
    });

    //收费详情
    order.getPayList=function(action,formdata,$table){
        	var oldtr=$table.find('tr:gt(0)');
        	oldtr.css({
        		opacity:0
        	});
        	
        $.post(action,formdata,function(data){
        	$table.find('tr:gt(0)').remove();
            var newtr='';
            var all=0;
            data.forEach(function(e){
            	all+=e.total*100
                newtr+='<tr>';
                newtr+='<td>'+e.chargeName +'</td>';
                newtr+='<td class="yc-rmb" >'+e.rentalUnit +'</td>';
                newtr+='<td >'+e.chargeNum +'</td>';
                newtr+='<td >'+e.total +'</td>';
                newtr+='</tr>';
            });
            all=(all/100).toFixed(2);
            newtr+='<tr><td></td><td></td><td></td><td>';
            newtr+='<strong>合计：'+all+'</strong>'
            newtr+='</td></tr>';
            $table.append(newtr);
        });
    }
    
})();