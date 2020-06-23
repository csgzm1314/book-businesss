// pages/collection/collection.js
/**
 * create by lh 
 * date 2018-07-04
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collectionAry: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    const banner = db.collection('Book')
    var exprs = wx.getStorageSync("collectionsDate") || [];
    for (var i = 0; i < exprs.length; i++) {
      banner.where({
          _id: exprs[i]
        }).get()
        .then(res => {
          console.log(res)
          this.setData({
            collectionAry: this.data.collectionAry.concat(res.data)
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  addToCart: function () {
    wx.showToast({
      title: '成功加入购物车',
      icon: 'success',
      success: function (res) {
        // 将添加的商品ID放入一个数组中，然后传给后端，当点击跳转到购物车页面时，通过商品ID来获取加入的商品信息list
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
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
  goToList: function () {
    wx.switchTab({
      url: '../list/list',
    })
  }
})