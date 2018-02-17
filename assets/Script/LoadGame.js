// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        loadBar:cc.ProgressBar,
        precent:cc.Label,
		rate:0,
		source_leng:58,
    },

    // LIFE-CYCLE CALLBACKS:
    //加载用户信息
    loadUserInfo() {
        var self = this;
        console.log("start loadUserInfo......");
        var userId   = 0;//Storage.getUserId();
        var password = 0;//Storage.getPassword();

        var imei     = Storage.getImei();
        //only for test
        if (imei == 0) {
            imei = "imei7";
        }
        console.log("userId:"+ userId + " password:" + password + " imei:" + imei);
        if (!!userId && !!password) {
            console.log("get getLogin function......");
            Servers.getLogin(userId, password, function (data) {
                console.log("get login info succ:" + JSON.stringify(data));

                var token = data.token;
                Servers.getEntry(token,function(data){
                    self.saveUserInfo(data);
                });
            });
        } else if (!!imei) {
            console.log("get getRegister function......");
            Servers.getRegister(imei, function (data) {
                console.log("get getRegister info succ" + JSON.stringify(data));
                var token = data.token;
                Servers.getEntry(token,function(data){
                    self.saveUserInfo(data);
                });
            });
        } else {
            console.log("load user infolmation failed !!");
        }
    },
    //保存用户信息
    saveUserInfo(data){
		g_user = data.initdata.player;
		Storage.setUserId(g_user.userId);
        Storage.setPassword(g_user.password);
        console.log("start saveUserInfo......"+ JSON.stringify(g_user));
        this.intoHall();
    },
    //跳转页面
    intoHall(){
        console.log("start got into mainscene......");
        cc.director.loadScene("MainScene");
    },
    onLoad () {
		this.source_leng = 92;
		this.load_res();
        this.schedule(this.load_update,0.5);
    },
	load_update(){
		this.loadBar.progress = this.rate/this.source_leng * 100;
		this.precent.string = this.loadBar.progress + "%";
		cc.log("this.rate:" + this.rate);
		if(this.rate >= this.source_leng){
			this.unschedule(this.load_update);
			this.loadUserInfo();
		}
	},
	load_res(){
		var self = this;
		cc.loader.loadResDir("",cc.SpriteFrame,function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res :" + assets[i].name);
			}
		});
		cc.loader.loadResDir("prefab",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res :" + assets[i].name);
			}
		});
	}
});
