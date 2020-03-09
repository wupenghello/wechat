/*
 * @Author: WuPeng
 * @Date:   2020-03-09 11:57:37
 * @Last Modified by:   WuPeng
 * @Last Modified time: 2020-03-09 17:18:22
 */

// jshint esversion:6

// 引入 mongoose
const mongoose = require('mongoose');

// 获取 schema
const Schema = mongoose.Schema;

// 创建约束对象

const theatersSchema = new Schema({

	title: String,
	rating: Number,
	runtime: String,
	directors: String,
	casts: String,
	image: String,
	doubanId: {
		type: Number,
		unique: true		// 唯一值
	},
	genre: [String],
	summary: String,
	releaseDate: String,
	posterKey: String, //图片上传到服务器中，返回的key值
	createTime: {
		type: Date,
		default: Date.now()
	}

});

//创建模型对象
const Theaters = mongoose.model('Theaters', theatersSchema);

//暴露出去
module.exports = Theaters;