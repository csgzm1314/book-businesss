//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // imgUrls: [
    //   'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    // ],
    imgUrls: [
      'cloud://xiaoshucheng-c7u5y.7869-xiaoshucheng-c7u5y-1302319532/b1.jpg',
      'cloud://xiaoshucheng-c7u5y.7869-xiaoshucheng-c7u5y-1302319532/b2.jpg',
      'cloud://xiaoshucheng-c7u5y.7869-xiaoshucheng-c7u5y-1302319532/b3.jpg'
    ],
    businessData: [],
    indicatorDots: true, // 轮播图上是否显示当前显示第几张图片的小图标
    autoplay: true, // 是否自动播放
    interval: 5000,
    duration: 1000,
    recommondPic1: 'cloud://xiaoshucheng-c7u5y.7869-xiaoshucheng-c7u5y-1302319532/she2.png',
    recommondPic2: 'cloud://xiaoshucheng-c7u5y.7869-xiaoshucheng-c7u5y-1302319532/li1.png',
    autoFocus: true,
    searchVal: '',
    businessData: []
  },
  onLoad: function(options) {
    console.log("页面已经加载完毕")
    wx.setStorage({
      data: false,
      key: 'login',
    })
    var arr=new Array()
    wx.setStorageSync('collectionsDate', arr)
  },
  onShow: function() {
    const db = wx.cloud.database()
    const _ = db.command
    const banner = db.collection('Book')
    banner.where({
        price: _.gt(50)
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
  sear: function(e) {
    this.setData({
      searchVal: e.detail.value
    })
  },
  goCancel: function() {
    if (this.data.searchVal != '') {
      wx.navigateTo({
        url: '../search/search?searchVal=' + this.data.searchVal,
      })
    } else {
      wx.showToast({
        title: '请输入书名',
        duration: 500
      })
    }
  }
})