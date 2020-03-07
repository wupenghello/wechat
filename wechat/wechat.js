/*
* @Author: WuPeng
* @Date:   2020-02-28 21:52:19
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-07 17:43:16
* 
*/

//jshint esversion:6
//jshint esversion:8

//只需要引入 request-promise-native , 不需要引入 request
const rp = require('request-promise-native');

//引入 config 模块
const {appID , appsecret} = require('../config');

// 引入 menu
const menu = require('./menu');

// 引入 api
const api = require('../utils/api');

// 引入工具函数
const { readFileAsync, writhFileAsync} = require('../utils/tool'); 

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
		const url = `${api.accessToken}appid=${appID}&secret=${appsecret}`;

		return new Promise( (resolve , reject) => {

			//用 request 发送请求，返回值是一个 promise 对象
			rp({
				method:'GET',
				url,
				json:true,
			})
			.then( res => {

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
		return writhFileAsync(access_token,'access_token.txt');
	}

	/**
	 * [readAccessToken 读取 accessToken]
	 * @return {[ Promise 对象 ]} [accessToken 对象]
	 */
	readAccessToken(){

		return readFileAsync('accessToken.txt');

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
				const url = `${api.menu.create}access_token=${data.access_token}`;

				// 发送请求
				const result = await rp({method:'POST',url,json:true,body:menu});

				console.log('创建菜单成功');

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
				const url = `${api.menu.delete}access_token=${data.access_token}`;

				// 发送请求
				const result = await rp({method:'GET',url,json:true});

				resolve(result);
			}catch(e){
				reject('deleteMent 方法出了问题:' + e);
			}

		});
	}


	/**
	 * [getTicket 用来请求 ticket]
	 * @return {[type]} [ticket 对象]
	 */
	getTicket(){

		return new Promise( async (resolve , reject) => {

			// 定义请求地址
			const data = await this.fetchAccessToken();

			// 定义请求地址
			const url = `${api.ticket}access_token=${data.access_token}`;

			//用 request 发送请求，返回值是一个 promise 对象
			rp({
				method:'GET',
				url,
				json:true,
			})
			.then( res => {

				//设置 ticket 的过期时间，提前五分钟
				res.expires_in = Date.now() + ( res.expires_in - 300) * 1000;

				// 将 promise 对象状态改成成功的状态
				resolve({
					ticket:res.ticket,
					expires_in:res.expires_in,
				});

			})
			.catch( err => {
				// 将 promise 对象状态改成失败的状态
				reject('getTicket 方法失败了，原因是: ' + err);
			});
		});
	}


	/**
	 * [saveTicket 保存 ticket]
	 * @param  {[type]} ticket [ ticket 对象]
	 * @return {[type]}        [description]
	 */
	saveTicket( ticket ){

		return writhFileAsync( ticket , 'ticket.txt');

	}


	/**
	 * [readTicket 读取 ticket]
	 * @return {[type]} [ticket 对象]
	 */
	readTicket(){

		return readFileAsync( 'ticket.txt' );

	}



	isValidTicket( data ){

		// 检查传入的参数是否是有效的

		if( !data && !data.ticket && !data.expires_in){

			// 代表 ticket 是无效的

			return false;
		}

		// 检测 ticket 是否在有效期内

		if( data.expires_in < Date.now() ){

			// 过期了

			return false;

		} else {

			// 没有过期

			return true;
		}

	}


	fetchTicket(){

		//优化
		if(this.ticket && this.ticket_expires_in && this.isValidTicket(this)){

			//说明之前保存过 ticket ，并且是有效的，可以直接使用；

			 return Promise.resolve({
				ticket:this.ticket,
				expires_in:this.expires_in
			});
		}

		// 是 isValidTicket 函数的返回值
		return this.readTicket()
			.then( async res => {

				// 本地存在文件 判断是否过期
				if( this.isValidTicket(res) ){

					// 没有过期,有效的

					return Promise.resolve(res);

				}else{
					// 本地文件过期了，发送请求重新获取 ticket
					const res = await this.getTicket();
					
					//获取之后就保存下来（本地文件），并将获取的 ticket 暴露出去
					await this.saveTicket(res);

					//将请求回来的 ticket 返回出去
					return Promise.resolve(res);
				}

			})
			.catch( async err => {

				// 本地没有文件，就发送请求获取 ticket 
				const res = await this.getTicket();
				
				//获取之后就保存下来（本地文件），并将获取的 ticket 暴露出去
				await this.saveTicket(res);

				//将请求回来的 ticket 返回出去
				return Promise.resolve(res);

			})
			.then( res => {

				// 将 ticket 挂在到 this 上

				this.ticket = res.ticket;
				this.ticket_expires_in = res.expires_in;

				// 返回 res 包装了一层 promise 对象。（此对象为成功的状态）
				// 是 this.readTicket()最终的返回值
				return Promise.resolve(res);
			});
	}

}


// ( async () => {

// 	// 运行这里可以刷新目录

// 	const w = new Wechat();

// 	let result = await w.deleteMenu();

// 	result = await w.createMenu(menu);

// })();

module.exports = Wechat;