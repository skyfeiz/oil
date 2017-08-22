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
			x:137,
			y:134
		};
		let r = 68;
		let w = 18;

		let circle0 = new CircleShape({
			shape:{
				cx:vec2.x,
				cy:vec2.y,
				r:52,
			},
			style:{
				fill:'none',
				lineWidth:1,
				stroke:'#013854',
			}
		})
		this.zr.add(circle0);
		let circle1 = new CircleShape({
			shape:{
				cx:vec2.x,
				cy:vec2.y,
				r:64,
			},
			style:{
				fill:'none',
				lineWidth:12,
				stroke:'#042554',
			}
		})
		this.zr.add(circle1);
		let circle2 = new CircleShape({
			shape:{
				cx:vec2.x,
				cy:vec2.y,
				r:79,
			},
			style:{
				fill:'none',
				lineWidth:10,
				stroke:'#012046',
			}
		})
		this.zr.add(circle2);
		let circle3 = new CircleShape({
			shape:{
				cx:vec2.x,
				cy:vec2.y,
				r:89,
			},
			style:{
				fill:'none',
				lineWidth:1,
				stroke:'#014e6c',
			}
		})
		this.zr.add(circle3);

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