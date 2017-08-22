import $ from 'jquery';
import zrender from 'zrender';
import CircleShape from "zrender/lib/graphic/shape/Circle";
import ImageShape from "zrender/lib/graphic/Image.js";

function Mark(x,y){
	let w = 364;
	let h = 69;
	let $div = $('<div><div>');
	$('.root').append($div);
	$div.css({
		width:w,
		height:h,
		position:'absolute',
		left:x,
		top:y
	})
	let zr = zrender.init($div[0]);
	let www = new ImageShape({
		style:{
			x:0,
			y:0,
			image:'imgs/header/www.png',
			width:w,
			height:h
		}
	})
	zr.add(www);
}
module.exports = Mark;