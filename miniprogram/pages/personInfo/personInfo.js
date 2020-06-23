// pages/personInfo/personInfo.js
var compare = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9XxAa]$/;
var compare2 = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
var compare3 = /^1[3|4|5|6|8][0-9]\d{4,8}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressAry: [],
    name: '',
    ident: '',
    email: '',
    date: "",
    phone:'',
    key:'addPersonInfo'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.getStorage({
      key: 'userInformation',
      success: function(res) {
        // console.log(res)
        _this.setData({
          userNickName: res.data
        })
      },
    })
    const db = wx.cloud.database();
    db.collection("personInfoDate").where({
      userNickName:this.data.userNickName
    }).get().then(res=>{
      if(res.data==''){
        wx.setStorage({
          data: false,
          key: 'addPersonInfo',
        })
      }else{
        wx.setStorage({
          data: true,
          key: 'addPersonInfo',
        })
        this.setData({
          name:res.data[0].name,
          ident:res.data[0].ident,
          phone:res.data[0].phone,
          email:res.data[0].email,
          date:res.data[0].date
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 自定义方法 
   * 
   */
  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getIdent: function(e) {
    this.setData({
      ident: e.detail.value
    })
  },
  getPhoneNum:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  getEmail: function(e) {
    this.setData({
      email: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  showTopTips: function(e) {
    if (this.data.name === '') {
      wx.showToast({
        title: '姓名不能为空!',
        icon: 'none',
        image: '',
        duration: 1000
      })
    } else if (this.data.ident === '') {
      wx.showToast({
        title: '身份证不能为空！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else if (!compare.test(this.data.ident)) {
      wx.showToast({
        title: '请输入正确的身份证！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else if (this.data.email === '') {
      wx.showToast({
        title: '邮箱不能为空！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else if (!compare2.test(this.data.email)) {
      wx.showToast({
        title: '请输入正确的邮箱！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else if (this.data.date === '') {
      wx.showToast({
        title: '生日不能为空！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    } else 
    if (this.data.phone.length === 0) {
      wx.showToast({
        title: '手机号码不能为空！',
        icon: 'none',
        image: '',
        duration: 1600
      })
    }else{
      if (!compare3.test(this.data.phone)) {
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
          const db = wx.cloud.database();
          var addPersonInfo=wx.getStorageSync('addPersonInfo') || [];
          if(addPersonInfo==false){
            db.collection("personInfoDate").add({
              data:{
                userNickName: this.data.userNickName,
                name: this.data.name,
                email: this.data.email,
                phone:this.data.phone,
                ident: this.data.ident,
                date: this.data.date
              }
            }).then(res=>{
              wx.setStorage({
                key: 'addPersonInfo',
                data: true,
              })
              wx.navigateBack({
                url: '../mine/mine'
              })
            })
          }else{
            db.collection("personInfoDate").where({
              userNickName:this.data.userNickName
            }).get().then(res=>{
              console.log(res.data[0]._id)
              db.collection("personInfoDate").doc(res.data[0]._id).update({
                data:{
                  name: this.data.name,
                  email: this.data.email,
                  phone:this.data.phone,
                  ident: this.data.ident,
                  date: this.data.date
                }
              }).then(res=>{
                wx.navigateBack({
                  url: '../mine/mine'
                })
              })
            })
          }    
        }
      }
    } 
    
  }
})