import $ from 'jquery';
import Wchart from '../chart/wchart.js';
Wchart(1540,920);

var $imgs = $('#imgs');
$.getJSON('asset/imgList.json', null, function(data) {
    var imgs = data.data;
    var totalNum = imgs.length;

    var str = '';
    for (var i = totalNum - 1; i >= 0; i--) {
        var item = imgs[i];

        str+='<li><h3>' + item.title + '</h3><h4>' + item.name1 + '</h4><p>' + item.content1 + '</p><h4>' + item.name2 + '</h4><p>' + item.content2 + '</p></li>';
    }
    $imgs.html(str);
})