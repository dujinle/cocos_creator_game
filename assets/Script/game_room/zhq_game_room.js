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
		lastPosition:-1,
		comparableState:false,
		currentGetPowerPlayerPosition:0,
		//head label info
		master_label:cc.Label,
		room_num_label:cc.Label,
		danzhu_label:cc.Label,
		zongzhu_label:cc.Label,
		huihe_label:cc.Label,
		//buttons for game
		start_button:cc.Node,
		zhunbei_button:cc.Node,
		touxiang_button:cc.Node,
		butouxiang_button:cc.Node,
		jiefeng_button:cc.Node,
		chupai_button:cc.Node,
		buchupai_button:cc.Node,
		liangA_button:cc.Node,
		players:{
			type:cc.Node,
			default:[],
		},
		lastPai:{
			type:cc.Node,
			default:[],
		}
    },

    onLoad () {
		this.bet = g_betArray[0];
        this.sumBet =0;
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
		this.schedule(this.showRoomMessageUpdate,1.0/60,cc.REPEAT_FOREVER,0);
		this.node.on("pressed", this.switchRadio, this);
	},
	start(){
		cc.log("go into zhq game room scene start");
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
	initButtonEnableAfterDealCards:function(){
        this.start_button.getComponent(cc.Button).interactable = false;
		this.zhunbei_button.getComponent(cc.Button).interactable = true;
		this.liangA_button.getComponent(cc.Button).interactable = true;
    },
	initButtonEnableAfterComeInRoom(){
		this.start_button.getComponent(cc.Button).interactable = true;
		this.zhunbei_button.getComponent(cc.Button).interactable = false;
		this.touxiang_button.getComponent(cc.Button).interactable = false;
		this.butouxiang_button.getComponent(cc.Button).interactable = false;
		this.jiefeng_button.getComponent(cc.Button).interactable = false;
		this.chupai_button.getComponent(cc.Button).interactable = false;
		this.buchupai_button.getComponent(cc.Button).interactable = false;
		this.liangA_button.getComponent(cc.Button).interactable = false;
    },
	initButtonEnableChuPai(){
		this.start_button.getComponent(cc.Button).interactable = false;
		this.zhunbei_button.getComponent(cc.Button).interactable = false;
		this.touxiang_button.getComponent(cc.Button).interactable = false;
		this.liangA_button.getComponent(cc.Button).interactable = false;
		this.chupai_button.getComponent(cc.Button).interactable = false;
		this.buchupai_button.getComponent(cc.Button).interactable = false;
		if(this.currentGetPowerPlayerPosition == g_myselfPlayerPos){
			this.chupai_button.getComponent(cc.Button).interactable = true;
		}
	},
    initPlayersAndPlayer_noPower(){
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
			var player_com = player.getComponent("zhq_player");
			player_com.init(player_stc);
			player_com.player_position = i + 1;
			g_players.push(player);
			player.active = true;
		}
	},
    init_count_timer(){
    	for(var i = 0;i < g_players.length;i++){
			var player_com = g_players[i].getComponent("zhq_player");
			if(player_com.position_server == g_myselfPlayerPos){
				player_com.start_timer();
    			break;
    		}
    	}
    },

	
	//按钮回调函数
	callback_start(){
		this.start_button.getComponent(cc.Button).interactable = false;
		pomelo.request(util.getGameRoute(),{
			process:"start",
			location:g_myselfPlayerPos
        },function(data){
            console.log(data.msg);
        });
	},
	callback_zhunbei(){
		this.zhunbei_button.getComponent(cc.Button).interactable = false;
		pomelo.request(util.getGameRoute(),{
			process:"ready",
			location:g_myselfPlayerPos
		},function(data){
			cc.log(data.msg);
		});
    },
	callback_jiefeng() {
		this.jiefeng_button.getComponent(cc.Button).interactable = false;
		pomelo.request(util.getGameRoute(),{
			process:"jiefeng",
			location:g_myselfPlayerPos
        },function(data){
            console.log(data.msg);
        });
    },
	callback_touxiang(){
		pomelo.request(util.getGameRoute(),{
			process:"throw",
			flag:true,
			location:g_myselfPlayerPos
        },function(data){
            console.log(data.msg);
        });
		this.touxiang_button.getComponent(cc.Button).interactable = false;
    },	
	callback_butouxiang(){
		pomelo.request(util.getGameRoute(),{
			process:"throw",
			flag:false,
			location:g_myselfPlayerPos
        },function(data){
            console.log(data.msg);
        });
		this.butouxiang_button.getComponent(cc.Button).interactable = false;
    },
	callback_chupai(){
		var playerPosition = -1;
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == g_myselfPlayerPos){
				playerPosition = i;
				break;
			}
		}
		var player = g_players[playerPosition];
		var player_com = player.getComponent("zhq_player");
		var selectCards = player_com.selected_cards;
		if(selectCards.length > 0){
			this.chupai_button.getComponent(cc.Button).interactable = false;
			this.buchupai_button.getComponent(cc.Button).interactable = false;
			var mark = {"p":[],"s":[]};
			for(var i = 0;i < selectCards.length;i++){
				var card_com = selectCards[i].getComponent("zhq_card");
				mark["p"].push(card_com.rank);
				mark["s"].push(card_com.suit);
			}
			pomelo.request(util.getGameRoute(),{
				process:"chupai",
				chupai:mark,
				location:g_myselfPlayerPos
			},function(data){
				console.log(data.msg);
			});
		}else{
			this.show_error_info("请选择要出的牌");
		}
	},
	callback_buchupai(){
		this.chupai_button.getComponent(cc.Button).interactable = false;
		this.buchupai_button.getComponent(cc.Button).interactable = false;
		pomelo.request(util.getGameRoute(),{
			process:"pass",
			location:g_myselfPlayerPos
		},function(data){
			console.log(data.msg);
		});
	},
	callback_liangA(){
		var playerPosition = -1;
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == g_myselfPlayerPos){
				playerPosition = i;
				break;
			}
		}
		var player = g_players[playerPosition];
		var player_com = player.getComponent("zhq_player");
		var selectCards = player_com.selected_cards;
		var mark = {"p":[],"s":[]};
		if(selectCards.length == 1){
			var card_com = selectCards[0].getComponent("zhq_card");
			if(card_com.rank == 14 && (card_com.suit == 2 || card_com.suit == 4)){
				this.liangA_button.getComponent(cc.Button).interactable = false;
				mark["p"] = [card_com.rank];
				mark["s"] = [card_com.suit];
			}else{
				this.show_error_info("请选择一张黑A 或者3张相同大小的牌");
				return false;
			}
		}else if(selectCards.length == 3){
			var card_com = selectCards[0].getComponent("zhq_card");
			var pref = card_com.rank;
			for(var j = 1;j < selectCards.length;j++){
				var card_com = selectCards[j].getComponent("zhq_card");
				if(card_com.rank != pref){
					this.show_error_info("请选择一张黑A 或者3张相同大小的牌");
					pref = -1;
					return false;
				}
				mark["p"].push(card_com.rank);
				mark["s"].push(card_com.suit);
			}
			this.liangA_button.getComponent(cc.Button).interactable = false;
		}else if(selectCards.length == 2){
			var card_com = selectCards[0].getComponent("zhq_card");
			var card_com_1 = selectCards[1].getComponent("zhq_card");
			if(card_com.rank != card_com_1.rank && card_com.rank != 14){
				return false;
			}
			if(card_com.suit != 2 && card_com.suit != 4){
				return false;
			}
			if(card_com_1.suit != 2 && card_com_1.suit != 4){
				return false;
			}
			this.liangA_button.getComponent(cc.Button).interactable = false;
			mark["p"] = [card_com.rank,card_com_1.rank];
			mark["s"] = [card_com.suit,card_com_1.suit];
		}else{
			this.show_error_info("请选择一张黑A 或者3张相同大小的牌");
			return false;
		}
		pomelo.request(util.getGameRoute(),{
			process:"liangA",
			mark:mark,
			location:g_myselfPlayerPos
		},function(data){
			console.log(data.msg);
		});
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
            cc.log("-----quit------"+JSON.stringify(data));
			self.onExit();
            cc.director.loadScene("MainScene");
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
		pomelo.on('onStart',this.onStart_function.bind(this));
    	pomelo.on('onReady',this.onReady_function.bind(this));
		pomelo.on('onAdd',this.onAdd_function.bind(this));
		pomelo.on('onNoRound',this.onNoRound_function.bind(this));
		pomelo.on('onGetUinfo',this.onGetUinfo_function.bind(this));
		pomelo.on('onFaPai',this.onFapai_function.bind(this));
		pomelo.on('onShoupai',this.onShoupai_function.bind(this));
		pomelo.on('onShoupaiFirst',this.onShoupaiFirst_function.bind(this));
		pomelo.on('onPass',this.onPass_function.bind(this));
		pomelo.on('onJieFeng',this.onJieFeng_function.bind(this));
		pomelo.on('onChuPai',this.onChuPai_function.bind(this));
		pomelo.on('onChuPaiTip',this.onChuPaiTip_function.bind(this));
		pomelo.on('onMarkA',this.onMarkA_function.bind(this));
		pomelo.on('onThrow',this.onThrow_function.bind(this));
		pomelo.on('onFinish',this.onFinish_function.bind(this));
		pomelo.on('onStartChuPai',this.onStartChuPai_function.bind(this));
		pomelo.on('onLeave',this.onLeave_function.bind(this));
		pomelo.on('onChangePlayer',this.onChangePlayer_function.bind(this));
		pomelo.on('onActBroadcast',this.onUserBroadcast_function.bind(this));
    },
	onStart_function(data){
		console.log("pomelo onStart:" + data.location);
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == data.location){
				player_com.is_power = 1;
				player_com.setSpriteStatus("start");
				player_com.stop_timer();
				//准备状态表示
				break;
			}
		}
	},
	onReady_function(data){
		cc.log("pomelo on Ready:" + data.location+" is ready");
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == data.location){
				player_com.is_power = 3;
				player_com.setSpriteStatus("yizhunbei");
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
		var player_com = player.getComponent("zhq_player");
		player_com.init(t_player);
		player_com.player_position = idx + 1;
		g_players.push(player);
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
			this.roomState = 1;
			for(var i = 0;i < this.betPhotoArray.length;i++){
				this.betPhotoArray[i].removeFromParent();
			}
			this.betPhotoArray.length = 0;
			//更新玩家信息
			for(var i=0;i<g_players.length;i++){
				//清除玩家手中上一局的牌，
				var player_com = g_players[i].getComponent("zhq_player");
				player_com.remove_cards();
			}
			this.bet = g_betArray[0];
			this.fapai_count = 0;

			/*初始化玩家手中的牌（背面），权限isPower,开牌checkCard弃牌abandon,失败提示精灵loserSprite*/
			for(var i=0;i < g_players.length;i++){
				var player_com = g_players[i].getComponent("zhq_player");
				player_com.is_power = 2;
				player_com.abandon = false;
				player_com.hide_status_sprite();
			}
			//玩家收牌状态更新
			for(var i=0;i < g_players.length;i++){
				var player = g_players[i];
				var player_com = player.getComponent("zhq_player");
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
		var card_len = cardType["p"].length;
		this.fapai_count = cardType["p"].length;

		for(var i = 0;i < card_len;i++){
			var suit=cardType["s"][i];
			var rank=cardType["p"][i];
			var card = new Array();
			card.push(suit);
			card.push(rank);
			this.myselfCards.push(card);
		}
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == g_myselfPlayerPos){
				continue;
			}
			player_com.init_cards(7);
			this.setPlayerCardsPosition(player,7);
		}
		this.actionFaPai();
	},
	onShoupaiFirst_function(data){
		console.log("onShoupaiFirst:" + JSON.stringify(data));
		//初始化myselfCards数组
		this.myselfCards.splice(0,this.myselfCards.length);

		var cardType = data["paixing"];

		for(i = 0;i < 6;i++){
			var suit = cardType["s"][i];
			var rank = cardType["p"][i];
			var card = new Array();
			card.push(suit);
			card.push(rank);
			this.myselfCards.push(card);
		}
		//其他玩家的牌放入Involvement中
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == g_myselfPlayerPos){
				continue;
			}
			player_com.init_cards(6);
			this.setPlayerCardsPosition(player,player_com.my_cards.length);
			this.myselfCardsReach = true;
		}
		//给玩家发牌动作，由于服务器还没有给开始发牌位置信息，目前默认为从客户端位置最小的开始发牌
		//this.actionFapai(6);
		//this.setContinueFapaiMenu();
	},
	onPass_function(data){
		console.log("onPass:" + JSON.stringify(data));
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == data.location){
				player_com.setSpriteStatus("buchupai");
				break;
			}
		}
	},
	onJieFeng_function(data){
		console.log("onJieFeng:" + JSON.stringify(data));
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == data.location){
				player_com.setSpriteStatus("jiefeng");
				break;
			}
		}
	},
	onChuPai_function(data){
		console.log("onChuPai:" + JSON.stringify(data));
		var paiXing = data["pai"];
		var locationServer = data["location"];
		var nextPositionServer = data["next"];
		var status = data["status"];
		var playerIndexOf=-1;
		for(var i=0;i<g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == locationServer){
				playerIndexOf = i;
				break;
			}
		}
		if(playerIndexOf==-1){
			console.log("error outside............... pomelo.on('onOpen')");
			return;
		}
		//还原上次玩家出的牌并隐藏起来牌
		if(this.lastPosition != -1){
			console.log("start remove last pai......" + this.lastPosition + " lens:" + this.lastPai.length);
			for(var i = 0;i < this.lastPai.length;i++){
				var card = this.lastPai[i];
				card.destroy();
				//card.runAction(cc.hide());
			}
			this.lastPai.splice(0,this.lastPai.length);
		}
		
		this.lastPosition = locationServer;
		var player = g_players[playerIndexOf];
		var player_com = player.getComponent("zhq_player");
		var size = cc.director.getVisibleSize();
		//其他玩家出牌动作
		if(locationServer != g_myselfPlayerPos){
			//出牌放在桌面中间显示
			for(var i = 0;i < paiXing["p"].length;i++){
				//移动到桌面位置
				console.log("chupai other :" + JSON.stringify(paiXing));
				var suit = paiXing["s"][i];
				var rank = paiXing["p"][i];
				var card = player_com.addPlayerCard();
				var card_com = card.getComponent("zhq_card");
				var position = this.calc_player_card_position(player,player_com.my_cards.length - 1);
				card.setPosition(position);
				card_com.initCardSprite(suit,rank);
				var moveToPos = this.node.convertToNodeSpaceAR(cc.p(size.width/2-(80*(i)),size.height/2));
				var moveToBiPaiPosition = cc.moveTo(0.5,moveToPos);
				card_com.sprite.runAction(cc.show());
				card.runAction(moveToBiPaiPosition);
				this.lastPai.push(card);
				player_com.selected_cards.push(card);
			}
		}else{
			//自己出牌动作
			for(var i = 0;i < player_com.selected_cards.length;i++){
				var card = player_com.selected_cards[i];
				//移动到桌面位置
				var moveToPos = this.node.convertToNodeSpaceAR(cc.p(size.width/2-(80*(i)),size.height/2));
				var moveToBiPaiPosition = cc.moveTo(0.5,moveToPos);
				card.runAction(moveToBiPaiPosition);
				this.lastPai.push(card);
			}
			//重新排列牌
			player_com.remove_select_cards();
			this.setPlayerCardsPosition(player,player_com.my_cards.length);
		}
		//出玩牌了
		if(status == -1){
			if(nextPositionServer == g_myselfPlayerPos){
				this.jiefeng_button.getComponent(cc.Button).interactable = true;
				this.buchupai_button.getComponent(cc.Button).interactable = false;
			}
			player_com.is_power = 0;
			player_com.setSpriteStatus("finish");
		}
	},
	onChuPaiTip_function(data){
		console.log("onChuPaiTip:" + JSON.stringify(data));
		var flag = data["flag"];
		var locationServer = data["location"];
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == g_myselfPlayerPos && g_myselfPlayerPos == this.currentGetPowerPlayerPosition){
				if(player_com.position_server == locationServer && player_com.is_power == 4){
					if(flag == true){
						this.chupai_button.getComponent(cc.Button).interactable = true;
					}else{
						this.chupai_button.getComponent(cc.Button).interactable = false;
					}
				}
				break;
			}
		}
	},
	onMarkA_function(data){
		console.log("onMarkA:" + JSON.stringify(data));
		var markPai = data["mark"];
		var locationServer = data["location"];
		var heiAs = data["heia"];
		this.bet = parseInt(data["chip"]);
		//开始标记宣牌的状态信息
		for(var i = 0;i < heiAs.length;i++){
			var heiLocation = heiAs[i];
			for(var j = 0;j < g_players.length;j++){
				var player = g_players[j];
				var player_com = player.getComponent("zhq_player");
				if(player_com.position_server == heiLocation && heiLocation != g_myselfPlayerPos){
					var lastId = player_com.getNextEmptyCard();
					var card = player_com.my_cards[lastId];
					var card_com = card.getComponent("zhq_card");
					if(i == 0){
						card_com.initCardSprite(4,14);
					}else if(i == 1){
						card_com.initCardSprite(2,14);
					}
					var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
					var backCamera = cc.rotateBy(0.45,0,-90);
					var backSpawn = cc.spawn(backCardSeq,backCamera);
					var frontSeq = cc.sequence(cc.delayTime(0.45),cc.show());
					var frontCamera = cc.rotateBy(0.6,0,-360);
					var frontSpawn = cc.spawn(frontSeq,frontCamera);
					card_com.sprite_back.node.runAction(backSpawn);
					card_com.sprite.runAction(frontSpawn);
					break;
				}
			}
		}
		for(var j = 0;j < g_players.length;j++){
			var player = g_players[j];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == locationServer){
				if(markPai["p"].length >= 3 && locationServer != g_myselfPlayerPos){
					for(var i = 0;i < markPai["p"].length;i++){
						var lastId = player_com.getNextEmptyCard();
						player_com.set_card_sprite(lastId,parseInt(markPai["s"][i]),parseInt(markPai["p"][i]));
						var card = player_com.my_cards[lastId];
						var card_com = card.getComponent("zhq_card");
						
						var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
						var backCamera = cc.rotateBy(0.45,0,-90);
						var backSpawn = cc.spawn(backCardSeq,backCamera);
						var frontSeq = cc.sequence(cc.delayTime(0.45),cc.show());
						var frontCamera = cc.rotateBy(0.6,0,-360);
						var frontSpawn = cc.spawn(frontSeq,frontCamera);
						card_com.sprite_back.node.runAction(backSpawn);
						card_com.sprite.runAction(frontSpawn);
					}
				}
				player_com.resetSelectCard();
			}
			
		}
		this.touxiang_button.getComponent(cc.Button).interactable = true;
	},
	onThrow_function(data){
		cc.log("onThrow:" + JSON.stringify(data));
		var playerPosServer = data["location"];
		var playerPosServers = data["users"];
		var flag = data["status"];
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == playerPosServer){
				if(flag == true){
					player_com.setSpriteStatus("touxiang");
				}else if(flag == false){
					player_com.setSpriteStatus("butouxing");
				}
				break;
			}
		}
		for(var j = 0;j < playerPosServers.length;j++){
			if(playerPosServer == playerPosServers[j]){
				continue;
			}
			if(playerPosServers[j] == g_myselfPlayerPos){
				this.touxiang_button.getComponent(cc.Button).interactable = true;
				this.butouxiang_button.getComponent(cc.Button).interactable = true;
			}
		}
	},
	onFinish_function(data){
		console.log("onFinish:" + JSON.stringify(data));
		var winners = data["winner"];
		var loster = data["lost"];
		var type = data["status"];
		this.bet = data["cur_chip"];
		this.myselfCardsReach = false;
		//和牌
		if(type == 2){
			for(var i=0;i<g_players.length;i++){
				var player = g_players[i];
				var player_com = player.getComponent("zhq_player");
				player_com.setSpriteStatus("equal");
			}
		}else{
			//黑方获胜
			for(var i = 0;i < loster.length;i++){
				var loserLocal = loster[i];
				var winLocal = winners[i];
				var loserPlayer = null;
				var winnerPlayer = null;
				for(var j=0;j<g_players.length;j++){
					var player = g_players[j];
					var player_com = player.getComponent("zhq_player");
					if(player_com.position_server == loserLocal){
						loserPlayer = player;
						player_com.setSpriteStatus("loser");
						player_com.resetMoneyLabel(player_com.my_gold - this.bet);
						break;
					}
				}
				for(var j = 0;j < g_players.length;j++){
					var player = g_players[j];
					var player_com = player.getComponent("zhq_player");
					if(player_com.position_server == winLocal){
						winnerPlayer = player;
						player_com.setSpriteStatus("winner");
						player_com.resetMoneyLabel(player_com.my_gold + this.bet);
						break;
					}
				}
				if(loserPlayer != null && winnerPlayer != null){
					this.actionBottomBet(loserPlayer.getPosition(),winnerPlayer.getPosition());
				}
			}
		}
		this.initButtonEnableAfterComeInRoom();
		if(this.lastPosition != -1){
			console.log("start remove last pai......" + this.lastPosition + " lens:" + this.lastPai.length);
			for(var i = 0;i < this.lastPai.length;i++){
				var card = this.lastPai[i];
				card.destroy();
				//card.runAction(cc.hide());
			}
			this.lastPai.splice(0,this.lastPai.length);
		}
		
		this.lastPosition = -1;
	},
	onStartChuPai_function(data){
		console.log("onStartChuPai:" + JSON.stringify(data));
		var rotationPlayerPositionServer = data["location"];
		//暂停当前玩家定时器,并初始化玩家按钮定时器
		for(var i=0;i<g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.position_server == this.currentGetPowerPlayerPosition){
				player_com.stop_timer();
				break;
			}
		}
		//开启轮换到的玩家 并设置 玩家的状态信息出牌准备 3
		this.currentGetPowerPlayerPosition = rotationPlayerPositionServer;
		var rotationPlayerIndexOf = -1;
		for (var i = 0; i < g_players.length; i++) {
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if (player_com.position_server == rotationPlayerPositionServer) {
				rotationPlayerIndexOf = i;
				player_com.start_timer();
			}
			player_com.is_power = 4;
			player_com.hide_status_sprite();
		}
		if (rotationPlayerIndexOf == -1) {
			console.log("error outside........................................pomelo.on('onChangePlayer')");
			return;
		}
		var player = g_players[rotationPlayerIndexOf];
		var player_com = player.getComponent("zhq_player");
		if(player_com.position_server != g_myselfPlayerPos){
			//设置红桃四的玩家状态
			var flag = false;
			var lastId = player_com.getNextEmptyCard();
			for(var i = 0;i < lastId;i++){
				var card = player_com.my_cards[i];
				var card_com = card.getComponent("zhq_card");
				if(card_com.suit == 3 && card_com.rank == 4){
					flag = true;
					break;
				}
			}
			if(flag == false){
				player_com.set_card_sprite(lastId,3,4);
				var card = player_com.my_cards[lastId];
				var card_com = card.getComponent("zhq_card");
				var backCardSeq = cc.sequence(cc.delayTime(0.45),cc.hide());
				var backCamera = cc.rotateBy(0.45,0,-90);
				var backSpawn = cc.spawn(backCardSeq,backCamera);
				var frontSeq = cc.sequence(cc.delayTime(0.45),cc.show());
				var frontCamera = cc.rotateBy(0.6,0,-360);
				var frontSpawn = cc.spawn(frontSeq,frontCamera);
				card_com.sprite_back.node.runAction(backSpawn);
				card_com.sprite.runAction(frontSpawn);
			}
		}
		player_com.setSpriteStatus("chupai");
		this.initButtonEnableChuPai();
	},	
	onLeave_function(data){
		cc.log("onLeave:" + JSON.stringify(data));
		var playerName = data["user"];
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
			if(player_com.id == playerName){
				cc.log("quit from zjh room g_players");
				player_com.remove_cards();
				player.active = false;
				g_players.splice(i,1);
				break;
			}
		}
		this.playerNum--;
	},
	onChangePlayer_function(data){
		cc.log("onChangePlayer:" + JSON.stringify(data));
		var rotationPlayerPositionServer = data["location"];
		//暂停当前玩家定时器,并初始化玩家按钮定时器
		var tmp_allplayers = g_players_noPower.concat(g_players);
		for(var i=0;i < g_players.length;i++){
			var player_com = g_players[i].getComponent("zhq_player");
			if(player_com.position_server == this.currentGetPowerPlayerPosition){
				player_com.stop_timer();
				break;
			}
		}
		//开启轮换到的玩家
		if(g_players.length >= 2) {
			this.currentGetPowerPlayerPosition = rotationPlayerPositionServer;
			if (rotationPlayerPositionServer == g_myselfPlayerPos) {
				this.chupai_button.getComponent(cc.Button).interactable = true;
				this.buchupai_button.getComponent(cc.Button).interactable = true;
				if(this.lastPosition == this.currentGetPowerPlayerPosition){
					this.buchupai_button.getComponent(cc.Button).interactable = false;
				}
			}
			for (var i = 0; i < g_players.length; i++) {
				var player_com = g_players[i].getComponent("zhq_player");
				if (player_com.position_server == rotationPlayerPositionServer) {
					player_com.start_timer();
					player_com.setSpriteStatus("chupai");
				}else if(player_com.statusTag == "chupai"){
					player_com.hide_status_sprite();
				}
			}
		}
	},
	onUserBroadcast_function(data){
		cc.log("onUserBroadcast:"+JSON.stringify(data));
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
			var player_com = all_players[i].getComponent("zhq_player");
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

	switchRadio(event) {
		var card_com = event.target.getComponent("zhq_card");
        var suit = event.target.getComponent("zhq_card").suit;
		var rank = event.target.getComponent("zhq_card").rank;
		cc.log("switchRadio : suit:" + suit + " rank:" + rank);
		var player_com = null;
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
    		if(player_com.position_server == g_myselfPlayerPos){
    			break;
    		}
    	}
		if(player_com == null){
			return false;
		}
		if(card_com.touch_tag == true){
			player_com.selected_cards.push(event.target);
		}else{
			for(var i = 0;i < player_com.selected_cards.length;i++){
				var card_t = player_com.selected_cards[i];
				if(card_t == event.target){
					player_com.selected_cards.splice(i,1);
					break;
				}
			}
		}
		var selectCards = player_com.selected_cards;
		if(selectCards.length > 0){
			var mark = {"p":[],"s":[]};
			for(var i = 0;i < selectCards.length;i++){
				var card_com = selectCards[i].getComponent("zhq_card");
				mark["p"].push(card_com.rank);
				mark["s"].push(card_com.suit);
			}
			pomelo.request(util.getGameRoute(),{
				process:"chutip",
				chupai:mark,
				location:g_myselfPlayerPos
			},function(data){
				console.log(data.msg);
			});
		}
    },
	actionFaPai(){
		cc.log("fapai :" + this.fapai_count);
    	var size = cc.director.getWinSize();
		var playerArrayPosition = -1;
		//递归发牌如果this.count == 0 则停止发牌
		if(this.fapai_count <= 0){
			this.initButtonEnableAfterDealCards();
			return true;
		}
		this.fapai_count = this.fapai_count - 1;
		for(var i = 0;i < g_players.length;i++){
			var player = g_players[i];
			var player_com = player.getComponent("zhq_player");
    		if(player_com.position_server == g_myselfPlayerPos){
    			playerArrayPosition=i;
    			break;
    		}
    	}
		if(playerArrayPosition == -1){
			return false;
		}
		
    	var player = g_players[playerArrayPosition];
		var player_com = player.getComponent("zhq_player");
		var card_len = player_com.my_cards.length;
		var card = player_com.addPlayerCard();
		var card_com = card.getComponent("zhq_card");
		var position = this.calc_player_card_position(player,card_len);
		player_com.set_card_sprite(card_len,parseInt(this.myselfCards[card_len][0]),
			parseInt(this.myselfCards[card_len][1]));
		card.setPosition(position);
    	var callFunc = cc.callFunc(this.actionFaPai,this);
    	//card.runAction(cc.sequence(cc.delayTime(0.45),cc.show(),callFunc));
		card_com.sprite.runAction(cc.sequence(cc.delayTime(0.45),cc.show(),callFunc));
    },
	actionBottomBet(loserPlayerPosition,winPlayerPosition){
       var size = cc.director.getWinSize();
       var countNumber = -1;
       for(var j = 0;j < g_betArray.length;j++){
           if(this.bet == g_betArray[j]){
               j++;
               countNumber=j;
               break;
           }
       }
       if(countNumber == -1){
           console.log("error........outside actionBottomBet:function" + this.bet);
		   var betNum = this.bet / g_betArray[0];
		   while(betNum > 0){
			   var chip = cc.instantiate(g_assets["chip_100"]);
			   this.node.addChild(chip);
			   this.betPhotoArray.push(chip);
			   chip.setPosition(loserPlayerPosition);
			   var moveBet = cc.moveTo(0.3,winPlayerPosition);
			   chip.runAction(cc.sequence(cc.delayTime(0.45),moveBet,cc.hide()));
			   betNum = betNum - 1;
		   }
       }else{
		   var chip = cc.instantiate(g_assets["chip_" + this.bet]);
		   this.node.addChild(chip);
		   this.betPhotoArray.push(chip);
		   chip.setPosition(loserPlayerPosition);
		   var moveBet=cc.moveTo(0.3,winPlayerPosition);
		   chip.runAction(cc.sequence(cc.delayTime(0.45),moveBet,cc.hide()));
	   }
	},
	calc_player_card_position(player,m){
		var player_com = player.getComponent("zhq_player");
		var x = 0;
		var y = 0;
		if(player_com.player_position == 1){
			x = player.getPositionX() + 45 *(m - 1);// - player_com.mobile_sprite.node.getContentSize().width/2;
			y = player.getPositionY() + player_com.mobile_sprite.node.height + 25;
		}else if(player_com.player_position == 2){
			x = player.getPositionX() - (6-m)*30 + player_com.mobile_sprite.node.getContentSize().width/2 - 40;
			y = player.getPositionY() + player_com.mobile_sprite.node.height + 30;
		}else if(player_com.player_position == 3){
			x = player.getPositionX() -  (6-m)*30 + player_com.mobile_sprite.node.getContentSize().width/2 - 40;
			y = player.getPositionY() - player_com.mobile_sprite.node.height - 30;
		}else if(player_com.player_position == 4){
			x = player.getPositionX() + m*30 - player_com.mobile_sprite.node.getContentSize().width/2 + 40;
			y = player.getPositionY() - player_com.mobile_sprite.node.height - 30;
		}else if(player_com.player_position == 5){
			x = player.getPositionX() + m*30 - player_com.mobile_sprite.node.getContentSize().width/2 + 40;
			y = player.getPositionY() + player_com.mobile_sprite.node.height + 30;
		}
		cc.log("calc x:" + x + " y:" + y);
		return cc.p(x,y);
	},
	setPlayerCardsPosition(player,card_len){
		var player_com = player.getComponent("zhq_player");
		for(var m = 0;m < card_len;m++){
			var position = this.calc_player_card_position(player,m);
			var card = player_com.my_cards[m];
			card.setPosition(position);
		}
	},
	show_error_info(message){
		var size = cc.director.getVisibleSize();
		var error_tip = cc.instantiate(g_assets["prop_error_scene"]);
		var error_tip_com = error_tip.getComponent("prop_error_info");
		error_tip_com.show_error_info(msg);
		this.node.addChild(error_tip);
		error_tip.setPosition(this.node.convertToNodeSpace(size.width/2,size.height/2));
	},
	pomelo_removeListener(){
		cc.log("remove listener");
		pomelo.removeListener('onStart');
        pomelo.removeListener('onReady');
		pomelo.removeListener('onAdd');
		pomelo.removeListener('onNoRound');
		pomelo.removeListener('onGetUinfo');
		pomelo.removeListener('onFaPai');
        pomelo.removeListener('onShoupai');
        pomelo.removeListener('onShoupaiFirst');
        pomelo.removeListener('onPass');
        pomelo.removeListener('onJieFeng');
        pomelo.removeListener('onChuPai');
        pomelo.removeListener('onChuPaiTip');
        pomelo.removeListener('onMarkA');
        pomelo.removeListener('onThrow');
        pomelo.removeListener('onFinish');
        pomelo.removeListener('onStartChuPai');
		pomelo.removeListener('onLeave');
		pomelo.removeListener('onChangePlayer');
		pomelo.removeListener('onActBroadcast');
    },

	onExit(){
        g_dealCardBack.destroy();
        g_playerData.splice(0,g_playerData.length);
        g_roomData.splice(0,g_roomData.length);
		g_players.splice(0,g_players.length);
		g_players_noPower.splice(0,g_players_noPower.length);
		cc.log("exit from the room......");
        //释放资源
        //this.releaseMember();

        //注销监听接口
        this.pomelo_removeListener();
		this.destroy();
    },
	
});
