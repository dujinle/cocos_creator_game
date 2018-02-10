cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        type:0,
    },

    // use this for initialization
    onLoad: function () {
		cc.log("go into bipai choice");
        var self = this;
        this.node.on("touchstart", function (event) {
            self.node.dispatchEvent(new cc.Event.EventCustom("pressed", true));
        }, self);
    },
    start(){
		var ringSmallAction = cc.scaleTo(0.5,0.5,0.5);
		var ringBigAction = cc.scaleTo(0.5,2,2);
		var ringSeqAction = cc.sequence(ringSmallAction,ringBigAction);
		var ringRepeatAction = cc.repeatForever(ringSeqAction);
		this.node.runAction(ringRepeatAction);
		cc.log("baipai choice index:",this.node.getSiblingIndex());
	},
    init: function (index,type) {
        this.index = index;
        this.type = type;
    },
});

