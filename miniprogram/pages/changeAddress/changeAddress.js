// pages/changeAddress/changeAddress.js
/**
 *  create by lh
 *  date  2018-07-04
 */
var compare = /^1[3|4|5|6|8][0-9]\d{4,8}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressAry: [],
    region: [],
    showTopTips: false,
    userName: '',
    userDetailAddress: '',
    userPhoneNum: '',
    commonAddress: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    var _id = options._id;
    // console.log(_this.data.addressAry.length)
    // 请求服务器数据
    // wx.request({
    //   url: 'http://192.168.1.199', // 请求地址
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: 'GET', // 默认值为GET
    //   success: function (res) {
    //     console.log(res.data) // 服务器返回的数据
    //   },
    //   fail: function (errMsg) {
    //     wx.showModal({
    //       title: '请求数据失败',
    //       content: '服务器正忙，请稍后重试',
    //     })
    //   } 
    // })
    const db = wx.cloud.database();
    db.collection("personAddress").doc(_id).get().then(res => {
      console.log(res.data)
      _this.setData({
        addressAry: res.data,
        region: res.data.region,
        userName: res.data.userName,
        userDetailAddress: res.data.userDetailAddress,
        userPhoneNum: res.data.userPhoneNum,
        commonAddress: res.data.commonAddress
      })
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
  // 获取收件人姓名
  getUserName: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 获取省市区信息
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 获取用户详细收货地址
  getUserDetailAddress: function (e) {
    this.setData({
      userDetailAddress: e.detail.value
    })
  },
  // 获取用户联系电话号码
  getUserPhoneNum: function (e) {
    console.log(666)
    this.setData({
      userPhoneNum: e.detail.value
    })
    console.log(this.data.userPhoneNum)
  },
  // 是否设置未常用地址
  switchChange: function (e) {
    this.setData({
      commonAddress: e.detail.value
    })
  },
  // 保存用户新增地址信息到数据库
  saveAddress: function () {
    // 存放用户信息的对象
    const db = wx.cloud.database();
    var userNickName = wx.getStorageSync("userInformation") || [];
    if (this.data.userName === '') {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (this.data.region.length === 1) {
      wx.showToast({
        title: '请选择地址省市区地址信息',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else if (this.data.userDetailAddress === '') {
      wx.showToast({
        title: '请填写详细收货地址！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else if (this.data.userPhoneNum.length === 0) {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else {
      if (!compare.test(this.data.userPhoneNum)) {
        wx.showToast({
          title: '请输入正确的手机号码！',
          icon: 'none',
          image: '',
          duration: 1600
        })
      } else {
        if (this.data.userPhoneNum.length !== 11) {
          wx.showToast({
            title: '输入的手机号码不足11位！',
            icon: 'none',
            image: '',
            duration: 1600
          })
        } else {
          if (this.data.commonAddress == true) {
            db.collection("personAddress").where({
              userNickName: userNickName
            }).get().then(res => {
              console.log(res.data)
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].commonAddress == true) {
                  db.collection("personAddress").doc(res.data[i]._id).update({
                    data: {
                      commonAddress: false
                    }
                  }).then(res => {
                    db.collection("personAddress").doc(this.data.addressAry._id).update({
                      data: {
                        userName: this.data.userName,
                        region: this.data.region,
                        userDetailAddress: this.data.userDetailAddress,
                        userPhoneNum: this.data.userPhoneNum,
                        commonAddress: this.data.commonAddress
                      }
                    })
                    // 数据保存后，跳转到地址管理页面
                    wx.redirectTo({
                      url: '../personAddress/personAddress'
                    })
                  })
                }
              }
            })
          }
          db.collection("personAddress").doc(this.data.addressAry._id).update({
            data: {
              userName: this.data.userName,
              region: this.data.region,
              userDetailAddress: this.data.userDetailAddress,
              userPhoneNum: this.data.userPhoneNum,
              commonAddress: this.data.commonAddress
            }
          })
          // 数据保存后，跳转到地址管理页面
          wx.redirectTo({
            url: '../personAddress/personAddress'
          })
        }
      }
    }
  }
})