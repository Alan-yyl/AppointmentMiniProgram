Page({
  //工作发布的时间范围
  realseTime: {
    start: undefined,
    last: undefined,
  },
  /**
   * 页面的初始数据
   */
  data: {
    date: [],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    //保存每个月的天数
    days: [],
    year: 0,
    mouth: 0,
    dayInfos: [{
        "date": "2020-2-6",
        "type": "常日班",
        //剩余名额
        "count": 3,
        "note": "工作时间：9:00-17:00",
      },
      {
        "date": "2020-2-6",
        "type": "长时班",
        //剩余名额
        "count": 2,
        "note": "工作时间：9:00-19:00",
      },
      {
        "date": "2020-2-6",
        "type": "跟踪班",
        //剩余名额
        "count": 2,
        "note": "工作时间：6:00-19:00",
      },
    ],
    //当前处于所处的具体日期
    selectedDay: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp()
    //初始化工作发布的时间
    this.data.realseTime = app.globalData.realseTime
    //工作发布的时间
    console.log("工作发布的时间")
    console.log(this.data.realseTime.last)
    //显示未发布工作的第一天，即last+1
    this.dateData();
    this.releasedWorkDay();
  },

  onUnload: function() {
    // 页面销毁时执行
    console.log("执行了onUnload，小程序被销毁")
  },

  //用户点击减少月份
  minusMouth: function() {
    var mouth;
    var year;
    mouth = this.data.mouth
    year = this.data.year
    mouth--
    if (mouth < 1) {
      mouth = 12
      year--
    }
    this.updateDays(year, mouth)
  },
  //用户点击增加月份
  plusMouth: function() {
    var mouth;
    var year;
    mouth = this.data.mouth
    year = this.data.year
    mouth++
    if (mouth > 12) {
      mouth = 1
      year++
    }
    this.updateDays(year, mouth)
  },
  /**
   * 根据日期从服务器查询当天的的工作信息，并更新dayInfos信息
   */
  getBookInfo: function(date) {
    //模拟服务器返回的信息
    var info = [{
        "date": date,
        "type": "常日班",
        "count": 3,
        "note": "工作时间：9:00-17:00"
      },
      {
        "date": date,
        "type": "长时班",
        "count": 3,
        "period": "工作时间：9:00-19:00"
      },
      {
        "date": date,
        "type": "跟踪班",
        "count": 3,
        "period": "工作时间：6:00-19:00"
      },
    ]
    //界面渲染
    this.setData({
      dayInfos: info,
    })
  },


  /**
   * 用户点击日历上某一个日期
   */
  getdayinfo: function(e) {
    //年份
    var year = e.currentTarget.dataset.year
    //月份
    var month = e.currentTarget.dataset.month
    //日
    var day = e.currentTarget.dataset.value
    console.log("getdayinfo用户点击了" + year + "-" + month + "-" + day)
    var date = year + "-" + month + "-" + day
    var dayclass = "days-item-text-select";
    this.data.selectedDay = date

    //更新被点击日期的样式
    this.updateDays(year, month, day)
    //从服务器获取被点击日期的具体信息
    this.getBookInfo(date)
  },

  /**
   * 显示未发布工作的第一天
   */
  dateData: function() {
    var date = new Date(this.data.realseTime.last);
    //计算指定日期后一天的毫秒数
    var milliseconds = date.getTime() + 24 * 3600 * 1000
    //计算后一天的日期
    var tomorow = new Date(milliseconds)
    console.log(date + "后一天的日期为" + tomorow)

    var year = tomorow.getFullYear();
    var month = tomorow.getMonth() + 1;
    var day = tomorow.getDate();
    this.data.selectedDay = year + "-" + month + "-" + day
    console.log("未发布工作的第一天是" + this.data.selectedDay)
    this.updateDays(year, month, day)
  },
  /**
   * 更新某一天的样式
   */
  updateDays: function(year, mouth, day) {
    console.log(year + "  " + mouth + "  " + day);
    var days = [];
    var dateDay, dateWeek;
    // 根据日期获取每个月有多少天
    var getDateDay = function(year, mouth) {
      return new Date(year, mouth, 0).getDate();
    }
    //计算本月第一天是周几，用于后面打印空格
    var getDateWeek = function(year, mouth) {
      //月份:0 ~ 11
      return new Date(year, mouth - 1, 1).getDay();
    }

    dateDay = getDateDay(year, mouth)
    dateWeek = getDateWeek(year, mouth)

    console.log(dateDay);
    console.log(dateWeek);
    //向数组中添加天
    for (let index = 1; index <= dateDay; index++) {
      var workDay;
      console.log(day + "==" + index)
      //判断当前日期是否是可工作的日期
      var isWorkDay = year + "-" + mouth + "-" + index;
      workDay = this.releasedWorkDay(isWorkDay);
      console.log(workDay);
      if (day == index) {
        //为被点击的天加样式
        days.push({
          "value": index,
          "class": "days-item-text-select",
          "workDay": workDay
        })
      } else {
        days.push({
          "value": index,
          "class": "days-item-text",
          "workDay": workDay
        })
      }
    }

    //向数组中添加，一号之前应该空出的空格
    for (let index = 1; index <= dateWeek; index++) {
      days.unshift(0)
    }

    this.setData({
      days: days,
      year: year,
      mouth: mouth,
    })

  },
  /**
   * 检查nowday是否在[start,last]之间
   */
  releasedWorkDay: function(nowday) {
    var app = getApp()

    var nowdayToStart = new Date(nowday).getTime() - app.globalData.workDayStart;
    //工作日的区间
    var startToLast = new Date(this.data.realseTime.last).getTime() - app.globalData.workDayStart
    console.log(nowdayToStart);
    console.log(startToLast);

    if (nowdayToStart < 0) {
      //日期是已经过期的
      return -1;
    } else if (nowdayToStart > 0 && nowdayToStart <= startToLast) {
      // 日期是工作日
      return 0;
    } else if (nowdayToStart > 0 && nowdayToStart >= startToLast) {
      //日期是未发布的日期
      return 1;
    }
  },

  /**
   * 发布需求,通过表单提交用户的输入到服务器(未侧式)
   */
  formSubmit: function(e) {
    console.log(e.detail.value)

    //提交成功后的提示
    wx.showModal({
      title: '提示',
      content: '提交成功',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  //   wx.request({
  //     url: 'http://localhost:8080/feedback/question.do',
  //     //form发生了submit事件，携带数据为
  //     data: e.detail.value,
  //     //方式
  //     method: "POST",
  //     //数据头
  //     header: {
  //       'content-type': 'application/json'
  //     },

  //     //提交成功
  //     success: (res) => {
  //       console.log(res.data)
  //       if (res.error) {
  //         wx.showToast({
  //           title: 'res.data.msg',
  //           icon: "none",
  //           duration: 2000,
  //         })
  //       } else {
  //         wx.showToast({
  //           title: '添加成功',
  //           icon: 'success',
  //           duration: 2000,
  //         })
  //       }
  //     }
  //   })
  }
})