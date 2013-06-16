/*
* Coland Ajax Upload 1.3 Beta
* Copyright 2013, Coland Chan
* http://www.colandchan.com
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/MIT
Change Log:
1.0 Beta
1.1 Beta
- JS Code Prettify
- PHP backward compatibility for PHP 5.2.0
1.2 Beta
- Fix browser loading status after submit
1.3 Beta
- Browser backward compatibility for IE6 and IE7
*/
(function($) {
$.fn.colandAjaxUpload=function(callback, dataType){
return this.each(function(){

var id = new Date().getTime().toString()+Math.floor((Math.random()*9999)+1000).toString();
var form = $('<form></form>').attr({'action':$(this).attr('action'), 'method':'post', 'enctype':'multipart/form-data','target':'colanduploadframe'+id}).css({'position':'absolute', 'top':'0px', 'left':'0px', 'width':'0px', 'height':'0px', 'border':'0px', 'display':'none'});

$.each($(this).serializeArray(), function(i, field){
  $('<input />').attr({'type':'hidden', 'name':field.name}).val(field.value).appendTo(form);
});

$(this).find('input[type=file]').each(function(key, oldElement){
	var newElement = $(oldElement).clone().val(null);
	$(oldElement).before(newElement);
	$(oldElement).appendTo(form);
});

$(form).appendTo(document.body);		

var io=$('<iframe name="colanduploadframe'+id+'"></iframe>').attr({'id':'colanduploadframe'+id, 'src':'javascript:false'}).css({'position':'absolute', 'top':'0px', 'left':'0px', 'width':'0px', 'height':'0px', 'border':'0px', 'display':'none'});

$(io).appendTo(document.body);

if (typeof(callback)=='object' && typeof(callback.start)=='function'){
	callback.start();
}

var xml = {};

try{
	$(form).submit();
} catch(e) {			
	if (typeof(callback)=='object' && typeof(callback.error)=='function'){
		callback.error(e);
	}
}

io.load(function(){			
	var io=$('#colanduploadframe'+id+":first");
	try{				
		if(io[0].contentWindow){
		xml.responseText=io[0].contentWindow.document.body?io[0].contentWindow.document.body.innerHTML:null;
		}else if(io.contentDocument){
		xml.responseText=io[0].contentDocument.document.body?io[0].contentDocument.document.body.innerHTML:null;
		}else{
		xml.responseText=null;
		}
	}catch(e){
		if (typeof(callback)=='object' && typeof(callback.error)=='function'){
			callback.error(e);
		}
	}

	if (xml){
		try {
			if (typeof(dataType)!='undefined' && dataType=="json"){
				var data=$.parseJSON(xml.responseText);
			}else{
				var data=$("<div></div>").html(xml.responseText).text();
			}

			if (typeof(callback)=='object' && typeof(callback.success)=='function'){
				callback.success(data);
			}else if (typeof(callback)=='function'){
				callback(data);
			}
		} catch(e) {
			if (typeof(callback)=='object' && typeof(callback.error)=='function'){
				callback.error(e);
			}else{
			}
		}

		try {
			setTimeout("$('#colanduploadframe"+id+":first').remove();", 10);
			$(form).remove();
		}catch(e){
			if (typeof(callback)=='object' && typeof(callback.error)=='function'){
				callback.error(e);
			}
		}	

		xml = null;

		if (typeof(callback)=='object' && typeof(callback.complete)=='function'){
			callback.complete();
		}
	}
});

});
}
})(jQuery);
