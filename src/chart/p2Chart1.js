import $ from 'jquery';
import zrender from "zrender";
import CircleShape from "zrender/lib/graphic/shape/Circle";
import ArcShape from "zrender/lib/graphic/shape/Arc";
import TextShape from "zrender/lib/graphic/Text";
import Group from "zrender/lib/container/Group";

class P2Chart1{
	constructor(dom) {
		this.zr = zrender.init(dom);
		this.$dom1 = $(dom).clone();
		$(dom).before(this.$dom1);
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
		let vec2 = {
			x:140,
			y:140
		};
		let r = 64;
		let w = 12;
		let circle = new CircleShape({
			shape:{
				cx:vec2.x,
				cy:vec2.y,
				r:r,
			},
			style:{
				fill:'none',
				lineWidth:w,
				stroke:'#0665a5',
			}
		})
		this.zr.add(circle);

		this.sR = 0;
		for (var i = 0; i < this._dataProvider.length; i++) {
			let value = this._dataProvider[i].value;
			let name = this._dataProvider[i].name;
			let reg = value/100 * Math.PI;
			let arc = new ArcShape({
				shape:{
					cx:vec2.x,
					cy:vec2.y,
					r:r,
					startAngle:-Math.PI/2,
					endAngle:-Math.PI/2,
					percent:0
				},
				style:{
					fill:'none',
					lineWidth:w,
					stroke:'#ff9800',
					lineCap:'round'
				}
			})
			this.zr.add(arc);
			this.$dom1.html('<p class="c_namebox">计划完成情况</p><p class="c_valuebox"><span class="value fl" id="c_valuebox_value">  </span><span class="unit fl">%</span></p>');
			arc.animateShape().when(2000,{
				endAngle:reg,
				percent:1
			}).start().during(function(){
				$('#c_valuebox_value').text((arc.shape.percent*value).toFixed(2));
			});
		}
	}
}
module.exports = P2Chart1;