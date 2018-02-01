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
		sprite:null,
		sprite_back:cc.Sprite,
		suit:0,
		rank:0,
    },

    // LIFE-CYCLE CALLBACKS:
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
		var size = cc.director.getVisibleSize();
		this.node.setPosition(cc.p(size.width/2,size.height + g_dealCardBack.getContentSize().height/2));
		//this.test_open();
	},
	test_open(){
		var self = this;
		cc.loader.loadResDir("",cc.SpriteFrame,function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res :" + assets[i].name);
			}
			self.initCardSprite(2,5);
			var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
			var backCamera = cc.rotateBy(0.45,0,-90);
			var backSpawn = cc.spawn(backCardSeq,backCamera);
			var frontSeq = cc.sequence(cc.delayTime(0.45),cc.show());
			var frontCamera = cc.rotateBy(0.6,0,-360);
			var frontSpawn = cc.spawn(frontSeq,frontCamera);
			self.sprite_back.node.runAction(backSpawn);
			self.sprite.runAction(frontSpawn);
			setTimeout(function(){
				var frontSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
				var frontCamera = cc.rotateBy(0.45,0,90);
				var frontSpawn = cc.spawn(frontSeq,frontCamera);
				
				var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.show());
				var backCamera = cc.rotateBy(0.6,0,270);
				var backSpawn = cc.spawn(backCardSeq,backCamera);
				
				self.sprite.runAction(frontSpawn);
				self.sprite_back.node.runAction(backSpawn);
			},2000);
		});
	},
	test_close(){
		var self = this;
		var frontSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
		var frontCamera = cc.rotateBy(0.45,0,-90);
		var frontSpawn = cc.spawn(frontSeq,frontCamera);
		
		var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.show());
		var backCamera = cc.rotateBy(0.9,0,-180);
		var backSpawn = cc.spawn(backCardSeq,backCamera);
		
		self.sprite.runAction(frontSpawn);
		self.sprite_back.node.runAction(backSpawn);
	}
    // update (dt) {},
});
