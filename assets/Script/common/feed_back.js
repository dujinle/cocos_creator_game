cc.Class({
    extends: cc.Component,

    properties: {
		edit_box:cc.EditBox,
    },
	edit_start(){
		cc.log("start:" + this.edit_box.string);
	},
	edit_change(){
		cc.log("change:" + this.edit_box.string);
	},
	edit_end(){
		cc.log("end:" + this.edit_box.string);
	},
	button_ok(){
		var self = this;
		var size = cc.director.getVisibleSize();
		if(this.edit_box.string.length > 0){
			Servers.feedback(g_user.playerId,"all",this.edit_box.string,function(data){
				cc.log(data);
				if(data.code != 200){
					util.show_error_info(self,size,"信息提交失败");
				}else{
					util.show_error_info(self,size,"信息提交成功");
				}
			});
		}else{
			util.show_error_info(self,size,"没有输入内容");
		}
	},
	button_close(){
		cc.director.loadScene("MainScene");
	}
});
