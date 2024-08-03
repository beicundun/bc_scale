/**
 * bc_scale JavaScript Library v0.9.0
 * Author Atsushi Kitamura
 * Since 2013-01-03
 */

function BC_Scale(selector_str, isCenter_bool) {

	var self = this;
	this.box = $(selector_str);
	this.child; // 子要素はひとつとする
	
	this.box.defLeft = parseInt(this.box.css('left'));
	this.box.defTop = parseInt(this.box.css('top'));
	this.box.startLeft = this.box.defLeft;
	this.box.startTop = this.box.defTop;
	this.box.endLeft = this.box.defLeft;
	this.box.endTop = this.box.defTop;
	
	this.child = this.box.children('*');
	this.child.defLeft = parseInt(this.child.css('left'));
	this.child.defTop = parseInt(this.child.css('top'));
	this.child.startLeft = this.child.defLeft;
	this.child.startTop = this.child.defTop;
	this.child.endLeft = this.child.defLeft;
	this.child.endTop = this.child.defTop;
	this.child.defWidth = this.child.attr('width'); // 設定されているサイズ
	this.child.defHeight = this.child.attr('height'); // 設定されているサイズ
	this.child.startWidth = 0;
	this.child.startHeight = 0;
	this.child.endWidth = this.child.defWidth;
	this.child.endHeight = this.child.defHeight;
	// 拡大縮小の中心点を子要素の中心とするかどうか
	if (isCenter_bool) {
		this.isCenter = true;
		this.ratioX = 0.5;
		this.ratioY = 0.5;
	}
	else {
		this.isCenter = false;
		this.ratioX = Math.round((Math.abs(this.child.defLeft) / this.child.defWidth) * 1000) / 1000;
		this.ratioY = Math.round((Math.abs(this.child.defTop) / this.child.defHeight) * 1000) / 1000;
	}
	this.scaleX = 1; // 現在のスケール
	this.scaleY = 1; // 現在のスケール
	this.vpX = Math.floor($(window).width() / 2); // 消失点のx値
	this.vpY = Math.floor($(window).height() / 2); // 消失点のy値
	this.x = 0; // 物体のx値
	this.y = 0; // 物体のy値
	this.z = 0; // 物体のz値
	this.px = 0; // 物体の投影面でのx値
	this.py = 0; // 物体の投影面でのy値
	this.fl = 250; // 焦点距離
	this.timerId_together;

	$(window).resize(function(evt){
		self.setVp();
		self.render3d();
	});
	
	/*-----------------------------------------------------------------------------
	表示非表示関連
	-----------------------------------------------------------------------------*/
	this.show = function(duration_num, onComplete_func){
		var _duration = 1000;
		if (!isNaN(duration_num)) {
			_duration = duration_num;
		}
		if (onComplete_func) {
			self.box.show(_duration, onComplate_func);
		}
		else {
			self.box.show(_duration);
		}
	};
	
	this.hide = function(duration_num, onComplete_func){
		var _duration = 1000;
		if (!isNaN(duration_num)) {
			_duration = duration_num;
		}
		if (onComplete_func) {
			self.box.hide(_duration, onComplate_func);
		}
		else {
			self.box.hide(_duration);
		}
	};
	
	/*-----------------------------------------------------------------------------
	スケール関連
	-----------------------------------------------------------------------------*/
	this.scaleUp = function(duration_num, easing_str, onComplete_func){
		var _duration = 1000;
		if (!isNaN(duration_num)) {
			_duration = duration_num;
		}
		var _easing = 'swing';
		if (easing_str) {
			_easing = easing_str;
		}
		
		if (onComplete_func) {
			self.child.animate({width: self.child.endWidth + 'px', height: self.child.endHeight + 'px', left: self.child.endLeft + 'px', top: self.child.endTop + 'px'}, _duration, _easing, onComplate_func);
		}
		else {
			self.child.animate({width: self.child.endWidth + 'px', height: self.child.endHeight + 'px', left: self.child.endLeft + 'px', top: self.child.endTop + 'px'}, _duration, _easing);
		}
	};

	this.setScaleX = function(scale_num) {
		var _scaleX = self.scaleX;
		if (!isNaN(scale_num)) {
			self.scaleX = scale_num;
			_scaleX = scale_num;
			var _width = self.child.defWidth * _scaleX;
			var _left = 0;
			if (self.isCenter) {
				_left = '-'+ Math.floor(_width / 2);
			}
			else {
				_left = '-'+ Math.floor(_width * self.ratioX);
			}
			self.child.css('width', _width + 'px');
			self.child.css('left', _left + 'px');
		}
	};
	
	this.setScaleY = function(scale_num){
		var _scaleY = self.scaleY;
		if (!isNaN(scale_num)) {
			self.scaleY = scale_num;
			_scaleY = scale_num;
			var _height = self.child.defHeight * _scaleY;
			var _top = 0;
			if (self.isCenter) {
				_top = '-'+ Math.floor(_height / 2);
			}
			else {
				_top = '-'+ Math.floor(_height * self.ratioY);
			}
			self.child.css('height', _height + 'px');
			self.child.css('top', _top + 'px');
		}
	};
	
	this.setStart = function(width_num, height_num){
		var width = self.child.startWidth;
		if (!isNaN(width_num)) {
			width = width_num;
		}
		var height = self.child.startHeight;
		if (!isNaN(height_num)) {
			height = height_num;
		}
		var left = '-' + Math.floor(width) / 2;
		var top = '-' + Math.floor(height)  /2;
		self.child.css('width', width + 'px');
		self.child.css('height', height + 'px');
		self.child.css('left', left + 'px');
		self.child.css('top', top + 'px');
	};
	
	this.getScale = function(min_num, max_num, arg_num) {
		if (!isNaN(min_num) || !isNaN(max_num) || !isNaN(arg_num)) {
			return false;
		}
		
		var scale = (max_num - min_num) * (sin_num + 1) / 2 + min_num;
		return scale;
	};
	
	/*-----------------------------------------------------------------------------
	3D関連
	-----------------------------------------------------------------------------*/
	// 物体の位置を元にレンダリングする
	this.render3d = function(x_num, y_num, z_num) {
		var _x = self.x;
		var _y = self.y;
		var _z = self.z;
		var _px = self.x;
		var _py = self.y;
		var _vpX = self.vpX;
		var _vpY = self.vpY;
		var _fl = self.fl;
		var _scale;
		
		if (!isNaN(x_num)) {
			self.x = _x = x_num;
		}
		if (!isNaN(y_num)) {
			self.y = _y = y_num;
		}
		if (!isNaN(z_num)) {
			self.z = _z = z_num;
		}
		
		// 物体が近すぎる場合は非表示にする
		if (_z < -self.fl) {
			self.box.css('display', 'none');
		}
		else {
			if (self.box.css('display') == 'none') {
				self.box.css('display', 'block');
			}
			
			self.scaleX = _scale = self.getScale3D(_z);
			self.px = _px = _x * _scale + _vpX;
			self.py = _py = _y * _scale + _vpY;
			
			self.setScaleX(_scale);
			self.setScaleY(_scale);
			self.box.css('left', _px + 'px').css('top', _py + 'px');	
		}
	};
	
	// 拡大率（＝縮小率）を3D要素のz値から割り出して返す
	this.getScale3D = function(z_num) {
		if (isNaN(z_num)) {
			return false;
		}
		var _scale = self.fl / (self.fl + z_num);
		return _scale;
	};
	
	// 消失点を設定
	this.setVp = function(vpX_num, vpY_num) {
		if (isNaN(vpX_num) && isNaN(vpX_num)) {
			self.vpX = Math.floor($(window).width() / 2);
			self.vpY = Math.floor($(window).height() / 2);
		}
		else {
			var _vpX = self.vpX;
			var _vpY = self.vpY;
			if (!isNaN(vpX_num)) {
				self.vpX = _vpX = vpX_num;
			}
			if (!isNaN(vpY_num)) {
				self.vpY = _vpY = vpY_num;
			}
		}
	}
	
	// 引数の要素のそばに配置し続ける
	/*※obj_bcScaleはBC_Scaleのインスタンスであり、jQueryオブジェクトではない。jQueryオブジェクトは、obj_bcScale.boxやobj_bcScale.child であることに注意！
	*/
	this.togetherOn = function(obj_bcScale, offsetLeft_num, offsetTop_num, interval_num){
		self.timerId_together = setInterval(function(){
			var _left = offsetLeft_num * obj_bcScale.scaleX;
			var _top = offsetTop_num * obj_bcScale.scaleY;
			var _objLeft = Math.round(obj_bcScale.box.offset().left);
			var _objTop = Math.round(obj_bcScale.box.offset().top);
			self.setScaleX(obj_bcScale.scaleX);
			self.setScaleY(obj_bcScale.scaleY);
			self.box.css('left', (_objLeft+_left)+'px');
			self.box.css('top', (_objTop+_top)+'px');
		}, interval_num);
	};
	// 引数の要素のそばへの配置を解除
	this.togetherOff = function(obj_bcScale){
		clearInterval(self.timerId_together);
		self.box.fadeOut();
	};
}
