/**
 * Simple Map object with stack-like operations (pop, popHead, etc.)
 *
 * @author Amir Lazarovich
 */
function Map(array, key) {
	//////////////////////////////////////////////////////
 	////// Private
 	//////////////////////////////////////////////////////
 	var length = 0;
	var map = {};
	var keys = [];

	//////////////////////////////////////////////////////
 	////// Public
 	//////////////////////////////////////////////////////

 	function put(index, data) {
 		var existingData = map[index];
		if (data != undefined && data != null && (existingData == undefined || existingData == null)) {
			map[index] = data;
			length++;	
			keys.push(index);
		}
 	};
 	this.put = put;


 	function add(array, key) {
 		for (var i = 0, max = array.length; i < max; i++) {
 			var item = array[i];
 			put(item[key], item);
 		}
 	};
 	this.add = add;

 	this.clear = function() {
		length = 0;
		map = {};
		keys = [];
	};

	this.remove = function(index) {
		var data;
		if (length > 0) {
			data = map[index];
			if (data != undefined && data != null) {
				delete map[index];
				length--;	
				var i = keys.indexOf(index);
				if (i >= 0) {
					keys.splice(i, 1);	
				}
			}
		}

		return data;
	};

	this.get = function(index) {
		return map[index];
	};

	this.last = function() {
		return this.get(keys[keys.length - 1]);
	};

	this.cycleLast = function() {
		var item = this.last();
		if (item != undefined && item != null) {
			var lastKey = keys.pop();
			if (lastKey != undefined && lastKey != null) {
				// move the last item to beginning 
				keys.unshift(lastKey);	
			} else {
				// bad state! try to correct it
				console.log("*** corrupted map detected!");
				for (var i in map) {
					if (map.hasOwnProperty(i) && map[i] == item) {
					 	delete map[i];
					 	break;
					}
				}

				item = undefined;
			}
		}

		return item;
	};

	this.pop = function() {
		return this.remove(keys.pop());
	};

	this.popHead = function() {
		return this.remove(keys.splice(0, 1));
	};

	this.peekHead = function() {
		return this.get(keys.slice(0, 1));
	};

	this.exists = function(index) {
		return (map[index] != undefined && map[index] != null);
	};

	this.length = function() {
		return length;
	};

	this.unwrap =  function() {
		// TODO we should return a clone
		return map;
	};

	this.keys = function() {
		// TODO we should return a clone
		return keys;
	};

	this.forEachKey = function(func) {
		keys.forEach(func);
	};

	this.forEachItem = function(func) {
		keys.forEach(function (key) {
			func(map[key]);
		});
	};

	this.forEach = function(func) {
		keys.forEach(function (key) {
			func(key, map[key]);
		});
	};

	//////////////////////////////////////////////////////
 	////// Constructor
 	//////////////////////////////////////////////////////	
 	(function Map(array, key) {
 		if (array == undefined || key == undefined) {
 			return;
 		}

 		// parse array
 		add(array, key);
 	})(array, key);
}