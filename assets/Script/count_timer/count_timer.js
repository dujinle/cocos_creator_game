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
		progress_bar_top:cc.ProgressBar,
		progress_bar_boom:cc.ProgressBar,
		top_precent:0,
		boom_precent:0,
		pid:0,
		sumTime:3,
    },

    onLoad(){
		cc.log("load counter time progress",this.sumTime);
		this.sumTime = 3;
		this.progress_bar_top.progress = 0;
		this.progress_bar_boom.progress = 0;
		this.top_precent = 0;
		this.boom_precent = 0;
		cc.log(this.progress_bar_top.progress,this.progress_bar_boom.progress);
		//this.start_timer();
    },

    start_timer(){
		cc.log("start timer .......",this.sumTime);
		cc.log("start timer .......",this.progress_bar_top.progress,this.progress_bar_boom.progress);
		this.progress_bar_top.progress = 0;
		this.progress_bar_boom.progress = 0;
		this.top_precent = 0;
		this.boom_precent = 0;
		this.schedule(this.progress_bar,0.1);
    },
	progress_bar(){
		cc.log("top_precent:" + this.top_precent + " boom_precent" + this.boom_precent);
		cc.log("top:" + this.progress_bar_top.progress + " boom:" + this.progress_bar_boom.progress);
		if(this.progress_bar_boom.progress <= 1){
			this.boom_precent = this.boom_precent + 0.2;
			this.progress_bar_boom.progress = this.boom_precent / this.sumTime;
			return;
		}
		if(this.progress_bar_top.progress <= 1){
			this.top_precent = this.top_precent + 0.2;
			this.progress_bar_top.progress = this.top_precent / this.sumTime;
			return;
		}
		this.unschedule(this.progress_bar);
	},
    stop_timer:function(){
		this.unschedule(this.progress_bar);
		this.progress_bar_top.progress = 0;
		this.progress_bar_boom.progress = 0;
		this.top_precent = 0;
		this.boom_precent = 0;
    }
});
