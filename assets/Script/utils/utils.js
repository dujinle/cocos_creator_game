/**
 * Created by WTF Wei on 2016/4/21.
 * Function :
 */
var util = util || {};

/**
 * 等级 充值金额判断等级
 * @param recharge
 */
util.toLevel = function (recharge) {
    var level =  parseInt(recharge/10);
    return level;
}

/**
 * 增量 充值金额判断增量
 * @param recharge
 */
util.toDelta = function (recharge) {
    var delta = parseInt(recharge/10)*100 + 1000;
    return delta;
}

/**
 * 容量 充值金额判断容量
 * @param recharge
 */
util.toVolume = function (recharge) {
    var volume = 10*(parseInt(recharge/10)*100 + 1000);
    return volume;
}

util.createUUID = function () {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
}
util.getGameRoute = function(){
	if(g_game_type == "ZJH"){
		return "game.ZJHGameHandler.ZJHGameProcess";
	}else if(g_game_type == "TDK"){
		return "game.TDKGameHandler.TDKGameProcess";
	}else if(g_game_type == "ZHQ"){
		return "game.ZHQGameHandler.ZHQGameProcess";
	}
}

util.getCreateRoute = function(){
	if(g_game_type == "ZJH"){
		return "connector.ZJHEntryHandler.create";
	}else if(g_game_type == "TDK"){
		return "connector.TDKEntryHandler.create";
	}else if(g_game_type == "ZHQ"){
		return "connector.ZHQEntryHandler.create";
	}
}
util.getEnterRoute = function(){
	if(g_game_type == "ZJH"){
		return "connector.ZJHEntryHandler.enter";
	}else if(g_game_type == "TDK"){
		return "connector.TDKEntryHandler.enter";
	}else if(g_game_type == "ZHQ"){
		return "connector.ZHQEntryHandler.enter";
	}
}
util.show_error_info = function(pp,size,msg){
	var error_tip = cc.instantiate(g_assets["prop_error_scene"]);
	var error_tip_com = error_tip.getComponent("prop_error_info");
	error_tip_com.show_error_info(msg);
	pp.node.addChild(error_tip);
	error_tip.setPosition(pp.node.convertToNodeSpace(size.width/2,size.height/2));
}