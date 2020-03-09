/*
* @Author: WuPeng
* @Date:   2020-03-09 11:50:53
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-09 12:48:16
*/

// jshint esversion:6


// 引入 mongoose
const mongoose = require('mongoose');

module.exports = new Promise( (resolve , rejecct) => {

	//连接数据库
	mongoose.set('useCreateIndex', true); //加上这个 node.js 运行不报错
	mongoose.connect('mongodb://localhost:27017/my_movie',{useNewUrlParser:true , useUnifiedTopology: true});

	//绑定事件监听
	mongoose.connection.once('open',err => {

		if(!err){
			console.log('数据库连接成功了~~');
			resolve();
		}
		else{
			rejecct( '数据库连接失败：' + err );
		}
		
	});

});