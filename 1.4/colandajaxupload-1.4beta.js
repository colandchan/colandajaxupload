/*
* Coland Ajax Upload 1.4 Beta
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
1.4 Beta
- Add alias $.fn.colandajaxupload
- Argument dataType case insensitive, and can be set through options
- Rewrite default settings
*/
(function($) {
$.fn.colandAjaxUpload=function(options, dataType){

var settings = $.extend({
	dataType:dataType || "",
	start:function(){
		return;
	},
	error:function(e){
		return;
	},
	complete:function(){
		return;
	},
	success:function(data){
		return;
	}
},($.isPlainObject(options)?options:{}));

if ($.isFunction(options)) {
	settings.success = options;
}

return this.each(function(){

var id = new Date().getTime().toString()+Math.floor((Math.random()*9999)+1000).toString();
var form = $('<form></form>').attr({'action':$(this).attr('action'), 'method':'post', 'enctype':'multipart/form-data','target':'colanduploadframe'+id}).css({'position':'absolute', 'top':'0px', 'left':'0px', 'width':'0px', 'height':'0px', 'border':'0px', 'display':'none'});

$.each($(this).serializeArray(), function(i, field){
	$('<input />').attr({'type':'hidden', 'name':field.name}).val(field.value).appendTo(form);
});

$(this).find('input:file').each(function(key, oldElement){
	var newElement = $(oldElement).clone().val(null);
	$(oldElement).before(newElement);
	$(oldElement).appendTo(form);
});

$(form).appendTo(document.body);		

var io=$('<iframe name="colanduploadframe'+id+'"></iframe>').attr({'id':'colanduploadframe'+id, 'src':'javascript:false'}).css({'position':'absolute', 'top':'0px', 'left':'0px', 'width':'0px', 'height':'0px', 'border':'0px', 'display':'none'});

$(io).appendTo(document.body);

settings.start();

var xml = {};

try{
	$(form).submit();
} catch(e) {			
	settings.error(e);
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
		settings.error(e);
	}

	if (xml){
		try {
			if (settings.dataType.toLowerCase()=="json"){
				var data=$.parseJSON(xml.responseText);
			}else{
				var data=$("<div></div>").html(xml.responseText).text();
			}

			settings.success(data);
		} catch(e) {
			settings.error(e);
		}

		try {
			setTimeout("$('#colanduploadframe"+id+":first').remove();", 10);
			$(form).remove();
		}catch(e){
			settings.error(e);
		}	

		xml = null;

		settings.complete();
	}
});

});
}
$.fn.colandajaxupload=$.fn.colandAjaxUpload;
})(jQuery);