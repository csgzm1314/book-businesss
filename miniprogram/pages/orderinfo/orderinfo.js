// miniprogram/pages/orderinfo/orderinfo.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    console.log(this.data.id)
    const db = wx.cloud.database()
    const banner = db.collection('indent')
    // 获取数据
    banner.where({
        _id: this.data.id
      }).get()
      .then(res => {
        this.setData({
          indent: res.data,
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onLook: function (e) {
    var name1 = e.currentTarget.dataset.id
    const db = wx.cloud.database()
    const banner = db.collection('Book')
    console.log(name1)
    banner.where({
        name: name1
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          arr: res.data[0]._id
        })
        wx.navigateTo({
          url: '../details/details?id=' + this.data.arr,
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
})