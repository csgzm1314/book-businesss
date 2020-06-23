// pages/payment/payment.js
/**
 * create by lh 
 * date 2018-07-09
 */
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressAry: [],
    userInfo: {
      name: '',
      phoneNum: '',
      address: ''
    },
    paymentshops: [],
    totalMoney: 0,
    freight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    const db = wx.cloud.database()
    const banner = db.collection('orders')
    banner.where({}).get()
      .then(res => {
        console.log(res)
        this.setData({
          paymentshops: res.data,
        })
        var money = 0;
        for (var i = 0; i < _this.data.paymentshops.length; i++) {
          money += _this.data.paymentshops[i].price * _this.data.paymentshops[i].goodsNum
          console.log(money)
        }
        this.setData({
          totalMoney: money
        })
      })
      .catch(err => {
        console.log(err)
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
    let _this = this;
    var userNickName = wx.getStorageSync('userInformation') || [];
    const db = wx.cloud.database();
    db.collection("personAddress").where({
      userNickName: userNickName
    }).get().then(res => {
      for (var i = 0; i < res.data.length; i++) {
        console.log(res.data[i])
        if (res.data[i].commonAddress == true) {
          _this.setData({
            addressAry: res.data[i],
            userInfo: {
              name: res.data[i].userName,
              phoneNum: res.data[i].userPhoneNum,
              address: res.data[i].region[0] + res.data[i].region[1] + res.data[i].region[2] + res.data[i].userDetailAddress
            },
          })
        }
      }
    })
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
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  payment: function () {
    var that = this
    var userNickName = wx.getStorageSync("userInformation") || [];

    if(that.data.userInfo.name!=""){
      wx.showModal({
        title: '提交订单',
        content: '是否提交订单？',
        success: function (res) {
          // 确定提交订单
          if (res.confirm) {
            console.log(that.data.paymentshops)
            for (var i = 0; i < that.data.paymentshops.length; i++) {
              const db1 = wx.cloud.database()
              db1.collection('indent').add({
                data: {
                  username:that.data.userInfo.name,
                  userPhoneNum:that.data.userInfo.phoneNum,
                  address:that.data.userInfo.address,
                  _id: that.data.paymentshops[i]._id,
                  price: that.data.paymentshops[i].price,
                  numbers: that.data.paymentshops[i].goodsNum,
                  imgUrl: that.data.paymentshops[i].imgUrl,
                  name: that.data.paymentshops[i].name,
                  userNickName: userNickName,
                  status: "待收货"
                },
              })
              console.log(that.data.paymentshops[i]._id)
              db1.collection('orders').doc(that.data.paymentshops[i]._id).remove({
                success: res => {
                  wx.showToast({
                    title: '提交订单成功',
                  })
                  that.onLoad()
                  wx.navigateTo({
                    url: '../indent/indent?activeIndex=2&sliderOffset=160',
                  })
                }
              })
            }
          } else {
            for (var i = 0; i < that.data.paymentshops.length; i++) {
              const db1 = wx.cloud.database()
              db1.collection('indent').add({
                data: {
                  username:that.data.userInfo.name,
                  userPhoneNum:that.data.userInfo.phoneNum,
                  address:that.data.userInfo.address,
                  _id: that.data.paymentshops[i]._id,
                  price: that.data.paymentshops[i].price,
                  numbers: that.data.paymentshops[i].goodsNum,
                  imgUrl: that.data.paymentshops[i].imgUrl,
                  name: that.data.paymentshops[i].name,
                  userNickName: userNickName,
                  status: "待支付"
                },
              })
              db1.collection('orders').doc(that.data.paymentshops[i]._id).remove({
                success: res => {
                  wx.showToast({
                    title: '未完成支付',
                  })
                  that.onLoad()
                  wx.navigateTo({
                    url: '../indent/indent?activeIndex=1&sliderOffset=80',
                  })
                }
              })
            }
          }
        }
      })
    }else{
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
		  	duration: 1000
		})

    }
    
  }
})