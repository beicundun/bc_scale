/**
 * bc_library JavaScript Library v0.9.0
 * Author Atsushi Kitamura
 * Since 2013-01-02
 */

if (!BC) {
	var BC = {};
}

// 度数→ラジアン
BC.getRadian = function(degree_num){
	if (isNaN(degree_num)) {
		return false;
	}
	// 引数が360より大きい角度の場合も0〜360に変換
	var degree = (degree_num % 360 + 360) % 360;
	var radian = degree * Math.PI / 180;
	return radian;
};

// ラジアン→度数
BC.getDegree = function(radian_num){
	if (isNaN(radian_num)) {
		return false;
	}
	var degree = radian_num / Math.PI * 180;
	return degree;
};

BC.getScale = function(min_num, max_num, arg_num) {
	if (isNaN(min_num) || isNaN(max_num) || isNaN(arg_num)) {
		return false;
	}
	var scale = (max_num - min_num) * (arg_num + 1) / 2 + min_num;
	return scale;
};

// 数字を価格表記に変換
BC.getPriceFormat = function(price_num, mark_str, markIsHead_bool){
	var price = '';
	// マーク（¥や円、$など）を価格の前に配置する場合
	if (markIsHead_bool) {
		price = mark_str + price_num.toString().replace( /([0-9]+?)(?=(?:[0-9]{3})+$)/g , '$1,' );
	}
	else {
		price = price_num.toString().replace( /([0-9]+?)(?=(?:[0-9]{3})+$)/g , '$1,' ) + mark_str;
	}
	return price;
};

// 引数の配列要素をランダムに並べ替えた配列で返す
BC.getRandomArray = function(array_ary){
	var newArray_ary = [];
	core(array_ary);
	return newArray_ary;
	
	function core(array_ary) {
		var index = Math.floor(Math.random() * array_ary.length);
		newArray_ary.push(array_ary[index]);
		array_ary.splice(index, 1);
		// まだ要素があれば再帰処理
		if (array_ary.length > 0) {
			arguments.callee(array_ary);
		}
	}
};

// 配列要素を要素のキーで小さい順に並べ直して返す
BC.asort = function(array, key){
	array.sort(
		// この匿名関数が比較関数
		function(a, b){
			if (a[key] < b[key]) {
				return 1;
			}
			else {
				return -1;
			}		
		}
	);
	return array;
};

