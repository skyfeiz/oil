import zrender from 'zrender';
import ImageShape from "zrender/lib/graphic/Image.js";
import Group from "zrender/lib/container/Group";

class BarItem{
	constructor(opts){
		this.init(opts)
	}
	init(opts){
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

		let img = new ImageShape({
			style:{
				x:x-w/2,
				y:y-h,
				width:w,
				height:h,
				image:'imgs/p2/barItem.png',
			},
			zlevel:2
		})
		
		if (opts.duration) {
			img.style.height = 0;
			img.style.y = y;
			zr.add(img);
			img.animateStyle().when(opts.duration,{
				height:h,
				y:y-h
			}).delay(delay).start().done(function(){
				opts.onComplete && opts.onComplete();
			});
		}else{
			zr.add(img);
		}
	}
}

module.exports = BarItem;