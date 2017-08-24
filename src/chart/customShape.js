import zrender from 'zrender';
import RectShape from "zrender/lib/graphic/shape/Rect.js";
import CircleShape from "zrender/lib/graphic/shape/Circle.js";
import Group from "zrender/lib/container/Group";
import PolygonShape from 'zrender/lib/graphic/shape/Polygon';
import SectorShape from 'zrender/lib/graphic/shape/Sector';
import LineGradient from "zrender/lib/graphic/LinearGradient";
import Pattern from "zrender/lib/graphic/Pattern";
import Image from "zrender/lib/graphic/Image";

class CustomShape {
	constructor(opts) {
		this.init(opts)
	}
	init(opts) {
		let _this = this;

		let imgSrc = opts.imgSrc;


		let w = opts.w || 120;
		let color = opts.color || 'rgba(0,234,255,1)';



		_this.duration = opts.duration || 0;
		_this.valueText = opts.valueText || null;
		_this.zr = opts.zr;

		if (!opts.h) {
			console.warn('类CustomShape需要传入高度h');
		}
		if (!opts.x || !opts.y) {
			console.warn('类CustomShape需要传入中心点x,y');
		}
		let h = opts.h;
		let x = opts.x;
		let y = opts.y;
		_this.y = y;

		// 小圆的半径
		_this.cR = 8;
		if (h < _this.cR * 6) {
			h = _this.cR * 6;
		}

		let objArr = [];

		_this.group = new Group();

		// 限制区域
		_this.limitRect = new RectShape({
			shape: {
				x: x - w / 2,
				y: y - h - 4,
				width: w,
				height: h + 4
			}
		})
		_this.group.setClipPath(_this.limitRect);

		// 画矩形
		_this.rect = new RectShape({
			shape: {
				x: x - w / 2,
				y: y - h,
				width: w,
				height: h
			},
			zlevel: 2,
			style: {
				fill: 'none'
			}
		})
		objArr.push(_this.rect);
		let colorLinear = [{
				offset: 1,
				color: color
			}, {
				offset: 0,
				color: color.substring(0, color.lastIndexOf(',')) + ',0.2)'
			}]
			// _this.drawShaodw(x - w / 2,y - h,w,h,colorLinear,20);

		// 画 6的 圆
		let arr = [y - _this.cR, y - h / 2, y - h + _this.cR];
		_this.circlrArr = [];
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < 2; j++) {
				let sector = new SectorShape({
					shape: {
						cx: x - (j * 2 - 1) * (w / 2),
						cy: arr[i],
						r: _this.cR,
						startAngle: (j * 2 - 1) * Math.PI / 2,
						endAngle: -(j * 2 - 1) * Math.PI / 2
					},
					style: {
						fill: 'none'
					}
				})
				_this.circlrArr.push(sector);
				objArr.push(sector);
			}
		}
		//　画上方突出的被截掉的圆
		_this.topSector = new SectorShape({
			shape: {
				cx: x + 20,
				cy: y - h,
				r: _this.cR + 2,
				startAngle: -Math.PI,
				endAngle: 0
			},
			style: {
				fill: 'none'
			}
		})
		objArr.push(_this.topSector);

		this.img0Arr = [];
		for (var i = 0; i < objArr.length; i++) {
			let Group00 = new Group();
			Group00.setClipPath(objArr[i]);
			_this.zr.add(Group00);
			let iX = x - w / 2 - _this.cR - 1;
			let iY = y - h - 6;
			let iW = w + _this.cR * 2 + 2;
			let iH = h + 4 + 4;
			let img0 = new Image({
				style: {
					x: iX,
					y: y,
					disY: iY,
					disH: iH,
					width: iW,
					height: 0,
					image: imgSrc
				}
			})
			Group00.add(img0);
			this.img0Arr.push(img0);
		}
		this.animation(opts.onComplete);
	}

	animation(fn) {
		let _this = this;
		if (!this.duration) {
			for (var i = 0; i < this.img0Arr.length; i++) {
				this.img0Arr[i].style.y = this.img0Arr[i].style.disY;
				this.img0Arr[i].style.height = this.img0Arr[i].style.disH;
			}
		} else {
			let itargetH = this.rect.shape.height;
			let itargetY = this.rect.shape.y;
			for (var i = 0; i < this.img0Arr.length; i++) {
				this.img0Arr[i].style.height = this.cR * 6;
				this.img0Arr[i].style.y = itargetY + itargetH - this.cR * 6 - 4;
				this.img0Arr[i].animateStyle().when(this.duration, {
					height: this.img0Arr[i].style.disH,
					y: this.img0Arr[i].style.disY
				}).start().done(function() {
					fn && fn();
				})
			}

			this.rect.shape.height = this.cR * 6;
			this.rect.shape.y = itargetY + itargetH - this.cR * 6;
			this.zr.add(this.rect);
			this.rect.animateShape().when(this.duration,{
				height:itargetH,
				y:itargetY
			}).start().done(function(){
				fn && fn();
			});

			for (let i = 0; i < this.circlrArr.length; i++) {
				let cItgY = this.circlrArr[i].shape.cy;
				this.circlrArr[i].shape.cy = this.y - Math.floor(i/2) * this.cR*2 - this.cR; 
				this.zr.add(this.circlrArr[i]);
				this.circlrArr[i].animateShape().when(this.duration,{
					cy:cItgY
				}).start();
			}

			let lItgY = this.limitRect.shape.y;
			this.limitRect.shape.y = itargetY + itargetH - this.cR * 6 - 4;
			this.limitRect.animateShape().when(this.duration,{
				y:lItgY
			}).start();

			let tItgY = this.topSector.shape.cy;
			this.topSector.shape.cy = itargetY + itargetH - this.cR * 6
			this.zr.add(this.group);
			this.topSector.animateShape().when(this.duration,{
				cy:tItgY
			}).start();

			if (this.valueText) {
				let nItg = this.valueText.style.text;
				let nItgY = this.valueText.style.y;
				this.valueText.style.y = itargetY + itargetH - this.cR * 6 - 20;
				this.valueText.style.text = 0;
				this.valueText.style.pecent = 0;
				this.zr.add(this.valueText);
				this.valueText.animateStyle().when(this.duration, {
					y: nItgY,
					pecent: 1
				}).start().during(function() {
					_this.valueText.style.text = (_this.valueText.style.pecent * nItg).toFixed(3);
				});
			}
		}
	}

}
module.exports = CustomShape;