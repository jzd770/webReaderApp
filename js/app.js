(function(){
	var Util = (function(){
		var pre = 'reader_'
		var StorageGetter = function(key){
			return localStorage.getItem(pre+key);
		}
		var StorageSetter = function(key,val){
			return localStorage.setItem(pre+key,val);
		}
		var getJsonp = function(url,callback){
			return $.jsonp({
				url:url,
				cache:true,
				callback:'duokan_fiction_chapter',
				success:function(result){
					var data = $.base64.decode(result);
					var json = decodeURIComponent(escape(data));
					callback(json);
				}
			})
		}
		return {
			getter:StorageGetter,
			setter:StorageSetter,
			getJsonp:getJsonp
		}
	})();
	
	var Dom = {
		top_nav : $('#top-nav'),
		bottom_nav : $('#bottom-nav'),
		night:$('#night-icon'),
		day:$('#day-icon'),
		font:$('#font'),
		font1:$('.bottom_nav'),
		big:$("#lage-font"),
		small:$("#small-font"),
		fontsize:$("#reader-container")
	}
	//初始化字体和背景色
	var fontsize = parseInt(Util.getter('fontsize'));
	Dom.fontsize.css('font-size',fontsize);
	Dom.fontsize.css('background',Util.getter('background'));
	
	var Win = $(window);
	var Doc = $(document);
	
	function main(){
		var readerModel = readermodel();
		var readerUI = readerBase(Dom.fontsize);
		
		readerModel.init(function(data){
			readerUI(data);
		});
		
		EventHanlder();
	}
	function readermodel(){
		//实现和阅读器相关的数据交互方法
		var Chapter_id;
		var init = function(UIcallback){
			getFictionInfo(function(){
				getCurChapter(Chapter_id,function(data){
					UIcallback && UIcallback(data);
				});
			})
		}
		var getFictionInfo = function(callback){
			$.get('data/chapter.json',function(data){
				//获取章节信息之后的回调
				Chapter_id = data.chapters[1].chapter_id;
				callback && callback(data);
			},'json');
		}
		
		var getCurChapter = function(chapter_id,callback){
			$.get('data/data' + chapter_id + '.json',function(data){
				if(data.result == 0){
					var url = data.jsonp;
					Util.getJsonp(url,function(data){
						callback && callback(data);
					});
				}
			},'json');
		}
		return {
			init:init
		}
	}
	
	function readerBase(container){
		//渲染基本的UI结构
		function parseChapter(jsondata){
			var jsonobj = JSON.parse(jsondata);
			var html = '<h4>'+jsonobj.t+'</h4>';
			for(var i=0;i<jsonobj.p.length;i++){
				html += '<p>' + jsonobj.p[i] + '</p>';
			}
			return html;
		}
		return function(data){
			container.html(parseChapter(data));
		}
	}
	
	function EventHanlder(){
		//交互事件绑定
		$('#action_mid').click(function(){
			if(Dom.top_nav.css('display')=='none'){
				Dom.top_nav.show();
				Dom.bottom_nav.show();
			}else{
				Dom.top_nav.hide();
				Dom.bottom_nav.hide();
				Dom.font1.hide();
			}
		});
		
		Win.scroll(function(){
			Dom.top_nav.hide();
			Dom.bottom_nav.hide();
			Dom.font1.hide();
		});
		//白天夜间按钮切换
		Dom.day.click(function(){
			Dom.day.hide();
			Dom.night.show();
			Dom.fontsize.css('background','#f7eee5');
			Util.setter('background','#f7eee5');
				
		});
		Dom.night.click(function(){
			Dom.night.hide();
			Dom.day.show();
			Dom.fontsize.css('background','#283548');
			Util.setter('background','#283548');
		});
		//字体设置
		Dom.font.click(function(){
			if(Dom.font1.css('display')=='none'){
				Dom.font1.show();
			}else{
				Dom.font1.hide();
			}
		});
		Dom.big.click(function(){
			if(fontsize >= 20){
				return;
			}
			fontsize += 1;
			Dom.fontsize.css('font-size',fontsize);
			Util.setter('fontsize',fontsize);
		});
		Dom.small.click(function(){
			if(fontsize <= 12){
				return;
			}
			fontsize -= 1;
			Dom.fontsize.css('font-size',fontsize);
			Util.setter('fontsize',fontsize);
		});
		//背景色调节
		$("#color1").on('click',function(){
			Dom.fontsize.css('background','#f7eee5');
			Util.setter('background','#f7eee5');
		});
		$("#color2").on('click',function(){
			Dom.fontsize.css('background','#e9dfc7');
			Util.setter('background','#e9dfc7');
		});
		$("#color3").on('click',function(){
			Dom.fontsize.css('background','#a4a4a4');
			Util.setter('background','#a4a4a4');
		});
		$("#color4").on('click',function(){
			Dom.fontsize.css('background','#cdefce');
			Util.setter('background','#cdefce');
		});
		$("#color5").on('click',function(){
			Dom.fontsize.css('background','#283548');
			Util.setter('background','#283548');
		});
	}
	
	main();
})();
