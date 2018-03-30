cc.Class({
    extends: cc.Component,

    properties: {
        loadBar:cc.ProgressBar,
        precent:cc.Label,
		rate:0,
		source_leng:58,
    },
    onLoad () {
		this.source_leng = 109;
		this.load_res();
        this.schedule(this.load_update,0.5);
    },
	load_update(){
		this.loadBar.progress = this.rate/this.source_leng * 100;
		this.precent.string = this.loadBar.progress + "%";
		cc.log("this.rate:" + this.rate);
		if(this.rate >= this.source_leng){
			this.unschedule(this.load_update);
			cc.director.loadScene("LoginScene");
		}
	},
	load_res(){
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
		});
	}
});