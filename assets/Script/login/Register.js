cc.Class({
    extends: cc.Component,

    properties: {
        phone_box:cc.Node,
		name_box:cc.Node,
		qianming_box:cc.Node,
		pwd_box:cc.Node,
		repwd_box:cc.Node,
		ptip_label:cc.Label,
		rtip_label:cc.Label,
		rbutton:cc.Button,
		sex_nan:cc.Node,
		sex_nv:cc.Node,
		phone_num:null,
		nick_name:null,
		sign_text:null,
		sex_type:null,
		password:null,
    },
	
    onLoad () {
		this.node.on("pressed", this.switchRadio, this);
		this.sex_nan.active = true;
		this.sex_type = 1;
		this.sex_nv.active = false;
		this.rbutton.getComponent(cc.Button).interactable = false;
	},
	input_phone_begin(){
		this.ptip_label.string = "";
		this.phone_num = this.phone_box.getComponent(cc.EditBox).string;
	},
	input_phone_end(){
		var self = this;
		self.phone_num = self.phone_box.getComponent(cc.EditBox).string;
		Servers.getIsPhone(self.phone_num,function(data){
			self.ptip_label.string = data.msg;
			if(data.code == 200){
				self.rbutton.getComponent(cc.Button).interactable = true;
			}
		});
	},
	input_name_begin(){
		this.nick_name = this.name_box.getComponent(cc.EditBox).string;
	},
	input_name_end(){
		this.nick_name = this.name_box.getComponent(cc.EditBox).string;
	},
	input_qianming_begin(){
		this.sign_text = this.qianming_box.getComponent(cc.EditBox).string;
	},
	input_qianming_end(){
		this.sign_text = this.qianming_box.getComponent(cc.EditBox).string;
	},
	input_pwd_begin(){
		this.password = this.pwd_box.getComponent(cc.EditBox).string;
	},
	input_pwd_end(){
		this.password = this.pwd_box.getComponent(cc.EditBox).string;
	},
	input_rpwd_begin(){
		this.rtip_label.string = "";
	},
	input_rpwd_end(){
		if(this.password != this.repwd_box.getComponent(cc.EditBox).string){
			this.rtip_label.string = "密码不匹配";
			this.rbutton.getComponent(cc.Button).interactable = false;
		}else{
			this.rbutton.getComponent(cc.Button).interactable = true;
		}
	},
	switchRadio(event) {
        var index = event.target.getComponent("one_choice").index;
		var type = event.target.getComponent("one_choice").type;
		cc.log("switchRadio : index:" + index + " type:" + type);
		if(index == 0){
			this.sex_nan.active = true;
			this.sex_nv.active = false;
			this.sex_type = 1;
		}else if(index == 1){
			this.sex_nan.active = false;
			this.sex_nv.active = true;
			this.sex_type = 0;
		}
    },
	onRegister(){
		var self = this;
		var size = cc.director.getVisibleSize();
		Servers.getRegister(this.phone_num,this.nick_name,this.password,this.sign_text,this.sex_type,function(data){
			util.show_error_info(self,size,data.msg);
			if(data.code == 200){
				var hail = cc.callFunc(self.intoHail,self);
				self.node.runAction(cc.sequence(new cc.DelayTime(2.5),hail));
			}
		});
	},
	intoHail(){
		cc.director.loadScene("LoginScene");
	}
});