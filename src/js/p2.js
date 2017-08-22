import $ from 'jquery';
import P2Chart1 from './../chart/p2Chart1.js';
import P2Chart2 from './../chart/p2Chart2.js';
import P2LeftChart from './../chart/p2LeftChart.js';
import Wchart from '../chart/wchart.js';

let p2Chart1 = new P2Chart1(document.getElementById('chartPi'));
let data1 = [{
	name: '计划完成情况',
	value: 62.08
}];
p2Chart1.setDataProvider(data1);
Wchart(1540,920);
let p2Chart2 = new P2Chart2(document.getElementById('chart2'));
let data2 = [{
	seriesName: '日均产油量',
	dataList: [{
		name: '2017-01',
		value: 359.03
	}, {
		name: '2017-02',
		value: 366.28
	}, {
		name: '2017-03',
		value: 375.52
	}, {
		name: '2017-04',
		value: 362.11
	}, {
		name: '2017-05',
		value: 373.18
	}, {
		name: '2017-06',
		value: 377.59
	}, {
		name: '2017-07',
		value: 367.91
	}, {
		name: '2017-08',
		value: 355.12
	}, {
		name: '2017-09',
		value: 337.68
	}, {
		name: '2017-10',
		value: 359.15
	}, {
		name: '2017-11',
		value: 362.37
	}, {
		name: '2017-12',
		value: 347.53
	}]
}, {
	seriesName: '计划',
	dataList: [{
		name: '2017-01',
		value: 340
	}, {
		name: '2017-02',
		value: 320
	}, {
		name: '2017-03',
		value: 324
	}, {
		name: '2017-04',
		value: 356
	}, {
		name: '2017-05',
		value: 330
	}, {
		name: '2017-06',
		value: 362
	}, {
		name: '2017-07',
		value: 350
	}, {
		name: '2017-08',
		value: 340
	}, {
		name: '2017-09',
		value: 322
	}, {
		name: '2017-10',
		value: 340
	}, {
		name: '2017-11',
		value: 320
	}, {
		name: '2017-12',
		value: 330
	}]
}];
p2Chart2.setDataProvider(data2);

let p2LeftChart = new P2LeftChart(document.getElementById('leftchart'));
let leftData = [{
	seriesName:'前周日均产油量',
	dataList:[{
		name:'伊拉克鲁迈拉项目',
		value:112.505
	},{
		name:'加拿大都沃内项目',
		value:27.418
	},{
		name:'苏丹 1/2/4区项目',
		value:56.148
	}]
},{
	seriesName:'上周日均产油量',
	dataList:[{
		name:'伊拉克鲁迈拉项目',
		value:113.912
	},{
		name:'加拿大都沃内项目',
		value:32.651
	},{
		name:'苏丹 1/2/4区项目',
		value:63.357
	}]
}];

let p2RightChart = new P2LeftChart(document.getElementById('rightchart'));
let rightData = [{
	seriesName:'前周日均产油量',
	dataList:[{
		name:'伊拉克西古尔纳一期项目',
		value:39.607
	},{
		name:'珍珠项目',
		value:14.316
	},{
		name:'阿曼项目',
		value:6.923
	}]
},{
	seriesName:'上周日均产油量',
	dataList:[{
		name:'伊拉克西古尔纳一期项目',
		value:38.572
	},{
		name:'珍珠项目',
		value:12.546
	},{
		name:'阿曼项目',
		value:6.319
	}]
}]

let $leftbtn = $('#leftbtn');
let $rightbtn = $('#rightbtn');
let $main = $('#main');
let iNow = 1;
let bFirst1 = true;
let bFirst2 = true;

$leftbtn.click(function(){
	switch(iNow){
		case 0:
			return;
			break;
		case 2:
			new TweenMax($main,3.0,{
				left:-1920,
				ease: Power4.easeOut
			})
			$rightbtn.removeClass('silent');
			iNow = 1;
			break;
		default :
			$(this).addClass('silent')
			new TweenMax($main,3.0,{
				left:0,
				ease: Power4.easeOut,
				onStart:function(){
					if (bFirst1) {
						bFirst1 = false;
					}else{
						return;
					}
					p2LeftChart.setDataProvider(leftData);
				}
			})
			iNow = 0;
			break;
	}
})

$rightbtn.click(function(){
	switch(iNow){
		case 2:
			return;
			break;
		case 0:
			new TweenMax($main,3.0,{
				left:-1920,
				ease: Power4.easeOut
			})
			$leftbtn.removeClass('silent');
			iNow = 1;
			break;
		default :
			$(this).addClass('silent')
			new TweenMax($main,3.0,{
				left:-3840,
				ease: Power4.easeOut,
				onStart:function(){
					if (bFirst2) {
						bFirst2 = false;
					}else{
						return;
					}
					p2RightChart.setDataProvider(rightData);
				}
			})
			iNow = 2;
			break;
	}
})