cc.Class({
    extends: cc.Component,

    properties: {
        /*user layer 里面的参数设置*/
		bg_sprite:cc.Node,
        vnickname_lable:cc.Label,
        vacount_label:cc.Label,
        vlevel_label:cc.Label,
        vfangka_label:cc.Label,
        vuid_label:cc.Label,
        vsex_label:cc.Label,
		vvip_label:cc.Label,
		vdiamon_label:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("start go into popUserLayer js");
		var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
            onTouchBegan: function (touch, event) {
                //实现 onTouchBegan 事件回调函数
                var target = event.getCurrentTarget();
                // 获取事件所绑定的 target
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                cc.log("当前点击坐标"+locationInNode);
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
         }, this.bg_sprite);
    },
	show(){
		this.vnickname_lable.string = g_user.nickName;
		this.vacount_label.string = "1234567890";
		this.vlevel_label.string = "0";
		this.vfangka_label.string = g_user.fangka;
		this.vuid_label.string = "12345566";
		if(g_user.gender == 1){
			this.vsex_label.string = "男";
		}else{
			this.vsex_label.string = "女";
		}
		this.vvip_label.string = g_user.vip;
		this.vdiamon_label.string = g_user.diamond;
		this.node.active = true;
	},
	hide(){
		this.node.active = false;
	},
    exit(){
    
    },
});
