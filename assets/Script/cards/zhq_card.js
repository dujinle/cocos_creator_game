cc.Class({
    extends: cc.Component,

    properties: {
		sprite:null,
		sprite_back:cc.Sprite,
		touch_tag:false,
		id:0,
		suit:0,
		rank:0
    },

	initCardSprite(suit,rank){
		var size = cc.director.getVisibleSize();
        this.suit = suit;
        this.rank = rank;
        var cardNumber=(this.rank-2)*4+this.suit;
		this.sprite = new cc.Node("sprite");
		var sp = this.sprite.addComponent(cc.Sprite);
		sp.spriteFrame = g_assets[cardNumber.toString()];
		this.sprite.runAction(cc.hide());
		this.node.addChild(this.sprite);
    },
    onLoad () {
		cc.log("zjh_card  onload......");
		var self = this;
		var size = cc.director.getVisibleSize();
		self.node.on("touchstart", function (event) {
			self.menuCallbackButton();
            self.node.dispatchEvent(new cc.Event.EventCustom("pressed", true));
        }, self)
	},
	menuCallbackButton(){
		console.log("start move the card......");
		if(this.touch_tag == false){
			var x = this.node.getPositionX();
			var y = this.node.getPositionY() + 10;
			console.log("start move the card up......x:" + x + " y:" + y);
			var acToUp = cc.moveTo(0.1,cc.p(x,y));
			console.log("start move the card up......");
			this.node.runAction(acToUp);
			this.touch_tag = true;
		}else{
			var x = this.node.getPositionX();
			var y = this.node.getPositionY() - 10;
			var acToDown = cc.moveTo(0.1,cc.p(x,y));
			console.log("start move the card down......x:" + x + " y:" + y);
			this.node.runAction(acToDown);
			this.touch_tag = false;
		}
		return this.touch_tag;
	}
});
