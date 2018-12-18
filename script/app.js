
/**
 * @name app.js
 * @author lilei
 * @date 2018.12.18
 * @desc app公用函数封装
 */

;(function(){

	// 参数conf是额外的配置
	var APP = function(conf){

		// 全局公用的this
		var thiz = this;

		// 是否需要调试打印（默认需要）
		this.openLog = true;

		// 打印调试
		this.log = function(mark,msg){
			if(thiz.openLog){
				var mk = "";
	 			if(mark){mk=mark;}
	 			var date = this.getDate();
	 			if(msg instanceof Array || msg instanceof Object){
	 				msg = JSON.stringify(msg);
	 			}
	 			console.log("["+date+"]  @"+mk+"  "+msg);
			}
 		};

 		// 设置宽高相等
 		this.equalWH = function(selector){
 			if(selector){
 				var W = $(selector).width();
 				$(selector).height(W+"px");
 			}
 		};

 		// 检测某个应用是否已安装
 		this.checkApp = function(pkName){
 			var installed = api.appInstalled({
			    sync: true,
			    appBundle: pkName
			});
			return installed;
 		};

 		// 重启app
 		this.restart = function(){
 			api.rebootApp();
 		};

 		// 打开某个应用
 		this.openApp = function(config,callback){
 			if(config){
 				var conf = {};
	 			if(thiz.ST=="android"){
	 				conf.appParam = config.appParam;
	 				conf.androidPkg = config.androidPkg;
	 			}else{
	 				conf.appParam = config.appParam;
	 				conf.iosUrl = config.iosUrl;
	 			}
	 			api.openApp(conf,function(ret,err){
	 				if(callback){
	 					callback(ret,err);
	 				}
	 			});
 			}else{
 				thiz.toast("打开"+config.name+"失败！");
 			}
 		};

 		// 显示弹窗
 		this.showPopup = function(anchor,action,style){

 			var thiz = this;

            // 获取图标的坐标
            var iW = anchor.width();
            var padding = 12;

            var itemH = 45;

            var marginL = 40;
            if(style&&style.marginL){
            	marginL = style.marginL
			}
            // 构造内容
            var datas = [];
            for(var i=0;i<action.items.length;i++){
                datas.push({
                    title:action.items[i].text
                });
            }

            var pW = 100;
            var pH = itemH*datas.length;

            // popup
            thiz.popup.open({
                rect: {
                    w: pW,
                    h: pH
                },
                position: {
                    x: thiz.W-padding*2,
                    y: thiz.H*9/100
                },
                styles: {
                    mask: 'rgba(0,0,0,0.2)',
                    bg: '#fff',
                    cell: {
                        bg: {
                            normal: '',
                            highlight: ''
                        },
                        h: itemH,
                        title: {
                            marginL: marginL,
                            color: '#636363',
                            size: 12,
                        }
                    }
                },
                datas:datas,
                animation: true
            }, function(ret) {
                if (ret) {
                    if(ret.eventType=="click"){
                        // 发送消息
                        thiz.trigger("action",action.items[ret.index]);
                    }
                }
            });
        };

 		// 打开系统自带浏览器
 		this.openSysNavi = function(url,callback){
 			if(url){
 				if(thiz.ST=="android"){
 					api.openApp({
                        androidPkg: 'android.intent.action.VIEW',
                        mimeType: 'text/html',
                        uri: url
                    }, function(ret, err) {
                    	if(callback){
                    		callback(ret,err);
                    	}
                    });
 				}else{
 					api.openApp({
                        iosUrl: url
                    }, function(ret, err) {
                    	if(callback){
                    		callback(ret,err);
                    	}
                    });
 				}
 			}
 		};

 		// 安装应用
 		this.install = function(path){
 			if(path){
 				api.installApp({
				    appUri: path
				});
 			}
 		};

 		// 关闭组件（静默关闭）
 		this.closeWidget = function(){
 			api.closeWidget({
			    id: thiz.ID,
			    silent:true
			});
 		};

 		// 把app版本转换为整数，便于比较大小
 		this.getVerNum = function(version){
 			var result = "";
 			if(version){
 				var splits = version.split(".");
 				for(var i = 0;i<splits.length;i++){
 					result+=splits[i];
 				}
 				result = parseInt(result);
 			}
 			return result;
 		};

 		// for循环（循环对象或者数组）
 		this.for = function(target,callback){
 			if(target instanceof Array){
 				for(var i = 0;i<target.length;i++){
 					var index2 = i;
 					thiz.log("index2",index2);
 					var ret = {};
 					ret.target = target;
 					ret.item = target[index2];
 					ret.index = index2;
 					callback(ret);
 				}
 				return;
 			}
 			if(target instanceof Object){
 				for(var key in target){
 					var key2 = key;
 					var ret = {};
 					ret.target = target;
 					ret.item = target[key2];
 					ret.key = key2;
 					callback(ret);
 				}
 			}
 		};

 		// 数组删除所有指定值的元素（暂时只支持字符串）
 		this.deleteArrStr = function(arr,value){
 			var result = arr;
 			if(result instanceof Array){
 				for(var i=0;i<result.length;i++){
 					if(result[i]==value){
 						result.splice(i,1);
 					}
 				}
 			}
 			return result;
 		};

 		// 解析json
 		this.parse = function(json){
 			this.log("parse",json);
 			var result = null;
 			if(json && typeof json == "string"){
 				result = JSON.parse(json);
 			}else{
 				result = json;
 			}
 			return result;
 		};

 		// 把json转为字符串
 		this.jsonStr = function(jsonObj){
 			var result;
 			if(jsonObj instanceof Array || jsonObj instanceof Object){
 				result = JSON.stringify(jsonObj);
 			}
 			return result;
 		}

 		// 小数保留小数位数
 		this.toFixed = function(num,dec){
 			var result;
 			if(num!=null&&num!=undefined&&num!="" || num==0){
 				if(typeof num == "string"){
 					result = parseFloat(num).toFixed(dec);
 				}
 				if(typeof num == "number"){
 					result = num.toFixed(dec);
 				}
 			}
 			return result;
 		};

 		// 把字符串转为数字（整数和浮点数）
 		this.toNum = function(num){
 			var result;
 			if(num){
 				if(typeof num == "string"){
 					result = Number(num);
 				}
 				if(typeof num == "number"){
 					result = num;
 				}
 			}
 			return result;
 		}

 		// 截取小数的后四位
 		this.deciFour = function(decimal){
 			var result;
 			if(typeof decimal == "string"){
 				result = parseFloat(decimal).toFixed(8);
 			}
 			if(typeof decimal == "number"){
 				result = parseFloat(decimal).toFixed(8);
 			}
 			result = result+"";
 			var splits = result.split(".");
 			result = splits[0]+"."+splits[1].slice(0,4);
 			return result;
 		};

 		// 解析整数
 		this.toInt = function(num){
 			var result;
 			if(num){
 				if(typeof num == "string"){
 					result = Number(num);
 				}
 				if(typeof num == "number"){
 					result = num;
 				}
 				result = parseInt(result);
 			}
 			return result;
 		}

 		// 倒计时
 		this.countDown = function(second,callback){
 			thiz.log("countDown","调用了countDown");
		    var time = second;
		    var id = null;
		    this.countDown.stopCount = function(){
		        if(id){
		          	window.clearInterval(id);
		          	thiz.log("countDown","已停止倒计时！");
		        }
		    };
		    if(time>0 && !id){
		       	id = setInterval(function(){
		         	time --;
		          	if(callback){callback(time);}
		          	if(time == 0){
		            	window.clearInterval(id);
		          	}
		        },1000);
		    }
	    };

	    // 获取指定日期的当前时区的GMT时间

	    // 转换秒为00：00：00显示格式
	    this.tranSecond = function(second){
	    	var sec = second;
	    	var hour = parseInt(sec / 3600);
	    	if(hour<10){
	    		hour = "0"+hour;
	    	}
	    	var min = parseInt((sec % 3600) / 60);
	    	if(min<10){
	    		min = "0"+min;
	    	}
	    	var secLast = parseInt((sec % 3600) % 60);
	    	if(secLast<10){
	    		secLast = "0"+secLast;
	    	}
	    	return hour+":"+min+":"+secLast;
	    };

	    // 转换秒为 0天 00:00:00 显示格式
	    this.tranSecond2 = function(second){
	    	var sec = second;

	    	// 天
	    	var day = parseInt(sec/(3600*24));

	    	var hour = parseInt(sec / 3600);
	    	if(hour<10){
	    		hour = "0"+hour;
	    	}
	    	var min = parseInt((sec % 3600) / 60);
	    	if(min<10){
	    		min = "0"+min;
	    	}
	    	var secLast = parseInt((sec % 3600) % 60);
	    	if(secLast<10){
	    		secLast = "0"+secLast;
	    	}
	    	return (day>0?(day+"天 "):"")+hour+":"+min+":"+secLast;
	    };

		// 初始化常见操作
		this.initCommon = function(){

			// 解决iOS点击响应慢的问题
			try{
				if(FastClick){
					FastClick.attach(document.body);
				}
			}catch(e){
				thiz.log("err","找不到FastClick变量");
			}


			// 设置状态栏颜色
			api.setStatusBarStyle({
	            style: 'dark',
	            color:'#ffffff'
	        });

			// 初始化点击返回
			if($(".back")){
				$(".back").click(function(){
					var type = $(".back").data("type");
					thiz.log("界面类型type",type);
					if(type == "frame"){api.closeFrame();}
					if(type == "win"){api.closeWin();}
				});
			}

			thiz.closePage();
		};

		// 数据初始化
		this.init = function(){

			// 系统类型
			this.ST = api.systemType;

			// app版本
			this.AV = api.appVersion;

			// 组件ID，所填为示例ID
			this.ID = "A6054055585400";

			// 当前显示窗口名称
			this.winName = api.pageParam.winName?api.pageParam.winName:"";
			// 当前frame名称
			this.frameName = api.pageParam.frameName?api.pageParam.frameName:"";

			// APICloud的文件存储路径
			this.sd = api.fsDir;
			// 项目目录路径
			this.rd = api.wgtRootDir;
			// 页面根路径
			this.hd = api.wgtRootDir+"/html/";

			// 界面常量
			this.W = api.winWidth;// 窗口宽度
			this.H = api.winHeight;// 窗口高度
			this.FW = api.frameWidth;// frame宽度
			this.FH = api.frameHeight;// frame高度

			this.sH = 24;// 状态栏占位高度
			this.hH = 0;// 导航栏高度
			this.btH = 70;// 底部tab高度
			
			// 其他配置
			this.config = {};

			if(conf && conf instanceof Object){
				this.config = $.extend(this.config,conf);
			}
			// 服务器请求地址
			// this.config.url = "http://192.168.1.26/";// 本地
			// this.config.url = "http://119.27.169.84:19001";// 测试
			// this.config.imgUrl = "http://119.27.169.84:19002";
			// this.config.url = "https://appapiv1.renrenmine.com/";// 正式

			this.config.url = "http://api.mxqqlg.com/" //正式

			// 列表ajax请求状态
			this.listAjaxing = false;// 默认未发送请求


	        this.initCommon();
		};

		// 判断文件是否存在
		this.exist = function(file,callback){
			if(this.fs){
				this.fs.exist({path:file},callback);
			}else{
				callback(null,false);
			}
		};
		// 删除文件
		this.remove = function(file,callback){
			if(this.fs){
				this.fs.remove({path:file},callback);
			}else{
				callback(null,false);
			}
		};

		// 校验手机号码
		this.checkPhone = function(phone){
			// 判断输入号码是否有效
		    if(!phone || !phone.trim()){
		    	this.toast("请输入手机号码！");
		        return false;
		    }
		    if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(phone))){
		    	this.toast("请输入正确手机号码！");
		        return false;
		    }
		    return true;
		};

		// 有无提示检测
		this.checkPhone2 = function(phone,istoast){
			// 判断输入号码是否有效
		    if(!phone || !phone.trim()){
		    	if(istoast){this.toast("请输入手机号码！");}
		        return false;
		    }
		    if(!(/^1[3|4|5|7|8][0-9]{9}$/.test(phone))){
		    	if(istoast){this.toast("请输入正确手机号码！");}
		        return false;
		    }
		    return true;
		};

		// 检测身份证号码
		this.checkIdnum = function(idnum){
	    	if(!idnum){
	    		this.toast("请输入身份证号码！");
	    		return false;
	    	}
	    	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	    	if(!reg.test(idnum)){
	    		this.toast("请输入正确身份证号码！");
	    		return false;
	    	}
	    	return true;
	    };

		// 监听输入框输入变化，移动端onchange事件不好用，最好用onkeyup
		this.keyup = function(input,callback){
			if($ && typeof input == "string"){
				$(input).on("keyup",function(e,t){
					callback($(this).val());
				});
				return;
			}
			if($ && input instanceof Array){
				for(var i=0;i<input.length;i++){
					if(input[i].type){
						var curInput = input[i];
						$(input[i].ele).on("keyup",function(e,t){
							callback({type:curInput.type,ele:curInput.ele,val:$(this).val()});
						});
					}else{
						$(input[i]).on("keyup",function(e,t){
							callback($(this).val());
						});
					}

				}
				return;
			}
		};

		// 限制只能输入规定条件的内容（condition可以为number,num-letter）
		this.limit = function(ele,limit,callback){
			var limits = {
				"number":/^[0-9]*$/,
				"letter":/^[a-zA-Z]*$/,
				"num-letter":/^[0-9a-zA-Z]*$/,
				"decimal":/^[-,\+]{0,1}[0-9]*\.{0,1}[0-9]{0,4}$/,
				"decimal6":/^[-,\+]{0,1}[0-9]*\.{0,1}[0-9]{0,6}$/,
			};
			if(limits[limit]){
				thiz.keyup(ele,function(ret){
					thiz.log("输入变化",ret);
					if(limits[limit].test(ret)){
						thiz.log("fuck","fuck");
						callback({value:ret,status:true});
					}else{
						callback({value:ret,status:false});
					}
				});
			}
		};

		// 统一APP入口创建frame
		this.openFrame = function(config){
			if(config instanceof Object){
				api.openFrame(config);
			}
		};

		// 设置frame相关参数
		this.setFrame = function(attr){
			if(attr instanceof Object){
				api.setFrameAttr(attr);
			}
		};

		// 设置frameGroup
		this.setFG = function(attr){
			if(attr instanceof Object){
				api.setFrameGroupAttr(attr);
				api.setFrameGroupIndex(attr);
			}
		}

		// 把frame设置到前台显示
		this.toFront = function(fromm,to){
			var conf = {
				from:fromm
			}
			if(to){
				conf.to = to;
			}
			api.bringFrameToFront(conf);
		};

		// 统一创建frameGroup
		this.openFG = function(config,callback){
			if(config instanceof Object){
				api.openFrameGroup(config,callback);
			}
		};

		// 切换frameGroup的frame
		this.switchF = function(name,index){
			api.setFrameGroupIndex({
			    name: name,
			    index: index
			});
		};

		// 统一APP入口创建win
		this.openWin = function(config){
			if(config instanceof Object){
				// 保存当前窗口名称到本地数据库
				thiz.setStorage("curWin",config.name);
				api.openWin(config);
			}
		};

		// 检测窗口是否已经存在窗口栈中
		this.checkWin = function(name,callback){
			var isWinExist = false;
			this.trigger("check_win",{name:name});
			this.listen("check_win_feedback",function(ret,err){
				thiz.log("check_win_feedback",ret);
				isWinExist = true;
				callback(ret,err);
			});

			// 100毫秒无响应就表示没有该窗口了
			var tout = new thiz.TOUT(100);
			tout.start(function(){
				if(!isWinExist){
					thiz.log("checkWin","没有得到指定窗口响应！"+name);
					callback(null,null);
				}
			});
		};

		// 显示启动轮播广告
		this.showBroads = function(){
			this.openWin({
				name:"broads_win",
				url:this.hd+"common/broadcasting.html",
				slidBackEnabled:false,
				animation:{
					type:"fade"
				}
			});
		};

		// 打开弹窗frame
		this.dialog = function(param){
			this.openFrame({
				name:"dialog",
				url:thiz.hd+"common/dialog.html",
				bgColor:"rgba(0,0,0,0.4)",
				rect:{
					x:0,
					y:0,
					w:thiz.W,
					h:thiz.H
				},
				pageParam:param
			});
		};

		// 打开弹窗win
		this.dialogWin = function(param){
			this.openWin({
				name:"dialog",
				url:thiz.hd+"common/dialog.html",
				// bgColor:"rgba(255,0,0,1)",
				pageParam:param,
				animation:{
					type:"fade"
				}
			});
		};

		// apicloud自带confirm
		this.confirm = function(param,callback){
			api.confirm(param, function(ret, err){
				callback(ret,err);
			});
		};

		// 关闭对话框frame
		this.closeDialog = function(){
			api.closeFrame({
				name:"dialog"
			});
		};

		// 打开图片浏览页面
		this.openImgViewer = function(urls){
			if(typeof urls == 'string' || urls instanceof Array){
				this.openWin({
					name:"image_viewer",
					url:thiz.hd+"common/image_viewer.html",
					pageParam:{
						urls:urls
					}
				})
			}
		};

		// 打开图片浏览组件
		this.showImgBrowser = function(urls,callback){
			if(urls && this.photoBrowser){
				var images = [];
				if(typeof urls == 'string'){
					images.push(urls);
				}
				if(urls instanceof Array){
					images = urls;
				}
				this.photoBrowser.open({
					images: images
				},function(ret,err){
					if(callback){
						callback(ret,err);
					}
				})
			}
		};

		// 获取当前图片的url
		this.getCurImgUrl = function(callback){
			if(this.photoBrowser){
				this.photoBrowser.getIndex(function(ret,err){
					if(ret){
						thiz.photoBrowser.getImage({index:ret.index},function(ret2,err2){
							if(ret2){
								callback(ret2.path);
							}else{
								callback("");
							}
						});
					}else{
						callback("");
					}
				});
			}else{
				callback("");
			}
		};

		// 获取当前窗口名称
		this.getCurWinName = function(){
			var curWin = this.getSyncStorage("curWin");
			this.log("getCurWinName",curWin);
			return curWin;
		};

		// 跳转到客服页面
		this.goService = function(){
			this.openWin({
				name:"service_header_win",
				url:thiz.hd+"common/header_win.html",
				slidBackEnabled:false,
				pageParam:{"subpage":"common/service","name":"service","title":"客服","closeBySub":"true","allowEdit":"true","winName":"service_header_win","frameName":"service"},
				allowEdit:true
			});
		};

		// 关闭当前frame
		this.closeF = function(name){
			if(!name){
				api.closeFrame();
			}else{
				api.closeFrame({
					name:name
				});
			}
		};

		// 关闭当前窗口
		this.closeW = function(name){
			if(!name){
				api.closeWin();
			}else{
				api.closeWin({name:name});
			}
		};

		// 关闭到主窗口
		this.toMainWin = function(){
			api.closeToWin({
			    name: 'root'
			});
		};

		// 关闭到指定窗口
		this.toWin = function(name){
			api.closeToWin({
				name:name
			});
		};

		// 隐藏页面
		this.hideFrame = function(name){
			api.setFrameAttr({
				name:name,
				hidden:true
			});
		};

		// 显示页面
		this.showFrame = function(name){
			api.setFrameAttr({
				name:name,
				hidden:false
			});
		};

		// 创建底部tab栏
		this.createBottomTab = function(){
			// 创建底部tab
	        api.openFrame({
	            name:"tab",
	            url:thiz.hd+"tab.html",
	            rect:{
	            	x:0,
	                y:this.H-thiz.btH,
	                w:thiz.W,
	                h:thiz.btH
	            },
	            bgColor:"#00000000"
	        });
		};

		// 创建主要界面（school、properties、sell、pocket、mine）
		this.createMain = function(name){
			var url;
			if(name=="school"){
				url=thiz.hd+"main/home.html";
			}
			if(name=="information"){
				url=thiz.hd+"main/more.html";
			}
			if(name=="news"){
				url=thiz.hd+"main/cart.html";
			}
			if(name=="mine"){
				url=thiz.hd+"main/mine.html";
			}
			// 创建其他非发布页面
			api.openFrame({
	            name:name,
	            url:url,
	            rect:{
	            	x:0,
	                y:thiz.hH,
	                w:thiz.W,
	                h:thiz.mH+15
	            },
	            bgColor:"#eee"
	        });
		};

		// 打开浏览器
		this.browse = function(url,callback){
			if(url&&thiz.browser){
				var omhh = thiz.getSyncStorage("OMHH");
				thiz.browser.openView({
				    url: url,
				    rect: {
				        x: 0,
				        y: omhh,
				        w: thiz.W,
				        h: thiz.H - omhh
				    }
				}, function(ret,err) {
				    if(callback){
				    	callback(ret,err);
				    }
				});
			}
		};

		// 检查登录
		this.isLogin = function(){
			var accountStr = api.getPrefs({sync:true,key:'account'});
			if(!accountStr){
				return false;
			}

			var account = JSON.parse(accountStr);
			if(account.token){
				return true;
			}else{
				return false;
			}
		};

		// 跳转到登录页
		this.goLogin = function(){
			var thiz = this;
			this.toast("请登录");
			this.tout(200,function(){
				thiz.openWin({
                    name:"login_header_win",
                    url:thiz.hd+"common/header_win.html",
                    pageParam:{
                        title:"登录/注册",
                        subpage:"login/login_regist",
                        "bgColor":"#db1430",
                        color:"white"
                    }
                });
			});
		};

		// 设置偏好设置
		this.setStorage = function(key,value){
			var val = value;
			if(key){
				if(val instanceof Object || val instanceof Array){
					val = JSON.stringify(val);
				}
				api.setPrefs({
					key:key,
					value:val
				});
			}
		};

		// 判断是否是第一次启动app
		this.isFirst = function(){
			var isfirst = true;
			var val = this.getSyncStorage("isfirst");
			this.log("isfirst",val);
			if(val){
				isfirst = false;
			}
			return isfirst;
		};

		// 同步读取偏好设置
		this.getSyncStorage = function(key){
			if(key){
				var value = api.getPrefs({
				    sync: true,
				    key: key
				});
				return value;
			}else{
				return null;
			}
		};

		// 异步读取偏好设置
		this.getAsyncStorage = function(key,callback){
			if(key){
				api.getPrefs({
				    key: key
				}, function(ret, err) {
				    if(callback){
				    	callback(ret.value);
				    }
				});
			}else{
				if(callback){
					callback(null);
				}
			}
		};

		// 删除偏好设置
		this.rmStorage = function(key){
			if(key){
				api.removePrefs({
				    key: key
				});
			}
		};

		// 保存账号
		this.setAccount = function(account){
			this.setStorage("account",account);
		};

		// 获取账号
		this.getAccount = function(){
			var accountStr = this.getSyncStorage("account");
			var account = null;
			try{
				account = JSON.parse(accountStr);
			}catch(e){
				this.log("app","获取账号失败！");
			}
			return account;
		};

		// 删除账号
		this.delAccount = function(){
			this.rmStorage("account");
		};

		// 下拉刷新
		this.downRefresh = function(callback,conf){
			var opts = {
		        visible: true,
		        bgColor: '#F6F6F6',
		        textColor: '#959595',
		        textDown: '下拉刷新...',
		        textUp: '松开刷新...',
		        textLoading:"刷新中...",
		        showTime: false
		    };
		    if(conf instanceof Object){
		    	$.extend(opts,conf);
		    	this.log("downRefresh_opts",opts);
		    }
			// 设置下拉刷新
		    api.setRefreshHeaderInfo(opts, function(ret, err){
		        if(callback){
		            callback();
		        }
		    });
		};

		// toggle class
		this.togClass = function(clickEle,claz,targetEle,callback){
			if(clickEle && claz){
				if($){
					$(clickEle).click(function(){
						var ftarget = clickEle;
						if(targetEle){
							ftarget=clickEle+" "+targetEle;
							$(ftarget).removeClass(claz);
							$(this).find(targetEle).addClass(claz);
						}else{
							$(ftarget).removeClass(claz);
							$(this).addClass(claz);
						}

			            if(callback){
			            	callback();
			            }
			        });
				}else{
					thiz.log("togClass","依赖jquery");
				}
			}
		};

		// 结束下拉
		this.stopRefresh = function(){
			api.refreshHeaderLoadDone();
		};

		// 没有数据显示
	    this.noData = function(container,msg){
	      	var template = "<div style='width:100%;height:100%;' class='nodata center'>"+
	                        "<label style='font-size:16px;color:#999999'>"+msg+"</label>"+
	                    "</div>";
	      	container.find(".nodata").remove();
	      	$(template).appendTo(container);
	    };

		// 转菊花
		this.flower = function(param){
			api.openFrame({
				name:"flower",
				url:api.wgtRootDir+"/html/common/flower.html",
				bgColor:"transparent",
				pageParam:param
			});
		};

		// 关闭菊花
		this.closeFlower = function(time){
			// 延时关闭
			setTimeout(function(){
				api.closeFrame({name:"flower"});
			},time?time:1000);
		};

		// 提示
		this.toast = function(msg){
			api.toast({
				msg:msg,
				location:"middle",
				global:true
			});
		};

		// 提示（延时）
		this.toastDefi = function(msg,time){
			var minTime = 2000;
			if(minTime <= time){minTime = time;}
			api.toast({
				msg:msg,
				location:"middle",
				duration: minTime,
				global:true
			});
		};

		// 获取文件名
		this.getFileName = function(filePath){
			var result = null;
			if(filePath){
				var pathArr = filePath.split("/");
                result = pathArr[pathArr.length - 1];

			}
			return result;
		};

		// 拍照
		this.shootPic = function(callback){
			api.getPicture({
			    sourceType: 'camera',
			    mediaValue: 'pic',
			    encodingType: 'jpg',
			    destinationType: 'url',
			    allowEdit: false,
			    quality: 100,
			    saveToPhotoAlbum: false
			},callback);
		};

		// 相册选择
		this.getPic = function(callback){
			api.getPicture({
			    sourceType: 'library',
			    mediaValue: 'pic',
			    encodingType: 'jpg',
			    destinationType: 'url',
			    allowEdit: false,
			    quality: 100,
			    saveToPhotoAlbum: false
			},callback);
		};

		// 封装actionSheet
		this.sheet = function(config,callback){
			api.actionSheet(config, function(ret, err) {
				callback(ret,err);
			});
		};

		// 打开图片处理界面
		this.openImgHandle = function(param){
			this.openWin({
				name:"image_handle",
				url:this.hd+"common/image_handle.html",
				pageParam:param
			});
		};

		// 初始化裁剪模块
		this.initClipper = function(param,callback){
			if(this.clipper && param && param.srcPath){
				this.clipper.open(param, function(ret,err){
	                if(err){
	                	thiz.log("initClipper","初始化clipper失败");
	                    callback(null,err);
	                    return;
	                }
	                if(ret){
	                    thiz.log("initClipper",ret);
	                    callback(ret,null);
	                }
	            });
			}
		};

		// 图片压缩
		this.compImg = function(param,callback){
			if(this.filter && param && param.img){
				this.filter.compress(param,function(ret,err){
	                if(err){
                    	thiz.log("compImg_err",err);
                    	if(callback){
                    		callback(null,err);
                    	}
                    }
                    if(ret){
                    	thiz.log("compImg",ret);
                    	if(callback){
	                    	callback(ret,null);
	                    }
                    }
	            });
			}
		};

		// 图片裁剪函数
		this.cutImg = function(param,callback){
			if(this.clipper && param.destPath){
				this.clipper.save(param,function(ret,err){
	                if(err){
	                    thiz.log("cutImg_err",err);
	                    if(callback){
	                    	callback(null,err);
	                    }
	                    return;
	                }
	                if(ret){
	                	thiz.log("cutImg",ret);
	                	if(callback){
	                    	callback(ret,null);
	                    }
	                }
	            });
			}
		};

		// 执行动画
		this.animate = function(param,callback){
			if(param){
				api.animation(param,callback);
			}
		};

		// 保存图片到系统相册
		this.savePic = function(url){
			this.log("savePic","called");
			api.saveMediaToAlbum({
			    path:url
			}, function(ret, err) {
			    if (ret && ret.status) {
			        thiz.toast('保存成功！');
			    } else {
			        thiz.toast('保存失败！');
			    }
			});
		};

		// 拨打电话号码
		this.call = function(phone){
			if(phone){
				api.call({
				    type: 'tel_prompt',
				    number: phone
				});
			}else{
				this.toast("电话号码为空！");
			}
		};

		// 触发事件
		this.trigger = function(event,data){
			if(event){
				api.sendEvent({
					name:event,
					extra:data
				});
			}
		};

		// 监听事件
		this.listen = function(event,callback){
			if(event && typeof event == "string"){
				api.addEventListener({
					name:event
				},callback);
			}

			if(event instanceof Array){
				for(var i = 0;i<event.length;i++){
					var e = event[i];
					api.addEventListener({
						name:e
					},callback);
				}
			}
		};

		// 监听页面滚动到底部
		this.toBottom = function(callback){
			api.addEventListener({
			    name: 'scrolltobottom'
			}, function(ret, err) {
				callback(ret,err);
			});
		};

		// Android监听返回事件（目前只有android有效）
		this.back = function(callback){
		    api.addEventListener({
		        name: 'keyback'
		    }, function (ret, err) {
		    	thiz.log("back","监听到android返回键事件");
		        if(callback){
		        	callback(ret,err);
		        }
		    });
		};

		// android和ios监听app退到后台（目前只有android有效）
		this.pause = function(callback){
			api.addEventListener({
			    name:"pause"
			}, function(ret, err){
				thiz.log("pause",ret);
				callback(ret,err);
			});
		};

		// android和ios监听app进入前台（目前只有android有效）
		this.resume = function(callback){
			api.addEventListener({
			    name:"resume"
			}, function(ret, err){
				thiz.log("resume",ret);
				callback(ret,err);
			});
		};

		// 视图消失事件（对单一win）
		this.disappear = function(callback){
			api.addEventListener({
			    name:"viewdisappear"
			}, function(ret, err){
				thiz.log("disappear",thiz.winName);
				callback(ret,err);
			});
		};

		// 视图显示事件（对单一win）
		this.appear = function(callback){
			api.addEventListener({
			    name:"viewappear"
			}, function(ret, err){
				thiz.log("appear",thiz.winName);
				callback(ret,err);
			});
		};

 		// 定时任务
 		this.tout = function(milli,callback){
 			if(milli){
 				setTimeout(callback,milli);
 			}
 		};

 		// 心跳任务
 		this.theart = function(milli,callback){
 			if(milli){
 				var index = setInterval(callback,milli);
 				this.theart.stop = function(){
 					window.clearInterval(index);
 				}
 			}
 		};

		// 获取日期（返回格式：yy-mm-dd hh:mm:ss）
		this.getDate = function(stamp,ismili){
			var date = new Date();
			if(stamp){
				if(ismili){
					date = new Date(stamp);
				}else{
					date = new Date(stamp*1000);
				}
			}
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			if(month < 10){
				month = "0"+month;
			}
			var day = date.getDate();
			if(day < 10){
				day = "0"+day;
			}
			var hour = date.getHours();
			if(hour < 10){
				hour = "0"+hour;
			}
			var minute = date.getMinutes();
			if(minute < 10){
				minute = "0"+minute;
			}
			var second = date.getSeconds();
			if(second < 10){
				second = "0"+second;
			}

			var final = year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
			return final;
		};

		// 获取当前日期的时间戳（单位是s）
		this.getCurStamp = function(){
			var mili = (new Date()).getTime();
			return mili/1000;
		};

		// 转换yyyy-mm-dd hh:mm:ss格式为秒
		this.toSecond = function(date){
			var first = date.split(" ")[0];
			var second = date.split(" ")[1];
			var splits1 = first.split("-");
			var splits2 = second.split(":");
			var result = (new Date(parseInt(splits1[0]),parseInt(splits1[1]) - 1,parseInt(splits1[2]),parseInt(splits2[0]),parseInt(splits2[1]),parseInt(splits2[2]))).getTime();
			return result/1000;
		};

		// 通用关闭窗口或者关闭frame
		this.closePage = function(){
			$(".close").click(function(){
				if($(this).data("type")=="win"){
					api.closeWin();
					return;
				}
				if($(this).data("type")=="frame"){
					api.closeFrame();
				}
			});
		}

		// 统一处理点击跳转页面
		this.handlePage = function(){
			var account = thiz.getAccount();
			this.log("handlePage","调用了handlePage");
			$(".go-page").unbind();
			$(".go-page").click(function(){

				thiz.log("go-page","点击了go-page");

				// 判断是否终止跳转
				if($(this).data("defeat")){
					var msg = thiz.parse($(this).data("defeat")).msg;
					thiz.toast(msg);
					return;
				}

				var p = thiz.parse($(this).data("param"));
				var sp = p.param;
				if(p.name){
					if(sp){
						sp.winName=p.name;
					}
				}else{
					if(sp){
						sp.winName=="";
					}
				}
				if(sp && sp.name){
					sp.frameName=sp.name;
				}
				if(sp && !sp.name){
					sp.frameName="";
				}
				// 是否要判断账号里的字段
				if(p.checkAccount){
					var ispass = true;
					for(var key in p.checkAccount){
						if(p.checkAccount[key] != account[key]){
							ispass=false;
						}
					}
					if(!ispass){
						sp = p.param2;
					}
				}
				var conf = {
					name:p.name,
					url:thiz.hd+p.page+".html",
					pageParam:sp
				};

				// 判断是否允许编辑
				if(p.allowEdit && p.allowEdit == "true"){
					conf.allowEdit = true;
				}

				// 判断是否可以滑动返回（iOS有效）
				if(p.slideBack && p.slideBack == "false"){
					conf.slidBackEnabled = false;
				}

				if(p.needLogin && !thiz.isLogin()){
					thiz.goLogin();
					return;
				}else{
					thiz.openWin(conf);
				}
			});

			$(".close-page").unbind();
			$(".close-page").click(function(){
				api.closeWin();
			});
		};

		// 公用ajax，主要是统一解决用户未登录，跳转登录页（主要用于非文件请求）
		this.ajax = function(conf){

			// 请求状态码
			var needLogin = -100;
			var ok = 1;
			var fail = 0;
			var accountErr = -1;

			// 列表状态文本
			var NODATA = "暂时没有相关数据";
			var NOMORE = "没有更多数据了";
			var LOADMORE = "上拉加载更多"
			var LOADING = "加载中...";
			var NETERR = "加载中...";

			if(conf && conf instanceof Object){

				// 如果是列表加载，并且列表正处于加载状态，退出
				if(conf.extra && conf.extra.container && thiz.listAjaxing){
					return;
				}

				// 如果是普通加载
				if(!conf.extra || !conf.extra.container){
					thiz.listAjaxing = false;
				}

				// 如果是列表加载，并且列表没有处于加载状态，执行加载
				if(conf.extra && conf.extra.container && !thiz.listAjaxing){
					thiz.listAjaxing = true;
					// 判断通过，显示正在加载中...
					$("#listState").text(LOADING);
				}

				// 开始转菊花
				if(conf.extra && conf.extra.isflower){
					if(conf.extra.flowerParam){
						thiz.flower(conf.extra.flowerParam);
					}else{
						thiz.flower();
					}
				}

				thiz.log("--------ajax_param--------",conf.param);
				api.ajax(conf.param, function(ret,err) {

					thiz.log("--------request_ret--------",ret);
					thiz.log("--------request_err--------",err);
					

					thiz.stopRefresh();

					// 不管是普通还是列表加载，加载完成后，都重置listAjaxing为false
					thiz.listAjaxing = false;

				    if(ret){
				    	// thiz.log("ajax_ret",ret);

				    	if(ret.code==200||ret instanceof Array || ret.data==1){
				    		if(conf.param.callback){
					        	conf.param.callback(ret,err);
					        }

					        // 判断是否需要重新登录
					        if(ret.data=="token不存在"){
					        	// 跳转登录
					        	thiz.goLogin();
					        }

				    	}

				    	if(ret.code==404){
				    		if(ret.wenben){
				    			thiz.toast(ret.wenben);
				    		}else{
				    			if(ret.data&&ret.data instanceof Array){

				    				if(thiz.ST!="ios"){
				    					thiz.log("--------conf.extra---------",conf.extra);
				    					if(!conf.extra.isStopNodataToast){
					    					thiz.toast("暂时没有数据");
					    				}
				    				}

				    			}else{
				    				// thiz.toast("服务器异常");
				    			}
				    		}
				    		if(conf.param.callback){
					        	conf.param.callback(ret,err);
					        }
				    	}

				    	// if(ret.code == needLogin){
				    	// 	thiz.log("needLogin",needLogin);
				    	// 	// 如果在下拉刷新，停止
				    	// 	thiz.stopRefresh();

				    	// 	// 跳转到登录界面
				    	// 	thiz.goLogin();

				    	// }else{

				    	// 	// 判断是否是列表请求
				    	// 	if(ret.current_page && ret.total_page){
				    	// 		// 判断是否还有下一页
				    	// 		if(parseInt(""+ret.current_page) == parseInt(""+ret.total_page)){
				    	// 			// 显示没有更多数据了
				    	// 			if(conf.extra && conf.extra.container){
				    	// 				$("#listState").text(NOMORE);
				    	// 			}
				    	// 		}else{
				    	// 			// 显示上拉加载下一页
				    	// 			if(conf.extra && conf.extra.container){
				    	// 				$("#listState").text(LOADMORE);
				    	// 			}
				    	// 		}
				    	// 	}

				    	// 	// 先调回调，比如渲染模板之类的......
				    	// 	if(conf.param.callback){
					    //     	conf.param.callback(ret,err);
					    //     }

					    //     // 为页面跳转添加点击
					    //     thiz.handlePage();
				    	// }
				    }else{

				    	if(conf.extra && conf.extra.container){
				    		$("#listState").text(NETERR);
						}
				        // thiz.toast("网络链接失败");
				        thiz.log("ajax_err"+conf.param.url,err);

				        if(conf.param.failed){
				        	conf.param.failed();
				        }
				    }

				    // 关闭转菊花
				    api.closeFrame({name:"flower"});
				});
			}
		}

		// 文件上传接口（支持多文件）
		this.upload = function(conf){
			// 请求状态码
			var needLogin = -100;
			var ok = 1;
			var fail = 0;
			var accountErr = -1;

			if(conf && conf instanceof Object){
				// 开始转菊花
				if(conf.extra.isflower){
					if(conf.extra.flowerParam){
						if(conf.extra.flowerParam.delay){
							thiz.tout(conf.extra.flowerParam.delay,function(){
								thiz.flower(conf.extra.flowerParam);
							});
						}
					}else{
						thiz.flower();
					}
				}
				api.ajax(conf.param, function(ret,err) {
					// 关闭菊花
					if(conf.extra && conf.extra.isflower){
						if(thiz.flower.close){
							thiz.flower.close();
						}

						if(conf.extra.flowerParam && conf.extra.flowerParam.delay){
							thiz.tout(conf.extra.flowerParam.delay+800,function(){
								thiz.flower.close();
							});
						}
					}

				    if(ret){
				    	thiz.log("upload",ret);
				    	if(ret.desc){
				    		thiz.toast(ret.desc);
				    	}
				    	if(ret.code == needLogin){
				    		// 跳转到登录界面
				    		thiz.goLogin();
				    		return;
				    	}
			    		if(conf.param.callback){
				        	conf.param.callback(ret,err);
				        }
				    }else{
				        // thiz.toast("网络链接失败!");
				        thiz.log("ajax_err",err);
				        api.closeFrame({name:"flower"});
				    }
				});
			}
		};

		// 下载文件
		this.download = function(url,callback){
			if(url){
				var arr = url.split("/");
				var fileName = arr[arr.length - 1];
				api.download({
				    url:url,
				    savePath:'fs://renDown/'+fileName,
				    report:true,
				    cache:true,
				    allowResume:true
				}, function(ret, err) {
				    if (ret.state != 1) {
				    	if(ret.state == 2){
				    		thiz.log("download","下载文件失败："+url);
				    	}else{
				    		thiz.log("download","文件下载中");
				    	}
				    }
				    if(callback){
				    	callback(ret,err);
				    }
				});
			}
		};

		this.download2 = function(url,name,callback){
			if(url){
				var arr = url.split("/");
				var fileName = arr[arr.length - 1];
				var fileFix = fileName.split(".")[1];
				if(name){
					fileName = name;
				}
				api.download({
				    url:url,
				    savePath:'fs://renDown/'+fileName+".jpg",
				    report:true,
				    cache:true,
				    allowResume:true
				}, function(ret, err) {
				    if (ret.state != 1) {
				    	if(ret.state == 2){
				    		thiz.log("download","下载文件失败："+url);
				    	}else{
				    		thiz.log("download","文件下载中");
				    	}
				    }
				    if(callback){
				    	callback(ret,err);
				    }
				});
			}
		};

		// 获取服务器上app的最新版本，用于强制升级（只对android有效）
		this.checkAppVer = function(callback){
			if(this.ST=='android'){
				// this.ajax({
	   //              param:{
	   //                  method:"post",
	   //                  url:thiz.config.url+"member/getinfo",
	   //                  data:{
	   //                      values:{}
	   //                  },
	   //                  callback:function(ret,err){
	   //                      thiz.log("userInfo","getinfo返回："+JSON.stringify(ret));
	   //                      callback(ret,err);
	   //                  }
	   //              },
	   //              extra:{
	   //                  isflower:false
	   //              }
	   //          });
	   			callback();
			}
		};

		// 快捷动态获取用户账户信息（可能不是当前用户信息）
		this.userInfo = function(callback2,otherUid){
			var account = this.getAccount();
			if(account && account.token){
				this.ajax({
	                param:{
	                    method:"post",
	                    url:thiz.config.url+"member/getinfo",
	                    data:{
	                        values:{
	                            uid:account.uid,
	                            token:account.token,
	                            search_uid:otherUid
	                        }
	                    },
	                    callback:function(ret,err){
	                        thiz.log("userInfo","getinfo返回："+JSON.stringify(ret));
	                        callback2(ret,err);
	                    }
	                },
	                extra:{
	                    isflower:false
	                }
	            });
            }
		};

		// 验证码统一获取接口
		this.getCode = function(phone,callback){
			this.ajax({
                param:{
                    method:"post",
                    url:thiz.config.url+"/runningman/send_captcha",
                    data:{
                        body:JSON.stringify({
                            request:{
                                encrypt_type:"0"
                            },
                            body:{
                                phone:phone,
                                type:"0"
                            }
                        })
                    },
                    callback:function(ret,err){
                        thiz.log("getCode","获取验证码："+JSON.stringify(ret));
                        thiz.toast("验证码获取成功！");
                        callback(ret,err);
                    }
                },
                extra:{
                    isflower:true
                }
            });
		};

		// 获取资产通用接口
		this.getProperties = function(callback){
			var account = this.getAccount();
			this.log("getProperties_param",{
                            uid:account.uid,
                            token:account.token
                        });
			this.ajax({
                param:{
                    method:"post",
                    url:thiz.config.url+"wallet/detail",
                    data:{
                        values:{
                            uid:account.uid,
                            token:account.token
                        }
                    },
                    callback:function(ret,err){
                        thiz.log("getProperties","获取资产返回："+JSON.stringify(ret));
                        callback(ret,err);
                    }
                },
                extra:{
                    isflower:true
                }
            });
		};

		// 获取市场币种行情的接口
		this.getCoinMarket = function(callback){
			var account = thiz.getAccount();
			this.ajax({
                param:{
                    method:"post",
                    url:thiz.config.url+"finance/home",
                    data:{
                        values:{
                            uid:account.uid,
                            token:account.token
                        }
                    },
                    callback:function(ret,err){
                        thiz.log("getCoinMarket","返回："+JSON.stringify(ret));
                        callback(ret,err);
                    }
                },
                extra:{
                    isflower:true
                }
            });
		};

		// 获取平台币种行情
		this.getCoinPlatform = function(callback){
			var account = this.getAccount();
			this.ajax({
                param:{
                    method:"post",
                    url:thiz.config.url+"trade/platformCoinQuotes",
                    data:{
                        values:{
                            uid:account.uid,
                            token:account.token
                        }
                    },
                    callback:function(ret,err){
                        thiz.log("getCoinPlatform","返回："+JSON.stringify(ret));
                        callback(ret,err);
                    }
                },
                extra:{
                    isflower:true
                }
            });
		};

		// 获取平台交易行情
		this.getTradePlatform = function(callback){
			var account = this.getAccount();
			this.ajax({
                param:{
                    method:"post",
                    url:thiz.config.url+"trade/platformTradeCurrentInfo",
                    data:{
                        values:{
                            uid:account.uid,
                            token:account.token
                        }
                    },
                    callback:function(ret,err){
                        thiz.log("getTradePlatform","返回："+JSON.stringify(ret));
                        callback(ret,err);
                    }
                },
                extra:{
                    isflower:true
                }
            });
		};

		// 获取区域码
		this.getAreaCode = function(callback){
			this.ajax({
                param:{
                    method:"post",
                    url:thiz.config.url+"site/getAllowCountry",
                    data:{
                        values:{}
                    },
                    callback:function(ret,err){
                        thiz.log("getAreaCode","返回："+JSON.stringify(ret));
                        callback(ret,err);
                    }
                },
                extra:{
                    isflower:false
                }
            });
		};

		// 获取交易限制信息
		this.getTradeLimit = function(callback){
			var account = this.getAccount();
			this.ajax({
                param:{
                    method:"post",
                    url:thiz.config.url+"trade/getTradeBaseInfo",
                    data:{
                        values:{
                            uid:account.uid,
                            token:account.token
                        }
                    },
                    callback:function(ret,err){
                        thiz.log("getTradeLimit","返回："+JSON.stringify(ret));
                        callback(ret,err);
                    }
                },
                extra:{
                    isflower:true
                }
            });
		};

		// 启动app调用
		this.start = function(){
			var account = this.getAccount();
			if(account && account.uid){
				this.ajax({
	                param:{
	                    method:"post",
	                    url:thiz.config.url+"site/appOpen",
	                    data:{
	                        values:{
	                            uid:account.uid,
	                            token:account.token
	                        }
	                    },
	                    callback:function(ret,err){
	                        thiz.log("start","app启动返回："+JSON.stringify(ret));
	                    }
	                },
	                extra:{
	                    isflower:false
	                }
	            });
			}
		};

		// 支付（type=WX/ALI）
		this.pay = function(type,p,callback){
			var opts = {};
			if(type == "WX"){
				thiz.log("支付方式",type);

				if(thiz.wx){

	    			opts={
	                    // secret:"7152afc2cfeb1690c68590f16f15f5b2",
	                    secret:"5def730a1f86f7b1be7f7c80a1caeb34",
	                    // key:p["wxResponse"]["key"],
	                    key:"wxdcfae64fc4c200b1",
	                    orderId:p["wxResponse"]["prepayId"],
	                    partnerId:p["wxResponse"]["partnerId"],
	                    nonceStr:p["wxResponse"]["nonceStr"],
	                    timeStamp:p["wxResponse"]["timestamp"],
	                    package:p["wxResponse"]["packageValue"],
	                    sign:p["wxResponse"]["sign"]
	                };

	                // alert("配置："+JSON.stringify(opts));
	                thiz.wx.payOrder(opts,function(ret, err){
	                	// alert("wwwwwwwwwww1111"+JSON.stringify(ret));
	                	// alert("wwwwwwwwwww111122222"+JSON.stringify(err));
	                    if(ret.status){
	                    	// alert("wwwwwwwwwww2222"+JSON.stringify(ret));
	                        thiz.toast("支付成功！");
	                        // 支付成功，关闭窗口
	                        // thiz.trigger("pay_success");
	                        // thiz.tout(500,function(){
	                        // 	thiz.closeW();
	                        // });
	                    }else{
	                    	// alert("wwwwwwwwwww3333"+JSON.stringify(ret));
	                        thiz.toast("支付失败！");
	                    }

	                    if(callback){
	                    	callback(ret,err);
	                    }

	                });
				}
			}else if(type == "ALI"){
				thiz.log("ali",p);
				if(thiz.ali){
					opts = {
	                    orderInfo:p["aliResponse"]["payParams"]
	                };

					thiz.ali.payOrder(opts,function(ret,err) {
	                    thiz.log("支付宝支付报错",err);
	                    if(ret.code=="9000"){
	                        thiz.toast("支付成功！");
	                    }else {
	                        thiz.toast("支付失败！");
	                    }

	                    if(callback){
	                    	callback(ret,err);
	                    }
	                });
				}
			}
		};

		/*
		 * 下面是即时通信相关API
		 */
		// apicloud监听推送消息
		this.apiPush = function(){
			api.notification({
		        vibrate:[500,500],
		        notify: {
		        	title:'apiPush',
		          	content:'您有了一条新消息',
		          	updateCurrent:true
		        }
		    }, function(ret, err) {
		        // 发送apicloud拿到推送消息广播
		        thiz.log("apiPush",ret);
		        thiz.trigger("api_recieved_push");
		    });
		};

		// 禁止融云推送弹窗
		this.stopNotifi = function(){
			if(this.ry){
				this.ry.disableLocalNotification(function(ret, err){
		        	thiz.log("stopNotifi",ret);
		        });
			}
		};

		// 初始化融云通信模块
		this.initRy = function(callback){
			if(this.ry){
				this.ry.init(function(ret,err){

					// 初始化成功后的操作
					thiz.stopNotifi();

					// 注册apicloud本地推送
					// thiz.apiPush();

					if(ret.status == 'error'){
						thiz.ryState.ryInited = false;
                		thiz.log("initRy","客服初始化出错！");
					}else{
						thiz.ryState.ryInited = true;
					}
					if(callback){
						callback(ret,err);
					}

					thiz.log("initRy_error",err);
				});
			}
		};

		// 获取融云通信token
		this.getRyToken = function(){
			var token = null;
			if(this.ryState.ryInited){
				// 获取token
				if(this.getAccount()){
					token = this.getAccount().im_token;
				}
				if(token){
					thiz.ryState.ryToken = token;
                    thiz.log("getRyToken",token);
				}else{
            		thiz.log("getRyToken","客服初始化出错！");
				}
			}else{
				this.log("getRyToken","融云未初始化");
			}
			return token;
		};

		// 获取融云链接状态（不稳定，有时要报错）
		this.checkRy = function(callback){
			if(this.ryState.ryInited && this.ryState.ryToken){
				this.ry.getConnectionStatus(function(ret, err) {
				    thiz.log("checkRy",ret);
				    callback(ret,err);
				});
			}
		}

		// 连接融云服务器
		this.conneRy = function(callback){
			thiz.log("conneRy_call","进入融云链接conneRy_called");
			if(this.ryState.ryInited && this.ryState.ryToken){
				thiz.log("conneRy_in","进入融云链接");
				// this.checkRy(function(ret){
				// 	if(!ret.result.connectionStatus=="CONNECTED"){
						// thiz.log("conneRy","融云未连接");
						thiz.ry.connect({token:this.ryState.ryToken},function(ret,err){
							if(ret.status == "error"){
								thiz.ryState.ryConnected = false;
								thiz.log("conneRy","客服初始化出错！"+thiz.jsonStr(err));
							}else{
								thiz.ryState.ryConnected = true;
								thiz.ryState.ryId = ret.result.userId;
								thiz.log("conneRy","客服初始化成功，并已连接！");
								thiz.log("conneRy","ryId："+thiz.ryState.ryId);
							}

							if(callback){
								callback(ret,err);
							}

							thiz.log("conneRy_error",err);
						});
					// }else{
					// 	thiz.log("conneRy","融云已经连接");
					// 	thiz.ryConnected = true;
					// }
				// });

			}
		};

		// 设置融云状态变化监听器
		this.setRyListener = function(callback){
			if(thiz.ry){
				thiz.ry.setConnectionStatusListener(function(ret, err) {
				    if(ret.result.connectionStatus=="CONNECTED"){
				    	callback(true);
				    }else{
				    	callback(false);
				    }
				});
			}
		};

		// 重连融云服务器
		this.reconneRy = function(callback1,callback2){
			thiz.log("reconneRy_call","--------------融云重连");
			if(this.ryState.ryInited && this.ryState.ryToken && !this.ryState.ryConnected){
				thiz.discRy(callback1);
				thiz.conneRy(callback2);
				thiz.log("reconneRy_call","--------------已执行重连");
			}
		};

		// 获取链接状态
		this.getConneStatus = function(callback){
			if(thiz.ry){
				thiz.ry.getConnectionStatus(function(ret, err) {
					if(ret.status=="success"){
						callback(true);
					}else{
						callback(false);
					}
				});
			}
		};

		// 退出融云服务器连接（默认仍然接收推送）
		this.discRy = function(callback){
			if(this.ryState.ryConnected){
				this.ry.disconnect({isReceivePush:true},function(ret,err){
					if(ret.status == "error"){
						thiz.log("conneRy","退出客服连接出错！");
					}else{
						thiz.ryState.ryConnected = false;
						thiz.ryState.ryId = null;
						thiz.log("conneRy","退出客服连接成功！");
					}
					thiz.log("discRy",err);
					if(callback){
						callback(ret,err);
					}
				});
			}
		}

		// 检测融云是否已连接
		this.checkRyState = function(){
			this.trigger("check_ry_state");
		}

		// 获取融云连接状态
		this.getRyState = function(){
			this.trigger("check_ry_state_result",this.ryState);
		}

		// 处理表情消息
		this.handleImo = function(msg){
			var result = null;
			if(msg){
				//表情符号转换
			    var reg = /\[.+?\]/g;
			    var face = {
			        '[微笑]' : '<span><img src="../../res/ChatBox/emotion/Expression_one.png"  width="28"/></span>',
			        '[撇嘴]' : '<span><img src="../../res/ChatBox/emotion/Expression_two.png"  width="28" /></span>',
			        '[色]' : '<span><img src="../../res/ChatBox/emotion/Expression_three.png"  width="28" /></span>',
			        '[发呆]' : '<span><img src="../../res/ChatBox/emotion/Expression_four.png"  width="28" /></span>',
			        '[得意]' : '<span><img src="../../res/ChatBox/emotion/Expression_five.png"  width="28" /></span>',
			        '[流泪]' : '<span><img src="../../res/ChatBox/emotion/Expression_six.png"  width="28" /></span>',
			        '[害羞]' : '<span><img src="../../res/ChatBox/emotion/Expression_seven.png"  width="28" /></span>',
			        '[闭嘴]' : '<span><img src="../../res/ChatBox/emotion/Expression_eight.png"  width="28" /></span>',
			        '[睡]' : '<span><img src="../../res/ChatBox/emotion/Expression_nine.png"  width="28" /></span>',
			        '[大哭]' : '<span><img src="../../res/ChatBox/emotion/Expression_ten.png"  width="28"/></span>',
			        '[尴尬]' : '<span><img src="../../res/ChatBox/emotion/Expression_oneone.png"  width="28"/></span>',
			        '[发怒]' : '<span><img src="../../res/ChatBox/emotion/Expression_onetwo.png"  width="28"/></span>',
			        '[调皮]' : '<span><img src="../../res/ChatBox/emotion/Expression_onethree.png"  width="28" /></span>',
			        '[呲牙]' : '<span><img src="../../res/ChatBox/emotion/Expression_onefour.png"  width="28" /></span>',
			        '[惊讶]' : '<span><img src="../../res/ChatBox/emotion/Expression_onefive.png"  width="28" /></span>',
			        '[难过]' : '<span><img src="../../res/ChatBox/emotion/Expression_onesix.png"  width="28" /></span>',
			        '[酷]' : '<span><img src="../../res/ChatBox/emotion/Expression_oneseven.png"  width="28" /></span>',
			        '[冷汗]' : '<span><img src="../../res/ChatBox/emotion/Expression_oneeight.png"  width="28" /></span>',
			        '[抓狂]' : '<span><img src="../../res/ChatBox/emotion/Expression_onenine.png"  width="28" /></span>',
			        '[吐]' : '<span><img src="../../res/ChatBox/emotion/Expression_twozero.png"  width="28" /></span>',
			        '[偷笑]' : '<span><img src="../../res/ChatBox/emotion/Expression_twoone.png"  width="28" /></span>',
			        '[愉快]' : '<span><img src="../../res/ChatBox/emotion/Expression_twotwo.png"  width="28" /></span>',
			        '[白眼]' : '<span><img src="../../res/ChatBox/emotion/Expression_twothree.png"  width="28" /></span>',
			        '[傲慢]' : '<span><img src="../../res/ChatBox/emotion/Expression_twofour.png"  width="28" /></span>',
			        '[饥饿]' : '<span><img src="../../res/ChatBox/emotion/Expression_twofive.png"  width="28" /></span>',
			        '[困]' : '<span><img src="../../res/ChatBox/emotion/Expression_twosix.png"  width="28" /></span>',
			        '[恐惧]' : '<span><img src="../../res/ChatBox/emotion/Expression_twoseven.png"  width="28" /></span>',
			        '[流汗]' : '<span><img src="../../res/ChatBox/emotion/Expression_twoeight.png"  width="28" /></span>',
			        '[憨笑]' : '<span><img src="../../res/ChatBox/emotion/Expression_twonine.png"  width="28" /></span>',
			        '[悠闲]' : '<span><img src="../../res/ChatBox/emotion/Expression_threezero.png"  width="28" /></span>',
			        '[奋斗]' : '<span><img src="../../res/ChatBox/emotion/Expression_threeone.png"  width="28" /></span>',
			        '[咒骂]' : '<span><img src="../../res/ChatBox/emotion/Expression_threetwo.png"  width="28" /></span>',
			        '[疑问]' : '<span><img src="../../res/ChatBox/emotion/Expression_threethree.png"  width="28" /></span>',
			        '[嘘]' : '<span><img src="../../res/ChatBox/emotion/Expression_threefour.png"  width="28" /></span>',
			        '[晕]' : '<span><img src="../../res/ChatBox/emotion/Expression_threefive.png"  width="28" /></span>',
			        '[疯了]' : '<span><img src="../../res/ChatBox/emotion/Expression_threesix.png"  width="28" /></span>',
			        '[衰]' : '<span><img src="../../res/ChatBox/emotion/Expression_threeseven.png"  width="28" /></span>',
			        '[骷髅]' : '<span><img src="../../res/ChatBox/emotion/Expression_threeeight.png"  width="28" /></span>',
			        '[敲打]' : '<span><img src="../../res/ChatBox/emotion/Expression_threenine.png"  width="28"/></span>',
			        '[再见]' : '<span><img src="../../res/ChatBox/emotion/Expression_fourzero.png"  width="28"/></span>',
			        '[擦汗]' : '<span><img src="../../res/ChatBox/emotion/Expression_fourone.png"  width="28"/></span>',
			        '[抠鼻]' : '<span><img src="../../res/ChatBox/emotion/Expression_fourtwo.png"  width="28" /></span>',
			        '[鼓掌]' : '<span><img src="../../res/ChatBox/emotion/Expression_fourthree.png"  width="28" /></span>',
			        '[糗大了]' : '<span><img src="../../res/ChatBox/emotion/Expression_fourfour.png"  width="28" /></span>',
			        '[坏笑]' : '<span><img src="../../res/ChatBox/emotion/Expression_fourfive.png"  width="28" /></span>',
			        '[左哼哼]' : '<span><img src="../../res/ChatBox/emotion/Expression_foursix.png"  width="28" /></span>',
			        '[右哼哼]' : '<span><img src="../../res/ChatBox/emotion/Expression_fourseven.png"  width="28" /></span>',
			        '[哈欠]' : '<span><img src="../../res/ChatBox/emotion/Expression_foureight.png"  width="28" /></span>',
			        '[鄙视]' : '<span><img src="../../res/ChatBox/emotion/Expression_fournine.png"  width="28" /></span>',
			        '[委屈]' : '<span><img src="../../res/ChatBox/emotion/Expression_fivezero.png"  width="28" /></span>',
			        '[快哭了]' : '<span><img src="../../res/ChatBox/emotion/Expression_fiveone.png"  width="28" /></span>',
			        '[阴险]' : '<span><img src="../../res/ChatBox/emotion/Expression_fivetwo.png"  width="28" /></span>',
			        '[亲亲]' : '<span><img src="../../res/ChatBox/emotion/Expression_fivethree.png"  width="28" /></span>',
			        '[吓]' : '<span><img src="../../res/ChatBox/emotion/Expression_fivefour.png"  width="28" /></span>',
			        '[可怜]' : '<span><img src="../../res/ChatBox/emotion/Expression_fivefive.png"  width="28" /></span>',
			        '[菜刀]' : '<span><img src="../../res/ChatBox/emotion/Expression_fivesix.png"  width="28" /></span>',
			        '[西瓜]' : '<span><img src="../../res/ChatBox/emotion/Expression_fiveseven.png"  width="28" /></span>',
			        '[啤酒]' : '<span><img src="../../res/ChatBox/emotion/Expression_fiveeight.png"  width="28" /></span>',
			        '[篮球]' : '<span><img src="../../res/ChatBox/emotion/Expression_fivenine.png"  width="28" /></span>',
			        '[乒乓]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixzero.png"  width="28" /></span>',
			        '[咖啡]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixone.png"  width="28" /></span>',
			        '[饭]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixtwo.png"  width="28" /></span>',
			        '[猪头]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixthree.png"  width="28" /></span>',
			        '[玫瑰]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixfour.png"  width="28" /></span>',
			        '[凋谢]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixfive.png"  width="28" /></span>',
			        '[嘴唇]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixsix.png"  width="28" /></span>',
			        '[爱心]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixseven.png"  width="28" /></span>',
			        '[心碎]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixeight.png"  width="28"/></span>',
			        '[蛋糕]' : '<span><img src="../../res/ChatBox/emotion/Expression_sixnine.png"  width="28"/></span>',
			        '[闪电]' : '<span><img src="../../res/ChatBox/emotion/Expression_sevenzero.png"  width="28"/></span>',
			        '[炸弹]' : '<span><img src="../../res/ChatBox/emotion/Expression_sevenone.png"  width="28" /></span>',
			        '[刀]' : '<span><img src="../../res/ChatBox/emotion/Expression_seventwo.png"  width="28" /></span>',
			        '[足球]' : '<span><img src="../../res/ChatBox/emotion/Expression_seventhree.png"  width="28" /></span>',
			        '[瓢虫]' : '<span><img src="../../res/ChatBox/emotion/Expression_sevenfour.png"  width="28" /></span>',
			        '[便便]' : '<span><img src="../../res/ChatBox/emotion/Expression_sevenfive.png"  width="28" /></span>',
			        '[月亮]' : '<span><img src="../../res/ChatBox/emotion/Expression_sevensix.png"  width="28" /></span>',
			        '[太阳]' : '<span><img src="../../res/ChatBox/emotion/Expression_sevenseven.png"  width="28" /></span>',
			        '[礼物]' : '<span><img src="../../res/ChatBox/emotion/Expression_seveneight.png"  width="28" /></span>',
			        '[拥抱]' : '<span><img src="../../res/ChatBox/emotion/Expression_sevennine.png"  width="28" /></span>',
			        '[强]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightzero.png"  width="28" /></span>',
			        '[弱]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightone.png"  width="28" /></span>',
			        '[握手]' : '<span><img src="../../res/ChatBox/emotion/Expression_eighttwo.png"  width="28" /></span>',
			        '[胜利]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightthree.png"  width="28" /></span>',
			        '[抱拳]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightfour.png"  width="28" /></span>',
			        '[勾引]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightfive.png"  width="28" /></span>',
			        '[拳头]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightsix.png"  width="28" /></span>',
			        '[差劲]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightseven.png"  width="28" /></span>',
			        '[爱你]' : '<span><img src="../../res/ChatBox/emotion/Expression_eighteight.png"  width="28" /></span>',
			        '[NO]' : '<span><img src="../../res/ChatBox/emotion/Expression_eightnine.png"  width="28" /></span>',
			        '[OK]' : '<span><img src="../../res/ChatBox/emotion/Expression_ninezero.png"  width="28" /></span>',
			        '[爱情]' : '<span><img src="../../res/ChatBox/emotion/Expression_nineone.png"  width="28" /></span>',
			        '[飞吻]' : '<span><img src="../../res/ChatBox/emotion/Expression_ninetwo.png"  width="28" /></span>',
			        '[跳跳]' : '<span><img src="../../res/ChatBox/emotion/Expression_ninethree.png"  width="28" /></span>',
			        '[发抖]' : '<span><img src="../../res/ChatBox/emotion/Expression_ninefour.png"  width="28" /></span>',
			        '[怄火]' : '<span><img src="../../res/ChatBox/emotion/Expression_ninefive.png"  width="28" /></span>',
			        '[转圈]' : '<span><img src="../../res/ChatBox/emotion/Expression_ninesix.png"  width="28" /></span>',
			        '[磕头]' : '<span><img src="../../res/ChatBox/emotion/Expression_nineseven.png"  width="28"/></span>',
			        '[回头]' : '<span><img src="../../res/ChatBox/emotion/Expression_nineeight.png"  width="28"/></span>',
			        '[跳绳]' : '<span><img src="../../res/ChatBox/emotion/Expression_ninenine.png"  width="28"/></span>',
			        '[投降]' : '<span><img src="../../res/ChatBox/emotion/Expression_onezerozero.png"  width="28" /></span>',
			        '[激动]' : '<span><img src="../../res/ChatBox/emotion/Expression_onezeroone.png"  width="28" /></span>',
			        '[街舞]' : '<span><img src="../../res/ChatBox/emotion/Expression_onezerotwo.png"  width="28" /></span>',
			        '[献吻]' : '<span><img src="../../res/ChatBox/emotion/Expression_onezerothree.png"  width="28" /></span>',
			        '[左太极]' : '<span><img src="../../res/ChatBox/emotion/Expression_onezerofour.png"  width="28" /></span>',
			        '[右太极]' : '<span><img src="../../res/ChatBox/emotion/Expression_onezerofive.png"  width="28" /></span>',
			        // '[哈哈]' : '<span><img src="../../res/ChatBox/emotion/Expression_onezerosix.png"  width="28" /></span>'
			    };
			    result = msg.replace(reg, function(a, b) {
	                return face[a] ? face[a] : a;
	            });
			}
			this.log("handleImo",result);
			return result;
		}

		// 发送消息
		this.sendMsg = function(msgObj,callback){
			// if(this.ryState.ryConnected){
				if(msgObj && msgObj instanceof Object){
					// 判断消息类型
					if(msgObj.type && msgObj.type == "text"){
						thiz.log("sendMsg","文本类型消息");
						this.ry.sendTextMessage({
						    conversationType:msgObj.convType,
						    targetId:thiz.ryState.serviceId,
						    text:msgObj.msg,
						    extra:thiz.jsonStr(!msgObj.extra?{}:msgObj.extra)
						}, function(ret, err) {
						    if (ret.status == 'prepare'){
						        thiz.log("sendMsg","准备："+thiz.jsonStr(ret));
						    }else if (ret.status == 'success'){
						        thiz.log("sendMsg","成功："+thiz.jsonStr(ret));
						    }else if (ret.status == 'error'){
						        thiz.log("sendMsg","出错："+thiz.jsonStr(err));
						    }
						    if(callback){
						    	callback(ret,err);
						    }
						});
					}

					if(msgObj.type && msgObj.type == "image"){
						thiz.log("sendMsg","图片类型消息");
						this.ry.sendImageMessage({
						    conversationType:msgObj.convType,
						    targetId:thiz.ryState.serviceId,
						    imagePath:msgObj.imagePath,
						    extra:thiz.jsonStr(!msgObj.extra?{}:msgObj.extra)
						}, function(ret, err){
						    if (ret.status == 'prepare'){
						        thiz.log("sendMsg","准备："+thiz.jsonStr(ret));
						    }else if (ret.status == 'success'){
						        thiz.log("sendMsg","成功："+thiz.jsonStr(ret));
						    }else if (ret.status == 'error'){
						        thiz.log("sendMsg","出错："+thiz.jsonStr(err));
						    }
						    if(callback){
						    	callback(ret,err);
						    }
						});
					}
				}
			// }
		};

		// 接收消息
		this.recieveMsg = function(){
			this.log("recieveMsg","called");
			if(this.ryState.ryInited){
				this.log("recieveMsg","ok");
				this.ry.setOnReceiveMessageListener(function(ret,err){
					thiz.log("recieveMsg",ret);

					// if(thiz.getCurWinName() != "service_header_win"){
					// 	// 备份消息
					// 	thiz.ryState.lastMsg = ret;
					// }else{
					// 	thiz.ryState.lastMsg = null;
					// }

					// 把消息广播出去
					var tmsg = {ret:ret,err:err};
					thiz.trigger("recieve_msg",tmsg);

					// 根据消息类型判断保存 交易推送、交易聊天推送、客服推送（交易推送优先级最高）
					if(ret.result.message.conversationType=="SYSTEM" && ret.result.message.content.name=="TRADE"){
						var tradePushNewest = thiz.parse(thiz.getSyncStorage("tradePushNewest"));
        				tradePushNewest.push(ret);
						thiz.setStorage("tradePushNewest",tradePushNewest);
					}
					if(ret.result.message.conversationType=="CUSTOMER_SERVICE"){
						var sevicePushNewest = thiz.parse(thiz.getSyncStorage("sevicePushNewest"));
						sevicePushNewest.push(ret);
						thiz.setStorage("sevicePushNewest",sevicePushNewest);
					}
					if(ret.result.message.conversationType=="CHATROOM"){
						var chatPushNewest = thiz.parse(thiz.getSyncStorage("chatPushNewest"));
						// thiz.setStorage("chatPushNewest",ret);
					}

					// 延时广播有新的推送消息
					var timeout = new thiz.TOUT(100);
					timeout.start(function(){
						thiz.trigger("new_push");
					});
				});
			}
		};

		// 可复用的定时
		this.THEART = function(milli){
			this.index = null;
			this.start = function(callback,callback2){
				var index2 = window.setInterval(callback,milli);
				if(!this.hasInited){
					this.index = index2;
					this.hasInited = true;
					callback2(index2);
				}
			};
			this.stop = function(callback){
				window.clearInterval(this.index);
			};
		};

		// 可复用的延时
		this.TOUT = function(milli){
			this.start = function(callback){
				var index2 = window.setTimeout(callback,milli);
				this.index = index2;
				this.hasCreated = false;
				if(callback && !this.hasCreated){
					callback(index2);
					this.hasCreated = true;
				}
			};
			this.stop = function(callback){
				window.clearTimeout(this.index);
			};
		};

		// 可复用的倒计时
		this.COUNTDOWN = function(sec){
		 	var time = sec;
		 	this.start = function(callback,callback2){
		 		if(time>0){
		 			var index = window.setInterval(function(){
		 				time --;
			          	if(callback){callback(time);}
			          	if(time == 0){
			            	window.clearInterval(index);
			            }
		 			},1000);
		 			this.index = index;
		 			if(!this.created){
		 				this.created = true;
		 				callback2(index);
		 			}
		 		}
		 	};
		};

		// 消息队列处理器
		/**
		 * conf = {
				turnInterval:5000, //消息循环等待时间
		   }
		 */
		this.MSG_HANDLER = function(conf){

			// 公用this
			var THIS = this;

			// 处理器状态（0->stop,1->running）
			this.state;
			// 定时索引记录
			this.thearIds = [];
			// 初始化函数
			this.init = function(callback){
				thiz.log("MSG_HANDLER_init","MSG_HANDLER_init");
				this.state = 0;// 默认停止状态

				// 监听新消息来了
				thiz.listen("new_push",function(){
					thiz.log("new_push","监听到了新的推送");
					// 判断当前是否处于运行状态
					if(THIS.state==0){
						thiz.log("new_push","消息处理器未启动");
						// 延时处理（减少同步操作prefs的概率）
						var timerDelay = new thiz.TOUT(100);
						timerDelay.start(function(){
							THIS.start();
						});
					}else{
						thiz.log("new_push","消息处理器已启动");
					}
				});
			};

			// 获取要处理的消息
			this.getMsg = function(){
				var result = null;
				// 应用刚启动的时候判断是否有新的推送消息
			    var tradePushNewest = thiz.parse(thiz.getSyncStorage("tradePushNewest"));
			    var chatPushNewest = thiz.parse(thiz.getSyncStorage("chatPushNewest"));
			    var sevicePushNewest = thiz.parse(thiz.getSyncStorage("sevicePushNewest"));

			    if(tradePushNewest.length==0){
			    	result = null;
			        // 判断交易聊天
			        // if(chatPushNewest=="none"){
			            if(sevicePushNewest.length==0){
			            	result = null;
			            }else{
			                result = {};
			                result.type = "sevicePushNewest";
			                result.msg = sevicePushNewest.shift();
			                thiz.log("servicePush_result",result);
			                // 回写数据到本地
			                thiz.setStorage("sevicePushNewest",sevicePushNewest);

			            }
			        // }else{
			        // }
			    }else{
			        // 去除斜杠
			        result = {};
			        result.type = "tradePushNewest";
			        result.msg = thiz.parse(tradePushNewest.shift().result.message.content.data.replace(/\\/g,""));
			        thiz.log("tradePush_result",result);
			        thiz.setStorage("tradePushNewest",tradePushNewest);
			    }

			    return result;
			};

			// 消息处理循环
			this.msgTurn = function(result,callback){

				thiz.log("--------timer--------","一次消息循环开始");
				// 关闭上一次循环的弹窗
				thiz.closeW("dialog");

				// if(result && result.msg){
				if(result && result.msg){
					if(result.type=="tradePushNewest"){// 如果是交易推送消息
						// 显示交易推送对话框
				        // var dialogTradeP1 = {
				        //     dtype:"dialog3",
				        //     data:{
				        //         title:"提示",
				        //         text:result.msg.message,
				        //         btns:[
				        //             {
				        //                 name:"取消",
				        //                 event:"cancel_push_dialog",
				        //                 style:"color:#0095E5;"
				        //             },
				        //             {
				        //                 name:"确认",
				        //                 event:"sell/deal",
				        //                 style:"color:#0095E5;"
				        //             }
				        //         ],
				        //         extra:result.msg
				        //     }
				        // };
				        // thiz.dialogWin(dialogTradeP1);
				        var btns = ["取消","确定"];
				        if(thiz.ST=="android"){
				        	btns = ["确定","取消"];
				        }
				        thiz.confirm({
				        	title:"提示",
				        	msg:result.msg.message,
				        	buttons:btns
				        },function(ret,err){
				        	if(ret.buttonIndex==1){// 如果点击了取消
				        		if(thiz.ST=="android"){
				        			thiz.trigger("sell/deal",result.msg);
				        		}else{
				        			thiz.trigger("cancel_push_dialog",result.msg);
				        		}
				        	}
				        	if(ret.buttonIndex==2){// 如果点击了确定
				        		if(thiz.ST=="android"){
				        			thiz.trigger("cancel_push_dialog",result.msg);
				        		}else{
				        			thiz.trigger("sell/deal",result.msg);
				        		}
				        	}
				        });
				        // thiz.dialog(dialogTradeP1);
				        thiz.log("--------timer--------","一次消息循环结束");
						return;
					}
					if(result.type=="sevicePushNewest"){// 如果是客服聊天推送消息
						// 显示交易推送对话框
		                // var dialogTradeP2 = {
		                //     dtype:"dialog2",
		                //     data:{
		                //         title:"提示",
		                //         text:"您有新的客服消息！",
		                //         btns:[
		                //             {
		                //                 name:"取消",
		                //                 event:"cancel_push_dialog",
		                //                 style:"color:#0095E5;"
		                //             },
		                //             {
		                //                 name:"确认",
		                //                 event:"common/service",
		                //                 style:"color:#0095E5;"
		                //             }
		                //         ],
		                //         extra:result
		                //     }
		                // };

		                // thiz.dialogWin(dialogTradeP2);
		                var btns = ["取消","确定"];
				        if(thiz.ST=="android"){
				        	btns = ["确定","取消"];
				        }
		                thiz.confirm({
				        	title:"提示",
				        	msg:"您有新的客服消息！",
				        	buttons:btns
				        },function(ret,err){
				        	if(ret.buttonIndex==1){// 如果点击了取消
				        		if(thiz.ST=="android"){
				        			thiz.trigger("common/service",result.msg);
				        		}else{
				        			thiz.trigger("cancel_push_dialog",result.msg);
				        		}
				        	}
				        	if(ret.buttonIndex==2){// 如果点击了确定
				        		if(thiz.ST=="android"){
				        			thiz.trigger("cancel_push_dialog",result.msg);
				        		}else{
				        			thiz.trigger("common/service",result.msg);
				        		}
				        	}
				        });

		                // thiz.dialog(dialogTradeP2);
		                thiz.log("--------timer--------","一次消息循环结束");
						return;
					}
				}
			};

			// 启动消息处理器
			this.start = function(callback){

				// 定时心跳
				if(this.state==0){

					this.state = 1;

					// 获取消息
					var result = THIS.getMsg();
					// 获取当前窗口名称
					// var curWin = api.getPrefs({sync: true,key:"serviceFlag"});

					// thiz.log("thiz.getCurWinName1111111()",api.getPrefs({sync: true,key:"serviceFlag"}));
					thiz.log("--------isService11111111--------",thiz.isService);
					if(result && !thiz.isService){
						thiz.log("yyyyyyyyyyyy","居然通过了，草");
						// 先处理一条，再定时处理后面的
						THIS.msgTurn(result);
					}else{
						THIS.stop();
					}

					// 新建定时器
					this.timer = new thiz.THEART(conf.turnInterval);

					this.timer.start(function(){
						thiz.log("--------消息处理定时--------","hehe");
						// 获取消息
						var result2 = THIS.getMsg();
						// 获取当前窗口名称
						// var curWin2 = api.getPrefs({sync: true,key:"serviceFlag"});
						// thiz.log("thiz.getCurWinName2222222()",api.getPrefs({sync:true,key:"serviceFlag"}));
						thiz.log("--------isService2222222--------",thiz.isService);
						thiz.log("--------消息处理定时--------","hehe4");
						if(result2 && !thiz.isService){
							thiz.log("--------消息处理定时--------","hehe2");
							THIS.msgTurn(result2);
						}else{
							thiz.log("--------消息处理定时--------","hehe3");
							THIS.stop();
						}
					},function(index2){
						THIS.thearIds.push(index2);
						thiz.log("index2",index2);
					});
				}
			};

			// 停止消息处理器（强制停止）
			this.stop = function(callback){

				this.state = 0;
				// 墙纸好停止所有心跳
				thiz.log("所有定时器ids",this.thearIds);
				for(var i = 0;i<this.thearIds.length;i++){
					window.clearInterval(this.thearIds[i]);
				}
				this.thearIds.splice(0,this.thearIds.length);

				this.timer = null;
			};

			this.init();
		};

		// 获取会话消息列表
		this.getMsgList = function(conf,callback){
			thiz.log("getMsgList","called"+this.ryState.ryConnected);
			if(this.ryState.ryConnected){
				thiz.log("getMsgList","connected");
				this.ry.getHistoryMessages({conversationType:conf.type,targetId:conf.tid,oldestMessageId:conf.last,count:conf.count},function(ret, err) {
					thiz.log("getMsgList",ret);
					if(callback){
						callback(ret,err);
					}
	            });
			}else{
				this.stopRefresh();
			}
		};

		// 获取会话信息
		this.getConverInfo = function(callback){
			thiz.log("getConverInfo","called"+this.ryState.ryConnected);
			if(this.ryState.ryConnected){
				thiz.log("getConverInfo","connected");
				this.ry.getConversation({conversationType:conf.type,targetId:conf.tid},function(ret, err) {
					thiz.log("getConverInfo",ret);
					if(callback){
						callback(ret,err);
					}
	            });
			}
		};

		// 加入聊天室
		this.joinChatroom = function(callback){
			if(this.ryState.ryConnected && this.ryState.serviceId){
				this.ry.joinChatRoom({
				    chatRoomId: this.ryState.serviceId,
				    defMessageCount: this.ryState.msgLoad
				}, function(ret, err) {
				    if (ret.status == 'success'){
				    	thiz.log("joinChatroom","加入聊天室成功！");
				    	thiz.ryState.joinSuccess = true;
				    }else{
				    	thiz.log("joinChatroom","加入聊天室失败！");
				    	thiz.ryState.joinSuccess = false;
				    	thiz.toast("加入聊天室失败！");
				    }
				    callback(ret,err);
				})
			}
		};

		// 打开消息发送工具
		this.openChat = function(callback){
			if(this.chatbox){
				this.chatbox.open({
		            placeholder : '输入新消息',
		            maxRows : 4,
		            autoFocus: true,
		            emotionPath : 'widget://res/ChatBox/emotion',
		            styles : {
		                inputBar : {
		                    borderColor : '#ececec',
		                    bgColor : '#fbfbfb'
		                },
		                inputBox : {
		                    borderColor : '#B3B3B3',
		                    bgColor : '#FFFFFF'
		                },
		                emotionBtn : {
		                    normalImg : 'widget://res/ChatBox/face_one.png'
		                },
		                extrasBtn : {
		                    normalImg : 'widget://res/ChatBox/add_one.png'
		                },
		                keyboardBtn : {
		                    normalImg : 'widget://res/ChatBox/key_one.png'
		                },
		                recordBtn : {
		                    normalBg : '#ffffff',
		                    activeBg : '#F4F4F4',
		                    color : '#5D5D5D',
		                    size : 14
		                },
		                indicator : {
		                    target : 'both',
		                    color : '#c4c4c4',
		                    activeColor : '#9e9e9e'
		                },
		                sendBtn : {
		                    titleColor : '#ffffff',
		                    bg : '#12b7f5',
		                    activeBg : '#1ba1d4',
		                    titleSize : 14
		                }
		            },
		            extras : {
		                titleSize : 13,
		                titleColor : '#a3a3a3',
		                btns : [{
		                    title : '相册图片',
		                    normalImg : 'widget://res/ChatBox/img_one.png',
		                    activeImg : 'widget://res/ChatBox/img_two.png'
		                }, {
		                    title : '相机拍照',
		                    normalImg : 'widget://res/ChatBox/cam_one.png',
		                    activeImg : 'widget://res/ChatBox/cam_two.png'
		                }]
		            }
		        }, function(ret, err) {
		        	thiz.log("openChat",ret);
				    callback(ret,err);
				    if(ret){
				    	var iosMoveCount = 0;
				    	var timeOutId = null;
				    	var moveRet = null;
				    	var moveErr = null;
				    	// 监听输入框所在区域弹动事件
				    	thiz.chatbox.addEventListener({target:"inputBar",name:"move"},function(ret,err){
				    		thiz.log("inputBar_move",ret);
				    		moveRet = ret;
				    		moveErr = err;
				    		// 处理iOS会在短时间内触发很多次的问题
				    		iosMoveCount++;
				    		if(thiz.ST=="ios"){
				    			if(!timeOutId){
				    				timeOutId = setTimeout(function(){
				    					thiz.log("openChat","计时回调！");
				    					if(iosMoveCount>=3){
				    						thiz.log("openChat","计时回调 >=3");
				    						callback(moveRet,moveErr);
				    					}else if(iosMoveCount<=2){
				    						thiz.log("openChat","计时回调 <=2");
				    						callback(moveRet,moveErr);
				    					}else{

				    					}
				    					iosMoveCount = 0;
				    					window.clearTimeout(timeOutId);
				    					timeOutId = null;
				    					moveRet = null;
				    					moveErr = null;
				    				},100);// 100毫秒内侦测
				    			}
				    		}
				    		if(thiz.ST=="android"){
				    			callback(ret,err);
				    			iosMoveCount = 0;
				    		}
				    	});
				    	// 监听输入框所在区域高度改变
				    	thiz.chatbox.addEventListener({target:"inputBar",name:"change"},function(ret,err){
				    		thiz.log("inputBar_change",ret);
				    		callback(ret,err);
				    	});
				    }
				});
			}
		};

		// 关闭消息发送pannel
		this.closePannel = function(){
			if(this.chatbox){
				this.chatbox.closeBoard();// 关闭表情等
				this.chatbox.closeKeyboard();// 关闭键盘
			}
		};

		// 设置小米推送监听
		this.regiXmListener = function(callback){
			if(this.mipush){
				this.mipush.setListener(callback);
			}
		};
		// 注册小米推送
		this.regiXmPush = function(){
			if(this.mipush){
				this.mipush.registerPush({
					appId:this.miState.appId,
					appKey:this.miState.appKey
				},function(ret,err){
					thiz.log("regiXmPush",ret);
					if(ret.status){
						thiz.miState.regId = ret.regId;
					}
					thiz.regiXmListener(function(ret,err){
						thiz.log("regiXmListener",ret);
					});
				});
			}
		};

		// 刷新页面
		this.reload = function(){
			window.location.reload();
		};

		// 跳转到锚点
		this.toMark = function(name){
			if(name!=null&&name!=undefined){
				window.location.hash = name;
			}
		};

		// 获取协议
		this.getProtocol = function(url){
			var result = null;
			if(url){
				var splits = url.split(":");
				result = splits[0];
			}
			return result;
		};

		// 获取url上的参数
		this.getUrlParam = function(url,name){
	        if(url.indexOf(name)>0){
	        	var splits0 = url.split("?");
	        	var splits1 = splits0[1].split("&");
	        	for(var i=0;i<splits1.length;i++){
	        		var splits2 = splits1[i].split("=");
	        		if(splits2[0]==name){
	        			return splits2[1];
	        		}
	        	}
	        }
	        return null;
		};

		// 获取参数
		this.getWebParams = function(name){
			var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) {
		        return unescape(r[2]);
		    }
		    return null;
		};

		// 初始化
		this.init();
	}

	window.APP = APP;

})();
