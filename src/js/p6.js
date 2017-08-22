import $ from 'jquery';
var oGroups;
var oCurrentGroup;
//var oSlider;

oGroups = document.getElementById('groups');
//oSlider = document.getElementById('slider');
_getGroups();

oImgs = document.getElementById('imgs');
oTxt = document.getElementById('txt');
oTemplate = oTxt.innerHTML;

function _getGroups() {
    $.getJSON('asset/groupList.json', null, function(data) {
        var groups = data.data;
        // 创建分组
        var oLi = document.createElement('li');
        oLi.className = 'group';
        for (var i = 0; i < groups.length; i++) {
            // 最右侧的group，设置一个class，在css中去掉右边框
            if (i == groups.length - 1) addClass(oLi, 'rightGroup');
            oLi._data = groups[i];
            oGroups.appendChild(oLi);

            // 创建分组名称
            var oSpan = document.createElement('span');
            oSpan.className = 'groupName';
            oSpan.style.width = '100%';
            oSpan.style.display = 'inline-block';
            oSpan.innerHTML = groups[i].name;
            oLi.appendChild(oSpan);

            oLi.onclick = function() {
                _setCurrentGroup(this);
            }
        }
        // 默认选中第一个
        _setCurrentGroup(oGroups.getElementsByClassName('group')[0]);
    });
}

/**
 * 设置当前分组
 * @param oLi 当前分组对象
 * @private
 */
function _setCurrentGroup(oLi) {
    if (oCurrentGroup) {
        // 清空上一个当前分组的子集
        var children = oCurrentGroup.getElementsByClassName('groupChild');
        for (var i = children.length - 1; i >= 0; i--) {
            oCurrentGroup.removeChild(children[i]);
        }
        oCurrentGroup.onclick = function() {
            _setCurrentGroup(this);
        }
        removeClass(oCurrentGroup, 'currentGroup');
    }
    // 重新设置当前分组，并取消单击事件，否则会和子集的单击事件冲突
    oCurrentGroup = oLi;
    oCurrentGroup.onclick = null;
    addClass(oCurrentGroup, 'currentGroup');

    _getImgs();
}

/**
 * 依据当前分组中图片的长度，创建当前分组的子级
 * @param imgLength
 * @private
 */
function _createGroupChildren(imgLength) {
    // 创建子集
    var w = (oCurrentGroup.offsetWidth - 1) / imgLength;
    var s = 0,
        l = 100,
        liHeight = 44,
        liWidth = '310px',
        spaceS = '100%',
        spaceL = '100%';
    for (var i = 0; i < imgLength; i++) {
        var oSpan = document.createElement('span');
        oSpan.className = 'groupChild';
        oSpan.style.height = liHeight + 'px';
        oSpan.style.width = liWidth;
        oSpan.style.position = 'absolute';
        oSpan.style.top = liHeight * i + 'px';
        oSpan.style.left = 0;
        //oSpan.style.background = 'hsl(' + i + 5 + ', 90%, 50%)';
        //oSpan.style.background = 'hsl(269, ' + s + '%, ' + l + '%)';
        oCurrentGroup.appendChild(oSpan);

        oSpan._index = imgLength - 1 - i;

        s += spaceS;
        l -= spaceL;

        (function(index) {
            oSpan.onclick = function() {
                //先全部删除类名，然后给选中的添加类名active
                for (var j = 0; j < imgLength; j++) {
                    $(".groupName").eq(j).removeClass('active');
                };
                $(".groupName").eq(index).addClass('active');
                _moveImg(this._index, this._index < _currentIndex ? 'right' : 'left');
            }
        })(i)

    }

    // 设置滑块位置，默认选中当前分组的第一个
    // oSlider.style.width = w - 1 + 'px';
    // oSlider.style.left = oCurrentGroup.getElementsByTagName('span')[0].offsetLeft + 'px';
    // oSlider.style.display = 'block';
}

//------------------------------------------

var oImgs; // ul容器
var aLis; // 存放所有的li jQuery对象
var oTxt; // 用于显示图片描述信息HTML的容器
var oTemplate; // 图片描述信息的HTML模板

var totalNum = 0,
    successNum = 0,
    errorNum = 0;
var maxW = 0,
    maxH = 0;

var _currentIndex;

// window.onkeydown = function(evt)
// {
//     if (aLis == null) return;
//     var oEvent = evt || event;
//     switch (oEvent.keyCode)
//     {
//         case 37:
//             if(_currentIndex < aLis.length)
//             {
//                 _moveImg(_currentIndex + 1, 'left');
//             }
//             break;
//         case 39:
//             if (_currentIndex > 0)
//             {
//                 _moveImg(_currentIndex - 1, 'right');
//             }
//             break;
//     }
//     // 取消事件的默认行为，防止页面横向滚动
//     oEvent.preventDefault();
// }

function _getImgs() {
    aLis = [];
    totalNum = successNum = errorNum = maxW = maxH = 0;
    //先将原来的清空
    while (oImgs.hasChildNodes()) {
        oImgs.removeChild(oImgs.firstChild);
    }

    var _maxW = 816,
        _maxH = 560;

    $.getJSON('asset/imgList.json', null, function(data) {
        var imgs = data.data;
        totalNum = imgs.length;
        _createGroupChildren(totalNum);

        for (var i = totalNum - 1; i >= 0; i--) {
            var item = imgs[i];

            var oLi = document.createElement('li');
            for (var j = 0; j < 4; j++) {
                var disc = document.createElement('img');
                disc.src = "imgs/p6/disc.png";
                oLi.appendChild(disc);
            }


            oLi._index = totalNum - 1 - i;
            oLi._data = item;
            oLi.style.width = _maxW + 'px';
            oLi.style.height = _maxH + 'px';
            //oLi.innerHTML = '<h3>' + item.title + '</h3><h4>' + item.name1 + '</h4><p>' + item.content1 + '</p><h4>' + item.name2 + '</h4><p>' + item.content2 + '</p>';
            oImgs.appendChild(oLi);


            // var oImg = document.createElement('img');
            // oImg.src = item.url;
            var oImga = document.createElement('p');
            oImga.style.color = "#fff";
            oImga.innerHTML = '<h3>' + item.title + '</h3><h4>' + item.name1 + '</h4><p>' + item.content1 + '</p><h4>' + item.name2 + '</h4><p>' + item.content2 + '</p>';;
            // oLi.appendChild(oImg);
            oLi.appendChild(oImga);

            var oSpan = document.createElement('span');
            oSpan.className = 'liMask';
            oLi.appendChild(oSpan);

            // oSpan = document.createElement('span');
            // oSpan.className = 'fullscreen';
            // oLi.appendChild(oSpan);

            // oSpan.onclick = function(evt) {
            //     var oEvent = evt || event;
            //     _zoomInImg();
            //     oEvent.stopImmediatePropagation();
            // }
            var that = oImga;

            // oImg.onload = function() {
            //统计所有图片的最大尺寸
            maxW = Math.max(maxW, 1440);
            maxH = Math.max(maxH, 900);
            // 限定最大尺寸，_maxW、_maxH到时需要根据浏览器的尺寸计算
            maxW = Math.min(maxW, _maxW);
            maxH = Math.min(maxH, _maxH);

            var oj_li = $(that.parentNode);
            //console.log(this.parentNode)
            oj_li._showW = maxW;
            oj_li._showH = maxH;
            //oj_li._originW = this.width;
            //oj_li._originH = this.height;
            oj_li._index = that.parentNode._index;
            oj_li._data = that.parentNode._data;
            aLis.push(oj_li);

            successNum++;
            _doCheckImgLoad();
            // };
            // oImg.onerror = function() {
            //     errorNum++;
            //     this.alt = '未加载到图片。';

            //     var oj_li = $(this.parentNode);
            //     oj_li._showW = Math.min(maxW, this.width);
            //     oj_li._showH = Math.min(maxH, this.height);
            //     oj_li._index = this.parentNode._index;
            //     oj_li._data = this.parentNode._data;
            //     oj_li._dataError = true;
            //     aLis.push(oj_li);

            //     _doCheckImgLoad();
            // }

        }
    })
}

function _doCheckImgLoad() {
    if (successNum + errorNum == totalNum) {
        $(oImgs).css({
            width: maxW + 'px',
            height: maxH + 'px',
            display: 'block',
            left: 1920 / 2 - maxW * 2 / 3 + 'px',
            top: 1080 / 2 - maxH / 2 - 50 + 'px'
        });
        oTxt.style.left = oImgs.offsetLeft + 20 + maxW + 'px';
        oTxt.style.display = 'block';

        aLis.sort(function(a, b) {
            return a._index - b._index;
        });

        for (var i = 0; i < aLis.length; i++) {
            var oLi = aLis[i];
            oLi.css({
                left: '-300px',
                top: maxH / 2 + 'px',
                width: '0',
                height: '0',
                opacity: 0.2
            });

            var timer; // 解决单击、双击冲突
            oLi.click(function() {
                var current = this;
                timer = setTimeout(function() {
                    _moveImg(current._index, 'right');
                }, 250);
            });
            oLi.dblclick(function() {
                clearTimeout(timer);
                if (this._index != _currentIndex || this._dataError) return;
                oCurrentLi = this;
                _compareImg();
            });

            //createReflection(oLi);
        }

        _currentIndex = aLis.length - 1;
        _moveImg(_currentIndex, 'right');
    }
}


//-------------------- 展示对比图片 -----------------------

var oTop, oMask, oCurrentLi, oCurrentImg;

function _compareImg() {
    //if (oTop instanceof undefined) oTop = document.getElementById('top');
    //if (oMask instanceof undefined) oMask = document.getElementById('mask');
    oTop = document.getElementById('top');
    oMask = document.getElementById('mask');

    // 创建对比图片
    var oImg = document.createElement('img');
    oImg.src = 'imgs/p6/3.jpg';
    oTop.appendChild(oImg);

    // 将原图片添加到oTop中
    oCurrentImg = oCurrentLi.getElementsByTagName('img')[0];
    oTop.appendChild(oCurrentImg);

    oCurrentImg.className = oImg.className = 'compare';

    oTop.style.display = oMask.style.display = 'block';
    oMask.style.opacity = 1;

    // 设置原图片和对比图片的style
    oCurrentImg.style.width = oImg.style.width = oCurrentLi.offsetWidth - 100 + 'px';
    oCurrentImg.style.height = oImg.style.height = oCurrentLi.offsetHeight - 100 + 'px';
    oCurrentImg.style.top = oImg.style.top = oImgs.offsetTop + 50 + 'px';
    oCurrentImg.style.left = oImg.style.left = oImgs.offsetLeft + 'px';

    addClass(oCurrentImg, 'compareLeft');
    addClass(oImg, 'compareRight');

    document.onclick = function(evt) {
        var oEvent = evt || event;
        // 为了防止误操作，如果单击的是img，则直接return。
        if (oEvent.target != oTop) return;
        removeClass(oCurrentImg, 'compareLeft');
        removeClass(oImg, 'compareRight');

        oCurrentImg.addEventListener('transitionend', _transitionEnd);
    }
}

function _transitionEnd() {
    oTop.style.display = oMask.style.display = 'none';
    oMask.style.opacity = 0;

    // 清除原图片的行间样式
    oCurrentImg.style.cssText = '';

    // 将原图片重新添加到oCurrentLi中
    var oSpan = oCurrentLi.getElementsByTagName('span')[0];
    oCurrentLi.insertBefore(oCurrentImg, oSpan);
    // 清除对比图片
    oTop.removeChild(oTop.firstChild);

    // 释放内存
    document.onclick = null;
    oCurrentImg.removeEventListener('transitionend', _transitionEnd);
}

//-------------------- 展示对比图片结束 -----------------------

function _zoomInImg() {
    if (oTop instanceof undefined) oTop = document.getElementById('top');
    if (oMask instanceof undefined) oMask = document.getElementById('mask');

    oCurrentLi = aLis[_currentIndex];
    oCurrentImg = oCurrentLi.getElementsByTagName('img')[0];
    oTop.appendChild(oCurrentImg);

    oTop.style.display = oMask.style.display = 'block';
    oMask.style.opacity = 1;

    var targetW = oLi._originW >= window.innerWidth ? window.innerWidth * 0.9 : oLi._originW;
    var targetH = oLi._originH >= window.innerHeight ? window.innerHeight * 0.9 : oLi._originH;

    oCurrentImg.style.width = targetW + 'px';
    oCurrentImg.style.height = targetH + 'px';
    oCurrentImg.style.top = maxH / 2 - targetH / 2 + 50 + 'px';
    oCurrentImg.style.left = maxW / 2 - targetW / 2 + 'px';

    //var oLi = aLis[_currentIndex];
    var targetW = oLi._originW >= window.innerWidth ? window.innerWidth * 0.9 : oLi._originW;
    var targetH = oLi._originH >= window.innerHeight ? window.innerHeight * 0.9 : oLi._originH;
    //oLi.animate({
    //    left: maxW / 2 - targetW / 2 + 'px',
    //    top: maxH / 2 - targetH / 2 + 50 + 'px',
    //    width: targetW + 'px',
    //    height: targetH + 'px'
    //});
}

function _moveImg(currentIndex, direction) {
    //先全部删除类名，然后给选中的添加类名active
    var groupLen = $('.groupName').length;
    for (var j = 0; j < groupLen; j++) {
        $(".groupName").eq(groupLen - 1 - j).removeClass('active');
    };
    $(".groupName").eq(groupLen - 1 - currentIndex).addClass('active');

    // 设置滑块的位置
    //oSlider.style.left = oCurrentGroup.getElementsByTagName('span')[totalNum - currentIndex].offsetLeft + 'px';

    var scale = 0.8,
        spaceL = 50,
        nextL = 0,
        index = 7;

    // 向右运动时，需要从_currentIndex开始遍历，因为有可能点击的是中间的一张图片currentIndex
    // 那么在currentIndex的左侧的图片(小于currentIndex)和在currentIndex的右侧的图片(大于currentIndex)都需要运动
    if (direction == 'right') {
        var num = _currentIndex;
        var delay = 100;
    }
    // 向左运动时，只需要处理currentIndex的左侧的图片(小于currentIndex)，所以只需要从currentIndex开始遍历
    // 为了效果，所以两个方向的延时时间不一样
    else {
        num = currentIndex;
        delay = 100;
    }

    for (var i = num; i >= 0; i--) {
        var oLi = aLis[i];
        //var liMask = oLi;
        //liMask.stop(true);
        // 清除元素的所有动画
        oLi.stop(true);

        // 比当前点击的更靠前的图片，直接运动至屏幕的最右侧
        if (i > currentIndex) {
            direction == 'right' ? oLi.delay((num - i) * delay) : oLi.delay(i * delay);
            //oLi.delay((num - i) * delay);

            //liMask.animate({
            //    opacity: 0
            //});

            oLi.animate({
                left: window.innerWidth / 2 + maxW / 2 + 'px',
                top: -(window.innerHeight / 2 - maxH / 2) + 'px',
                width: window.innerHeight * oLi._showW / oLi._showH + 'px',
                height: window.innerHeight + 'px',
                opacity: 0
            });
        }
        // 当前点击的图片，运动至屏幕中央
        else if (i == currentIndex) {
            direction == 'right' ? oLi.delay((num - i) * delay) : oLi.delay(i * delay);
            //oLi.delay((num - i) * delay);

            var currentImgH = oLi._showH;

            //liMask.animate({
            //    opacity: 0
            //});

            oLi.animate({
                left: '0',
                top: '0',
                width: oLi._showW + 'px',
                height: oLi._showH + 'px',
                opacity: 1
            });

            $('#imgs li').css('box-shadow', '');
            if (i == 0) {
                $('#imgs li').eq(0).find('.liMask').css('opacity', 0);
                $('#imgs li').eq(0).css('box-shadow', '1px 9px 18px 0px rgba(0,0,0,0.6)');
            } else if (i == 1) {
                $('#imgs li').eq(0).find('.liMask').css('opacity', 0.1);
                $('#imgs li').eq(1).find('.liMask').css('opacity', 0);
                $('#imgs li').eq(1).css('boxShadow', '1px 9px 18px 0px rgba(0,0,0,0.6)');
            } else if (i == 2) {
                $('#imgs li').eq(0).find('.liMask').css('opacity', 0.2);
                $('#imgs li').eq(1).find('.liMask').css('opacity', 0.1);
                $('#imgs li').eq(2).find('.liMask').css('opacity', 0);
                $('#imgs li').eq(2).css('boxShadow', '1px 9px 18px 0px rgba(0,0,0,0.6)');
            } else if (i == 3) {
                $('#imgs li').eq(0).find('.liMask').css('opacity', 0.3);
                $('#imgs li').eq(1).find('.liMask').css('opacity', 0.2);
                $('#imgs li').eq(2).find('.liMask').css('opacity', 0.1);
                $('#imgs li').eq(3).find('.liMask').css('opacity', 0);
                $('#imgs li').eq(3).css('boxShadow', '1px 9px 18px 0px rgba(0,0,0,0.6)');
            } else if (i == 4) {
                $('#imgs li').eq(0).find('.liMask').css('opacity', 0.4);
                $('#imgs li').eq(1).find('.liMask').css('opacity', 0.3);
                $('#imgs li').eq(2).find('.liMask').css('opacity', 0.2);
                $('#imgs li').eq(3).find('.liMask').css('opacity', 0.1);
                $('#imgs li').eq(4).find('.liMask').css('opacity', 0);
                $('#imgs li').eq(4).css('boxShadow', '1px 9px 18px 0px rgba(0,0,0,0.6)');
            } else if (i == 5) {
                $('#imgs li').eq(0).find('.liMask').css('opacity', 0.5);
                $('#imgs li').eq(1).find('.liMask').css('opacity', 0.4);
                $('#imgs li').eq(2).find('.liMask').css('opacity', 0.3);
                $('#imgs li').eq(3).find('.liMask').css('opacity', 0.2);
                $('#imgs li').eq(4).find('.liMask').css('opacity', 0.1);
                $('#imgs li').eq(5).find('.liMask').css('opacity', 0);
                $('#imgs li').eq(5).css('boxShadow', '1px 9px 18px 0px rgba(0,0,0,0.6)');
            }



        }
        // 比当前点击的更靠后的图片，按照一个比一个缩小的规律运动
        else {
            direction == 'right' ? oLi.delay((num - i) * delay) : oLi.delay(i * delay);
            //oLi.delay((num - i) * delay);

            if (scale > 0.2) {
                var h = currentImgH * scale;
                var w = oLi._showW * scale;
                nextL -= spaceL; // + index * index;  // 控制是否递进的向左偏移
            } else {
                h = 0;
            }

            // 给越靠后的图片设置一个越深的遮罩，看起来更立体一些
            // liMask.animate({
            //     opacity: 0.9
            // });

            oLi.animate({
                left: nextL + 'px',
                top: maxH / 2 - h / 2 + 'px',
                width: w + 'px',
                height: h + 'px',
                opacity: 1
            })

            scale -= 0.18;
            index -= 2;
        }
    }

    _currentIndex = currentIndex;
}

//function _moveImgLeft(currentIndex)
//{
//    var scale = 0.8, spaceL = 15, nextL = 0, index = 7;
//
//    for (var i = currentIndex; i >= 0; i--)
//    {
//        var oLi = aLis[i];
//        // 清除元素的所有动画
//        oLi.stop(true, true);
//
//        if (i == currentIndex)
//        {
//            oLi.delay((currentIndex - i) * 50);
//
//            var currentImgH = oLi._showH;
//
//            oLi.css('opacity', 0);
//
//            oLi.animate({
//                left: '0',
//                top: '0',
//                width: oLi._showW + 'px',
//                height: oLi._showH + 'px',
//                opacity: 1
//            });
//        }
//        else
//        {
//            oLi.delay((currentIndex - i) * 50);
//
//            if (scale > 0.2)
//            {
//                var h = currentImgH * scale;
//                var w = oLi._showW * scale;
//                nextL -= spaceL + index * index;
//            } else {
//                h = 0;
//            }
//
//            // 给越靠后的图片设置一个越深的遮罩，看起来更立体一些
//            oLi.css('opacity', 1 - scale);
//
//            oLi.animate({
//                left: nextL + 'px',
//                top: maxH / 2 - h / 2 + 'px',
//                width: w + 'px',
//                height: h + 'px',
//                opacity: 1
//            })
//
//            scale -= 0.18;
//            index -= 2;
//        }
//    }
//    _currentIndex = currentIndex;
//}

/**
 * 创建倒影
 * @param oLi
 */
function createReflection(oLi) {
    //创建倒影，oReflectionBg用来给倒影设置一个黑色背景，否则倒影是半透明的，会显示后面其他图片的倒影
    var oReflectionBg = $('<span></span>');
    oReflectionBg.addClass('reflectionBg');

    //oReflectionImg用来呈现一个旋转180度的倒影图片
    var oReflectionImg = $('<span></span>');
    oReflectionImg.addClass('reflectionImg');
    oReflectionImg.append(oLi.clone().html());

    //oReflectionMask用来呈现一个倒影遮罩
    var oReflectionMask = $('<span></span>');
    oReflectionMask.addClass('reflectionMask');

    oLi.append(oReflectionBg);
    oLi.append(oReflectionImg);
    oLi.append(oReflectionMask);
}


function hasClass(element, className)
{
    return element.className.match(RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(element, className)
{
    if (!hasClass(element, className))
        element.className += ' ' + className;
}

function removeClass(element, className)
{
    if (hasClass(element, className))
        element.className = element.className.replace(RegExp('(\\s|^)' + className + '(\\s|$)'), '');
}