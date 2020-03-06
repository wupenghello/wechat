/*
* @Author: WuPeng
* @Date:   2020-03-06 16:55:24
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 20:20:07
*
* 自定义菜单
*/


module.exports =  {
     "button":[
     {	
          "type":"click",
          "name":"今日1歌曲",
          "key":"今日歌曲"
      },
      {
           "name":"菜单",
           "sub_button":[
           {	
               "type":"view",
               "name":"搜索",
               "url":"http://www.soso.com/"
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