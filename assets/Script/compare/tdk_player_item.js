cc.Class({
    extends: cc.Component,

    properties: {
		player_name:cc.Label,
		score:cc.Label,
		status:cc.Sprite,
		cards:{
			type:cc.Node,
			default:[]
		}
    },

    onLoad () {
		/*
		for(var i = 0;i < this.cards.length;i++){
			var card = this.cards[i];
			card.active = false;
		}
		*/
	},
	set_card_info(idx,suit,rank){
		cc.log("tdk player item:",idx,suit,rank);
		var card = this.cards[idx];
		var card_sprite = card.getComponent(cc.Sprite);
		card_sprite.spriteFrame = g_assets["tdk_" + suit];
		var card_label = card.getChildByName("card_label").getComponent(cc.Label);
		card_label.string = g_Puke[rank];
	},
});
