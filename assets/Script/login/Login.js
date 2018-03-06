cc.Class({
    extends: cc.Component,

    properties: {
		telephone:null,
		phone_ebox:cc.Node,
		password:null,
		pwd_ebox:cc.Node,
		retain_pwd:false,
		auto_login:false,
		retain_pwd_node:cc.Node,
		auto_login_node:cc.Node,
		tip_label:cc.Label,
		login_type:null,
		
    },
	input_phone_begin(){
		cc.log("start input phone number......");
		this.tip_label.string = "";
	},
	input_phone_change(){
		this.telephone = this.phone_ebox.getComponent(cc.EditBox).string;
		cc.log(this.telephone);
	},
	input_phone_end(){
		this.telephone = this.phone_ebox.getComponent(cc.EditBox).string;
		cc.log(this.telephone);
	},
	input_pwd_begin(){
		cc.log("start input password......");
		this.tip_label.string = "";
	},
	input_pwd_change(){
		this.password = this.pwd_ebox.getComponent(cc.EditBox).string;
		cc.log(this.password);
	},
	input_pwd_end(){
		this.password = this.pwd_ebox.getComponent(cc.EditBox).string;
		cc.log(this.password);
	},
	onLogin(){
		var self = this;
		var size = cc.director.getVisibleSize();
		cc.log("onLogin",self.telephone,self.password);
		if(self.telephone == null || self.password == null){
			self.tip_label.string = "用户名密码不能为空";
			return ;
		}
		Servers.getLogin(self.telephone, self.password, function (data) {
			console.log("get login info succ:" + JSON.stringify(data));
			if(data.code != 200){
				self.tip_label.string = data.msg;
				return;
			}
			var token = data.token;
			Servers.getEntry(token,function(data){
				self.saveUserInfo(data);
			});
		});
	},
	saveUserInfo(data){
		g_user = data.initdata.player;
		Storage.setPhoneNumber(g_user.phone_num);
        Storage.setPassword(g_user.password);
		Storage.setLoginType(this.login_type);
		Storage.setAutoLoginFlag(this.auto_login);
		Storage.setPasswordFlag(this.retain_pwd);
        console.log("start saveUserInfo......"+ JSON.stringify(g_user));
		cc.director.loadScene("MainScene");
    },
	onRegister(){
		cc.log("onRegister");
		cc.director.loadScene("RegisterScene");
	},
	wxLogin(){
		cc.log("wxLogin");
		this.login_type = "weixin";
	},
	qqLogin(){
		cc.log("qqLogin");
		this.login_type = "qq";
	},
    onLoad () {
		this.node.on("pressed", this.switchRadio, this);

		
		this.retain_pwd = Storage.getPasswordFlag();
		this.auto_login = Storage.getAutoLoginFlag();
		if(this.retain_pwd == true){
			this.retain_pwd_node.active = true;
		}else{
			this.retain_pwd_node.active = false;			
		}
		if(this.auto_login == true){
			this.auto_login_node.active = true;
		}else{
			this.auto_login_node.active = false;
		}
		
		this.login_type = Storage.getLoginType();
		if(this.login_type == "weixin"){
			
		}else if(this.login_type == "qq"){
			
		}else{
			if(this.auto_login == true && this.retain_pwd == true){
				this.password = Storage.getPassword();
				this.telephone = Storage.getPhoneNumber();
				if(this.password == null || this.telephone == null){
					return false;
				}
				this.phone_ebox.getComponent(cc.EditBox).string = this.telephone;
				this.pwd_ebox.getComponent(cc.EditBox).string = this.password;
				this.onLogin();
			}
		}
	},
	switchRadio(event) {
        var index = event.target.getComponent("one_choice").index;
		var type = event.target.getComponent("one_choice").type;
		cc.log("switchRadio : index:" + index + " type:" + type);
		if(index == 0){
			if(this.retain_pwd == false){
				this.retain_pwd = true;
				this.retain_pwd_node.active = true;
			}else{
				this.retain_pwd = false;
				this.retain_pwd_node.active = false;
			}
		}else if(index == 1){
			if(this.auto_login == false){
				this.auto_login = true;
				this.auto_login_node.active = true;
			}else{
				this.auto_login = false;
				this.auto_login_node.active = false;
			}
		}
		cc.log(this.auto_login,this.retain_pwd);
		Storage.setAutoLoginFlag(this.auto_login);
		Storage.setPasswordFlag(this.retain_pwd);
    },
    // update (dt) {},
});
