$().ready(function(){
		//给table添加横向缩进条
		$(".table").wrap("<div class='table-responsive'></div>");
		//table新加样式

		$(".table").addClass("table-style");
		$(".box").addClass("no-shadow");
		 
		$('.table-cols').find('td:even').css('background-color', '#F5F5F5');
		$('.table-cols').find('td:odd').each(
				function(index, ele){
					$(this).hover(
						function(){
							$(this).css('background-color', '#f5f5f5');
						},
						function(){
							$(this).css('background-color', '#fff');
						}
				);
		});
			
	 $(document).on('click', 'li> a', function(e) {
	        var _this = this;
	        //Get the clicked link and the next element
	        var $this = $(this);
	        var checkElement = $this.next();
            //Get the parent menu
            var parent = $this.parents('ul').first();
            //Get the parent li
            var parent_li = $this.parent("li");
			
			 parent_li.addClass("active");
				
			//set active menu
              var data = parent_li.attr('data-options');
              
              if(data!=null){
              	  var datas = data.split('_');
	              //alert(data)
	              if(datas[1]=='1'){
	              		storeSession('menuOne', data);
	              }else if(datas[1]=='2'){
	            		storeSession('menuTwo', data);
	              }else if(datas[1]=='3'){
	            		storeSession('menuThree', data);
	              };
              }
	              
            //Open the target menu and add the menu-open class
            checkElement.slideDown('normal', function () {
              //Fix the layout in case the sidebar stretches over the height of the window
              //_this.layout.fix();
            });
	        
	          //if this isn't a link, prevent the page from being redirected
	          if (checkElement.is('.treeview-menu')) {
	        	  var data = $this.parent().attr('data-options');
	        	  if(data!=null){
		              var datas = data.split('_');
		               if(datas[1]=='3'||datas[1]=='2'){
		            		storeSession('menuThree', data);
		              }
	              }
	            e.preventDefault();
	          }
	    	});
});
function storeSession(name, val) {
	  if (typeof (Storage) !== "undefined") {
	    sessionStorage.setItem(name, val);
	  } else {
	    alert('Please use a modern browser to properly view this template!');
	  }
	}
	function getSession(name) {
	  if (typeof (Storage) !== "undefined") {
	    return sessionStorage.getItem(name);
	  } else {
	    alert('Please use a modern browser to properly view this template!');
	  }
	}
	
	function clearSession(){
	 if (typeof (Storage) !== "undefined") {
		 sessionStorage.clear();
		  } else {
		    alert('Please use a modern browser to properly view this template!');
		  }
	}
	
	function excute(localHref,data){
		 
		  var configs = data['menu'];
		     $(configs).each(function(index) {
	             var val = configs[index];
	             if(val.length==0){
	            	 
	            	 $('.sidebar-menu').append('<li><a href="#"><i class="'+val.cssStyle+'"></i>'+val.title+'</a></li>');
	             }else{
	            	 
	            	 if(val['menu'].length==0){
	            		 $('.sidebar-menu').append('<li class="treeview" data-options="treeview_1_'+val.id+'"><a href="'+localHref+val.href+'"><i class="'+val.cssStyle+'"></i> <span>'+val.title+'</span></a>');
	            	 }else{
	            		 
		            	   var head ='<li class="treeview" data-options="treeview_1_'+val.id+'"><a href="#"><i class="'+val.cssStyle+'"></i> <span>'+val.title+'</span><i class="fa fa-angle-left pull-right"></i></a> ';

                         var str='<ul class="treeview-menu" >';
							$(val['menu']).each(function(index2) {
					             var val1 = val['menu'][index2];
					             if(val1['items'].length==0){
					            	 str+='<li data-options="treeview_2_'+val1.id+'"><a href="'+localHref+val1.href+'"><i class="'+val1.cssStyle+'"></i> '+val1.text+'</a></li>';
					             }else{
					            	 str+='<li  data-options="treeview_2_'+val1.id+'"><a href="#"><i class="'+val1.cssStyle+'"></i> '+val1.text+'<i class="fa fa-angle-left pull-right"></i></a>';
					            	 str+='<ul class="treeview-menu">';
		 							 $(val1['items']).each(function(index3) {
		 								 var val2 = val1['items'][index3];
		 								 str+='<li data-options="treeview_3_'+val2.id+'"><a href="'+localHref+val2.href+'"><i class="'+val2.cssStyle+'"></i> '+val2.text+'</a></li>';
							         });
		 							str+='</ul></li>';
					             }
					         });
							 str+='</ul>';
							 $('.sidebar-menu').append(head+str);
	            	 }
	             }
	         });
	 
		    	var menu1 = getSession('menuOne');
		    	var menu2 = getSession('menuTwo');
		    	var menu3 = getSession('menuThree');
		    	 
		    	 if(menu1!=null){
		    		$("li[data-options='"+menu1+"']").addClass("active");
		    	 }
		    	 if(menu2!=null){
		    	 	$("li[data-options='"+menu2+"']").addClass("active");
		    	}
	    		 if(menu3!=null){
	    		 	$("li[data-options='"+menu3+"']").addClass("active");
	    		 }
	}
	
	function excuteUserDate(data){
		 $(".userEmail").html(data.email);
	}
	function loadData(localHref){
		var treeData =getSession('treeData');
		if(false){
		  treeData =JSON.parse(treeData);  
		  excute(treeData);
		}else{
		  $.get(
				  localHref+'resources/tree.json',
			      function (data){ //回传函数
			    	  storeSession('treeData', JSON.stringify(data));
			    	  excute(localHref,data);
			    	}
			    );  
	  }
	   
     var userData =getSession('userData');
	  if(false){//userData!=null
		  userData =JSON.parse(userData);  
		  excuteUserDate(userData);
	  }else{
		  $.get(localHref+'user/info.json',
		      function (data){ //回传函数
		    	  storeSession('userData', JSON.stringify(data));
		    	  excuteUserDate(data);
		    	}
		 );  
	  }
}