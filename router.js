/*
* @Author: WuPeng
* @Date:   2020-02-27 22:09:16
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 19:26:58
* @Descript:路由
*/

/* jshint esversion:6 */

// 引入 express
const express = require('express');

// 创建路由容器
const router = express.Router();

// 定义路由
router.get('/home',(req,res) => {
	res.render('index.html');
});

router.get('/test', (req,res) => {
	// res.send('This is test page');
});

// 导出路由
module.exports = router; 

