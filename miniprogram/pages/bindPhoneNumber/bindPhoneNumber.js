// pages/bindPhoneNumber/bindPhoneNumber.js
/**
 * create by lh 
 * date 2018-07-04
 */ 
var compare = /^1[3|4|5|6|8][0-9]\d{4,8}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneAry:[],
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.getStorage({
      key: 'phoneInfoData',
      success: function (res) {
        console.log(res)
        _this.setData({
          phone: res.data[0].phone
        })
      }
    })
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
  getPhoneNum:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  saveAddress:function(e){
    let phoneInfoData = {};
    if (this.data.phone.length === 0) {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    }else{
      if (!compare.test(this.data.phone)) {
        wx.showToast({
          title: '请输入正确的手机号码！',
          icon: 'none',
          image: '',
          duration: 1600
        })
      }else{
        if (this.data.phone.length !== 11) {
          wx.showToast({
            title: '输入的手机号码不足11位！',
            icon: 'none',
            image: '',
            duration: 1600
          })
        }else{
          phoneInfoData={
            phone:this.data.phone
          }
          console.log(phoneInfoData)
          let phoneData = [];
          phoneData.push(phoneInfoData);
          wx.setStorage({
            key: 'phoneInfoData',
            data: phoneData,
          })
          console.log(phoneData)
          wx.showToast({
            title: '添加成功！',
            icon: 'success',
            duration: 1000
          })
          wx.navigateBack({
            url: '../mine/mine'
          })
        }
      }
    } 
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
  
  }
})