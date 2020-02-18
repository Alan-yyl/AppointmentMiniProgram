Page({
  data: {
    sex: '男',
    imageList: []
  },
  //表单提交
  formSubmit: function (e) {
    console.log(e.detail.value)
    wx.request({
      url: 'http://localhost:8080/feedback/question.do', //仅为示例，并非真实的接口地址
      //form发生了submit事件，携带数据为
      data: e.detail.value,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data)
        if (res.error) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000,
          })

          this.upload();
        }
      }
    })
  },
  //拍照或者选择本地照片上传
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 2, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res + "选择照片成功" + res.tempFilePaths)
        that.data.imageList.push(res.tempFilePaths)
        that.setData({
          imageList: that.data.imageList //设置图片数组首地址指向，指向图片的本地临时文件路径列表 (本地路径)
        })
      }
    })
  },
  //预览照片
  previewImage: function (e) {
    console.log("触发预览")
    var that = this
    //currentList是一个图片列表
    //e.target.dataset.src获取到节点data-src的值
    var currentList = e.target.dataset.src
    console.log(current)
    wx.previewImage({
      //当前显示图片的http链接
      current: currentList[0],
      //需要预览的图片http链接列表
      urls: currentList,
    })
  },

  //上传
  upload: function () {
    console.log("出发上传")
    wx.uploadFile({
      url: 'http://anqingya.top/face/index.php/home/index/upload', //仅为示例，非真实的接口地址
      filePath: this.data.imageList[0],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        var data = res.data
        console.log(data);
        var json = JSON.parse(res.data);
        wx.showToast({
          title: json.msg,
          icon: 'none',
          duration: 3000,
        })
      }
    })
  }
})