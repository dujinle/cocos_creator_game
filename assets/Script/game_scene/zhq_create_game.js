cc.Class({
    extends: cc.Component,

    properties: {
		jushu:20,
		dizhu:100,
		renshu:4,
		fangka:1,
		tianxuan:0,
		game_type:"ZHQ",
		choice_radios:{
			type:cc.Node,
			default:[],
		}
    },
    onLoad () {
		cc.log("start go into create game js");
		var self = this;
		self.dizhu = 100;
		self.renshu = 4;
		self.jushu = 20;
		self.fangka = 1;
		self.tianxuan = 0;
		self.node.on("pressed", self.switchRadio, self);
		var bg_sprite =  self.node.getChildByName("bg_sprite");
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
					self.node.active = false;
				}
			}
         }, bg_sprite);
	},
	switchRadio(event) {

        var index = event.target.getComponent("one_choice").index;
		var type = event.target.getComponent("one_choice").type;
		cc.log("switchRadio : index:" + index + " type:" + type);
        for(let i = 0; i < this.choice_radios.length; i++){
			var item = this.choice_radios[i].getComponent("one_choice");
			if(item.type != type){
				continue;
			}
            if(item.index == index){
				if(type == 1){
					this.jushu = 20 * index;
					this.fangka = index;
				}else if(type == 2){
					this.renshu = 3 + index;
				}else if(type == 3){
					this.tianxuan = index - 1;
				}
                item.pitchOn();
            }else{
                item.lifeUp();
            }
        }
		cc.log("select jushu" + this.jushu + " fangka:" + this.fangka + " renshu:" + this.renshu + " tianxuan:" + this.tianxuan);
    },
    start () {

    },
	create_game(){
		var self = this;
		var size = cc.director.getVisibleSize();
		var param = {
			playerId:g_user.playerId,
			roomType:this.game_type,
			maxChip:this.dizhu,
			renShu:this.renshu,
			tianXuan:this.tianxuan,
			juShu:this.jushu,
			fangKa:this.fangka
		};
		room_create(param,function(msg){
			var error_tip = cc.instantiate(g_assets["prop_error_scene"]);
			var error_tip_com = error_tip.getComponent("prop_error_info");
			error_tip_com.show_error_info(msg);
			self.node.addChild(error_tip);
			error_tip.setPosition(self.node.convertToNodeSpace(size.width/2,size.height/2));
			cc.log(msg);
		});
	},
    // update (dt) {},
});
