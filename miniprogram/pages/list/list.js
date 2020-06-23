/**
 * create by lh 
 * date 
 * modify 2018-07-09
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categroy: [{
        name: '童书',
        id: 10011
      },
      {
        name: '文艺',
        id: 10012
      },
      {
        name: '社科',
        id: 10013
      },
      {
        name: '励志',
        id: 10014
      },
      {
        name: '生活',
        id: 10015
      },
      {
        name: '科技',
        id: 10016
      },
      {
        name: '教育',
        id: 10017
      }
    ],
    maxvalue: 0,
    cartAryP: [],
    goodsNum: 0,
    formaxvalue: [],
    curIndex: 0,
    toViewId: 10011,
    arry:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
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
    const db = wx.cloud.database()
    const banner = db.collection('Book')
    // 取童书
    banner.where({
        list: "1"
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          tong: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //取文艺书
    banner.where({
        list: "2"
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          wen: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //取社科书
    banner.where({
        list: "3"
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          she: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //取励志书
    banner.where({
        list: "4"
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          li: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //取生活书
    banner.where({
        list: "5"
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          sheng: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //取科技书
    banner.where({
        list: "6"
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          ke: res.data
        })
      })
      .catch(err => {
        console.log(err)
      })
    //取教育书
    banner.where({
        list: "7"
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          jiao: res.data
        })
      })
      .catch(err => {
        console.log(err)
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  switchTab(e) {
    this.setData({
      toViewId: e.target.dataset.id,
      curIndex: e.target.dataset.index
    })
    console.log(this.data.toViewId);
    console.log(this.data.curIndex);
  },
  // 点击购物车图片，将物品加入购物车
  addToCart: function (e) {
    var login = wx.getStorageSync("login") || [];
    if (login == false) {
      wx.switchTab({
        url: '../mine/mine',
      })
    } else {
      var userNickName = wx.getStorageSync("userInformation") || []; //获取用户名
      var that = this
      const db = wx.cloud.database()
      const banner = db.collection('shopMessage')
      banner.where({
        userNickName: userNickName,
        name: e.currentTarget.dataset.id.name
      }).get()
        .then(res => {
          console.log(res)
          that.setData({
            cartAryP: res.data,
          })
          console.log(that.data.cartAryP)
          that.data.maxvalue += 1
          if (that.data.cartAryP.length >0) { //查找是否集合已有相关数据
                  console.log(that.data.arry) //已有相关数据更新商品数量  
                  const db = wx.cloud.database()
                  const banner = db.collection('shopMessage')
                  const _ = db.command;
                  banner.doc(that.data.cartAryP[0]._id).update({
                    data: {
                      goodsNum: _.inc(1),
                    },
                    success: res => {
                      wx.showToast({
                        title: '已添加购物车',
                      })
                    },
                    fail: err => {
                      wx.showToast({
                        title: '添加失败',
                      })
                      console.log(this.data.goodsNum)
                    }
                  })  
                }else {
                wx.showToast({ //集合没有数据时直接加入集合
                  title: '成功加入购物车',
                  icon: 'success',
                  success: function (res) {
                    db.collection('shopMessage').add({
                      data: {
                        price: e.currentTarget.dataset.id.price,
                        goodsNum: 1,
                        check: "false",
                        imgUrl: e.currentTarget.dataset.id.imgUrl,
                        name: e.currentTarget.dataset.id.name,
                        userNickName: userNickName
                      },
                    })
                  }             
                      })
                    }

                  })
              }
            }
          })
                
          
      
    

