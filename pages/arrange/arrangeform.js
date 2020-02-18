// pages/arrange/arrangeform.js
Page({
  data: {
    //该数组保存输入框name、status
    inputArray: [{
        name: "",
        // 用户输入的名字服务器中有1、没有0
        status: 0
      },
      {
        name: "",
        // 用户输入的名字服务器中有1、没有0
        status: 0
      }
    ]
  },

  //用户点击增肌输入框
  add: function() {
    var input = {
      name: "",
      status: 0
    }

    this.data.inputArray.push(input)

    //更新
    this.setData({
      inputArray: this.data.inputArray
    })

    console.log(this.data.inputArray)
  },

  /**
   *用户点击减少输入框 
   */
  minus: function(e) {
    //获取用户点击的按钮的下标
    var index = e.currentTarget.dataset.index

    //从inputArray数组中将index这个元素删除
    for (let pos = index; pos < this.data.inputArray.length; pos++) {
      this.data.inputArray[pos] = this.data.inputArray[pos + 1]
    }
    this.data.inputArray.length--

      //渲染到前端
      this.setData({
        inputArray: this.data.inputArray
      })
  },

  /**
   * 将人员名单提交到服务器
   */
  submit: function() {
    console.log(this.data.inputArray)
    //提交成功后的提示
    if (this.data.inputArray[0].name!="") {
      wx.showModal({
        title: '提示',
        content: '保存成功',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入学生名单',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },


  //用户输入完成后，向服务器发请求确认该名字是否合法
  eventhandle: function(e) {
    //用户输入e.detail.value
    var inputvalue = e.detail.value
    if (inputvalue == null) {
      return
    }
    //去除字符串中的所有空格
    var name = inputvalue.replace(/\s*/g, "")
    console.log(name)
    //数组下标
    var index = e.currentTarget.dataset.index
    console.log(index)
    //更新数组index的name
    this.data.inputArray[index].name = name
    //向服务器发起请求
    //更新数组index的status
    this.data.inputArray[index].status = 1

    this.setData({
      inputArray: this.data.inputArray
    })
  }
})