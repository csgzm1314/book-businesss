// pages/mine/mine.js
var saveExprs = function (expr) {
  //获取存储数据的数组
  var exprs = wx.getStorageSync("collectionsDate") || [];
  //向数组中添加新的元素
  exprs.unshift(expr);
  //将添加的元素存储到本地
  wx.setStorageSync("collectionsDate", exprs);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoData: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  bindGetUserInfo: function (e) {
    // 登录时用户信息授权成功,获取用户基本信息
    console.log(e)
    wx.setStorage({
      data: true,
      key: 'login',
    })
    if (e.detail.userInfo) {
      wx.showToast({
        title: 'loading',
        icon: 'loading',
        duration: 1200
      })
      this.setData({
        userInfoData: e.detail.userInfo
      })
      wx.setStorage({
        key: "userInformation",
        data: e.detail.userInfo.nickName
      })
    }
    var arr=new Array();
    wx.setStorageSync('collectionsDate', arr)
    var userNickName = wx.getStorageSync("userInformation") || [];
    const db = wx.cloud.database();
    db.collection("userNickName-_id").where({
      userNickName:userNickName
    }).get().then(res=>{
      console.log(res.data)
      for(var i=0;i<res.data.length;i++){
        saveExprs(res.data[i].bookid)
      }
      var exprs = wx.getStorageSync("collectionsDate") || [];
      console.log(exprs)
    })
  },
})
