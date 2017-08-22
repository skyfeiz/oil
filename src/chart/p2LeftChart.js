import $ from 'jquery';

import zrender from 'zrender';
import RectShape from "zrender/lib/graphic/shape/Rect.js";
import CircleShape from "zrender/lib/graphic/shape/Circle.js";
import Group from "zrender/lib/container/Group";
import LineShape from "zrender/lib/graphic/shape/Line";
import TextShape from "zrender/lib/graphic/Text";
import ImageShape from "zrender/lib/graphic/Image.js";

import CustomShape from "./customShape.js";

class P2LeftChart {
	constructor(dom) {
		this.$dom = $(dom);

		this.W = $(dom).width();
		this.H = $(dom).height();

		this.barW = 120;
		this.barColors = ['#00eaff', '#0a9fff'];

		this.imgArr = ['imgs/p2/arrow_up.png','imgs/p2/fall.png'];

		// 坐标轴的区域
		this.zone = {
			left: 60,
			top: 100,
			right: 0,
			bottom: 60
		};

		this.zr = zrender.init(dom);
	}

	setConfig(value) {
		this._config = value;
	}

	setDataProvider(value) {
		this._dataProvider = value;
		this.creationContent();
	}

	creationContent() {
		let max = 0;
		let _this = this;
		// 二维数组 [[40,50,60],[35,56,45]]
		let dataArr = [];
		for (let i = 0; i < this._dataProvider.length; i++) {
			let arr = [];
			for (let j = 0; j < this._dataProvider[i].dataList.length; j++) {
				let iValue = this._dataProvider[i].dataList[j].value;
				arr.push(iValue);
				if (max < iValue) {
					max = iValue;
				}
			}
			dataArr.push(arr);
		}
		let yMax = this.getMax(max);
		this.createGrid(yMax, this._dataProvider[0].dataList);

		// 画柱状图
		let tH = this.H - this.zone.top - this.zone.bottom;
		for (let i = 0; i < this._dataProvider.length; i++) {
			for (let j = 0; j < this._dataProvider[i].dataList.length; j++) {
				let iValue = this._dataProvider[i].dataList[j].value;
				let iH = iValue / yMax * tH;
				let w = (j + 0.6) * (this.W - this.zone.right - this.zone.left ) / 3.2;
				let text = new TextShape({
					style: {
						x: _this.zone.left - 3 + w - 1 + (2 * i - 1) * (27 + _this.barW / 2),
						y: _this.H - _this.zone.bottom - iH - 20,
						fill: '#fff',
						font: 'normal 30px DIN MEDIUM',
						text: iValue,
						textAlign: 'center'
					}
				});
				new CustomShape({
					zr: this.zr,
					x: this.zone.left - 3 + w - 1 + (2 * i - 1) * (27 + this.barW / 2),
					y: this.H - this.zone.bottom,
					w: this.barW,
					h: iH,
					color: this.barColors[i],
					duration: 2000,
					valueText: text,
					onComplete: function() {
						_this.drawUpTip(dataArr);
					}
				});
			}
			this.drawLegend(this.W - 180,40+30*i,this._dataProvider[i].seriesName,this.barColors[i]);
		}
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
				y: this.zone.top - 20,
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
			let w = (i + 0.6) * (this.W - this.zone.right - this.zone.left ) / 3.2;
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
			let line = new LineShape({
				shape: {
					x1: this.zone.left - 3 + w,
					y1: this.H - this.zone.bottom,
					x2: this.zone.left - 3 + w,
					y2: this.zone.top,
				},
				style: {
					stroke: '#00eaff',
					lineDash: [2, 2]
				}
			})
			this.zr.add(line);
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

	drawUpTip(dataArr) {
		if (this.bOk) {
			return;
		}
		this.bOk = true;
		for (var i = 0; i < dataArr[0].length; i++) {
			let nDis = (dataArr[1][i] - dataArr[0][i]).toFixed(2);
			let nPecnet = (nDis / dataArr[0][i] * 100).toFixed(2);
			let w = (i + 0.6) * (this.W - this.zone.right - this.zone.left ) / 3.2;
			let x = this.zone.left - 3 + w - 1 - 60;
			let y = this.zone.top - 72;
			let img = new ImageShape({
				style: {
					x: x,
					y: y + 12,
					image: this.imgArr[(nDis<0?1:0)],
					width: 20,
					height: 36
				}
			});
			this.zr.add(img);
			let textN1 = new TextShape({
				style: {
					x: x + 29,
					y: y + 20,
					fill: '#00eaff',
					font: 'normal 30px DIN MEDIUM',
					text: nDis,
				}
			})
			this.zr.add(textN1);
			let textU1 = new TextShape({
				style: {
					x: x + 29 + (nDis + '').length * 15,
					y: y + 20,
					fill: '#ccd7e3',
					font: 'normal 18px Microsoft Yahei',
					text: '千吨'
				}
			})
			this.zr.add(textU1);
			let textN2 = new TextShape({
				style: {
					x: x + 29,
					y: y + 50,
					fill: '#00eaff',
					font: 'normal 30px DIN MEDIUM',
					text: nPecnet,
				}
			})
			this.zr.add(textN2);
			let textU2 = new TextShape({
				style: {
					x: x + 29 + (nPecnet + '').length * 15,
					y: y + 50,
					fill: '#ccd7e3',
					font: 'normal 24px Microsoft Yahei',
					text: '%'
				}
			})
			this.zr.add(textU2);
		}
	}

	drawLegend(x,y,name,color){
		let rect = new RectShape({
			shape:{
				x:x,
				y:y-14,
				width:26,
				height:14
			},
			style:{
				fill:color
			}
		})
		this.zr.add(rect);
		let text = new TextShape({
			style:{
				x:x+40,
				y:y,
				fill: '#ccd7e3',
				font: 'normal 20px Microsoft Yahei',
				text: name,
			}
		})
		this.zr.add(text);
	}

	//根据 n 取得最大值，该最大值必须是6的倍数
	getMax(N) {
		N *= 1.1;
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
module.exports = P2LeftChart;