/*
* @Author: WuPeng
* @Date:   2020-02-28 21:52:19
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 17:30:11
* 
*/

//jshint esversion:6
//jshint esversion:8

//只需要引入 request-promise-native , 不需要引入 request
const rp = require('request-promise-native');
// 引入 fs 模块
const { writeFile, readFile} = require('fs');

//引入 config 模块
const {appID , appsecret} = require('../config');

// 引入 menu
const menu = require('./menu');



// 定义类，获取 access_token
class Wechat {

	constructor(){

	}

	/**
	 * [getAccessToken 用来获取 access_token]
	 * @return {[promise]} [ access_token 对象 ]
	 */
	getAccessToken(){

		// 定义请求地址
		const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;

		return new Promise( (resolve , reject) => {

			//用 request 发送请求，返回值是一个 promise 对象
			rp({
				method:'GET',
				url,
				json:true,
			})
			.then( res => {

				// {
				//   access_token: '30_owTkWOF_0R3A8zzfuIxPu049de02JP01YsMU4XD4p9tHTD910gK5VbCDU__A6tYtmHxdHES1Lj_1U0Y6nc248fL_dF_7KEC7v7IEeJPDgKoIHy1G8l6lqmjqtIPyw194V4EtNbK9q3meTw9BPQNaAGAVWT',
				//   expires_in: 7200
				// }

				//设置 access_token 的过期时间，提前五分钟
				res.expires_in = Date.now() + ( res.expires_in - 300) * 1000;

				// 将 promise 对象状态改成成功的状态
				resolve(res);

			})
			.catch( err => {
				// 将 promise 对象状态改成失败的状态
				reject('getAccessToken 方法失败了，原因是: ' + err);
			});
		});
	}

	/**
	 * [saveAccessToken 保存 access_token]
	 * @param  {[object]} access_token [ access_token 对象]
	 * @return {[promise]} [ 成功没有返回值 ]
	 */
	saveAccessToken( access_token ){

		// 将对象转化为 json 字符串
		access_token = JSON.stringify(access_token);

		// 将 access_token 保存为一个文件
		return new Promise( (resolve , reject) => {

			writeFile('./accessToken.txt', access_token , err => {

				if(!err){
					console.log('access_token 保存成功 ~');
					resolve();
				} else {
					reject('saveAccessToken 方法出了问题，原因是： ' + err);
				}
			});
		});
	}

	/**
	 * [readAccessToken 读取 accessToken]
	 * @return {[ Promise 对象 ]} [accessToken 对象]
	 */
	readAccessToken(){

		// 读取本地文件自的 access_token
		return new Promise( (resolve , reject) => {

			readFile('./accessToken.txt', (err , data) => {

				if(!err){
					console.log('access_token 文件读取成功 ~');

					// 将 json 字符串转化为 js 对象
					data = JSON.parse(data);
					resolve( data );
				} else {
					reject('readAccessToken 方法出了问题，原因是： ' + err);
				}
			});
		});
	}


	/**
	 * [isValidAccessToken 检测 accessToken 是否有效]
	 * @param  {[Object]}  data [accessToken 对象]
	 * @return {Boolean}      [过期了就返回 false , 在有效期就返回 true]
	 */
	isValidAccessToken( data ){

		// 检查传入的参数是否是有效的

		if( !data && !data.access_token && !data.expires_in){

			// 代表 access_token 是无效的

			return false;
		}

		// 检测 access_token 是否在有效期内

		if( data.expires_in < Date.now() ){

			// 过期了

			return false;

		} else {

			// 没有过期

			return true;
		}

	}


	/**
	 * [fetchAccessToken 用来获取没有过期的 access_token]
	 * @return {[Promise]} [ access_token ]
	 */
	fetchAccessToken(){

		//优化
		if(this.access_token && this.expires_in && this.isValidAccessToken(this)){

			//说明之前保存过 access_token ，并且是有效的，可以直接使用；

			 return Promise.resolve({
				access_token:this.access_token,
				expires_in:this.expires_in
			});
		}

		// 是 fetchAccessToken 函数的返回值
		return this.readAccessToken()
			.then( async res => {

				// 本地存在文件 判断是否过期
				if( this.isValidAccessToken(res) ){

					// 没有过期,有效的

					return Promise.resolve(res);

				}else{
					// 本地文件过期了，发送请求重新获取 access_token
					const res = await this.getAccessToken();
					
					//获取之后就保存下来（本地文件），并将获取的 accessToken 暴露出去
					await this.saveAccessToken(res);

					//将请求回来的 access_token 返回出去
					return Promise.resolve(res);
				}

			})
			.catch( async err => {

				// 本地没有文件，就发送请求获取 accessToken 
				const res = await this.getAccessToken();
				
				//获取之后就保存下来（本地文件），并将获取的 accessToken 暴露出去
				await this.saveAccessToken(res);

				//将请求回来的 access_token 返回出去
				return Promise.resolve(res);

			})
			.then( res => {

				// 将 access_token 挂在到 this 上

				this.access_token = res.access_token;
				this.expires_in = res.expires_in;

				// 返回 res 包装了一层 promise 对象。（此对象为成功的状态）
				// 是 this.readAccessToken()最终的返回值
				return Promise.resolve(res);
			});
	}


	/**
	 * [createMenu 创建自定义菜单]
	 * @param  {[type]} menu [菜单的配置对象]
	 * @return {[type]}      [description]
	 */
	createMenu(menu){
		
		return new Promise( async (resolve,reject) => {

			try {
				// 获取 access_token
				const data = await this.fetchAccessToken();

				// 定义请求地址
				const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;

				// 发送请求
				const result = await rp({method:'POST',url,json:true,body:menu});

				resolve(result);
			}
			catch(e){
				reject('createMenu 方法出了问题:' + e);
			}

		});		
	}


	/**
	 * [deleteMent 删除自定义菜单]
	 * @return {[type]} [description]
	 */
	deleteMenu(){

		return new Promise( async (resolve,reject) => {

			try {
				// 获取 access_token
				const data = await this.fetchAccessToken();

				// 定义请求地址
				const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;

				// 发送请求
				const result = await rp({method:'GET',url,json:true});

				resolve(result);
			}catch(e){
				reject('deleteMent 方法出了问题:' + e);
			}

		});
	}

}


( async () => {
	const w = new Wechat();

	let result = await w.deleteMenu();

	result = await w.createMenu(menu);

})();

