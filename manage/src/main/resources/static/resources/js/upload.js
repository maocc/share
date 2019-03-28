$(function(){
	$('body').on('change','.upload',function () {
	    //开始上传文件时显示一个图片,文件上传完成将图片隐藏
	    //$("#loading").ajaxStart(function(){$(this).show();}).ajaxComplete(function(){$(this).hide();});
	    //执行上传文件操作的函数
	    var val=$(this).val();
	    if(val==""){
	    	alert("请选择要上传的文件");
	    	return false;
	    }
	    setUpload($(this).attr("id"));
	   
	});
	
});
var pDivId=null;
var processInterval=null;
function process(){
	var now = new Date();
	$.ajax({
		url : "http://localhost:8080/iwowo-web/process.json",
		type : 'GET',
		dataType : 'json',
		 data: now.getTime(),
		success : function(data) {
			$(pDivId).html(data.percent);
		}
	});
}

/**
 * 
 * @param host 主机地址
 * @param url 上传地址
 * @param uploadFileId form中真正的id
 * @param imgDivId 展示图片的显示位置
 * @param progressDivId 显示进度的id
 */
function upload(url,id,uploadFileId,imgDivId,progressDivId){
    var rootpath="";
    var imgPath="/";
    pDivId =progressDivId;
    $(progressDivId).html("上传中。。。");
    $(progressDivId).show();
    //设置加载图标的显示
	//$('#loading').show();
    //processInterval=setInterval(process, 1000);
	$.ajaxFileUpload({
        //处理文件上传操作的服务器端地址(可以传参数,已亲测可用)
        url:rootpath+url, 
        autoUpload: true,//是否自动上传  
        secureuri:false,                       //是否启用安全提交,默认为false
        fileElementId:id,           //文件选择框的id属性
        dataType:'json',                       //服务器返回的格式,可以是json或xml等
        success:function(data, status){
        	if(data['errorMsg']!=null){
        		$(progressDivId).html(data['errorMsg']);
        		
        		$(progressDivId).delay(5000).hide();
        		BootstrapDialog.alert(data['errorMsg']);
        		return ;
        	}
        	
        	
	        //服务器响应成功时的处理函数
	        var filename = data['fileName'];
	        var fileFullName =data['fileFullName'];
	        var size = data['size'];
	        $(uploadFileId).val(filename);
	        if(imgDivId!=null){
		        $(imgDivId).attr("src",fileFullName);
		        $(imgDivId).attr("href",fileFullName);
		        //$(imgDivId).css({height:"200px"});
	        }
	       
	       
	        BootstrapDialog.alert("上传成功");
	        $(progressDivId).delay(5000).hide();
			clearInterval(processInterval);
        },
        progressall: function (e, data) {//设置上传进度事件的回调函数  
        	 console.info(2222);
            var progress = parseInt(data.loaded / data.total * 5, 10); 
            alert(progress);
            console.info("-----"+progress);
            $('#progress .bar').css(  
                'width',  
                progress + '%'  
            );  
          
        }, 
        error:function(data, status, error){ //服务器响应失败时的处理函数
 			 
        	BootstrapDialog.alert("上传失败!");
        }
    });
}