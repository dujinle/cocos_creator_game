cc.Class({
    extends: cc.Component,

    properties: {
        username_label:cc.Label,
        fangka_label:cc.Label,
        diamond_label:cc.Label,
        sex_sprite:cc.Sprite,
        user_layer:cc.Node,
        game_layout:cc.Node,
        entergame_layout:cc.Node,
        pop_zjhgame_layer:cc.Node,
		pop_tdkgame_layer:cc.Node,
		pop_zhqgame_layer:cc.Node,
		pop_enter_game_layer:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("on load main scene.....");
		window.g_game_type = "ZJH";
		self = this;
		self.username_label.string = g_user.nickName;
        self.fangka_label.string = g_user.fangka;
        self.diamond_label.string = g_user.diamond;
		if(g_user.gender == 1){
			self.sex_sprite.spriteFrame = g_assets["gender1"];
        }
    },
    popUserLayer(){
        cc.log("start init pop user layer info");
		this.user_layer.getComponent("popUserLayer").show();
    },
	ExitUserLayer(){
		this.user_layer.getComponent("popUserLayer").hide();
    },
    enterGameLayer(event,customEventData){
        cc.log("enterGameLayer type:" + customEventData);
		g_game_type = customEventData;
		this.game_layout.getComponent("game_scene").hide();
        this.entergame_layout.getComponent("enter_game_scene").show();
    },
    enterGameBack(){
        this.game_layout.getComponent("game_scene").show();
		this.entergame_layout.getComponent("enter_game_scene").hide();
    },
    popCreateGameLayer(){
        cc.log("got info createGameLayer......");
		if(g_game_type == "ZJH"){
			this.pop_zjhgame_layer.active = true;
		}else if(g_game_type == "TDK"){
			this.pop_tdkgame_layer.active = true;
		}else if(g_game_type == "ZHQ"){
			this.pop_zhqgame_layer.active = true;
		}
    },
	popEnterGameLayer(){
		this.pop_enter_game_layer.active = true;
		cc.log("go into popEnterGameLayer......");
	},
	exit(){
		cc.director.end();
	},
    start () {

        //this.username.string = nickName;
    },

    // update (dt) {},
});
