// pages/indent/indent.js
/**
 * create by lh 
 * date 2018-07-10
 */
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部订单", "待支付", "待收货", "已完成"],
    activeIndex: null,
    sliderOffset: 0,
    sliderLeft: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 显示信息加载loading动画，等待数据请求加载
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 1000
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    if (options != null) {
      this.setData({
        activeIndex: options.activeIndex,
        sliderOffset: options.sliderOffset
      })
    }
    console.log(this.data.activeIndex)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const db = wx.cloud.database()
    const banner = db.collection('indent')
    var userName = wx.getStorageSync("userInformation") || [];
    // 全部订单
    banner.where({
        userNickName: userName
      }).get()
      .then(res => {
        this.setData({
          indent: res.data,
        })
      })
      .catch(err => {
        console.log(err)
      })
    // 待支付订单
    banner.where({
        status: "待支付",
        userNickName: userName
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          indent1: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //待收货订单
    banner.where({
        status: "待收货",
        userNickName: userName
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          indent2: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //已完成订单
    banner.where({
        status: "已完成",
        userNickName: userName
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          indent3: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  delateIndent: function () {
    // wx.showLoading({
    //   title: 'loading',
    // })
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 800
    })
  },
  onDel: function (e) {
    let id = e.currentTarget.dataset.id
    const db = wx.cloud.database()
    const that = this
    wx.showModal({
      title: '订单取消',
      content: '确定取消订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('订单取消成功')
          db.collection("indent").doc(id).remove({
            success: res => {
              wx.showToast({
                title: '订单取消成功',
              })
              that.onShow() //重新获取数据库数据
              this.onLoad() //重新加载页面       
            },
            fail: err => {
              wx.showToast({
                title: '订单取消失败',
              })
            }
          })
        }else {
          console.log('未取消订单')
        }
      }
    })
  },
  onlook: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../orderinfo/orderinfo?id=' + id,
    })
  },
  onPay: function (e) {
    const db = wx.cloud.database()
    const banner = db.collection("indent")
    var id = e.currentTarget.dataset.id
    const that = this
    wx.showModal({
      title: '是否支付',
      success: function (res) {
        if (res.confirm) {
          console.log('确定支付')
          db.collection("indent").doc(id).update({
            data: {
              status: "待收货",
            },
            success: res => {
              wx.showToast({
                title: '支付成功',
              })
              that.onShow() //重新获取数据库数据
              this.onLoad() //重新加载页面
            },
            fail: err => {
              wx.showToast({
                title: '支付失败',
              })
            }
          })
        } else {
          console.log('取消支付')
        }
      }
    })
  },
  onRec: function (e) {
    const db = wx.cloud.database()
    const banner = db.collection("indent")
    var id = e.currentTarget.dataset.id
    const that = this
    wx.showModal({
      title: '是否确认收货',
      success: function (res) {
        if (res.confirm) {
          console.log('确定收货')
          db.collection("indent").doc(id).update({
            data: {
              status: "已完成",
            },
            success: res => {
              wx.showToast({
                title: '收货成功',
              })
              that.onShow() //重新获取数据库数据
              this.onLoad() //重新加载页面
            },
            fail: err => {
              wx.showToast({
                title: '修改失败',
              })
            }
          })
        } else {
          console.log('取消支付')
        }
      }
    })
  }
})