/**
 * Created by dujinle on 1/28/18.
 */
var room_create = function(param,callback){
	cc.log("start create room playerId:" + JSON.stringify(param));
	
	pomelo.request(util.getCreateRoute(), param, function(data) {
		cc.log(JSON.stringify(data));
		if(data.error){
			callback(data.error);
			return ;
		}
		cc.log("create room succ");
		pomelo.request(util.getGameRoute(),{
			process:"getRoomInfo"
		},function(data1){
			//玩家的信息
			cc.log(JSON.stringify(data1));
			//创建全局的发牌背景扑克
			g_dealCardBack = new cc.Node("fapai_back");
			var sp = g_dealCardBack.addComponent(cc.Sprite);
			sp.spriteFrame = g_assets["back"];
			
			//房间的信息
			g_roomData.push(data1["current_chip"]);
			g_roomData.push(data1["all_chip"]);
			g_roomData.push(data1["round"]);
			g_roomData.push(data1["room_num"]);
			g_roomData.push(data1["player_num"]);
			g_roomData.push(data1["is_gaming"]);
			
			g_totalCount = data1["total_round"];
			var cur_player = data1["current_player"];
			if(cur_player == 0){
				g_roomData.push(1);
			}else{
				g_roomData.push(cur_player);
			}
			g_roomMasterName = data1["master_name"];
			var players = data1["players"];
			for(var i = 0;i < players.length;i++){
				var t_player = players[i];
				if(t_player != null && t_player != "null"){
					var player=new Array();
					player.push(t_player["id"]);
					player.push(t_player["location"]);
					player.push(t_player["isGame"]);
					player.push(t_player["nickName"]);
					player.push(t_player["gold"]);
					player.push(t_player["gender"]);
					if(g_game_type == "TDK"){
						player.push(t_player["paiXing"]);
					}else if(g_game_type == "ZJH"){
						player.push(t_player["mark"]);
					}
					g_playerData.push(player);
				}
			}
			if(g_game_type == "ZJH"){
				cc.director.loadScene("ZJHRoomScene");
			}else if(g_game_type == "TDK"){
				g_fapaiNum = data1["fapai_num"];
				cc.director.loadScene("TDKRoomScene");
			}else if(g_game_type == "ZHQ"){
				cc.director.loadScene("ZHQRoomScene");
			}
		});
	});
}

var room_enter = function(param,callback){
    pomelo.request(util.getEnterRoute(), param, function(data) {
        if(data.error) {
			callback(data.error);
			return ;
        }
		pomelo.request(util.getGameRoute(),{
			process:"getRoomInfo"
		},function(data1){
			//玩家的信息
			cc.log(JSON.stringify(data1));
			//创建全局的发牌背景扑克
			g_dealCardBack = new cc.Node("fapai_back");
			var sp = g_dealCardBack.addComponent(cc.Sprite);
			sp.spriteFrame = g_assets["back"];
			//房间的信息
			g_roomData.push(data1["current_chip"]);
			g_roomData.push(data1["all_chip"]);
			g_roomData.push(data1["round"]);
			g_roomData.push(data1["room_num"]);
			g_roomData.push(data1["player_num"]);
			g_roomData.push(data1["is_gaming"]);
			g_totalCount = data1["total_round"];
			var cur_player = data1["current_player"];
			if(cur_player == 0){
				g_roomData.push(1);
			}else{
				g_roomData.push(cur_player);
			}

			g_roomMasterName = data1["master_name"];
			var players = data1["players"];
			for(var i = 0;i < players.length;i++){
				var t_player = players[i];
				if(t_player != null && t_player != "null"){
					var player=new Array();
					player.push(t_player["id"]);
					player.push(t_player["location"]);
					player.push(t_player["isGame"]);
					player.push(t_player["nickName"]);
					player.push(t_player["gold"]);
					player.push(t_player["gender"]);
					if(g_game_type == "TDK"){
						player.push(t_player["paiXing"]);
					}else if(g_game_type == "ZJH"){
						player.push(t_player["mark"]);
					}
					g_playerData.push(player);
				}
			}
			if(g_game_type == "ZJH"){
				cc.director.loadScene("ZJHRoomScene");
			}else if(g_game_type == "TDK"){
				g_fapaiNum = data1["fapai_num"];
				cc.director.loadScene("TDKRoomScene");
			}else if(g_game_type == "ZHQ"){
				cc.director.loadScene("ZHQRoomScene");
			}
        });
    });
}