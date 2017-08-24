import zrender from 'zrender';
import RectShape from "zrender/lib/graphic/shape/Rect";
import CircleShape from "zrender/lib/graphic/shape/Circle";
import Group from "zrender/lib/container/Group";
import LineShape from "zrender/lib/graphic/shape/Line";
import TextShape from "zrender/lib/graphic/Text";
import ImageShape from "zrender/lib/graphic/Image";
import PolylineShape from "zrender/lib/graphic/Shape/Polyline";

class GirdXY {
	constructor(opts) {
		this.zr = zrender.inie(opts.dom);
		// 区域的宽高
		this.W = opts.W;
		this.H = opts.H;

		// 原点的坐标;
		this.x = opts.x;
		this.y = opts.y;

		// 默认X轴为类目轴
		this.categoryName = opts.category || 'X';

		init();
	}
	init() {

		

	}

	/**
	 * [getMaxValue] 
	 * 1 根据传入的数值，计算得到最大的值
	 * 2 轴分5段或者6段，所以得到的数必须是5或者6的倍数(暂时不考虑需要小数的情况);
	 * 3 如何判定到底是5还是6的倍数？
	 * @param  {[type]} n [description]
	 * @return {[type]}   [description]
	 */
	
	getMaxValue(n) {

		
	}
}