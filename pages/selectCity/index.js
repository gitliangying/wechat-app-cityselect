var $v = require('../../utils/validate.js');
var $citys = require('../../utils/citys.js');
var cityData = $citys.data;
var app = getApp();

var provinces = [];
var citys = [];
var countys = [];
const date = new Date()
const years = []
const months = []
const days = []
const hours = []

//城市
for (let i = 0; i < cityData.length; i++) {
    provinces.push(cityData[i].name);
}

for (let i = 0; i < cityData[0].sub.length; i++) {
    citys.push(cityData[0].sub[i].name)
}

for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
    countys.push(cityData[0].sub[0].sub[i].name)
}

//时间日期
for (let i = 1920; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    var j = i;
    if( j < 10){
        j = "0" + String(j);
    }
    months.push(j)
}

for (let i = 1; i <= 31; i++) {
    var j = i;
    if (j < 10) {
        j = "0" + String(j);
    }
    days.push(j)
}

for (let i = 1; i <= 60; i++) {
    var j = i;
    if (j < 10) {
        j = "0" + String(j);
    }
    hours.push(j)
}
var y = 1980, m = 1, d = 1, h = 0, i = 0, dateTime = null, sex = 0, photoList = [], provinceName = cityData[0].name, cityName = cityData[0].sub[0].name, countyName = cityData[0].sub[0].sub[0].name, address = cityData[0].name + ' ' + cityData[0].sub[0].name + ' ' + cityData[0].sub[0].sub[0].name;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        provinces: provinces,
        citys: citys,
        countys: countys,
        cityValue: [0,0,0],
        years: years,
        months: months,
        days: days,
        hours: hours,
        dateValue:[60,0,0,0,0],
        dateText:'请选择阳历生日',
        sexText:'请选择性别',
        cityText:'请选择出生地',
        isDate: true,
        isCity: true,
        isTip: false,
        isBtn: false,
        photoList: [],
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
        sex = 0;
        photoList = [];
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        sex = 0;
        photoList = [];
    },

    //提交表单
    formSubmit: function (e) {
        var that = this;
        var $doname = e.detail.value.doname;
        var $content = e.detail.value.content;
        if (!$v.minlength($doname, 1)) {
            wx.showModal({
                title: '系统提示',
                content: '请输入姓名',
                showCancel: false,
            })
            return false;
        }
        if (sex == 0) {
            wx.showModal({
                title: '系统提示',
                content: '请选择性别',
                showCancel: false,
            })
            return false;
        }
        if (!$v.required(dateTime)) {
            wx.showModal({
                title: '系统提示',
                content: '请选择阳历生日',
                showCancel: false,
            })
            return false;
        }
        if (!$v.required(address)) {
            wx.showModal({
                title: '系统提示',
                content: '请选择出生地',
                showCancel: false,
            })
            return false;
        }
        if (!$v.minlength($content, 10)) {
            wx.showModal({
                title: '系统提示',
                content: '内容不可少于10个字符',
                showCancel: false,
            })
            return false;
        }
        that.httpCreateOrder($doname, $content);
    },


    httpCreateOrder: function (name, content){
        var that = this;
        wx.showLoading({
            title: '加载中',
        })
        //禁用按钮
        that.setData({ isBtn: true })
        
        wx.request({
            url: app._G.apiUrl + 'order',
            method: 'POST',
            data: {
                uid: wx.getStorageSync('uid'),
                token: wx.getStorageSync('token'),
                name: name,
                sex: sex,
                birthday: dateTime,
                birthAddress: address,
                content: content,
                photos: photoList
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (result) {
                wx.hideLoading();
                var dt = result.data;
                if (dt.result != 1) {
                    wx.showModal({
                        title: '系统提示',
                        content: dt.msg,
                        showCancel: false,
                    })
                    return false;
                }

                wx.redirectTo({
                    url: '..'
                })

                console.log(result)
            },
            fail: function (e) {
                wx.hideLoading();
                wx.showModal({
                    title: '系统提示',
                    content: '请求超时，请稍后再试',
                    showCancel: false,
                })
            }

        })
    },

    //上传图片
    uploadImg: function(){
        var that = this;
        if (photoList.length >= 3) {
            wx.showModal({
                title: '系统提示',
                content: '最多只能上传三张图片',
                showCancel: false,
            })
            return false;
        }
        wx.chooseImage({
            count: 3,
            success: function (res) {

                wx.showLoading({
                    title: '加载中',
                })

                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: app._G.apiUrl + 'upload',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        
                    },
                    success: function (res) {
                        var dt = JSON.parse(res.data);
                        if (dt.result != 1) {
                            wx.showModal({
                                title: '系统提示',
                                content: dt.msg,
                                showCancel: false,
                            })
                            return false;
                        }
                        
                        photoList.push(dt.data);
                        that.setData({
                            photoList: photoList,
                            isTip: true
                        })
                        console.log('上传文件返回数据', dt)
                    },
                    fail: function () {
                        wx.showModal({
                            title: '系统提示',
                            content: '请求超时，请稍后再试',
                            showCancel: false,
                        })
                    },
                    complete: function () {
                        wx.hideLoading();
                    }
                })
            },
            fail: function () {
                wx.showModal({
                    title: '系统提示',
                    content: '错误，请稍后再试',
                    showCancel: false,
                })
            }
        })

    },

    //调起选择器
    risePicker: function(e){
        var that = this;
        var $mold = e.currentTarget.dataset.mold;
        if($mold == 'dateTime'){
            that.setData({
                isDate: false
            })
        }
        if($mold == 'city'){
            that.setData({
                isCity: false
            })
        }
        
    },
    //调起性别选择器
    sexSheetTap: function () {
        var that = this;
        wx.showActionSheet({
            itemList: ['男', '女'],
            success: function (e) {
                sex = e.tapIndex + 1;
                that.setData({
                    sexText: sex == 1 ? '男' : '女'
                })
            }
        })
    },
    //时间选择器
    dateChange: function (e) {
        var that = this;
        y = e.detail.value[0] + 1920;
        m = e.detail.value[1] + 1;
        d = e.detail.value[2] + 1;
        h = e.detail.value[3] + 1;
        i = e.detail.value[4] + 1;
        //console.log(e)
    },
    //城市选择器
    cityChange: function (e) {
        //console.log(e);
        var val = e.detail.value
        var t = this.data.cityValue;
        address = '';
        if (val[0] != t[0]) {
            citys = [];
            countys = [];
            for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                citys.push(cityData[val[0]].sub[i].name)
            }
            for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
                countys.push(cityData[val[0]].sub[0].sub[i].name)
            }

            this.setData({
                citys: citys,
                countys: countys,
                cityValue: [val[0], 0, 0]
            })
            provinceName = cityData[val[0]].name;
            cityName = cityData[val[0]].sub[0].name;
            countyName = cityData[val[0]].sub[0].sub[0].name;
            address += cityData[val[0]].name + " " + cityData[val[0]].sub[0].name + " " + cityData[val[0]].sub[0].sub[0].name; 
            return;
        }
        if (val[1] != t[1]) {
            countys = [];
            for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
            }
            this.setData({
                countys: countys,
                cityValue: [val[0], val[1], 0]
            })
            cityName = cityData[val[0]].sub[val[1]].name;
            countyName = cityData[val[0]].sub[val[1]].sub[0].name;
            address += cityData[val[0]].name + " " + cityData[val[0]].sub[val[1]].name + " " + cityData[val[0]].sub[val[1]].sub[0].name; 
            return;
        }
        if (val[2] != t[2]) {
            this.setData({
                county: this.data.countys[val[2]],
                cityValue: val
            })
            countyName = cityData[val[0]].sub[val[1]].sub[val[2]].name;
            address += cityData[val[0]].name + " " + cityData[val[0]].sub[val[1]].name + " " + cityData[val[0]].sub[val[1]].sub[val[2]].name;
            return;
        }
        

    },

    //确定选择
    ideChoice: function(e){
        var that = this;
        var $act = e.currentTarget.dataset.act;
        var $mold = e.currentTarget.dataset.mold;

        //时间日期
        if ($act == 'confirm' && $mold == 'dateTime'){
            dateTime = y + '-' + m + '-' + d + ' ' + h + ':' + i;
            that.setData({
                dateText: dateTime,
                
            })
        }
        //城市
        if ($act == 'confirm' && $mold == 'city') {
            that.setData({
                cityText: provinceName + ' ' + cityName + ' ' + countyName,
            })
        }
        that.setData({
            isCity:true,
            isDate: true
        })
    }




})