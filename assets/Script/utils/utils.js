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
util.showError = function(pparent,msg){
	size = cc.director.getWinSize();
	var errorTipSprite = new cc.Sprite(res.errorTip_png);
	errorTipSprite.setPosition(size.width/2,size.height/2);

	var errorLable = new cc.LabelTTF(msg, "Arial", 24);
	errorLable.setFontFillColor(cc.color.WHITE);
	errorLable.setPosition(errorTipSprite.getContentSize().width/2,
		errorTipSprite.getContentSize().height/2 - 5);
	errorTipSprite.addChild(errorLable);
	pparent.addChild(errorTipSprite);
	errorLable.runAction(cc.sequence(cc.fadeOut(3)));
	errorTipSprite.runAction(cc.sequence(cc.fadeOut(3.1)));
}