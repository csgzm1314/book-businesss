// pages/details/details.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var saveExprs = function (expr) {
  //获取存储数据的数组
  var exprs = wx.getStorageSync("collectionsDate") || [];
  //向数组中添加新的元素
  exprs.unshift(expr);
  //将添加的元素存储到本地
  wx.setStorageSync("collectionsDate", exprs);
}
var deleteExprs = function (expr) {
  var exprs = wx.getStorageSync("collectionsDate") || [];
  for (var i = 0; i < exprs.length; i++) {
    if (exprs[i] == expr) {
      var exprss = exprs.splice(i - 1, 0);
      console.log(exprss)
      wx.setStorageSync("collectionsDate", exprss);
    }
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessData: [],
    tabs: ["图文详情", "简介", "作者"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    collected: false,
    id: "",
    _iid: "",
    cartAryP: [],
    maxvalue: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
    this.setData({
      id: options.id
    })
    //这个时候就拿到传过来的name了
    console.log(this.data.id)
    var exprs = wx.getStorageSync("collectionsDate") || [];
    for (var i = 0; i < exprs.length; i++) {
      if (exprs[i] == this.data.id) {
        this.setData({
          collected: true
        })
        return
      }
    }
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
    const banner = db.collection('Book')
    banner.where({
        _id: this.data.id
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
  // 点击左侧商品分类菜单，显示不同分类的商品信息
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
          name: that.data.businessData[0].name
        }).get()
          .then(res => {
            console.log(res)
            that.setData({
              cartAryP: res.data,
            })
            console.log(that.data.cartAryP)
            if (that.data.cartAryP.length >0) { //查找是否集合已有相关数据
                    const db = wx.cloud.database()
                    const banner = db.collection('shopMessage')
                    const _ = db.command;
                    banner.doc(that.data.cartAryP[0]._id).update({ //已有相关数据更新商品数量  
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
                          price: that.data.businessData[0].price,
                          goodsNum: 1,
                          check: "false",
                          imgUrl:  that.data.businessData[0].imgUrl,
                          name:  that.data.businessData[0].name,
                          userNickName: userNickName
                        },
                      })
                    }             
                        })
                      }
  
                    })
                }
    },
  // 点击收藏商品
  collectedGoods: function () {
    var login = wx.getStorageSync("login") || [];
    if (login == false) {
      wx.switchTab({
        url: '../mine/mine',
      })
    } else {
      this.setData({
        collected: !this.data.collected
      })
      console.log(this.data.collected);
      var userNickName = wx.getStorageSync("userInformation") || [];
      console.log(userNickName);
      const db = wx.cloud.database();
      if (this.data.collected == true) {
        db.collection("userNickName-_id").add({
          data: {
            userNickName: userNickName,
            bookid: this.data.id
          }
        })
        saveExprs(this.data.id);
        var exprs = wx.getStorageSync("collectionsDate") || [];
        console.log(exprs)
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
        })
      } else {
        db.collection("userNickName-_id").where({
          userNickName: userNickName,
          bookid: this.data.id
        }).get().then(res => {
          console.log(res.data[0]._id)
          db.collection("userNickName-_id").doc(res.data[0]._id).remove().then(res => {
            var arr = new Array();
            wx.setStorageSync('collectionsDate', arr)
            db.collection("userNickName-_id").where({
              userNickName: userNickName
            }).get().then(res => {
              console.log(res.data)
              for (var i = 0; i < res.data.length; i++) {
                saveExprs(res.data[i].bookid)
              }
              var exprs = wx.getStorageSync("collectionsDate") || [];
              console.log(exprs)
              wx.showToast({
                title: '取消收藏',
                icon: 'success',
              })
            })
          })
        })
        //deleteExprs(this.data.id);
      }
    }
  },
  // 查看购物车
  goToCart: function () {
    wx.switchTab({
      url: '../cart/cart'
    })
  },
  buy: function () {
    var userNickName = wx.getStorageSync("userInformation") || [];
    const db = wx.cloud.database()
    const banner = db.collection("indent")
    const that = this
    var list1 = new Array()
    const banner1 = db.collection('personAddress')
    banner1.where({
        commonAddress: true,
        userNickName: userNickName
      }).get()
      .then(res => {
        list1 = res.data
      })
      .catch(err => {
        console.log(err)
      }).then(res2 => {
        if (list1.length != 0) {
          console.log(list1)
          that.setData({
            userInfo: {
              name: list1[0].userName,
              phoneNum: list1[0].userPhoneNum,
              address: list1[0].region[0] + list1[0].region[1] + list1[0].region[2] + list1[0].userDetailAddress
            },
          })
          wx.showModal({
            title: '是否支付',
            content: '金额:' + this.data.businessData[0].price,
            success: (res) => {
              if (res.confirm) {
                console.log('确定支付')
                var userNickName = wx.getStorageSync("userInformation") || [];
                db.collection('indent').add({
                  data: {
                    imgUrl: this.data.businessData[0].imgUrl,
                    name: this.data.businessData[0].name,
                    numbers: 1,
                    price: this.data.businessData[0].price,
                    userNickName: userNickName,
                    status: "待收货",
                    username: this.data.userInfo.name,
                    userPhoneNum: this.data.userInfo.phoneNum,
                    address: this.data.userInfo.address
                  },
                  success: res => {
                    wx.showToast({
                      title: '购买成功',
                    })
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                  },
                  fail: err => {
                    wx.showToast({
                      icon: 'none',
                      title: '购买失败'
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                  }
                })
              } else {
                console.log('取消支付')
              }
            }
          })
        } else {
          wx.showModal({
            title: "请选择地址",
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: "../personAddress/personAddress",
                })

              }
            }
          })
        }
      })
  }
})