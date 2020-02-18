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
    selectedDay: "",
    date: [],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    //保存每个的月的天数
    days: [],
    year: 0,
    mouth: 0,
    flag: true,
    dayInfos: [{
        "date": "2020-2-6",
        "type": "常日班",
        //剩余名额
        "count": 3,
        "note": "9：00-17：00",
        "status":"已发布"
      },
      {
        "date": "2020-2-6",
        "type": "长时班",
        //剩余名额
        "count": 2,
        "note": "9：00-19：00",
        "status": "已发布"
      },
      {
        "date": "2020-2-6",
        "type": "跟踪班",
        //剩余名额
        "count": 2,
        "note": "6：00-19：00",
        "status": "已发布"
      },
    ],
    selectedWorkDay: [],
    selectedToday: {
      "status": false,
      "type": "",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var app = getApp()
    //初始化已预约的工作
    this.data.selectedWorkDay = app.globalData.selectedWorkDay
    //初始化工作发布的时间
    this.data.realseTime = app.globalData.realseTime
    //已经预约的工作
    console.log(this.data.selectedWorkDay)
    this.dateData();
    this.releasedWorkDay();
  },

  onUnload: function() {
    // 页面销毁时执行
    console.log("被销毁")
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
    //如果当天是工作日，那么从服务器获取数据更新dayInfos

    //判断date是否是工作日,workDay为-1说明已经过期，为0说明是工作日，为1说明是未发布
    var workDay = this.releasedWorkDay(date);
    console.log("getBookInfo"+workDay)
    var info
    if (workDay==0) {
      info = [{
          "date": date,
          "type": "常日班",
          //从服务器获取，后续需要把这个人数更改为当天的需求人数
          "count": 3,
          "note": "9：00-17：00",
          "status":"已发布"
        },
        {
          "date": date,
          "type": "长时班",
          //从服务器获取，后续需要把这个人数更改为当天的需求人数
          "count": 3,
          "note": "9：00-19：00",
          "status": "已发布"
        },
        {
          "date": date,
          "type": "跟踪班",
          //从服务器获取，后续需要把这个人数更改为当天的需求人数
          "count": 3,
          "note": "6：00-19：00",
          "status": "已发布"
        },
      ]
    } else if (workDay == 1){
      info = [{
          "date": date,
          "type": "常日班",
          "count": 1,
          "note": "待发布"
        },
        {
          "date": date,
          "type": "长时班",
          "count": 1,
          "note": "待发布"
        },
        {
          "date": date,
          "type": "跟踪班",
          "count": 1,
          "note": "待发布"
        },
      ]
    }else{
      info = [{
        "date": date,
        "type": "常日班",
        //从服务器获取，后续需要把这个人数更改为当天的预约人数
        "count": 0,
        "note": "已过期"
      },
      {
        "date": date,
        "type": "长时班",
        //从服务器获取，后续需要把这个人数更改为当天的预约人数
        "count": 0,
        "note": "已过期"
      },
      {
        "date": date,
        "type": "跟踪班",
        //从服务器获取，后续需要把这个人数更改为当天的预约人数
        "count": 0,
        "note": "已过期"
      },
      ]
    }

    //界面渲染
    this.setData({
      dayInfos: info,
    })
  },
  /**
   * 预约工作
   */
  book: function(e) {
    var type = e.currentTarget.dataset.type
    var date = e.currentTarget.dataset.date
    var count = e.currentTarget.dataset.count
    console.log("预约信息" + date + "  " + type + " " + count)

    //剩余名额减1
    for (let index = 0; index < this.data.dayInfos.length; index++) {
      if (this.data.dayInfos[index].type == type && this.data.dayInfos[index].count > 0) {
        this.data.dayInfos[index].count = count - 1;
        console.log("更新")
        break
      }
    }


    //前端页面渲染
    this.setData({
      dayInfos: this.data.dayInfos,
    })
  },


  getdayinfo: function(e) {
    var openid = getApp().globalData.openid //获取用户信息
    console.log("openid123" + openid)
    var year = e.currentTarget.dataset.year
    var month = e.currentTarget.dataset.month
    var day = e.currentTarget.dataset.value
    console.log("getdayinfo" + year + "-" + month + "-" + day)
    var date = year + "-" + month + "-" + day
    var dayclass = "days-item-text-select";
    this.data.selectedDay = date
    //标记selectedToday是否被修改过
    var flag = false
    //判断被点击的这一天是否已经被该用户预约了
    for (let index = 0; index < this.data.selectedWorkDay.length; index++) {
      if (this.data.selectedWorkDay[index].date == date) {
        this.data.selectedToday.status = true
        this.data.selectedToday.type = this.data.selectedWorkDay[index].type
        console.log("用户已经预约了" + date + "   " + this.data.selectedToday)
        this.setData({
          selectedToday: this.data.selectedToday
        })
        flag = true
      }
    }
    if (!flag) {
      this.data.selectedToday.status = false
      this.data.selectedToday.type = ""
      this.setData({
        selectedToday: this.data.selectedToday
      })
    }
    //day为被点击的日期
    this.updateDays(year, month, day)
    this.getBookInfo(date)
  },

  dateData: function() {
    var date = new Date(this.data.realseTime.start);
    console.log("测试")
    console.log(this.data.selectedWorkDay)
    console.log(date)
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var date = year + "-" + month + "-" + day

    //设置该date班次预约情况
    for (let index = 0; index < this.data.selectedWorkDay.length; index++) {
      if (this.data.selectedWorkDay[index].date == date) {
        this.data.selectedToday.status = true
        this.data.selectedToday.type = this.data.selectedWorkDay[index].type
        console.log("用户已经预约了" + date + "   " + this.data.selectedToday)
        this.setData({
          selectedToday: this.data.selectedToday
        })
      }
    }

    this.updateDays(year, month, day)
  },
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
  }

  /**
   * 预约确认与处理
   */

})