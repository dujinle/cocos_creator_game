cc.Class({
    extends: cc.Component,

    properties: {
		is_start:false,
		shoe_active:cc.Node,
		egg_active:cc.Node,
		bomb_active:cc.Node,
		kiss_active:cc.Node,
		flower_active:cc.Node,
		cheers_active:cc.Node,
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
		this.kiss_active.active = false;
		this.flower_active.active = false;
		this.cheers_active.active = false;
		this.show_shoe();
	},
	onFinished(){
		cc.log("shoe active finish",this.isValid);
		if(this.show_type == 1){
			this.shoe_active.active = false;
		}else if(this.show_type == 2){
			this.egg_active.active = false;
		}else if(this.show_type == 3){
			this.bomb_active.active = false;
		}else if(this.show_type == 4){
			this.kiss_active.active = false;
		}else if(this.show_type == 5){
			this.flower_active.active = false;
		}else if(this.show_type == 6){
			this.cheers_active.active = false;
		}
		
		this.is_finish = true;
		this.is_start = false;
		this.node.parent = null;
		this.node.destroy();
	},
	show_shoe(s_pos,e_pos){
		var self = this;
		cc.loader.loadResDir("",cc.SpriteFrame,function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res :" + assets[i].name);
			}
		});
		cc.loader.loadResDir("prefab",function (err, assets) {
			for(var i = 0;i < assets.length;i++){
				g_assets[assets[i].name] = assets[i];
				self.rate = self.rate + 1;
				cc.log("load res :" + assets[i].name);
			}
			var shoe_active = cc.instantiate(g_assets["shoe_active"]);
			self.node.addChild(shoe_active);
			shoe_active.setPosition(cc.p(0,0));
			var move = cc.moveTo(0.5,cc.p(100,100));
			var rotation = cc.rotateBy(0.5,360);
			var spawn = cc.spawn(move,rotation);
			shoe_active.runAction(move);
			var anim = shoe_active.getComponent(cc.Animation);
			var animStatus = anim.play("shoe_active");
			// 设置循环模式为 Normal
			animStatus.wrapMode = cc.WrapMode.Normal;
			// 设置循环模式为 Loop
			animStatus.wrapMode = cc.WrapMode.Loop;
			// 设置动画循环次数为2次
			animStatus.repeatCount = 1;
		});
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
	},
	show_kiss(){
		this.show_type = 4;
		this.kiss_active.active = true;
		this.anim = this.kiss_active.getComponent(cc.Animation);
		this.anim.on('finished',  this.onFinished,this);
		this.animStatus = this.anim.play("kiss_active");
		this.is_start = true;
		// 设置循环模式为 Normal
		this.animStatus.wrapMode = cc.WrapMode.Normal;
		// 设置循环模式为 Loop
		this.animStatus.wrapMode = cc.WrapMode.Loop;
		// 设置动画循环次数为2次
		this.animStatus.repeatCount = 1;
	},
	show_flower(){
		this.show_type = 5;
		this.flower_active.active = true;
		this.anim = this.flower_active.getComponent(cc.Animation);
		this.anim.on('finished',  this.onFinished,this);
		this.animStatus = this.anim.play("flower_active");
		this.is_start = true;
		// 设置循环模式为 Normal
		this.animStatus.wrapMode = cc.WrapMode.Normal;
		// 设置循环模式为 Loop
		this.animStatus.wrapMode = cc.WrapMode.Loop;
		// 设置动画循环次数为2次
		this.animStatus.repeatCount = 1;
	},
	show_cheers(){
		this.show_type = 6;
		this.cheers_active.active = true;
		this.anim = this.cheers_active.getComponent(cc.Animation);
		this.anim.on('finished',  this.onFinished,this);
		this.animStatus = this.anim.play("cheers_active");
		this.is_start = true;
		// 设置循环模式为 Normal
		this.animStatus.wrapMode = cc.WrapMode.Normal;
		// 设置循环模式为 Loop
		this.animStatus.wrapMode = cc.WrapMode.Loop;
		// 设置动画循环次数为2次
		this.animStatus.repeatCount = 1;
	},
});
