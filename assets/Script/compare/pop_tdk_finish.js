cc.Class({
    extends: cc.Component,

    properties: {
		tdk_sprite:cc.Node,
		tdk_layout:cc.Layout,
    },
    onLoad () {
		cc.log("start go into pop tdk finish js");
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
				}
			}
         }, self.tdk_sprite);
		 //this.test_t();
	},
	init_info(players){
		for(var i = 0;i < players.length;i++){
			var player = players[i];
			var player_com = player.getComponent("tdk_player");
			var item = cc.instantiate(g_assets["tdk_player_item"]);
			var item_com = item.getComponent("tdk_player_item");
			item_com.player_name.string = player_com.nick_name;
			item_com.score.string = player_com.my_scole;
			item_com.status.spriteFrame = g_assets[player_com.statusTag];
			for(var j = 0;j < player_com.my_cards.length;j++){
				var card = player_com.my_cards[j];
				var card_com = card.getComponent("zjh_card");
				item_com.set_card_info(j,card_com.suit,card_com.rank);
			}
			this.tdk_layout.node.addChild(item);
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
				for(var i = 0;i < 2;i++){
					var item = cc.instantiate(g_assets["tdk_player_item"]);
					var item_com = item.getComponent("tdk_player_item");
					item_com.player_name.string = "1111";
					item_com.score.string = 30;
					item_com.status.spriteFrame = g_assets["winner"];
					for(var j = 0;j < 3;j++){
						item_com.set_card_info(j,2,10);
					}
					self.tdk_layout.node.addChild(item);
				}
			});
		});
	}
});
