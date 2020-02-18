App({
  onLaunch: function () {
    console.log("授权")
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                //如果已经授权了，可以直接调用getUserInfo获取头像
                wx.getUserInfo({
                  success: function (res) {
                    console.log(res.userInfo)
                    console.log("已经授权")
                  }
                })
              } else {
                //没有授权，跳转到授权页面
                console.log("未授权")
                wx.redirectTo({
                  url: '/pages/authorize/authorize',
                })
              }
            }
          })
        }
      },
      fail: function () {
        console.log("失败")
      }
    })
  },

  onLoad:function(){
    
  },

  //全局变量

  globalData:{
    realseTime: {
      start: "2020-2-8",
      last: "2020-2-28"
    },
    workDayStart: new Date().getTime(),
    workDayFinished:null,
    userInfo: null,
    //用户已经预约的工作
    selectedWorkDay:[
      {
        "date": "2020-2-7",
        "type": "常日班",
      },
      {
        "date": "2020-2-8",
        "type": "长时班",
      },
      {
        "date": "2020-2-9",
        "type": "跟踪班",
      },
      {
        "date": "2020-2-10",
        "type": "常日班",
      }
    ],
    //个人可工作的日期，一个二维数组，[month][day],month取值为1-12，month[0][]没有用到
    myworkDays: [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
  }
})
