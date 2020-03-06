/*
* @Author: WuPeng
* @Date:   2020-02-27 22:09:16
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 18:46:56
* @Descript:路由
*/

/* jshint esversion:6 */

// 引入 express
const express = require('express');

// 创建路由容器
const router = express.Router();

// 定义路由
router.get('/',(req,res) => {
	res.render('index.html');

	// 暂时注释掉 send , 客户端发出一次请求，服务器给出两次及以上响应,node 会有报错信息
});

router.get('/test', (req,res) => {
	// res.send('This is test page');
});

// 导出路由
module.exports = router; 

