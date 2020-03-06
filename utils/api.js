/*
* @Author: WuPeng
* @Date:   2020-03-06 21:00:32
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 21:20:07
*
* 地址前缀
*/

// jshint esversion:6

const prefix = 'https://api.weixin.qq.com/cgi-bin/';

module.exports = {
	accessToken:`${prefix}token?grant_type=client_credential&`,
	ticket:`${prefix}ticket/getticket?type=jsapi&`,
	menu:{
		create:`${prefix}menu/create?`,
		delete:`${prefix}menu/delete?`,
	}
};