cc.Class({
    extends: cc.Component,

    properties: {
		id:0,
		nick_name:null,
		my_gold:0,
		my_scole:0,
		position_server:0,
		statusTag:null,
		player_position:0,
		is_power:0,
		mobile_sprite:cc.Sprite,
		counter_timer:cc.Node,
		status_sprite:cc.Sprite,
		nick_name_label:cc.Label,
		gold_label:cc.Label,
		my_cards:{
			type:cc.Node,
			default:[]
		},
		selected_cards:{
			type:cc.Node,
			default:[]
		}
    },
	init(params){
		cc.log("tdk_player init: " + JSON.stringify(params));
		this.id = params[0];
        this.position_server = params[1];
        this.is_power = params[2];
		this.nick_name = params[3];
		this.my_gold = params[4];
		this.nick_name_label.getComponent(cc.Label).string = this.nick_name;
		this.gold_label.getComponent(cc.Label).string = this.my_gold;
		if(this.is_power > 0){
			this.setSpriteStatus("start");
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
		this.statusTag = status;
		this.status_sprite.spriteFrame = g_assets[status];
		this.status_sprite.node.active = true;
	},
	
	addPlayerCard(){
		var card = cc.instantiate(g_assets["zhq_card"]);
		this.node.parent.addChild(card);
		this.my_cards.push(card);
		return card;
	},
	init_cards(card_num){
		for(var i = 0;i < card_num;i++){
			var card = cc.instantiate(g_assets["zhq_card"]);
			this.node.parent.addChild(card);
			this.my_cards.push(card);
		}
    },
	set_card_sprite(idx,suit,rank){
		var card = this.my_cards[idx].getComponent("zhq_card");
		card.initCardSprite(suit,rank);
	},
	get_last_card(){
		var last_card = null;
		for(var i = 0;i < this.my_cards.length;i++){
			last_card = this.my_cards[i];
		}
		return last_card;
	},
	getNextEmptyCard(){
		for(var j = 0;j < this.my_cards.length;j++){
			var card = this.my_cards[j];
			var card_com = card.getComponent("zhq_card");
			if(card_com.sprite == null){
				return j;
			}
		}
		return -1;
	},
	remove_cards(){
		for(var i = 0;i < this.my_cards.length;i++){
			var card = this.my_cards[i];
			card.destroy();
		}
		this.my_cards.splice(0,this.my_cards.length);
	},
	remove_select_cards(){
		for(var i = 0;i < this.selected_cards.length;i++){
			var selectCard = this.selected_cards[i];
			for(var j = 0;j < this.my_cards.length;j++){
				if(selectCard == this.my_cards[j]){
					this.my_cards.splice(j,1);
					break;
				}
			}
		}
		this.selected_cards.splice(0,this.selected_cards.length);
	},
	resetSelectCard(){
		for(var i = 0;i < this.selected_cards.length;i++){
			var card_t = this.selected_cards[i];
			var card_com = card_t.getComponent("zhq_card");
			card_com.menuCallbackButton();
		}
		this.selected_cards.splice(0,this.selected_cards.length);
	},
	hide_status_sprite(){
		this.status_sprite.node.active = false;
	},
	resetMoneyLabel(money){
		this.my_gold = money;
		this.gold_label.string = money;
	},
});
