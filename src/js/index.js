import $ from 'jquery';
import DropletBg from '../chart/dropletBg.js';

let $navlis = $('#navUl').find('li');

$navlis.click(function(){
	if (!$(this).find('p')[0]) {return}
	let index = $(this).index();
	if ($(this).hasClass('li2') && $(this).attr('hrefgo')) {
		window.location.href = $(this).attr('hrefgo');
	}
	$navlis.each(function(idx,ele){
		$(ele).attr('class','li'+(idx-index+7)%5);
	})
})

let idArr = ['droplet1','droplet2','droplet3','droplet4'];
for (var i = 0; i < idArr.length; i++) {
	new DropletBg({
		dom:document.getElementById(idArr[i]),
		delay:(i+1)*2000
	})
}