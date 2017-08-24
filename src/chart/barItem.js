import zrender from 'zrender';
import ImageShape from "zrender/lib/graphic/Image";
import RectShape from "zrender/lib/graphic/shape/Rect";
import PolygonShape from 'zrender/lib/graphic/shape/Polygon';
import LineGradient from "zrender/lib/graphic/LinearGradient";
import Group from "zrender/lib/container/Group";

class BarItem {
	constructor(opts) {
		this.init(opts)
	}
	init(opts) {
		let w = opts.w || 58;
		let delay = opts.delay || 0;

		if (!opts.h) {
			console.warn('类BarItem需要传入高度h');
		}
		if (!opts.x || !opts.y) {
			console.warn('类BarItem需要传入中心点x,y');
		}
		let h = opts.h;
		let x = opts.x;
		let y = opts.y;

		let zr = opts.zr;

		let group = new Group();
		let limitRect = new RectShape({
			shape: {
				x: x - w / 2,
				y: y - h,
				width: w,
				height: h
			}
		});
		group.setClipPath(limitRect);
		zr.add(group);

		let polygon = new PolygonShape({
			shape: {
				points: [
					[x - w / 2, y + 1],
					[x - 6, y - h],
					[x, y - h + 7],
					[x + 6, y - h],
					[x + w / 2, y + 1]
				]
			},
			zlevel:2,
			style:{
				stroke:'rgba(47,171,151,1)',
				fill:new LineGradient(0, 1, 0, 0, [{
	                offset: 1,
	                color: 'rgba(2,252,243,0.7)'
	            },{
	                offset: 0,
	                color: 'rgba(3,71,141,0.3)'
	            }], false) 
			}
		})
		group.origin = [x,y];
		group.add(polygon);
		group.scale = [1,1];
		if (opts.duration) {
			group.add(polygon);
			group.scale = [1,0];
			group.pecent = 0;
			group.animate().when(opts.duration,{
				scale:[1,1],
				pecent:1,
			}).start().during(function(){
				opts.during && opts.during(group.pecent);
			}).done(function(){
				opts.onComplete && opts.onComplete();
			})
		}else{
			group.add(polygon);
		}
	}
}

module.exports = BarItem;