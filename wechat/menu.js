/*
* @Author: WuPeng
* @Date:   2020-03-06 16:55:24
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-08 14:47:30
*
* 自定义菜单
*/


// jshint esversion:6

const {url} = require('../config');

module.exports =  {
     "button":[
       {  
            "type":"view",
            "name":"硅谷电影",
            "url":`${url}/movie`
        },
        {  
            "type":"view",
            "name":"语音识别",
            "url":`${url}/search`
        },
        {
             "name":"戳我",
             "sub_button":[
              {
                 "type":"click",
                 "name":"帮助",
                 "key":"help"
              }]
         }
       ]
 };