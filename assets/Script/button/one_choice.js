cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        type:0,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.node.on("touchstart", function (event) {
            self.node.dispatchEvent(new cc.Event.EventCustom("pressed", true));
        }, this)
    },
    
    init: function (index,type) {
        this.index = index;
        this.type = type;
    },
    
    pitchOn: function () {
        this.node.getChildByName("choiced").active = true;
		this.node.getChildByName("choice").active = false;
    },
    
    lifeUp: function () {
		this.node.getChildByName("choice").active = true;
        this.node.getChildByName("choiced").active = false;
    }
});

