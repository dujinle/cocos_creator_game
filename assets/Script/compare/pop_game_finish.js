cc.Class({
    extends: cc.Component,

    properties: {
		game_sprite:cc.Node,
		game_layout:cc.Layout,
    },
    onLoad () {
		cc.log("start go into pop game finish js");
		var self = this;
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
					self.destroy();
				}
			}
         }, self.game_sprite);
		 //this.test_t();
	},
	init_info(players){
		for(var i = 0;i < players.length;i++){
			var player = players[i];
			var item = cc.instantiate(g_assets["game_player_item"]);
			var item_com = item.getComponent("game_player_item");
			item_com.set_player_info(player);
			this.game_layout.node.addChild(item);
		}
	},
	test_t(){
		var self = this;
		cc.loader.loadResDir("",cc.SpriteFrame,function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				cc.log("load res :" + assets[i].name);
			}
			cc.loader.loadResDir("prefab",function (err, assets) {
				for(var i = 0;i < assets.length;i++){
					g_assets[assets[i].name] = assets[i];
					cc.log("load res :" + assets[i].name);
				}
				var players = new Array();
				for(var i = 0;i < 3;i++){
					var player = new Array();
					player.push("player" + i);
					player.push("10000");
					player.push("2000");
					player.push("8000");
					players.push(player);
				}
				self.init_info(players);
			});
		});
	},
});
