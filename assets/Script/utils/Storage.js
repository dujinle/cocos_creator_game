/**
 * Created by kenkozheng on 2014/12/4.
 */

var Storage = {

    getUserId: function(){
        var userId = cc.sys.localStorage.getItem("userId") || null;
        return userId;
    },

    setUserId: function(userId){
        cc.sys.localStorage.setItem("userId",userId);
        return true;
    },

    getPassword: function(){
        var password = cc.sys.localStorage.getItem("password") || null;
        return password;
    },

    setPassword: function(password){
        cc.sys.localStorage.setItem("password",password) || null;
        return true;
    },
	getPhoneNumber: function(){
        var phone = cc.sys.localStorage.getItem("phone_num") || null;
        return phone;
    },

    setPhoneNumber: function(phone_num){
        cc.sys.localStorage.setItem("phone_num",phone_num);
        return true;
    },
	getLoginType: function(){
        var type = cc.sys.localStorage.getItem("login_type") || null;
        return type;
    },

    setLoginType: function(login_type){
        cc.sys.localStorage.setItem("login_type",login_type);
        return true;
    },

    getImei: function () {
        var imei  = cc.sys.localStorage.getItem("imei") || 0;
        //返回本机IMEI --待改造
        if(!imei){
        	imei = util.createUUID();// imei = getBJimei(); //底层获取IMEI
			Storage.setImei(imei);
        }
        return imei;
    },

    setImei:function(imei){
        cc.sys.localStorage.setItem("imei",imei);
        return true;
    },
	getPasswordFlag:function(){
		var flag = cc.sys.localStorage.getItem("pwd_flag");
		if(!flag){
			return false;
		}
		return true;
	},
	setPasswordFlag: function(flag){
        cc.sys.localStorage.setItem("pwd_flag",flag);
        return true;
    },
	getAutoLoginFlag:function(){
		var flag = cc.sys.localStorage.getItem("auto_flag");
		if(!flag){
			return false;
		}
		return true;
	},
	setAutoLoginFlag: function(flag){
        cc.sys.localStorage.setItem("auto_flag",flag);
        return true;
    },
};