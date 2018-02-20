/**
 * Created by guowanfu on 2016/5/3.
 */

/* gameScene.js*/

//扑克牌背面
var g_dealCardBack = null;
//g_dealCardBack.retain();
//筹码精灵
//var g_countSprite=new cc.Sprite(res.Chips_Test_png);
//g_countSprite.retain();
//存放加注选择筹码按钮的精灵
//var g_spritePlaceJiaZhuMenuSelect=null;
//监听触摸器，用于监听存放加注筹码按钮精灵g_spritePlaceJiaZhuMenuSelect
//var g_jiaZhu_touchListener=null;
//加注的大小
//var g_AddChipSize=null;
//比牌选择界面的按钮和提示精灵
//var g_menuBiPaiSelect=null;
//var g_biPaiRing=null;
//向服务器发送比牌玩家位置的变量
//var g_playerPositionServer1=null;
//var g_playerPositionServer2=null;
//临时全局变量，比牌玩家的数组下标,actionBiPai:function（）中
//var g_biPaiPlayerIndexOf1=new Array(2);
//var g_biPaiPlayerIndexOf2=new Array(2);
//玩家自己的服务器位置
//var myselfPlayerPositionServer=null;
//比牌失败者的位置,pomelo_on:function
//var g_loserPositionServer=null;
//广播信息记录数组，最多50条信息记录,假设现在只有四条记录
//var g_radioMessageArray=new Array();
//g_radioMessageArray.push("我来了，小子！");

//广播文字滚动窗口
//var g_cliper=new cc.ClippingNode();
//g_cliper.retain();
//广播信息记录最多保存数
//var g_recordMax=15;

//房间中玩家存储数据
var g_players_noPower = new Array();
var g_players = new Array();
var g_myselfPlayerPos = -1;
var g_playerData = new Array();
var g_roomData = new Array();
var g_roomMasterName = "";
var g_game_type = "ZJH";
var g_fapaiNum = 3;
var g_totalCount = 0;
var g_user = null;
var g_assets = {};
//房间状态信息是否进行中
//var g_roomState = 0;
/*popUpSettingLayer.js*/
//筹码加注级别
var g_betArray=[100,300,500,800,1000];
//游戏设置全局变量
var g_music_key;
var g_sound_key;
var g_chat_key;
var g_Puke = ["0","0","2","3","4","5","6","7","8","9","10","J","Q","K","A"];
MUSIC_KEY="music_key";
SOUND_KEY="sound_key";
CHAT_KEY="chat_key";
BOOL={
    NO:"0",
    YES:"1"
};
