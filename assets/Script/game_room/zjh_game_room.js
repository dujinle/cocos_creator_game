cc.Class({
    extends: cc.Component,

    properties: {
		bet:0,
		sumBet:0,
		count:0,
		fapai_count:0,
		roomNum:0,
		playerNum:0,
		roomState:0,
		master_name:null,
		total_count:0,
		danzhu:100,
		comparableState:false,
		currentGetPowerPlayerPosition:0,
		//head label info
		master_label:cc.Label,
		room_num_label:cc.Label,
		danzhu_label:cc.Label,
		zongzhu_label:cc.Label,
		huihe_label:cc.Label,
		//buttons for game
		zhunbei_button:cc.Node,
		bipai_button:cc.Node,
		kaipai_button:cc.Node,
		qipai_button:cc.Node,
		genzhu_button:cc.Node,
		jiazhu_button:cc.Node,
		players:{
			type:cc.Node,
			default:[],
		}
    },

    onLoad () {
		this.bet = g_betArray[0];
        this.sumBet = g_roomData[1];
		this.count = g_roomData[2];
		this.roomNum = g_roomData[3];
        this.playerNum = g_roomData[4];
        this.roomState = g_roomData[5];
		this.currentGetPowerPlayerPosition = g_roomData[6];
		this.master_name = g_roomMasterName;
		this.total_count = g_totalCount;
		this.startDealCardPosition1 = 0;
		this.startDealCardPosition = 0;
		this.comparableState = false;
		this.betPhotoArray = new Array();
		this.myselfCards = new Array();
		this.init_head_info();
		this.initButtonEnableAfterComeInRoom();
		this.initPlayersAndPlayer_noPower();
		if(this.roomState == 1){
			/*进来的时候 有玩家正在玩牌 则初始化他们的牌位置*/
			this.initPlayerCardsPosition();
		}
		this.schedule(this.showRoomMessageUpdate,1.0/60,cc.REPEAT_FOREVER,0);
	},
	start(){
		cc.log("go into zjh game room scene start");
		this.audioSource = this.node.getComponent(cc.AudioSource);
		g_music_key = cc.sys.localStorage.getItem(MUSIC_KEY);
		if(g_music_key == BOOL.YES){
			this.audioSource.play();
		}
		this.init_count_timer();
		this.pomelo_on();
	},
	init_head_info(){
		var size = cc.director.getWinSize();
		var lmaster = this.master_label.getComponent(cc.Label);
		lmaster.string = this.master_name;
		
		var lroom_num = this.room_num_label.getComponent(cc.Label);
		lroom_num.string = this.roomNum;
		
		var ldanzhu = this.danzhu_label.getComponent(cc.Label);
		ldanzhu.string = this.bet;
		
		var lzongzhu = this.zongzhu_label.getComponent(cc.Label);
		lzongzhu.string = this.sumBet;
		
		var lhuihe = this.huihe_label.getComponent(cc.Label);
		lhuihe.string = this.count + "/" + this.total_count;
		
		var position = this.node.convertToNodeSpaceAR(cc.p(
			size.width/2,size.height + g_dealCardBack.getContentSize().height/2));
		g_dealCardBack.setPosition(position);
		this.node.addChild(g_dealCardBack);
		
		//添加滚动字幕
		this.msage_scroll = cc.instantiate(g_assets["msage_scroll"]);
		this.node.addChild(this.msage_scroll);
		var x = size.width/2;
		var y = size.height - 120;
		this.msage_scroll.setPosition(this.node.convertToNodeSpaceAR(cc.p(x,y)));
	},
	initButtonEnableAfterComeInRoom(){
		this.bipai_button.getComponent(cc.Button).interactable = false;
		this.kaipai_button.getComponent(cc.Button).interactable = false;
		this.qipai_button.getComponent(cc.Button).interactable = false;
		this.genzhu_button.getComponent(cc.Button).interactable = false;
		this.jiazhu_button.getComponent(cc.Button).interactable = false;
		//正在游戏中则新加入的玩家不可以准备
		if(this.roomState == 1){
			this.zhunbei_button.getComponent(cc.Button).interactable = false;
		}else{
			this.zhunbei_button.getComponent(cc.Button).interactable = true;
		}
    },
	initButtonEnableAfterThrow(){
		this.bipai_button.getComponent(cc.Button).interactable = false;
		this.kaipai_button.getComponent(cc.Button).interactable = false;
		this.qipai_button.getComponent(cc.Button).interactable = false;
		this.genzhu_button.getComponent(cc.Button).interactable = false;
		this.jiazhu_button.getComponent(cc.Button).interactable = false;
		this.zhunbei_button.getComponent(cc.Button).interactable = false;
    },
    initPlayersAndPlayer_noPower(){
		var self = this;
		cc.log("initPlayersAndPlayer_noPower" + JSON.stringify(g_playerData));
		for(var i = 0;i < g_playerData.length;i++){
			if(g_playerData[i][0] == g_user.playerId){
				g_myselfPlayerPos = g_playerData[i][1];
				break;
			}
		}

		var position = new Array();
		//寻找玩家自己，确定自己的服务器位置和客户端位置
		for(var i = 0;i < g_playerData.length;i++){
			var idx = -1;
			var player_stc = g_playerData[i];
			if(player_stc[1] == g_myselfPlayerPos){
				idx = 0;
			}else if(player_stc[1] > g_myselfPlayerPos){
				var idx = player_stc[1] - g_myselfPlayerPos;
			}else if(player_stc[1] < g_myselfPlayerPos){
				var idx = this.players.length - g_myselfPlayerPos + player_stc[1];
			}
			if(idx >= 0){
				position[idx] = player_stc;
			}
		}
		for(var i = 0; i < this.players.length;i++){
			var player_stc = position[i];
			if(player_stc == null){
				continue;
			}
			var player = this.players[i];
			var player_com = player.getComponent("zjh_player");
			player_com.init(player_stc);
			player_com.player_position = i + 1;
			if(player_com.is_power == 0){
				g_players_noPower.push(player);
			}else{
				g_players.push(player);
			}
			player.active = true;
		}
	},
    init_count_timer(){
		var tmp_allplayers = g_players_noPower.concat(g_players);
    	for(var i = 0;i < tmp_allplayers.length;i++){
			var player_com = tmp_allplayers[i].getComponent("zjh_player");
			if(player_com.position_server == g_myselfPlayerPos){
				player_com.start_timer();
    			break;
    		}
    	}
    },
	initPlayerCardsPosition(){
        for(var i=0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zjh_player");
            if(player_com.is_power == 2){
				for(var m = 0;m < 3;m++){
					var position = this.calc_player_card_position(player,m);
					player_com.my_cards[m].setPosition(position);
				}
			}
        }
	},
	
	//按钮回调函数
	callback_zhunbei(){
		this.zhunbei_button.getComponent(cc.Button).interactable = false;
		pomelo.request(util.getGameRoute(),{
			process:"ready",
			location:g_myselfPlayerPos
		},function(data){
			cc.log(data.msg);
		});
    },
	callback_kaipai(){
		this.kaipai_button.getComponent(cc.Button).interactable = false;
        pomelo.request(util.getGameRoute(),{
            process:"open",
            location:g_myselfPlayerPos
        },function(data){
            cc.log(data.msg);
        });
    },
	callback_genzhu(){
		this.genzhu_button.getComponent(cc.Button).interactable = false;
		pomelo.request(util.getGameRoute(),{
			process:"follow",
			location:g_myselfPlayerPos
		},function(data){
			cc.log(data.msg);
		});
	},
	callback_qipai(){
		this.qipai_button.getComponent(cc.Button).interactable = false;
		pomelo.request(util.getGameRoute(),{
			process:"throw",
			location:g_myselfPlayerPos
		},function(data){
			cc.log(data.msg);
		});
	},
	callback_bipai(){
		if(g_players.length == 2) {
			this.bipai_button.getComponent(cc.Button).interactable = false;
			this.jiazhu_button.getComponent(cc.Button).interactable = false;
			this.genzhu_button.getComponent(cc.Button).interactable = false;
			this.qipai_button.getComponent(cc.Button).interactable = false;
			var left_position = 0;
			var right_position = 0;
			var left_player_com = g_players[0].getComponent("zjh_player");
			var right_player_com = g_players[1].getComponent("zjh_player");
			if (left_player_com.position_server == g_myselfPlayerPos) {
				left_position = left_player_com.position_server;
				right_position = right_player_com.position_server;
			}else {
				left_position = right_player_com.position_server;
				right_position = left_player_com.position_server;
			}

			pomelo.request(util.getGameRoute(), {
				process: "bipai",
				location1: left_position,
				location2: right_position
			}, function (data) {
				cc.log(JSON.stringify(data));
			});
		}else if(g_players.length > 2){
			this.bipai_button.getComponent(cc.Button).interactable = false;
			this.jiazhu_button.getComponent(cc.Button).interactable = false;
			this.genzhu_button.getComponent(cc.Button).interactable = false;
			this.qipai_button.getComponent(cc.Button).interactable = false;
			var size = cc.director.getVisibleSize();
			var pop_bipai_select = cc.instantiate(g_assets["pop_bipai_select"]);
			var pop_bipai_select_com = pop_bipai_select.getComponent("select_compare");
			var select_pos = new Array();
			for(var i = 0;i < g_players.length;i++){
				var player_com = g_players[i].getComponent("zjh_player");
				if(player_com.position_server == g_myselfPlayerPos){
					continue;
				}
				select_pos.push(player_com.player_position);
			}
			pop_bipai_select_com.set_which_select(select_pos);
			pop_bipai_select_com.set_callback(this.biPaiSelectCallBack);
			this.node.addChild(pop_bipai_select);
			pop_bipai_select.setPosition(this.node.convertToNodeSpaceAR(cc.p(size.width/2,size.height/2)));
			cc.log("SiblingIndex",pop_bipai_select.getSiblingIndex());
        }
    },
	callback_jiazhu(){
		var size = cc.director.getVisibleSize();
		var pop_add_chip = cc.instantiate(g_assets["pop_add_chip"]);
		var pop_add_chip_com = pop_add_chip.getComponent("add_chip");
		pop_add_chip_com.set_callback(function(index){
			pomelo.request(util.getGameRoute(),{
				process:"add",
				add_chip:g_betArray[index],
				location:g_myselfPlayerPos
			},function(data){
				console.log(data.msg);
			});
		});
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.position_server == g_myselfPlayerPos){
				var x = 0;
				var y = player.getPositionY() + player_com.mobile_sprite.node.height + 30;
				this.node.addChild(pop_add_chip);
				pop_add_chip.setPosition(cc.p(x,y));
				break;
			}
		}
	},
	callback_setting(){
		var self = this;
		var size = cc.director.getVisibleSize();
		var pop_setting = cc.instantiate(g_assets["pop_setting_scene"]);
		var pop_setting_com = pop_setting.getComponent("pop_set_scene");
		pop_setting_com.set_callback(function(index){
			if(index == 0){
				if(g_music_key == BOOL.NO){
					self.audioSource.pause();
				}else{
					self.audioSource.play();
				}
			}
		});
		
		var x = size.width/2;
		var y = size.height/2;
		this.node.addChild(pop_setting);
		pop_setting.setPosition(this.node.convertToNodeSpaceAR(cc.p(x,y)));
	},
	callback_gameback(){
		var self = this;
		pomelo.request(util.getGameRoute(),{
            process : 'quitRoom'
        },function(data){
            console.log("-----quit------"+JSON.stringify(data));
			self.onExit();
            cc.director.loadScene("MainScene");
        })
	},
	callback_uinfo(event,id){
		var self = this;
		var player = this.players[id];
		var player_com = player.getComponent("zjh_player");
		pomelo.request(util.getGameRoute(),{
            process : 'get_uinfo',
			send_from:g_myselfPlayerPos,
			send_to:player_com.position_server
        },function(data){
            console.log("-----quit------"+JSON.stringify(data));
        })
	},
	showRoomMessageUpdate(){
		var betString = this.bet;
		this.danzhu_label.string = betString;

		var sumBetString = this.sumBet;
		this.zongzhu_label.string = sumBetString;

		var countFlowingString = this.count + "/" + this.total_count;
		this.huihe_label.string = countFlowingString;
	},
	pomelo_on(){
    	pomelo.on('onReady',this.onReady_function.bind(this));
		pomelo.on('onAdd',this.onAdd_function.bind(this));
		pomelo.on('onNoRound',this.onNoRound_function.bind(this));
		pomelo.on('onFapai',this.onFapai_function.bind(this));
		pomelo.on('onGetUinfo',this.onGetUinfo_function.bind(this));
		pomelo.on('onShoupai',this.onShoupai_function.bind(this));
		pomelo.on('onOpen',this.onOpen_function.bind(this));
		pomelo.on('onThrow',this.onThrow_function.bind(this));
		pomelo.on('onFollow',this.onFollow_function.bind(this));
		pomelo.on('onLeave',this.onLeave_function.bind(this));
		pomelo.on('onChangePlayer',this.onChangePlayer_function.bind(this));
		pomelo.on('onBipai',this.onBipai_function.bind(this));
		pomelo.on('onEnd',this.onEnd_function.bind(this));
		pomelo.on('onEndPai',this.onEndPai_function.bind(this));
		pomelo.on('onAddChip',this.onAddChip_function.bind(this));
		pomelo.on('onActBroadcast',this.onUserBroadcast_function.bind(this));
    },
	onReady_function(data){
		cc.log("pomelo on Ready:" + data.location+" is ready");
		/*如果玩家进来时正在游戏中则准备后 放入g_players中*/
		for(var i = 0;i < g_players_noPower.length;i++){
			var player = g_players_noPower[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.position_server == data.location){
				g_players.push(player);
				g_players_noPower.splice(i,1);
				break;
			}
		}
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.position_server == data.location){
				player_com.is_power = 1;
				player_com.setSpriteStatus("yizhunbei");
				player_com.stop_timer();
				//准备状态表示
				break;
			}
		}
	},
	onAdd_function(data){
		cc.log("onAdd:" + JSON.stringify(data));
		var player = null;
		var playerInfo=data["user"];

		var t_player=new Array();
		t_player.push(playerInfo["id"]);
		t_player.push(playerInfo["location"]);
		t_player.push(playerInfo["isGame"]);
		t_player.push(playerInfo["nickName"]);
		t_player.push(playerInfo["gold"]);
		t_player.push(playerInfo["gender"]);
		t_player.push(playerInfo["mark"]);
		
		//确定新加入玩家的客户端位置
		var idx = 0;
		if(t_player[1] > g_myselfPlayerPos){
			idx = t_player[1] - g_myselfPlayerPos;
		}else{
			idx = this.players.length - g_myselfPlayerPos + t_player[1];
		}
		var player = this.players[idx];
		var player_com = player.getComponent("zjh_player");
		player_com.init(t_player);
		player_com.player_position = idx + 1;
		if(this.roomState == 1){
			g_players_noPower.push(player);
		}else{
			g_players.push(player);
		}
		player.active = true;
		/*
		//为新加入的玩家头像添加个人信息按钮
		var menuSprite1=new cc.Sprite(res.Mobile_jpg);
		var menuSprite2=new cc.Sprite(res.Mobile_jpg);
		var menuSprite3=new cc.Sprite(res.Mobile_jpg);
		var menuItem = new cc.MenuItemSprite(menuSprite1,menuSprite2,menuSprite3,this.menuCallbackPersonalMessage,this);
		menuItem.setName(player.player_position.toString());
		menuItem.attr({
			x : 0,
			y : 0,
			anchorX : 0,
			anchorY : 0
		});
		var menu=new cc.Menu(menuItem);
		menu.attr({
			x : 0,
			y : 0,
			anchorX : 0,
			anchorY : 0
		});
		player.spritePhotoMobile.addChild(menu);
		*/
		this.playerNum++;
	},
	onFapai_function(data){
		cc.log("onFapai" + JSON.stringify(data));
		var instruction_faPai = data["msg"];
		this.count = data["round"];
		if(instruction_faPai=="fapaile!"){
			/*更新房间状态和玩家信息*/
			//初始化发牌的位置
			this.currentGetPowerPlayerPosition = data["location"];
			this.startDealCardPosition1 = data["location"];
			this.startDealCardPosition = data["location"];
			
			//更新房间状态
			this.roomState=1;
			for(var i = 0;i < this.betPhotoArray.length;i++){
				this.betPhotoArray[i].removeFromParent();
			}
			this.betPhotoArray.length=0;
			//更新玩家信息
			for(var i=0;i<g_players.length;i++){
				//清除玩家手中上一局的牌，
				var player_com = g_players[i].getComponent("zjh_player");
				player_com.remove_cards();
			}
			this.bet = g_betArray[0];
			this.sumBet = data["all_chip"];

			/*初始化玩家手中的牌（背面），权限isPower,开牌checkCard弃牌abandon,失败提示精灵loserSprite*/
			for(var i=0;i < g_players.length;i++){
				var player_com = g_players[i].getComponent("zjh_player");
				player_com.init_cards();
				player_com.is_power = 2;
				player_com.check_card = false;
				player_com.abandon = false;
				player_com.hide_status_sprite();
			}
			//玩家收牌状态更新
			for(var i=0;i < g_players.length;i++){
				var player = g_players[i];
				var player_com = player.getComponent("zjh_player");
				this.actionBottomBet(player.getPosition());
				player_com.resetMoneyLabel(player_com.my_gold - this.bet);
				if(player_com.position_server == this.currentGetPowerPlayerPosition){
					player_com.setSpriteStatus("shou");
				}
			}
		}
	},
	onShoupai_function(data){
		cc.log("onShoupai:" + JSON.stringify(data));

		//初始化myselfCards数组
		this.myselfCards.splice(0,this.myselfCards.length);

		var cardType = data["paixing"];
		for(i = 1;i < 4;i++){
			var suit=cardType["s" + i];
			var rank=cardType["p" + i];
			var card = new Array();
			card.push(suit);
			card.push(rank);
			this.myselfCards.push(card);
		}

		//初始化玩家自己的正面牌并放好位置
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.position_server == g_myselfPlayerPos){
				for(var j = 0; j < 3;j++){
					var card = this.myselfCards[j];
					player_com.set_card_sprite(j,parseInt(card[0]),parseInt(card[1]));
				}
				break;
			}
		}
		this.myselfCardsReach=true;
		//给玩家发牌动作，由于服务器还没有给开始发牌位置信息，目前默认为从客户端位置最小的开始发牌
		var size = cc.director.getVisibleSize();
		var acMoveDown = cc.moveTo(0.5,this.node.convertToNodeSpaceAR(cc.p(size.width/2,size.height)));
		cc.log("startFaPaiPosition:" + this.currentGetPowerPlayerPosition);
		var callFuncActionDealCard = cc.callFunc(this.actionFaPai,this);
		g_dealCardBack.runAction(cc.sequence(new cc.EaseOut(acMoveDown,20),callFuncActionDealCard));
	},
	onOpen_function(data){
		cc.log("onOpen:" + JSON.stringify(data));
		var all_players = g_players.concat(g_players_noPower);
		var playerName = data["user"];
		for(var i = 0;i < all_players.length;i++){
			var player_com = all_players[i].getComponent("zjh_player");
			if(player_com.id == playerName){
				player_com.check_card = true;
				if(player_com.position_server == g_myselfPlayerPos){
					//如果是自己则执行翻牌动作
					for(var j = 0;j < 3;j++){
						var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
						var backCamera = cc.rotateBy(0.45,0,-90);
						var backSpawn = cc.spawn(backCardSeq,backCamera);
						var frontSeq = cc.sequence(cc.delayTime(0.45),cc.show());
						var frontCamera = cc.rotateBy(0.6,0,-360);
						var frontSpawn = cc.spawn(frontSeq,frontCamera);
						var card = player_com.my_cards[j].getComponent("zjh_card");
						card.sprite_back.node.runAction(backSpawn);
						card.sprite.runAction(frontSpawn);
					}
				}
				//重置定时器
				if(player_com.position_server == this.currentGetPowerPlayerPosition){
					player_com.stop_timer();
					player_com.start_timer();
				}
				player_com.setSpriteStatus("kan");
				break;
			}
		}
	},
	onThrow_function(data){
		cc.log("onThrow:" + JSON.stringify(data));
		var all_players = g_players.concat(g_players_noPower);
		var playerName = data["user"];
		for(var i = 0;i < all_players.length;i++){
			var player = all_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.id == playerName){
				player_com.abandon = true;
				if(player_com.position_server == g_myselfPlayerPos){
					this.initButtonEnableAfterThrow();
				}
				player_com.setSpriteStatus("qi");
				//将玩家移到player_noPower数组
				g_players_noPower.push(player);
				g_players.splice(i,1);
				break;
			}
		}
	},
	onFollow_function(data){
		cc.log("onFollow:" + JSON.stringify(data));
		var m_playerId = data["player_id"];
		this.sumBet = data["all_chip"];
		var all_players = g_players.concat(g_players_noPower);
		for(var i=0;i < all_players.length;i++){
			var player = all_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.id == m_playerId){
				player_com.resetMoneyLabel(parseInt(data["my_gold"]));
				this.actionFollowBet(player.getPosition(),player_com.check_card);
				break;
			}
		}
	},
	onAddChip_function(data){
		console.log("onAddChip:" + JSON.stringify(data));
		var m_playerId = data["player_id"];
		this.bet = data["current_chip"];
		this.sumBet = data["all_chip"];
		var all_players = g_players.concat(g_players_noPower);
		for(var i=0;i < all_players.length;i++){
			var player = all_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.id == m_playerId){
				player_com.resetMoneyLabel(parseInt(data["my_gold"]));
				this.actionFollowBet(player.getPosition(),player_com.check_card);
				break;
			}
		}
	},
	onLeave_function(data){
		cc.log("onLeave:" + JSON.stringify(data));
		var playerName = data["user"];
		var isFind = false;
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.id == playerName){
				cc.log("quit from zjh room g_players");
				player_com.remove_cards();
				player.active = false;
				g_players.splice(i,1);
				isFind = true;
				break;
			}
		}
		if(isFind==false){
			for(var i = 0;i < g_players_noPower.length;i++){
				var player = g_players_noPower[i];
				var player_com = player.getComponent("zjh_player");
				if(player_com.id == playerName){
					cc.log("quit from zjh room g_players_noPower");
					player_com.remove_cards();
					player.active = false;
					g_players_noPower.splice(i,1);
					isFind = true;
					break;
				}
			}
		}
		this.playerNum--;
	},
	onChangePlayer_function(data){
		cc.log("onChangePlayer:" + JSON.stringify(data));
		var rotationPlayerPositionServer = data["location"];
		//暂停当前玩家定时器,并初始化玩家按钮定时器
		var tmp_allplayers = g_players_noPower.concat(g_players);
		for(var i=0;i < tmp_allplayers.length;i++){
			var player_com = tmp_allplayers[i].getComponent("zjh_player");
			if(player_com.position_server == this.currentGetPowerPlayerPosition){
				player_com.stop_timer();
				if(this.currentGetPowerPlayerPosition == g_myselfPlayerPos){
					this.bipai_button.getComponent(cc.Button).interactable = false;
					this.genzhu_button.getComponent(cc.Button).interactable = false;
					this.jiazhu_button.getComponent(cc.Button).interactable = false;
				}
				break;
			}
		}
		//开启轮换到的玩家
		if(g_players.length >= 2) {
			this.currentGetPowerPlayerPosition = rotationPlayerPositionServer;
			for (var i = 0; i < g_players.length; i++) {
				var player_com = g_players[i].getComponent("zjh_player");
				if (player_com.position_server == rotationPlayerPositionServer) {
					player_com.start_timer();
					if (rotationPlayerPositionServer == g_myselfPlayerPos) {
						this.bipai_button.getComponent(cc.Button).interactable = true;
						this.genzhu_button.getComponent(cc.Button).interactable = true;
						this.jiazhu_button.getComponent(cc.Button).interactable = true;
					}
					break;
				}
			}
		}
	},
	onBipai_function(data){
		cc.log("onBipai:" + JSON.stringify(data));
		var winnerPositionServer = data["winner"];
		this.sumBet = data["all_chip"];
		var playerPositionServer1 = data["position1"];
		var playerPositionServer2 = data["position2"];

		var loserPositionServer=null;
		if(playerPositionServer1 == winnerPositionServer){
			loserPositionServer = playerPositionServer2;
		}else{
			loserPositionServer = playerPositionServer1;
		}
		cc.log("loserPositionServer:" + loserPositionServer);

		//置房间状态为比牌状态并定时重置回来
		this.comparableState=true;
		var delayCompare = new cc.DelayTime(4.8);
		var callbackSetRoomStateCompare = cc.callFunc(this.setRoomStateCompare,this);
		this.node.runAction(cc.sequence(delayCompare,callbackSetRoomStateCompare));

		//停止当前定时器进度条
		var tmp_allplayers = g_players_noPower.concat(g_players);
		for(var i = 0;i < tmp_allplayers.length;i++){
			var player_com = tmp_allplayers[i].getComponent("zjh_player");
			if(player_com.position_server == this.currentGetPowerPlayerPosition){
				player_com.stop_timer();
				break;
			}
		}

		//和自己相关的比牌时，为避免影响比牌的动作动画，先关闭开牌和弃牌按钮，比牌完毕再回复
		if(playerPositionServer1 == g_myselfPlayerPos ||playerPositionServer2 == g_myselfPlayerPos){
			this.bipai_button.getComponent(cc.Button).interactable = false;
			this.jiazhu_button.getComponent(cc.Button).interactable = false;
			this.genzhu_button.getComponent(cc.Button).interactable = false;
			this.qipai_button.getComponent(cc.Button).interactable = false;
			this.kaipai_button.getComponent(cc.Button).interactable = false;
		}

		//发起比牌的玩家执行跟注动作
		cc.log("start 发起比牌的玩家执行跟注动作" + tmp_allplayers.length);
		for(var i = 0;i < tmp_allplayers.length;i++){
			var player = tmp_allplayers[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.position_server == playerPositionServer1){
				player_com.resetMoneyLabel(parseInt(data["my_gold"]));
				this.actionFollowBet(player.getPosition(),player_com.check_card);
				break;
			}
		}
		//执行比牌动画
		this.actionBiPai(playerPositionServer1,playerPositionServer2,loserPositionServer);
	},
	onEnd_function(data){
		cc.log("onEnd:" + JSON.stringify(data));
		var all_players = g_players.concat(g_players_noPower);
		var playerPositionServer = data["winner"];
		for(var i = 0;i < all_players.length;i++){
			var player = all_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.position_server == playerPositionServer){
				//如果房间属于比牌状态，需要等到比牌动作完成才执行获取金币动作
				if(this.comparableState == true){
					if(this.bipai_ui.isValid == true){
						var compareTime = 4.8 - this.bipai_ui.getComponent("zjh_compare").get_cur_time();

						var waitGetBetTime=new cc.DelayTime(compareTime);
						var callBackWinnerGetBet= cc.callFunc(
							this.actionWinnerGetBet,this,player.getPosition());
						this.runAction(cc.sequence(waitGetBetTime,callBackWinnerGetBet));
						cc.log("compareTime:" + compareTime);
					}else{
						this.actionWinnerGetBet(this,player.getPosition());
					}
				}else{
					this.actionWinnerGetBet(this,player.getPosition());
				}
				player_com.resetMoneyLabel(player_com.my_gold + parseInt(data["all_chip"]));
				break;
			}
		}
		/* 结束则把玩家放入noPower中*/
		for(var i = 0;i < g_players.length;i++){
			g_players_noPower.push(g_players[i]);
		}
		g_players.splice(0,g_players.length);
	},
	onEndPai_function(data){
		cc.log("onEndPai:"+JSON.stringify(data));
		//获胜者的牌型
		var winnerCardType = data["winner_pai"];
		var tmp_allplayers = g_players_noPower.concat(g_players);
		//位置1的牌型
		for(i = 1; i < 6; i++){
			var cardString = data["location" + i];
			if(cardString != null&& cardString !="null" && g_myselfPlayerPos != i){
				console.log("location:num:" + i);
				cardString=JSON.parse(cardString);
				var tmp_card = new Array();
				
				var suit1=cardString["s1"];
				var rank1=cardString["p1"];
				var suit2=cardString["s2"];
				var rank2=cardString["p2"];
				var suit3=cardString["s3"];
				var rank3=cardString["p3"];
				for(var j = 0;j < tmp_allplayers.length;j++){
					var player = tmp_allplayers[j];
					var player_com = player.getComponent("zjh_player");
					if(player_com.position_server == i){
						for(var m = 0;m < 3;m++){
							var card = player_com.my_cards[m].getComponent("zjh_card");
							card.initCardSprite(parseInt(cardString["s" + (m + 1)]),parseInt(cardString["p" + (m + 1)]));
						}
						break;
					}
				}
			}
		}
		/*打开所有牌的*/
		//如果房间属于比牌状态，需要等到比牌动作完成才执行打开所有牌的动作
		if(this.comparableState == true){
			if(this.bipai_ui.isValid == true){
				var compareTime = 1.5 + 4.8 - this.bipai_ui.getComponent("zjh_compare").get_cur_time();
				var waitGetBetTime=new cc.DelayTime(compareTime);
				var callbackOpenAllCard = cc.callFunc(this.openAllCard,this,winnerCardType);
				this.runAction(cc.sequence(waitGetBetTime,callbackOpenAllCard));
				console.log("compareTime:"+compareTime);
			}else{
				this.openAllCard(null,winnerCardType);
			}
			console.log("room is comparing...........................................");
		}else{
			this.openAllCard(null,winnerCardType);
		}
	},
	onUserBroadcast_function(data){
		console.log("onUserBroadcast:"+JSON.stringify(data));
		var msage_scroll_com = this.msage_scroll.getComponent("msage_scroll");
		msage_scroll_com.set_string(data);
	},
	onNoRound_function(data){
		console.log("onNoRound:"+JSON.stringify(data));
		var size = cc.director.getVisibleSize();
		var golds_info = data["golds"];
		var tplayers = new Array();
		for(var key in golds_info){
			tplayers.push(golds_info[key]);
		}
		var pop_game_finish = cc.instantiate(g_assets["pop_game_finish"]);
		var pop_game_finish_com = pop_game_finish.getComponent("pop_game_finish");
		pop_game_finish_com.init_info(tplayers);
		var x = size.width/2;
		var y = size.height/2;
		this.node.addChild(pop_game_finish);
		pop_game_finish.setPosition(this.node.convertToNodeSpaceAR(cc.p(x,y)));
	},
	onGetUinfo_function(data){
		console.log("onNoRound:"+JSON.stringify(data));
		var size = cc.director.getWinSize();
		//显示玩家信息
		if(data["send_from"] == g_myselfPlayerPos){
			this.uinfo = cc.instantiate(g_assets["pop_game_user"]);
			var uinfo_com = this.uinfo.getComponent("pop_game_user");
			
			uinfo_com.init_info(data,this.actionSendGift);
			this.node.addChild(this.uinfo);
			this.uinfo.setPosition(this.node.convertToNodeSpaceAR(cc.p(size.width/2,size.height/2)));
		}
	},
	actionSendGift(pnode,type,send_from,send_to){
		cc.log("actionSendGift",type,send_from,send_to);
		var s_player = null;
		var e_player = null;
		var all_players = g_players.concat(g_players_noPower);
		if(send_from == send_to){
			return false;
		}
		for(var i = 0;i < all_players.length;i++){
			var player_com = all_players[i].getComponent("zjh_player");
			if(player_com.position_server == send_from){
				s_player = all_players[i];
			}
			if(player_com.position_server == send_to){
				e_player = all_players[i];
			}
		}
		var active = null;
		var active_name = null;
		//送鸡蛋
		if(type == 1){
			active = cc.instantiate(g_assets["shoe_active"]);
			active_name = "shoe_active";
		}else if(type == 2){
			active = cc.instantiate(g_assets["egg_active"]);
			active_name = "egg_active";
		}else if(type == 3){
			active = cc.instantiate(g_assets["bomb_active"]);
			active_name = "bomb_active";
		}else if(type == 4){
			active = cc.instantiate(g_assets["kiss_active"]);
			active_name = "kiss_active";
		}else if(type == 5){
			active = cc.instantiate(g_assets["flower_active"]);
			active_name = "flower_active";
		}else if(type == 6){
			active = cc.instantiate(g_assets["cheers_active"]);
			active_name = "cheers_active";
		}
		pnode.addChild(active);
		active.setPosition(s_player.getPosition());
		
		var move = cc.moveTo(0.5,e_player.getPosition());
		var rotation = cc.rotateBy(0.5,360);
		var spawn = cc.spawn(move,rotation);
		var self = this;
		var sendAction = cc.callFunc(function(){
			var anim = active.getComponent(cc.Animation);
			anim.on('finished',  function(){
				active.destroy();
			},null);
			var animStatus = anim.play(active_name);
			// 设置循环模式为 Normal
			animStatus.wrapMode = cc.WrapMode.Normal;
			// 设置循环模式为 Loop
			animStatus.wrapMode = cc.WrapMode.Loop;
			// 设置动画循环次数为2次
			animStatus.repeatCount = 1;
		});
		active.runAction(cc.sequence(spawn,sendAction));
	},
	actionFaPai(){
    	var size=cc.director.getVisibleSize();
    	var isFind=false;
    	var playerArrayPosition=-1;
    	cc.log("start into actionDealCards........startDealCardPosition1:" + this.startDealCardPosition1);
		cc.log("start into actionDealCards........startDealCardPosition:" + this.startDealCardPosition);
    	if(this.startDealCardPosition1==this.startDealCardPosition){this.fapai_count++}
    	if(this.fapai_count > 3){
			for(var i = 0;i < g_players.length;i++){
				var player = g_players[i];
				var player_com = player.getComponent("zjh_player");
				if(player_com.position_server == g_myselfPlayerPos){
					this.setPlayerCardsPosition(player,3);
					break;
				}
			}
    		this.fapai_count=0;
    		this.startDealCardPosition1 = this.startDealCardPosition;
    		var acMoveUp = cc.moveBy(0.5,cc.p(0,g_dealCardBack.getContentSize().height/2));
    		var acMoveUp1 = new cc.EaseIn(acMoveUp,10);
    		var acInitMenuItemCallback = cc.callFunc(this.startFirstRotationPosition,this);
    		g_dealCardBack.runAction(cc.sequence(acMoveUp1, acInitMenuItemCallback));
    		return;
    	}
    	for(var i = 0;i < g_players.length;i++){
			var player_com = g_players[i].getComponent("zjh_player");
    		if(player_com.position_server == this.startDealCardPosition1){
    			playerArrayPosition = i;
    			isFind=true;
    			break;
    		}
    	}
		if(isFind == true){
			if(playerArrayPosition == -1){
				cc.log("outside error.......................actionDealCards:function()");
				return;
			}

			this.startDealCardPosition1++;
			this.startDealCardPosition1 = this.startDealCardPosition1%5;
			if(this.startDealCardPosition1==0){
				this.startDealCardPosition1 = 5;
			}
			var player = g_players[playerArrayPosition];
			var player_com = player.getComponent("zjh_player");
			var position = this.calc_player_card_position(player,this.fapai_count - 1);
			cc.log("position:x:" + position.x + " y:" + position.y);
			var acMoveDown1 = cc.moveTo(0.2,this.node.convertToNodeSpaceAR(cc.p(size.width/2,size.height/2)));
			var acToCardPlayer = cc.moveTo(0.1,position);
			var callFunc = cc.callFunc(this.actionFaPai,this);
			var card = player_com.my_cards[this.fapai_count - 1];
			card.runAction(cc.sequence(acMoveDown1,acToCardPlayer,callFunc));
		}else{
			this.startDealCardPosition1++;
			this.startDealCardPosition1 = this.startDealCardPosition1%5;
			if(this.startDealCardPosition1==0){
				this.startDealCardPosition1 = 5;
			}
			this.actionFaPai();
		}
    },
	actionBiPai(playerPositionServer1,playerPositionServer2,loserPositionServer){
		cc.log("go into actionBiPai .......");
    	var size = cc.director.getWinSize();
		var left_player = null;
		var right_player = null;
		
		for(var i = 0;i < g_players.length;i++){
			var player_com = g_players[i].getComponent("zjh_player");
			if(player_com.position_server == playerPositionServer1){
				left_player = g_players[i];
			}
			if(player_com.position_server == playerPositionServer2){
				right_player = g_players[i];
			}
		}
		//获取三张牌的位置，供以后用
    	var cardPosition = new Array(3);
		var left_player_com = left_player.getComponent("zjh_player");
    	cardPosition[0] = left_player_com.my_cards[0].getPosition();
    	cardPosition[1] = left_player_com.my_cards[1].getPosition();
    	cardPosition[2] = left_player_com.my_cards[2].getPosition();
    	var cardPositionOther = new Array(3);
		var right_player_com = right_player.getComponent("zjh_player");
    	cardPositionOther[0] = right_player_com.my_cards[0].getPosition();
    	cardPositionOther[1] = right_player_com.my_cards[1].getPosition();
    	cardPositionOther[2] = right_player_com.my_cards[2].getPosition();
		
		
		//添加比牌背景UI
		this.bipai_ui = cc.instantiate(g_assets["zjhbipai_scene"]);
		var bipai_ui_com = this.bipai_ui.getComponent("zjh_compare");
		bipai_ui_com.init_info(left_player_com.nick_name,right_player_com.nick_name);
		this.node.addChild(this.bipai_ui);
		this.bipai_ui.setPosition(this.node.convertToNodeSpaceAR(cc.p(size.width/2,size.height/2)));
		//左面的牌动作
		for(var j = 0;j < 3;j++){
			//移动到比牌位置动作
			var card_pos = bipai_ui_com.get_card_position(bipai_ui_com.left_cards[j]);
			var bipai_position = cc.p(size.width/2 + card_pos.x,size.height/2 + card_pos.y);
			var moveToBiPaiPosition = cc.moveTo(1.5,card_pos);
			//移动到原来的位置
			var moveToOriginPosition = cc.moveTo(1.5,cardPosition[j]);
			var _seqBack=cc.sequence(moveToBiPaiPosition,cc.delayTime(2),moveToOriginPosition);
			left_player_com.my_cards[j].runAction(_seqBack);
		}
		//右面的牌动作
		for(var j = 0;j < 3;j++){
			//移动到比牌位置动作
			var card_pos = bipai_ui_com.get_card_position(bipai_ui_com.right_cards[j]);
			var bipai_position = cc.p(size.width/2 + card_pos.x,size.height/2 + card_pos.y);
			var moveToBiPaiPosition = cc.moveTo(1.5,card_pos);
			//移动到原来的位置
			var moveToOriginPosition = cc.moveTo(1.5,cardPositionOther[j]);
			var _seqBack=cc.sequence(moveToBiPaiPosition,cc.delayTime(2),moveToOriginPosition);
			right_player_com.my_cards[j].runAction(_seqBack);
		}
    	bipai_ui_com.bipai_start(1.5);
    	/*回调提示比牌失败者*/
		cc.log("start go into displayLoser .......");
    	var displayWaitTime = new cc.DelayTime(4.8);
    	var setDisplayLoserCallback = cc.callFunc(this.displayLoser,this,loserPositionServer);
    	this.node.runAction(cc.sequence(displayWaitTime,setDisplayLoserCallback));
		cc.log("end go into displayLoser .......");
    },
	actionBottomBet(player_position){
       var size=cc.director.getVisibleSize();
       var countNumber=-1;
       for(var j=0;j < g_betArray.length;j++){
           if(this.bet == g_betArray[j]){
               j++;
               countNumber = j;
               break;
           }
       }
       if(countNumber==-1){
           cc.log("error........outside actionBottomBet:function");
           return;
       }
	   var chip = cc.instantiate(g_assets["chip_" + this.bet]);
       this.node.addChild(chip);
       this.betPhotoArray.push(chip);
	   chip.setPosition(player_position);
       var x=size.width/3+size.width/3*Math.random();
       var y=size.height/2 + 150 *Math.random();
	   var move_pos = this.node.convertToNodeSpaceAR(cc.p(x,y));
       var moveBet=cc.moveTo(0.3,move_pos);
       chip.runAction(moveBet);
	},
	actionFollowBet(player_position,isCheckCard){
		cc.log("go into actionFollowBet......" + isCheckCard);
        var size=cc.director.getWinSize();
        var countNumber=-1;
        for(var j=0;j<g_betArray.length;j++){
            if(this.bet==g_betArray[j]){
                j++;
                countNumber=j;
                break;
            }
        }
		var chipNum = 1;
		if(isCheckCard == true){
			chipNum = 2;
		}
		//如果等于-1 说明没有单独的筹码符合 需要组合筹码
        if(countNumber==-1){
			cc.log("error........outside actionFollowBet:function");
			return;
        }
        
        while(chipNum > 0){
			var chip = cc.instantiate(g_assets["chip_" + this.bet]);
			this.node.addChild(chip);
			this.betPhotoArray.push(chip);
			chip.setPosition(player_position);
			var x=size.width/3+size.width/3*Math.random();
			var y=size.height/2 + 150 *Math.random();
			var move_pos = this.node.convertToNodeSpaceAR(cc.p(x,y));
			var moveBet=cc.moveTo(0.3,move_pos);
			chip.runAction(moveBet);
            chipNum--;
        }
    },
	openAllCard:function(mythis,winnerCardType){
        //打开自己的牌
		var tmp_allplayers = g_players_noPower.concat(g_players);
		for(var i=0;i<tmp_allplayers.length;i++){
			var player = tmp_allplayers[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.position_server == g_myselfPlayerPos){
				if(player_com.check_card == false && player.is_power == 2){
                    for(var j=0;j<3;j++){
						var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
						var backCamera = cc.rotateBy(0.45,0,-90);
						var backSpawn = cc.spawn(backCardSeq,backCamera);
						var frontSeq = cc.sequence(cc.delayTime(0.45),cc.show());
						var frontCamera = cc.rotateBy(0.6,0,-360);
						var frontSpawn = cc.spawn(frontSeq,frontCamera);
						var card = player_com.my_cards[j].getComponent("zjh_card");
                        card.sprite_back.node.runAction(backSpawn);
                        card.sprite.runAction(frontSpawn);
                    }
                }
                break;
            }
        }

        for(var i=0;i<tmp_allplayers.length;i++){
			var player = tmp_allplayers[i];
			var player_com = player.getComponent("zjh_player");
            if(player_com.position_server != g_myselfPlayerPos && player_com.is_power == 2){
            	for(var j=0;j<3;j++){
            		var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
					var backCamera = cc.rotateBy(0.45,0,-90);
					var backSpawn = cc.spawn(backCardSeq,backCamera);
					var frontSeq = cc.sequence(cc.delayTime(0.45),cc.show());
					var frontCamera = cc.rotateBy(0.6,0,-360);
					var frontSpawn = cc.spawn(frontSeq,frontCamera);
					var card = player_com.my_cards[j].getComponent("zjh_card");
					card.sprite_back.node.runAction(backSpawn);
					card.sprite.runAction(frontSpawn);
            	}
            }
        }
    },
	calc_player_card_position:function(player,m){
		var player_com = player.getComponent("zjh_player");
		var x = 0;
		var y = 0;
		if(player_com.player_position == 1){
			x = player.getPositionX() + player_com.mobile_sprite.node.getContentSize().width + g_dealCardBack.getContentSize().width/2*(m);
			y = player.getPositionY();
		}else if(player_com.player_position == 2){
			x = player.getPositionX() - (3-m)*30;
			y = player.getPositionY() + player_com.mobile_sprite.node.height + 30;
		}else if(player_com.player_position == 3){
			x = player.getPositionX() - (3-m)*30;
			y = player.getPositionY() - player_com.mobile_sprite.node.height - 30;
		}else if(player_com.player_position == 4){
			x = player.getPositionX() + m*30;
			y = player.getPositionY() - player_com.mobile_sprite.node.height - 30;
		}else if(player_com.player_position == 5){
			x = player.getPositionX() + m*30;
			y = player.getPositionY() + player_com.mobile_sprite.node.height + 30;
		}
		cc.log("calc x:" + x + " y:" + y);
		return cc.p(x,y);
	},
	setPlayerCardsPosition:function(player,card_len){
		var player_com = player.getComponent("zjh_player");
		for(var m = 0;m < card_len;m++){
			var position = this.calc_player_card_position(player,m);
			var card = player_com.my_cards[m];
			card.setPosition(position);
		}
	},
	setPlayerCardsBackPosition:function(player,card_len){
		var player_com = player.getComponent("zjh_player");
		for(var m = 0;m < card_len;m++){
			var position = this.calc_player_card_position(player,m);
			var card = player_com.my_cards[m].getComponent("zjh_card");
			card.sprite_back.node.setPosition(this.node.convertToNodeSpaceAR(position));
		}
	},
	startFirstRotationPosition:function (){
    	var rotationPlayerIndexOf=-1;
    	for(var i=0;i<g_players.length;i++){
			var player_com = g_players[i].getComponent("zjh_player");
    		if(player_com.position_server == this.currentGetPowerPlayerPosition){
				player_com.start_timer();
    			break;
    		}
    	}
    	if(this.currentGetPowerPlayerPosition == g_myselfPlayerPos){
			this.bipai_button.getComponent(cc.Button).interactable = true;
			this.genzhu_button.getComponent(cc.Button).interactable = true;
			this.jiazhu_button.getComponent(cc.Button).interactable = true;
    	}
		this.kaipai_button.getComponent(cc.Button).interactable = true;
		this.qipai_button.getComponent(cc.Button).interactable = true;
    },
	displayLoser(mythis,loserPositionServer){
    	var tmp_allplayers = g_players_noPower.concat(g_players);
        for(var i=0;i < g_players.length;i++){
			var player_com = g_players[i].getComponent("zjh_player");
            if(player_com.position_server == loserPositionServer){
            	player_com.setSpriteStatus("loser");
				g_players_noPower.push(g_players[i]);
				g_players.splice(i,1);
                break;
            }
        }
    },
	setRoomStateCompare(){
        this.comparableState=false;
    },
	actionWinnerGetBet(my_this,playerPosition){
        for(var j in this.betPhotoArray){
            var getBetAction =  cc.moveTo(1.0, playerPosition);
            this.betPhotoArray[j].runAction(cc.sequence(getBetAction,cc.hide()));
        }
		//初始化房间状态为非游戏状态
        this.roomState=0;
        //置按钮为不可点击
		this.initButtonEnableAfterComeInRoom();

        //关闭定时器
        var tmp_allplayers = g_players_noPower.concat(g_players);
        for(var i=0;i < tmp_allplayers.length;i++){
			var player_com = tmp_allplayers[i].getComponent("zjh_player");
            if(player_com.position_server == this.currentGetPowerPlayerPosition){
            	player_com.stop_timer();
                break;
            }
        }
    },
	biPaiSelectCallBack(index){
		var localtion1 = g_myselfPlayerPos;
		var localtion2 = null;
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zjh_player");
			if(player_com.player_position == (index + 1)){
				localtion2 = player_com.position_server;
				break;
			}
		}
		if(localtion2 != null){
			pomelo.request(util.getGameRoute(), {
				process: "bipai",
				location1: g_myselfPlayerPos,
				location2: localtion2
			}, function (data) {
				cc.log(JSON.stringify(data));
			});
		}
	},
	pomelo_removeListener(){
		cc.log("remove listener");
        pomelo.removeListener('onReady');
		pomelo.removeListener('onGetUinfo');
        pomelo.removeListener('onFollow');
        pomelo.removeListener('onAddChip');
        pomelo.removeListener('onAdd');
        pomelo.removeListener('onOpen');
        pomelo.removeListener('onThrow');
        pomelo.removeListener('onBipai');
		pomelo.removeListener('onNoRound');
        pomelo.removeListener('onLeave');
        pomelo.removeListener('onEnd');
        pomelo.removeListener('onFapai');
        pomelo.removeListener('onShoupai');
        pomelo.removeListener('onChangePlayer');
        pomelo.removeListener('onEndPai');
		pomelo.removeListener('onActBroadcast');
		
        //pomelo.removeListener('onChatInGame',onChatInGame_function);
        //pomelo.removeListener('onActBroadcast',onActBroadcast_function);
        //pomelo.removeListener('onUserBroadcast',onUserBroadcast_function);
    },

	onExit(){
        g_dealCardBack.destroy();
        g_playerData.splice(0,g_playerData.length);
        g_roomData.splice(0,g_roomData.length);
		g_players.splice(0,g_players.length);
		g_players_noPower.splice(0,g_players_noPower.length);
		console.log("exit from the room......");
        //释放资源
        //this.releaseMember();

        //注销监听接口
        this.pomelo_removeListener();
		this.destroy();
    },
	
});
