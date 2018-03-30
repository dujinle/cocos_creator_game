cc.Class({
    extends: cc.Component,

    properties: {
		edit_box:cc.EditBox,
		bg_sprite:cc.Node,
		title:null,
		tid:0,
		text_info:null,
		choice_radios:{
			type:cc.Node,
			default:[],	
		}
    },
	onLoad () {
		this.tid = 0;
		this.title = "意见";
		this.node.on("pressed", this.switchRadio, this);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {            // 触摸移动时触发
            },
            onTouchEnded: function (touch, event) {            // 点击事件结束处理
				var target=event.getCurrentTarget();
				var local=target.convertToNodeSpace(touch.getLocation());
				var s = target.getContentSize();
				var rect = cc.rect(0, 0, s.width, s.height);
				if (cc.rectContainsPoint(rect, local)){
					cc.log("ok touch in the region......");
				}else{
					cc.log("touch remove from parent");
					//self.node.active = false;
				}
			}
         }, this.bg_sprite);
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
	switchRadio(event) {
        var index = event.target.getComponent("one_choice").index;
		var type = event.target.getComponent("one_choice").type;
		cc.log("switchRadio : index:" + index + " type:" + type);
		
        for(let i = 0; i < this.choice_radios.length; i++){
			var item = this.choice_radios[i].getComponent("one_choice");
            if(item.index == index){
				this.tid = index;
				if(index == 0){
					this.title = "意见";
				}else if(index == 1){
					this.title = "Bug";
				}else if(index == 2){
					this.title = "体验";
				}else if(index == 3){
					this.title = "其他";
				}
                item.pitchOn();
            }else{
                item.lifeUp();
            }
        }
		cc.log("title : " + this.title + " tid:" + this.tid);
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
		this.node.active = false;
		this.node.destroy();
	}
});
