/*
* @Author: WuPeng
* @Date:   2020-03-05 18:11:45
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-05 22:41:13
*
* 函数工具包
*/


/*  jshint esversion:8 */

// 引入 xml2js,将 xml 数据转化为 js 对象
const { parseString } = require('xml2js');

module.exports = {

	getUserDataAsync( req ){
		
		return new Promise( (resolve , reject) => {

			let xmlData = '';

			req
				.on('data', data => {

					// 当流式数据传递过来是，会触发当前事件，会将数据注入到回调函数中
					// console.log(data);

					// 读取的数据是 buffer ,需要将其转化成字符串拼串
					xmlData += data.toString();
				})
				.on('end', () => {

					//当数据接受完毕时，会触发当前函数

					resolve(xmlData);

				});
			
		});
	},

	parseXMLAsync( xmlData ){

		return new Promise( (resolve , reject) => {
			parseString( xmlData , { trim:true }, (err,data) => {

				if(!err){
					resolve(data);
				} else {
					reject('parseXMLAsync 方法出了问题：' + err);
				}

			});
		});
	},

	formatMessage( jsData ){

		let message = {};

		// 获取 xml 对象
		jsData = jsData.xml;

		// 判断数据是否是一个对象
		if (typeof jsData === 'object'){

			// 遍历对象

			for( let key in jsData ){

				// 获取属性值
				let value = jsData[key];

				// 过滤空的数据
				if( Array.isArray(value) && value.length > 0 ){
					// 将合适的数据复制到 message 对象上
					message[key] = value[0];
				}
			}

		}

		return message;
	}

};
