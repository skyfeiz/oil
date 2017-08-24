import $ from 'jquery';

import zrender from 'zrender';
import RectShape from "zrender/lib/graphic/shape/Rect";
import CircleShape from "zrender/lib/graphic/shape/Circle";
import Group from "zrender/lib/container/Group";
import LineShape from "zrender/lib/graphic/shape/Line";
import TextShape from "zrender/lib/graphic/Text";
import ImageShape from "zrender/lib/graphic/Image";
import PolylineShape from "zrender/lib/graphic/Shape/Polyline";

import BarItem from "./barItem.js";

class P2Chart2 {
	constructor(dom) {
		this.zr = zrender.init(dom);

		this.$dom = $(dom);

		this.W = $(dom).width();
		this.H = $(dom).height();

		// 坐标轴的区域
		this.zone = {
			left: 60,
			top: 100,
			right: 0,
			bottom: 60
		};

		this.itemW = 58;

		this.legendImgArr = ['imgs/p2/icon1.png','imgs/p2/icon2.png'];
	}

	setConfig(value) {
		this._config = value;
	}

	setDataProvider(value) {
		this._dataProvider = value;
		this.creationContent();
	}

	creationContent() {
		let _this = this;
		let max = 0;
		for (let i = 0; i < this._dataProvider.length; i++) {
			for (let j = 0; j < this._dataProvider[i].dataList.length; j++) {
				let iValue = this._dataProvider[i].dataList[j].value;
				if (max < iValue) {
					max = iValue;
				}
			}
			this.drawLegend(this.W - this.zone.right - 270 + 170*i,40,this._dataProvider[i].seriesName,this.legendImgArr[i]);
		}
		let yMax = this.getMax(max);
		this.createGrid(yMax, this._dataProvider[0].dataList);

		let tH = this.H - this.zone.top - this.zone.bottom;
		for (var i = 0; i < this._dataProvider[0].dataList.length; i++) {
			let iValue = this._dataProvider[0].dataList[i].value;
			let iH = iValue / yMax * tH;
			let w = (i + 0.6) * (this.W - this.zone.right - this.zone.left) / this._dataProvider[0].dataList.length;
			let oldY = this.H - this.zone.bottom - 40;
			let img = new ImageShape({
				style:{
					x:this.zone.left - 3 + w - 1 - 22,
					y:oldY,
					width:43,
					height:46,
					image:'imgs/p2/barTop.png'
				}
			})
			this.zr.add(img);
			let text = new TextShape({
				style:{
					x:this.zone.left - 3 + w - 1,
					y:oldY - 8,
					text:0,
					fill:'#fff',
					font: 'normal 30px DIN MEDIUM',
					textAlign:'center'
				}
			})
			this.zr.add(text);
			new BarItem({
				x: this.zone.left - 3 + w - 1,
				y: this.H - this.zone.bottom,
				h:iH,
				zr:this.zr,
				duration:1000,
				delay:i*100,
				onComplete:function(){
					_this.drawPoints(_this.zone.left - 3 + w - 1,_this.H - _this.zone.bottom,iH);
				},
				during:function(percent){
					img.style.y = oldY - iH * percent;
					img.dirty();

					text.style.text = (iValue * percent).toFixed(2);
					text.style.y = oldY - iH * percent - 8;
					text.dirty();
				}
			})

		}
		let linesArr = [];
		for (var i = 0; i < this._dataProvider[1].dataList.length; i++) {
			let iValue = this._dataProvider[1].dataList[i].value;
			let w = (i + 0.6) * (this.W - this.zone.right - this.zone.left) / this._dataProvider[0].dataList.length;
			let iH = iValue / yMax * tH;
			let x = this.zone.left - 3 + w - 1;
			let y = this.H - this.zone.bottom - iH;
			linesArr.push([x,y])
		}
		let lines = new PolylineShape({
			shape:{
				points:linesArr
			},
			style:{
				stroke:'#ff9800',
				lineWidth:4
			},
			zlevel:3
		})
		for (var i = 0; i < linesArr.length; i++) {
			this.drawLineNode(linesArr[i][0],linesArr[i][1]);
		}
		let group = new Group();
		this.zr.add(group);
		let limitRect = new RectShape({
			shape:{
				x:linesArr[0][0],
				y:0,
				width:0,
				height:this.H
			}
		})
		group.setClipPath(limitRect);
		group.add(lines);
		limitRect.animateShape().when(2000,{
			width:linesArr[linesArr.length - 1][0]
		}).start();
	}
	/**
	 * [createGrid description]
	 * @param  {[number]} max y轴数据的最大值
	 * @param  {[array]} arr x轴的类目名数组
	 */
	createGrid(yMax, arr) {
		let lineY = new LineShape({
			shape: {
				x1: this.zone.left,
				y1: this.zone.top,
				x2: this.zone.left,
				y2: this.H - this.zone.bottom
			},
			style: {
				stroke: '#0485d8',
				lineWidth: 1
			}
		})
		this.zr.add(lineY);

		let textYName = new TextShape({
			style: {
				x: this.zone.left - 10,
				y: this.zone.top - 30,
				fill: '#ccd7e3',
				font: 'normal 20px Microsoft Yahei',
				text: '千吨/日',
				textAlign: 'center'
			}
		})
		this.zr.add(textYName);

		// y轴打点 6个点

		for (let i = 0; i <= 6; i++) {
			let h = i / 6 * (this.H - this.zone.bottom - this.zone.top);
			let rect = new RectShape({
				shape: {
					x: this.zone.left - 3,
					y: this.H - this.zone.bottom - h - 1,
					width: 3,
					height: 3
				},
				style: {
					fill: '#ffe600'
				}
			})
			this.zr.add(rect);
			let line = new LineShape({
				shape: {
					x1: this.zone.left,
					y1: this.H - this.zone.bottom - h,
					x2: this.W - this.zone.right,
					y2: this.H - this.zone.bottom - h
				},
				style: {
					stroke: 'rgba(4,133,216,0.5)'
				}
			})
			this.zr.add(line);
			let text = new TextShape({
				style: {
					x: 50,
					y: this.H - this.zone.bottom - h + 8,
					text: yMax / 6 * i,
					fill: '#8df3ff',
					font: 'normal 20px DIN MEDIUM',
					textAlign: 'right'
				}
			})
			this.zr.add(text);
		}
		let lineX = new LineShape({
			shape: {
				x1: this.zone.left,
				y1: this.H - this.zone.bottom,
				x2: this.W - this.zone.right,
				y2: this.H - this.zone.bottom
			},
			style: {
				stroke: '#0485d8',
				lineWidth: 1
			}
		})
		this.zr.add(lineX);
		for (let i = 0; i < arr.length; i++) {
			let w = (i + 0.6) * (this.W - this.zone.right - this.zone.left) / arr.length;
			let rect = new RectShape({
				shape: {
					x: this.zone.left - 3 + w - 1,
					y: this.H - this.zone.bottom,
					width: 3,
					height: 3
				},
				style: {
					fill: '#ffe600'
				}
			})
			this.zr.add(rect);
			let text = new TextShape({
				style: {
					x: this.zone.left - 3 + w,
					y: this.H - this.zone.bottom + 30,
					text: arr[i].name,
					fill: '#8df3ff',
					font: 'normal 20px DIN MEDIUM',
					textAlign: 'center'
				}
			})
			this.zr.add(text);
		}
	}

	drawLegend(x, y, name, imgSrc) {
		let img = new ImageShape({
			style: {
				x: x,
				y: y - 14,
				width: 37,
				height: 14,
				image:imgSrc
			}
		})
		this.zr.add(img);
		let text = new TextShape({
			style: {
				x: x + 40,
				y: y,
				fill: '#ccd7e3',
				font: 'normal 20px Microsoft Yahei',
				text: name,
			}
		})
		this.zr.add(text);
	}

	drawLineNode(x,y){
		let circle1 = new CircleShape({
			shape:{
				cx:x,
				cy:y,
				r:7
			},
			zlevel:5,
			style:{
				fill:'#cc0100'
			}
		})
		let circle2 = new CircleShape({
			shape:{
				cx:x,
				cy:y,
				r:4
			},
			zlevel:6,
			style:{
				fill:'#fff'
			}
		})
		this.zr.add(circle2)
		this.zr.add(circle1)
		let shadow = new CircleShape({
			shape:{
				cx:x,
				cy:y,
				r:18
			},
			zlevel:4,
			style:{
				fill:'rgba(255,230,0,0.4)'
			}
		})
		this.zr.add(shadow);
		shadow.hide();
		circle2.on('mouseover',function(){
			shadow.shape.x = this.shape.x;
			shadow.shape.y = this.shape.y;
			shadow.shape.r = 8;
			shadow.animateShape().when(100,{
				r:16
			}).start();
			shadow.show();
		})
		circle2.on('mouseout',function(){
			shadow.animateShape().when(100,{
				r:8
			}).start().done(function(){
				shadow.hide();
			});
		})
	}

	drawPoints(x,y,h){
		let nPoints = 50;
		let group = new Group();
		this.zr.add(group);
		let rect = new RectShape({
			shape:{
				x:x - this.itemW/2,
				y:y - h,
				width:this.itemW,
				height:h,
			}
		});
		group.setClipPath(rect);
		for (let i = 0; i < nPoints; i++) {
			let rnX = Math.random() * 50 - 25;
			let rnY = Math.random() * 8;
			let rnT = Math.random() * 2000;
			let rnD = Math.random() * 3000+3000;
			let circle = new CircleShape({
				shape:{
					cx:x - rnX,
					cy:y - rnY + 10,
					r:1
				},
				zlevel:1,
				style:{
					fill:'rgba(255,230,0,1)'
				}
			})
			group.add(circle);
			circle.animateShape(true).when(rnD,{
				cx:x,
				cy:y - h
			}).delay(rnT).start();
			circle.animateStyle(true).when(rnD,{
				fill:'rgba(255,230,0,0)'
			}).delay(rnT).start();
		}
	}

	//根据 n 取得最大值，该最大值必须是6的倍数
	getMax(N) {
		N *= 1.2;
		return n6(6);

		function n6(n) {
			if (n > N) {
				return n;
			} else {
				return n6(6 + n);
			}
		}
	}
}
module.exports = P2Chart2;