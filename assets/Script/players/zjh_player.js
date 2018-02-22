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
		id:0,
		nick_name:null,
		my_gold:0,
		position_server:0,
		player_position:0,
		check_card:false,
		is_power:0,
		abandon:false,
		mobile_sprite:cc.Sprite,
		counter_timer:cc.Node,
		status_sprite:cc.Sprite,
		nick_name_label:cc.Label,
		gold_label:cc.Label,
		my_cards:{
			type:cc.Node,
			default:[]
		},
		
    },
	onLoad(){
		cc.log("load zjh player......",this.check_card);
		
	},
	init(params){
		cc.log("zjh_player init: " + JSON.stringify(params));
		this.id = params[0];
        this.position_server = params[1];
        this.is_power = params[2];
		this.nick_name = params[3];
		this.my_gold = params[4];
		if(params[6] == 0){
			this.check_card = false;
		}else{
			this.check_card = true;
		}
		this.nick_name_label.getComponent(cc.Label).string = this.nick_name;
		this.gold_label.getComponent(cc.Label).string = this.my_gold;
		this.init_cards();
		if(this.is_power > 0){
			this.setSpriteStatus("yizhunbei");
		}
	},
	start_timer(){
		var count_timer = this.counter_timer.getComponent("count_timer");
		count_timer.start_timer();
	},
	stop_timer(){
		var count_timer = this.counter_timer.getComponent("count_timer");
		count_timer.stop_timer();
	},
    setSpriteStatus(status){
		console.log("zjh_player setSpriteStatus:" + status);
		this.status_sprite.spriteFrame = g_assets[status];
		this.status_sprite.node.active = true;
	},
	init_cards(){
		for(var i = 0;i < 3;i++){
			var card = cc.instantiate(g_assets["zjh_card"]);
			this.node.parent.addChild(card);
			this.my_cards.push(card);
		}
    },
	set_card_sprite(idx,suit,rank){
		var card = this.my_cards[idx].getComponent("zjh_card");
		card.initCardSprite(suit,rank);
	},
	remove_cards(){
		for(var i = 0;i < this.my_cards.length;i++){
			var card = this.my_cards[i];
			card.destroy();
		}
		this.my_cards.splice(0,this.my_cards.length);
	},
	hide_status_sprite(){
		this.status_sprite.node.active = false;
	},
	resetMoneyLabel(money){
		this.my_gold = money;
		this.gold_label.string = money;
	}
	// update (dt) {},
});
