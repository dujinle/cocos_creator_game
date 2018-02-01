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

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		cc.log("load game scene js");
		this.zjh_sprite = this.node.getChildByName("ZJH_sprite");
		this.tdk_sprite = this.node.getChildByName("TDK_sprite");
		this.zhq_sprite = this.node.getChildByName("ZHQ_sprite");
    },
    hide(){
		cc.log("start go into game scene hide");
		this.zjh_sprite.getComponent(cc.Button).interactable = false;
		this.tdk_sprite.getComponent(cc.Button).interactable = false;
		this.zhq_sprite.getComponent(cc.Button).interactable = false;
		this.node.active = false;
    },
	show(){
		cc.log("start go into game scene show");
		this.zjh_sprite.getComponent(cc.Button).interactable = true;
		this.tdk_sprite.getComponent(cc.Button).interactable = true;
		this.zhq_sprite.getComponent(cc.Button).interactable = true;
		this.node.active = true;
	},
    start () {

    },

    // update (dt) {},
});
