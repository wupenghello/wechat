/*
* @Author: WuPeng
* @Date:   2020-03-06 16:55:24
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-07 17:42:23
*
* 自定义菜单
*/


// jshint esversion:8

const {url} = require('../config');

module.exports =  {
     "button":[
     {  
          "type":"view",
          "name":"疫情实时播报",
          "url":`${url}/index`
      },
      {
           "name":"肺炎疫情",
           "sub_button":[
           {  
               "type":"view",
               "name":"抗击肺炎疫情城市数据",
               "url":`${url}/city`
            },
            {
               "type":"click",
               "name":"赞一下我们",
               "key":"赞一下我们"
            }]
       },
       {
            "name": "发送位置", 
            "type": "location_select", 
            "key": "rselfmenu_2_0"
        }]
 };