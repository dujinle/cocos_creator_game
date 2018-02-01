cc.Class({
    extends: cc.Component,

    properties: {
		create_game_sprite:cc.Node,
		enter_game_sprite:cc.Node,
		back:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		cc.log("load enter game scene js");
    },
    hide(){
		cc.log("start go into enter game scene hide");
		this.create_game_sprite.getComponent(cc.Button).interactable = false;
		this.enter_game_sprite.getComponent(cc.Button).interactable = false;
		this.back.getComponent(cc.Button).interactable = false;
		this.node.active = false;
    },
	show(){
		cc.log("start go into enter game scene show");
		this.create_game_sprite.getComponent(cc.Button).interactable = true;
		this.enter_game_sprite.getComponent(cc.Button).interactable = true;
		this.back.getComponent(cc.Button).interactable = true;
		this.node.active = true;
	},
    start () {

    },
});
