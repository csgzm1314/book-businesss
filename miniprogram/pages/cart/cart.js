// pages/cart/cart.js
/**
 * create by lh 
 * date 2018-07-04
 */
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopID: [],
    cartAryP: [],
    cartAry: [],
    checkAllBoolean: false,
    goodsValue: 0, // 合计总价
    goodsNums: 0, // 购买的商品数量
    chooseList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // console.log(_this.data.addressAry.length)
    // 请求服务器数据
    // wx.request({
    //   url: 'https://test.com/test.php', // 请求地址
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: 'GET', // 默认值为GET
    //   success: function (res) {
    //     console.log(res) // 服务器返回的数据
    //     showRequestInfo()
    //   },
    //   fail: function (errMsg) {
    //     showRequestInfo()
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
  onShow: function (e) {
    var userNickName = wx.getStorageSync("userInformation") || []; //获取用户名
    const db = wx.cloud.database()
    const banner = db.collection('shopMessage')
    banner.where({
        userNickName: userNickName
      }).get()
      .then(res => {
        console.log(res)
        this.setData({
          cartAry: res.data,
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
  // 选择商品信息
  checkboxChange: function (e) {
    // 选择信息列表赋值给chooseList
    this.setData({
      chooseList: e.detail.value
    })
    console.log(this.data.chooseList)
    var checkboxItems = this.data.cartAry,
      values = e.detail.value;
       console.log(values)
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false; // 先让原数组的所有checked为false，再根据商品信息所选项给对应的选项设置checked属性值为true
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i]._id == values[j]) {
          checkboxItems[i].checked = true;
          continue;
        }
      }
    }
    this.setData({
      cartAry: checkboxItems
    });
    // 如果勾选的选项数量刚好为数据的总长度，则勾选全选按钮，反之则取消全选
    if (e.detail.value.length === this.data.cartAry.length) {
      this.setData({
        checkAllBoolean: true
      });
    } else {
      this.setData({
        checkAllBoolean: false
      });
    }
    this.sumBuyNumber();
  },
  // 全选及反选
  checkAllChange: function (e) {
    let checkAllBoolean = this.data.checkAllBoolean; // 全选框Boolean
    let cartAry = this.data.cartAry; // 商品信息数组
    for (var i = 0; i < cartAry.length; i++) {
      cartAry[i].checked = !checkAllBoolean; // 不论全选或者是反选，商品列表的boolean与全选框的boolean刚好相反
    }
    this.setData({
      checkAllBoolean: !checkAllBoolean,
      cartAry: cartAry,
      goodsValue: !checkAllBoolean === false ? 0 : this.data.goodsValue,
      goodsNums: !checkAllBoolean === false ? 0 : this.data.goodsNums,
      chooseList: []
    });
    this.sumBuyNumber();
  },
  // 减少商品数量
  reduceNum: function (e) {
    var index = e.currentTarget.dataset['index'];
    this.sumBuyNumber(0, index);
  },
  // 增加商品数量
  addNum: function (e) {
    var index = e.currentTarget.dataset['index'];
    this.sumBuyNumber(1, index);
  },
  // 移除购物车商品
  removeGoods: function () {
    var removeList = [];

    if (this.data.checkAllBoolean){
      for (var i = 0; i < this.data.cartAry.length; i++) {
        removeList.push(this.data.cartAry[i]._id);

      }
    } else {
      removeList = this.data.chooseList;
      console.log(this.data.chooseList)
    }

    if (removeList.length > 0) {
      var _this = this;
      console.log(removeList)
      wx.showModal({
        title: '商品移出',
        content: '确定移出商品？',
        success: function (res) {
          // 确定移除商品
          if (res.confirm) {
            for (var j = 0; j < removeList.length; j++) {
              console.log(_this.data.cartAry[j]._id)
              for (var i = 0; i < _this.data.cartAry.length; i++) {
                console.log(removeList[i])
                if (removeList[j] == _this.data.cartAry[i]._id) {
                  console.log(Number(removeList[i]))
                  const db = wx.cloud.database()
                  db.collection('shopMessage').doc(_this.data.cartAry[i]._id).remove({
                    success: res => {
                      wx.showToast({
                        title: '删除成功',
                      })
                      _this.onShow()
                      this.onLoad()
                      this.setData({
                        counterId: '',
                        count: null,
                      })
                    },
                    fail: err => {
                      wx.showToast({
                        icon: 'none',
                        title: '删除失败',
                      })
                      console.error('[数据库] [删除记录] 失败：', err)
                    }
                  })
                }
              }
            }
          }
          _this.setData({
            goodsValue: 0, // 合计总价
            goodsNums: 0, // 购买的商品数量
            checkAllBoolean: false
          })
        }
      })
    } else {
      wx.showToast({
        title: '请选择您要移除的商品',
        icon: 'none',
        image: '',
        duration: 1000
      })
    }
  },
  // 计算结算数量结算金额 type-->1加0减，index-->索引
  sumBuyNumber: function (type, index) {
    var cartAry = this.data.cartAry; // 商品信息列表
    var chooseList = this.data.chooseList; // 选择购物结算列表
    console.log(chooseList)
    var sunBuy = 0; // 结算商品数量
    var sunMoney = 0; // 结算商品总金额
    if (type != undefined && type != 3) { // 如果不为undefined 那么就是加或减
      var goodsNum = cartAry[index].goodsNum;
      if (type === 1) { // 添加数量
        goodsNum++;
      } else if (type === 0) { // 减少数量
        --goodsNum;
        if (goodsNum < 0) {
          goodsNum = 0;
        }
      }
      cartAry[index].goodsNum = goodsNum;
      this.setData({
        cartAry: cartAry
      })
    }
    for (var i = 0; i < cartAry.length; i++) {
      var goodsNum = cartAry[i].goodsNum;
      if (this.data.checkAllBoolean) { // 如果商品列表全选
        sunBuy += goodsNum;
        sunMoney += goodsNum * cartAry[i].price;
      } else {
        for (var j = 0; j < chooseList.length; j++) {
          if (cartAry[i]._id == chooseList[j]) {
            sunBuy += goodsNum;
            sunMoney += goodsNum * cartAry[i].price;
          }
        }
      }
    }
    this.setData({
      goodsNums: sunBuy,
      goodsValue: sunMoney,
    })
    console.log(this.data.goodsNums)
  },
  submit: function () {
    var userNickName = wx.getStorageSync('userInformation') || []
    var paymentList = [];
    if (this.data.checkAllBoolean) {
      for (var i = 0; i < this.data.cartAry.length; i++) {
        paymentList.push(this.data.cartAry[i]._id);
      }
    } else {
      paymentList = this.data.chooseList;
      console.log(paymentList)
    }
    if (paymentList.length > 0) {
      var _this = this
      wx.showModal({
        title: '商品结算',
        content: '确定结算？',
        success: function (res) {
          // 确定移除商品
          if (res.confirm) {
            for (var j = 0; j < _this.data.cartAry.length; j++) {
              for (var i = 0; i < paymentList.length; i++) {
                if (paymentList[i] == _this.data.cartAry[j]._id) {
                  console.log(Number(paymentList[j]))
                  console.log(_this.data.cartAry[j]._id)
                  const db1 = wx.cloud.database()
                  db1.collection('orders').add({
                    data: {
                      price: _this.data.cartAry[j].price,
                      goodsNum: _this.data.cartAry[j].goodsNum,
                      imgUrl: _this.data.cartAry[j].imgUrl,
                      name: _this.data.cartAry[j].name,
                      userNickName:userNickName
                    },
                  })
                  const db = wx.cloud.database()
                  db.collection('shopMessage').doc(_this.data.cartAry[j]._id).remove({
                    success: res => {
                      _this.onShow()
                      this.onLoad()
                      this.setData({
                        counterId: '',
                        count: null,
                      })
                    },
                    fail: err => {
                      wx.showToast({
                        icon: 'none',
                        title: '删除失败',
                      })
                      console.error('[数据库] [删除记录] 失败：', err)
                    }
                  })
                }
              }
            }
            wx.navigateTo({
              url: '../payment/payment'
            })
          } else {
            wx.showToast({
              title: '结算已取消',
              icon: 'none',
              image: '',
              duration: 1000
            })
          }
        }
      })
    }
  },
  // 购物车没有商品时，跳转到商城页面
  goToList: function () {
    wx.switchTab({
      url: '../list/list',
    })
  }
})