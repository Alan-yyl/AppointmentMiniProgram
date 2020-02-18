//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: ''
    })
  },
  // onLoad: function () {
  //   console.log('onLoad')
  //   var that = this
  //   //调用应用实例的方法获取全局数据
  //   app.getUserInfo(function(userInfo){
  //     //更新数据
  //     that.setData({
  //       userInfo:userInfo
  //     })
  //   })
  // },
  edit:function(){
    console.log(app.userInfo)
    wx.navigateTo({
      url: '/pages/test/test',
  //     events: {
  //       // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
  //       acceptDataFromOpenedPage: function (data) {
  //         console.log(data)
  //       },
  //       someEvent: function (data) {
  //         console.log(data)
  //       }
  // },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test,我是页面more.js' })
        console.log("ok")
      },
      fail:function(res){
        console.log("no")
      }
    })
},

onGotUserInfo:function(e){
  console.log("nickname="+e.detail.userInfo.nickName)
}
})