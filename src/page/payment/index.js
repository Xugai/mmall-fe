/*
* @Author: Xugai
* @Date:   2018-04-21 11:06:09
* @Last Modified by:   Xugai
* @Last Modified time: 2018-04-23 08:40:44
*/
require('../module.js');
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('page/common/footer/index.css');

var _mm = require('util/mm.js');
var _payment = require('service/payment-service.js');
var templateIndex = require('./index.string');

//page逻辑部分
var page = {
	data: {
		orderNumber: _mm.getUrlParam('orderNo')
	},
	init: function(){
		this.onLoad();
		// this.bindEvent();
	},
	onLoad: function(){
		this.loadPaymentInfo();
	},
	// bindEvent: function(){
	// 	var _this = this;
	// 	$(document).on('click', '.order-cancel', function(){
	// 		if(window.confirm('确认取消该订单吗？请三思而后行~')){
	// 			_order.cancelOrder(_this.data.orderNumber, function(res){
	// 				_mm.successTip('该订单取消成功！');
	// 				_this.loadDetail();
	// 			}, function(errMsg){
	// 				_mm.errorTip(errMsg);
	// 			});
	// 		}
	// 	});
	// },
	//加载订单列表
	loadPaymentInfo: function(){
		var _this = this,
			paymentHtml ='',
			$pageWrap = $('.page-wrap');
			$pageWrap.html('<div class="loading"></div>');
			_payment.getPaymentInfo(_this.data.orderNumber, function(res){
				//渲染html
				paymentHtml = _mm.renderHtml(templateIndex, res);
				$pageWrap.html(paymentHtml);
				_this.listenOrderStatus();
			}, function(errMsg){
				$pageWrap.html('<p class="error-tip">' + errMsg +'</p>');
			});
	},
	listenOrderStatus: function(){
		var _this = this;
		/*
			功能：按照指定的周期（以毫秒计）来调用函数或计算表达式
			注：setInterval()方法会不停地调用函数，直到用clearInterval()终止定时或窗口被关闭。
				5e3表示，5乘以10的3次方；这是科学计数法
		*/ 
		window.setInterval(function(){
			this.paymentTimer = _payment.getPaymentStatus(_this.data.orderNumber, function(res){
				if(res === true){
					window.location.href = './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
				}
			})
		}, 5e3);
	}
};

$(function(){
	page.init();
});