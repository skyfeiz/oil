import $ from 'jquery';
import zrender from 'zrender';
import CircleShape from "zrender/lib/graphic/shape/Circle";
import DropletShape from "zrender/lib/graphic/shape/Droplet";
import Group from "zrender/lib/container/Group";

class DropletBg{
	constructor(opts){
		if (!opts.dom) {
			console.warn('类DropletBg需要传入dom');
			return;
		}
		this.dropColor = opts.dropColor || '#016eb9',
		this.dashColor = opts.dashColor || 'rgba(20,109,191,1)',
		this.delay = opts.delay || 0;

		this.zr = zrender.init(opts.dom);
		let $dom = $(opts.dom);
		// 传入的dom应该为正方形 宽高相等;
		this.W = $dom.width();
		this.init();
	}

	init(opts){
		let _this = this;
		let group = new Group();

		let dropW = 11;
		let dropH = 30;
		let w2 = this.W/2;
		let limitCircle = new CircleShape({
			shape:{
				cx:w2,
				cy:w2,
				r:w2
			},
			style:{
				stroke:'red',
				fill:'none'
			}
		});
		group.setClipPath(limitCircle);
		this.zr.add(group);
		let droplet = new DropletShape({
			shape:{
				cx:w2,
				cy:w2 + dropH/2 - dropW,
				width:dropW,
				height:dropH
			},
			style:{
				fill:this.dropColor
			}
		});
		this.zr.add(droplet);

		let sR = 30;
		for (var i = 0; i < 3; i++) {
			let circle = new CircleShape({
				shape:{
					cx:w2,
					cy:w2,
					r:0,
				},
				style:{
					stroke:this.dashColor,
					fill:'none',
					lineDash:[2,4]
				}
			})
			group.add(circle);

			circle.animateShape(true).when(6000,{
				r:sR*9
			}).delay(500*i+this.delay-300).start();

			circle.animateStyle(true).when(6000,{
				stroke:'rgba(20,109,191,0)'
			}).delay(500*i+this.delay-300).start();
		}
	}
}
module.exports = DropletBg;