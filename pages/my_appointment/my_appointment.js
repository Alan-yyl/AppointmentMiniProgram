Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  //事件处理函数
  gotableinfo:function(e){
    wx.navigateTo({
      url: '../table/table',
    })
  }
  
})