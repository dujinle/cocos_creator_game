cc.Class({
    extends: cc.Component,

    properties: {
		buy_scene:cc.Node,
    },
    onLoad () {
		this.index_arr = ["购买房卡","购买钻石","包月","包年"];
		
		this.node.on("pressed", this.switchRadio, this);
	},
	switchRadio(event) {
        var index = event.target.getComponent("one_choice").index;
		var type = event.target.getComponent("one_choice").type;
		cc.log("switchRadio : index:" + index + " type:" + type);
		var buy_scene_com = this.buy_scene.getComponent("store_buy");
		var info = new Array();
		info.push(this.index_arr[type]);//tip label info
		info.push(index);
		info.push(type);
		buy_scene_com.show_buy_scene(info);
    },
	call_back(){
		cc.director.loadScene("MainScene");
	},
});