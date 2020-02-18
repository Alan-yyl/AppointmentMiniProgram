Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: [],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    //保存每个的月的天数
    days: [],
    year: 0,
    month: 0,
    //被选择的日期，一个二维数组，[month][day],month取值为1-12，month[0][]没有用到
    selectedDays: [
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
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp()
    this.data.selectedDays = app.globalData.myworkDays
    this.dateData();
  },

  onUnload: function () {
    // 页面销毁时执行
    var app=getApp()
    app.globalData.myworkDays = this.data.selectedDays
  },

  //用户点击减少月份
  minusMonth: function() {
    var month;
    var year;
    month = this.data.month
    year = this.data.year
    month--
    if (month < 1) {
      month = 12
      year--
    }
    // console.log(month + "月被选择数组")
    // console.log(this.data.selectedDays)
    this.updateDays(year, month)
  },
  //用户点击增加月份
  plusMonth: function() {
    var month;
    var year;
    month = this.data.month
    year = this.data.year
    month++
    if (month > 12) {
      month = 1
      year++
    }
    // console.log(month + "月被选择数组")
    // console.log(this.data.selectedDays)
    this.updateDays(year, month)
  },
  /**
   * 点击事件，获取用户点击了日历的具体时间
   */
  getdayinfo: function(e) {
    var openid = getApp().globalData.openid //获取用户信息
    // console.log("openid123" + openid)
    var year = e.currentTarget.dataset.year
    var month = e.currentTarget.dataset.month
    var day = e.currentTarget.dataset.value
    // console.log("getdayinfo" + year + "-" + month + "-" + day)
    //对被点击的日期进行渲染。
    for (let index = 0; index < this.data.days.length; index++) {
      if (this.data.days[index].year == year && this.data.days[index].month == month && this.data.days[index].day == day && this.data.days[index].selected == false) {
        this.data.days[index].showclass = "days-item-text-select"
        this.data.days[index].selected = true
        //更新被选择日期数组
        this.data.selectedDays[month][day] = true
      } else if (this.data.days[index].year == year && this.data.days[index].month == month && this.data.days[index].day == day && this.data.days[index].selected == true) {
        this.data.days[index].showclass = "days-item-text"
        this.data.days[index].selected = false
        //更新被选择日期数组
        this.data.selectedDays[month][day] = false
      }
    }
    // console.log("当前被选择数组")
    // console.log(this.data.selectedDays)
    //将数据发送到前端
    this.setData({
      days: this.data.days,
      year: year,
      month: month,
    })
  },


  /**
   * 对今天进行显示
   */
  dateData: function() {
    var date = new Date();
    var days = [];
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.updateDays(year, month)
  },
  /**
   * 对days、month、year进行更新
   */
  updateDays: function(year, month, day) {
    console.log(year + "  " + month + "  " + day);
    var days = [];
    var dateDay, dateWeek;
    // 根据日期获取该月有多少天
    var getDateDay = function(year, month) {
      return new Date(year, month, 0).getDate();
    }
    /**
     *计算本月第一天是周几，用于在前面打印空格
     *为周日，前面有0个空格
     *为周六，前面有6个空格
     */
    var getDateWeek = function(year, month) {
      //月份:0 ~ 11
      return new Date(year, month - 1, 1).getDay();
    }

    //该月有几天
    dateDay = getDateDay(year, month)
    //本月第一天是周几
    dateWeek = getDateWeek(year, month)
    //向数组中添加天
    for (let i = 1; i <= dateDay; i++) {
      var item = {
        // 年
        year: undefined,
        // 月
        month: undefined,
        // 日
        day: undefined,
        //显示的样式
        showclass: "days-item-text",
        //是否被选中
        selected: false,
      }
      item.year = year
      item.month = month
      item.day = i

      days.push(item)
    }

    if (this.data.selectedDays[month] != undefined) {
      for (let k = 0; k < this.data.selectedDays[month].length; k++) {
        if (this.data.selectedDays[month][k] == true) {
          // console.log("this.data.selectedDays[month][k]")
          // console.log(k)
          // console.log(days[k - 1])
          days[k - 1].showclass = "days-item-text-select"
          days[k - 1].selected = true
        }
      }
    }
    //向数组中添加，一号之前应该空出的空格
    for (let index = 1; index <= dateWeek; index++) {
      days.unshift(0)
    }

    console.log(days)
    this.setData({
      days: days,
      year: year,
      month: month,
    })
  },

  save:function(){
    console.log("点击保存后，提交给服务器被选择的日期")
    console.log(this.data.selectedDays)
    wx.showModal({
      title: '提示',
      content: '已保存',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})