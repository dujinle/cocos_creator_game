cc.Class({
    extends: cc.Component,

    properties: {
		player_name:cc.Label,
		start_gold:cc.Label,
		end_gold:cc.Label,
		diff_gold:cc.Label,
    },

    onLoad () {
	},
	set_player_info(infos){
		cc.log(JSON.stringify(infos));
		this.player_name.string = infos[0];
		this.start_gold.string = infos[1];
		this.end_gold.string = infos[2];
		this.diff_gold.string = infos[3];
	},
});
