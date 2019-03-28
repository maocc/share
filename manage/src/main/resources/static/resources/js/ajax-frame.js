(function($){    
$.fn.loadUrl = function(options){  //各种属性、参数
	 
	var defaults = {//默认值
	            method : "GET"
	        };
	
	var options = $.extend(defaults, options);//定义参数
		$.ajax({url:options.url,
			method:options.method,
			data:options.data
		}).done(options.done()).fail(function(xhr){
			var status = xhr.status;//200
			if(status==401){
				window.location.href=/*[[@{/index.html}]]*/;
			}
		}).always(function(){
			
		});
    };
})(jQuery);






