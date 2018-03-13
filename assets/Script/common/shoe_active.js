cc.Class({
    extends: cc.Component,

    properties: {
		is_start:false,
		shoe_active:cc.Node,
		egg_active:cc.Node,
		bomb_active:cc.Node,
		show_type:0,
		is_finish:false,
		anim:null,
		animStatus:null,
    },
    onLoad () {
		cc.log("load gift active class");
		this.shoe_active.active = false;
		this.egg_active.active = false;
		this.bomb_active.active = false;
		this.show_bomb();
	},
	onFinished(){
		cc.log("shoe active finish",this.isValid);
		if(this.show_type == 1){
			this.shoe_active.active = false;
		}else if(this.show_type == 2){
			this.egg_active.active = false;
		}else if(this.show_type == 3){
			this.bomb_active.active = false;
		}
		this.is_finish = true;
		this.is_start = false;
		this.node.parent = null;
		this.node.destroy();
	},
	show_shoe(){
		this.show_type = 1;
		this.shoe_active.active = true;
		this.anim = this.shoe_active.getComponent(cc.Animation);
		this.anim.on('finished',  this.onFinished,this);
		this.animStatus = this.anim.play("shoe_active");
		this.is_start = true;
		// 设置循环模式为 Normal
		this.animStatus.wrapMode = cc.WrapMode.Normal;
		// 设置循环模式为 Loop
		this.animStatus.wrapMode = cc.WrapMode.Loop;
		// 设置动画循环次数为2次
		this.animStatus.repeatCount = 1;
	},
	show_egg(){
		this.show_type = 2;
		this.egg_active.active = true;
		this.anim = this.egg_active.getComponent(cc.Animation);
		this.anim.on('finished',  this.onFinished,this);
		this.animStatus = this.anim.play("egg_active");
		this.is_start = true;
		// 设置循环模式为 Normal
		this.animStatus.wrapMode = cc.WrapMode.Normal;
		// 设置循环模式为 Loop
		this.animStatus.wrapMode = cc.WrapMode.Loop;
		// 设置动画循环次数为2次
		this.animStatus.repeatCount = 1;
	},
	show_bomb(){
		this.show_type = 3;
		this.bomb_active.active = true;
		this.anim = this.bomb_active.getComponent(cc.Animation);
		this.anim.on('finished',  this.onFinished,this);
		this.animStatus = this.anim.play("bomb_active");
		this.is_start = true;
		// 设置循环模式为 Normal
		this.animStatus.wrapMode = cc.WrapMode.Normal;
		// 设置循环模式为 Loop
		this.animStatus.wrapMode = cc.WrapMode.Loop;
		// 设置动画循环次数为2次
		this.animStatus.repeatCount = 1;
	}
});
