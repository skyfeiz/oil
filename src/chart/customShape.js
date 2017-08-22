import zrender from 'zrender';
import RectShape from "zrender/lib/graphic/shape/Rect.js";
import CircleShape from "zrender/lib/graphic/shape/Circle.js";
import Group from "zrender/lib/container/Group";

class CustomShape {
	constructor(opts) {
		this.init(opts)
	}
	init(opts){

		let w = opts.w || 120;
		let color = opts.color || '#00eaff';

		this.duration = opts.duration || 0;
		this.valueText = opts.valueText || null;
		this.zr = opts.zr;

		if (!opts.h) {
			console.warn('类CustomShape需要传入高度h');
		}
		if (!opts.x || !opts.y) {
			console.warn('类CustomShape需要传入中心点x,y');
		}
		let h = opts.h;
		let x = opts.x;
		let y = opts.y;
		this.y = y;

		// 小圆的半径
		this.cR = 8;
		if (h<this.cR*6) {
			h = this.cR*6;
		}

		this.group = new Group();

		// 限制区域
		this.limitRect = new RectShape({
			shape: {
				x: x - w / 2,
				y: y - h - 4,
				width: w,
				height: h + 4
			}
		})
		this.group.setClipPath(this.limitRect);

		// 画矩形
		this.rect = new RectShape({
			shape: {
				x: x - w / 2,
				y: y - h,
				width: w,
				height: h
			},
			style: {
				fill: color
			}
		})

		// 画 6的 圆
		let arr = [y - this.cR, y - h / 2, y - h + this.cR];
		this.circlrArr =  [];
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < 2; j++) {
				let circle = new CircleShape({
					shape: {
						cx: x - (j * 2 - 1) * w / 2,
						cy: arr[i],
						r: this.cR
					},
					style: {
						fill: color
					}
				})
				this.circlrArr.push(circle);
			}
		}
		//　画上方突出的被截掉的圆
		this.topCircle = new CircleShape({
			shape: {
				cx: x + 20,
				cy: y - h,
				r: this.cR + 2
			},
			style: {
				fill: color
			}
		})
		this.group.add(this.topCircle);
		this.animation(opts.onComplete);
	}

	animation(fn){
		let _this = this;
		if (!this.duration) {
			this.zr.add(this.rect);
			for (let i = 0; i < this.circlrArr.length; i++) {
				this.zr.add(this.circlrArr[i]);
			}
			this.zr.add(this.group);
		}else{
			let itargetH = this.rect.shape.height;
			let itargetY = this.rect.shape.y;
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

			let tItgY = this.topCircle.shape.cy;
			this.topCircle.shape.cy = itargetY + itargetH - this.cR * 6
			this.zr.add(this.group);
			this.topCircle.animateShape().when(this.duration,{
				cy:tItgY
			}).start();

			if (this.valueText) {
				let nItg = this.valueText.style.text;
				let nItgY = this.valueText.style.y;
				this.valueText.style.y = itargetY + itargetH - this.cR * 6 - 20;
				this.valueText.style.text = 0;
				this.valueText.style.pecent = 0;
				this.zr.add(this.valueText);
				this.valueText.animateStyle().when(this.duration,{
					y:nItgY,
					pecent:1
				}).start().during(function(){
					_this.valueText.style.text = (_this.valueText.style.pecent * nItg).toFixed(3);
				});
			}
		}
	}

}
module.exports = CustomShape;