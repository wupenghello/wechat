/*
* @Author: WuPeng
* @Date:   2020-03-05 23:02:55
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-09 15:33:23
*
* 用来加工处理最终回复消息的模板（ xml 数据 ）
*/


// jshint esversion:8

module.exports = options => {

	let replyMessage = `<xml>
			  <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
			  <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
			  <CreateTime>${options.createTime}</CreateTime>
			  <MsgType><![CDATA[${options.msgType}]]></MsgType>`;

	if( 'text' === options.msgType ){
		replyMessage += `<Content><![CDATA[${options.content}]]></Content>`;
	}
	else if( 'image' === options.msgType ){
		replyMessage += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`;
	}
	else if( 'voice' === options.msgType ){
		replyMessage += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`;
	}
	else if( 'video' === options.msgType ){
		replyMessage += `<Video><MediaId><![CDATA[${options.mediaId}]]></MediaId><Title><![CDATA[${options.title}]]></Title><Description><![CDATA[${options.description}]]></Description></Video>`;
	}
	else if( 'music' === options.msgType ){
		replyMessage += `Music>
		    <Title><![CDATA[${options.title}]]></Title>
		    <Description><![CDATA[${options.description}]]></Description>
		    <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
		    <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
		    <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
		  </Music>`;
	}
	else if( 'news' === options.msgType ){
		replyMessage += `<ArticleCount>${options.content.length}</ArticleCount><Articles>`;

		options.content.forEach(item => {
			replyMessage += `<item>
		      <Title><![CDATA[${item.title}]]></Title>
		      <Description><![CDATA[${item.description}]]></Description>
		      <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
		      <Url><![CDATA[${item.url}]]></Url>
		    </item>`;
		});
    

		replyMessage += `</Articles>`;
	}


	replyMessage += '</xml>';


	// 最终返回给用户的 xml 
	return replyMessage;

};