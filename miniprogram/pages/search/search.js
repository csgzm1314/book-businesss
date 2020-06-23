Page({
  data: {
    searchVal: "",
    businessData: []
  },
  onLoad: function(options) {
    this.setData({
      searchVal: options.searchVal
    })
    const db = wx.cloud.database()
    const _ = db.command
    const banner = db.collection('Book')
    banner.where({
        name: { //columnName表示欲模糊查询数据所在列的名
          $regex: '.*' + this.data.searchVal + '.*', //queryContent表示欲查询的内容，‘.*’等同于SQL中的‘%’
          $options: 'i' //$options:'1' 代表这个like的条件不区分大小写,详见开发文档
        }
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          businessData: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  sear: function(e) {
    this.setData({
      searchVal: e.detail.value
    })
  },
  goCancel: function() {
    if (this.data.searchVal != '') {
      console.log(this.data.searchVal)
      this.onLoad(this.data)
    } else {
      wx.showToast({
        title: '请输入书名',
        duration: 500
      })

    }
  }
})