// 1.翻面控制
function turn(elem){
	var cls = elem.className;
	var n =elem.id.split('_')[1];
	// 判断点击的图片是否居中显示了，进行排序
	if(!/photo_center/.test(cls)){
		return rsort(n);
	}
	// .test检查cls字符串中是否有photo_front的字符串
	if(/photo_front/.test(cls)){
		cls = cls.replace(/photo_front/,'photo_back');
		g('#nav_'+n).className += ' i_back ';
	}else{
		cls = cls.replace(/photo_back/,'photo_front');
		g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
	}
	return elem.className = cls;
}
// 3.通用函数
function g(selector){
	var method = selector.substr(0,1) == '.' ? 'getElementsByClassName' : 'getElementById';
	return document[method](selector.substr(1));
}
// 4.输出所有的海报
var data = data;
function addPhotos(){
	var template = g('#wrap').innerHTML;
	var html = [];
	// 制作导航条
	var nav = [];
	for( s in data){//for(var s=0;s<data.length;s++)
		var _html = template
						.replace('{{index}}',s)
						.replace('{{img}}',data[s].img)
						.replace('{{caption}}',data[s].caption)
						.replace('{{desc}}',data[s].desc);
		html.push(_html);
		// 导航条控制按钮内容
		nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'+s+'\'))" class="i">&nbsp;</span>');
	}
	html.push('<div class="nav">'+nav.join('')+'</div>')
	g('#wrap').innerHTML = html.join('');
	rsort(random([0,data.length]));
}
addPhotos();
// 5.排序海报,放在中间的海报
function rsort(n){
	var _photo = g('.photo');
	var photos = [];
	for(var s=0;s<_photo.length;s++){
		_photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,' ');
		_photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,' ');
		_photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,' ');
		_photo[s].className += ' photo_front ';
		_photo[s].style.left = '';
		_photo[s].style.top = '';
		// 兼容
		_photo[s].style['transform'] = _photo[s].style['-webkit-transform'] = 'rotate(0deg) scale(1.3)';
		photos.push(_photo[s]);
	}
	var photo_center = g('#photo_'+n);
	photo_center.className += ' photo_center';
	// 在所有的photo中去掉photo_center的那张图
	photo_center = photos.splice(n,1)[0];
	// 把剩下的海报分为左右两个部分
	var photos_left = photos.splice(0,Math.ceil(photos.length/2));
	var photos_right = photos;
	var ranges = range();
	for(s in photos_left){
		var photo = photos_left[s];
		photo.style.left = random(ranges.left.x)+'px';
		photo.style.top = random(ranges.left.y)+'px';
		// 添加旋转样式
		photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';
	}
	for(s in photos_right){
		var photo = photos_right[s];
		photo.style.left = random(ranges.right.x)+'px';
		photo.style.top = random(ranges.right.y)+'px';
		// 添加旋转样式
		photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';
	}
	// 居中的图片对应的按钮样式
	var navs = g('.i');
	for(var s=0;s<navs.length;s++){
		navs[s].className = navs[s].className.replace(/\s*i_current\s*/,' ');
		navs[s].className = navs[s].className.replace(/\s*i_back\s*/,' ');
	}
	g('#nav_'+n).className += ' i_current ';
}
// 7.计算左右分区图片位置的范围
function range(){
	var range = {left:{x:[],y:[]},right:{x:[],y:[]}};
	var wrap = {
		w:g('#wrap').clientWidth,
		h:g('#wrap').clientHeight
	}
	var photo = {
		w:g('.photo')[0].clientWidth,
		h:g('.photo')[0].clientHeight
	}
	range.wrap = wrap;
	range.photo = photo;
	// 左分区x,y的范围
	range.left.x = [0-photo.w,wrap.w/2-photo.w/2];
	range.left.y = [0-photo.h,wrap.h];
	// 右分区x,y的范围
	range.right.x = [wrap.w/2+photo.w/2,wrap.w+photo.w];
	range.right.y = range.left.y;
	return range;
}
// 6.随机生成一个值
function random(range){
	var max = Math.max(range[0],range[1]);
	var min = Math.min(range[0],range[1]);
	var diff = max-min;
	// 生成range[0]到range[1]之间的随机数
	var number = Math.ceil(Math.random() * diff + min);
	return number;
}