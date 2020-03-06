/*
* @Author: WuPeng
* @Date:   2020-03-05 23:34:33
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 17:29:08
*
* 处理用户发送的消息类型和内容，决定返回不同的内容给用户
*/

// jshint esversion:6

module.exports = message => {

	let options = {
		toUserName:message.FromUserName,
		fromUserName:message.ToUserName,
		createTime:Date.now(),
		msgType:'text',		//默认text
	};
	
	let content = '你说啥';
	// 判断用户发送的消息是否是文本消息
	if( message.MsgType === 'text' ){
		// 判断用户发送的消息内容具体是什么

		if( message.Content === '1' ){
			content = '大吉大利，今晚吃鸡';
		}else if( message.Content === '2' ){
			content = '落地成盒';
		}else if( message.Content.match('吴鹏')){
			// 半匹配
			content = '吴鹏是最帅的';
		}
	}
	else if( 'image' === message.MsgType ){
		// 用户发送图片消息

		options.msgType = 'image';
		options.mediaId = message.MediaId;

		console.log( message.PicUrl);
	}
	else if( 'voice' === message.MsgType ){
		// 用户发送语音消息

		options.msgType = 'voice';
		options.mediaId = message.MediaId;

	}
	else if( 'location' === message.MsgType ){
		// 用户发送位置消息

		content = `维度：${message.Location_X} 经度：${message.Location_Y} 缩放大小：${message.Scale} 位置信息：${message.Label}`;
	}
	else if( 'event' === message.MsgType ){
		// 事件

console.log(message);

		if( 'subscribe' === message.Event ){
			// 用户订阅事件
			content = '欢迎您的关注~';
		}
		else if( 'LOCATION' === message.Event ){
			content = `维度：${message.Latitude} 经度：${message.Longitude} 精度：${message.Precision}`;
		}
		else if( 'CLICK' === message.Event ){
			content = `你点击了按钮 : ${message.EventKey}`;
		}
	}
	


	options.content = content;

	return options;


};