// history.js
var HISTORY_MODE = 55;
var historyGroup = new THREE.Object3D();

var historyzStacks={};

function historyxyStack(x, y) {
	var lookup = x+":"+y;

	if (!(lookup in historyzStacks)) {
		historyzStacks[lookup] = [];
	}

	var stack = historyzStacks[lookup];
	return stack;
}

function historyaddToXYStack(xPos, yPos, object) {
	var stack = historyxyStack(xPos, yPos);
	object.xPos = xPos;
	object.yPos = yPos;
	stack.push(object);
}


function kickoffHistory(keyword) {
	moveAwayOthers();
	news.getHistory(keyword, setupHistory);
}

function cleanupHistoryDOM() {
	// TODO!!

	console.log("removing dom elems...");
	var hglength = historyGroup.children.length;
	for (var i = hglength - 1; i >= 0; i--) {
		var obj = historyGroup.children[i];
		var elem = obj.element;
		elem.parentNode.removeChild(elem);

		console.log(elem.parentNode, "to be removed");
		historyGroup.remove(obj);
		// document.body.removeChild(elem);
	}

	historyzStacks = {};
}

function moveHistoryUp() {
	var duration = 800;
	var adjX = 100;
	new TWEEN.Tween(historyGroup.position)
		.to({x: camera.position.x - adjX, y:camera.position.y}, duration)
		.easing( TWEEN.Easing.Exponential.InOut )
		.start();

	new TWEEN.Tween( this )
		.to( {}, duration )
		.easing( TWEEN.Easing.Exponential.InOut )
		.onUpdate( render )
		.start();
}

function removeHistory() {
	var duration = 600;

	// var ZDOWNFAR = ZDOWN * 3;
	
	new TWEEN.Tween(historyGroup.position)
		.to({y:ZDOWN}, duration)
		.easing( TWEEN.Easing.Exponential.InOut )
		.start();

	new TWEEN.Tween( this )
		.to( {}, duration )
		.easing( TWEEN.Easing.Exponential.InOut )
		.onUpdate( render )
		.start();
			
}

function moveAwayOthers() {
	var duration = 800;
	var ZDOWNFAR = ZDOWN * 3;
	new TWEEN.Tween(topicLabels.position)
		.to({y:ZDOWNFAR}, duration*1.2)
		.easing( TWEEN.Easing.Exponential.InOut )
		.start();

	new TWEEN.Tween(timeline.position)
		.to({y:ZDOWNFAR}, duration*1.5)
		.easing( TWEEN.Easing.Exponential.InOut )
		.start();

	new TWEEN.Tween(group.position)
		.to({y:ZDOWNFAR}, duration*1.5)
		.easing( TWEEN.Easing.Exponential.InOut )
		.start();
	
	new TWEEN.Tween(mapObject.position)
		.to({y:ZDOWNFAR}, duration*1.5)
		.easing( TWEEN.Easing.Exponential.InOut )
		.start();

	new TWEEN.Tween( this )
		.to( {}, duration * 1.6 )
		.easing( TWEEN.Easing.Exponential.InOut )
		.onUpdate( render )
		.start();
			
}

function getDateRange(events) {
	var minTime;
	var maxTime;
	var elength = events.length;

}

function calcHistoryPos(histBucket, now, newsEv, range) {
	// TODO
	var timeobj = new Date(newsEv.timestamp);

	var timedelta_mins = (range.max.getTime() - timeobj.getTime()) / (1000*60);
	var timebucket = 60*24;
	var MS_IN_DAY = 86400 * 1000;
	var myBucket = Math.floor(timedelta_mins / timebucket);

	console.log("myBucket", myBucket);

	// var bucket = 86400 * 1000; // ms in day
	// var deltaMS = now.getTime() - timeobj.getTime();
	var xPos = myBucket;

	if (! (xPos in histBucket))
		histBucket[xPos] = 0;
	var yPos = histBucket[xPos]++;



	return {x: (itemWidth + xGap)  * -xPos, y: (itemHeight + yGap) * yPos, z: 0};
}


function makeUIElems(results) {
	// var results = rlength;
	// for (var i = 0; i < rlength; i++) {
	// 	var newsEv = results[i];
	// 	var gfx = getGraphic(newsEv);
		
	// 	var y = Math.floor(tIndex / rowSize);
	// 	var x = (i % rowSize);
	// 	var uielem = new UINews(newsEv, gfx, x, y);
	// 	uielems.push(uielem);


	// 				// console.log(gfx);
	// }
}

function makeHistoryElem(url, title) {
	var element = document.createElement( 'div' );
	element.className = 'element';
	element.style.backgroundColor = 'rgb(0,127,227)';

	if (url) {
		var symbol = document.createElement( 'img' );
		symbol.className = 'previewimg';
		symbol.src = url;
		symbol.addEventListener('touchstart', historyimgTouchStart);
		symbol.addEventListener('touchmove', historyimgMoveStart);
		element.appendChild( symbol );
	} else {
		var details = document.createElement( 'div' );
		details.className = 'details';
		details.innerHTML = title;
		// console.log(newsEv);
		element.appendChild( details );
	}

	var object = new THREE.CSS3DObject( element );
	element.obj = object;
	return object;
}

function addHistoryLabels() {

}

function newseventssort(a, b){
	if (a.related.length > b.related.length)
		return -1;
	else return 1;
}

function historyTimeRange(newsEvents) {
	var length = newsEvents.length;
	var minTime;
	var maxTime;
	for (var i = 0; i < length; i++) {
		var newsEv = newsEvents[i];
		var d = new Date(newsEv.timestamp);
		if (!minTime || d < minTime)
			minTime = d;
		if (!maxTime || d > maxTime)
			maxTime = d;
	}
	return {min : minTime, max: maxTime};
}


function buildHistoryTimeline(range) {
	// var range = _timeRange(uielems);
	var timedelta_mins = (range.max.getTime() - range.min.getTime()) / (1000*60);
	// TODO use days
	var timebucket = 60*24;
	var MS_IN_DAY = 86400 * 1000;
	var numBuckets = Math.ceil(timedelta_mins / timebucket);

	if (numBuckets == 0) numBuckets = 1;
	
	console.log("numBuckets", numBuckets);
	
	var d  = new Date();
	d.setTime(range.max.getTime());
	var startHr = d.getHours();
    for (var xPos = 0; xPos < numBuckets; xPos++) {
		var div = document.createElement("div");
		d.setTime(d.getTime() - MS_IN_DAY);
		// console.log(d);
	    div.className = 'timebar';

		var txt = (d.getUTCMonth() + 1) + '/' + d.getUTCDate();
		

	    div.innerText =  txt;
	    var object = new THREE.CSS3DObject( div );
		object.position.x = ( -xPos * (itemWidth+xGap) ) ;
		object.position.y = -itemHeight*.75;
		historyGroup.add(object); 
	}
    // historyGroup.add(timeline);
    
}

function addDescription(topic) {
	var tstatus = document.getElementById( 'topicstatus' );
	tstatus.innerText = topic;
	$(tstatus).fadeIn(1500);
	// tstatus.style.display = 'block';
}

function clearDescription() {
	var tstatus = document.getElementById( 'topicstatus' );
	$(tstatus).fadeOut(500);
}

function setupHistory(events, topic) {
	// console.log(events);
	// var histUIelems = makeUIElems(events);
	if (historyGroup.children.length > 0) {
		cleanupHistoryDOM();
	}
	// sort by relevance
	events.sort(newseventssort);

	mode = HISTORY_MODE;
	var histBucket = {};
	moveHistoryUp();

	var now = new Date();
	var elength = events.length;

	var zstack = {};

	var minX = null;
	var maxX = null;

	var hrange = historyTimeRange(events);

	for (var i = 0; i < elength; i++) {
		var newsEv = events[i];
		var gfx = getGraphic(newsEv);
		if (!gfx) {
			continue;
		}
		var pos = calcHistoryPos(histBucket, now, newsEv, hrange);

		var object = makeHistoryElem(gfx, newsEv.title);
		object.element.vidUrl = getVideo(newsEv);

		object.position.x = pos.x;
		object.position.y = pos.y;
		historyGroup.add(object);	
		historyaddToXYStack(pos.x, pos.y, object);

		var rlength = Math.min(3, newsEv.related.length);
		for (var j = 1; j < rlength; j++) {
			var ritem = newsEv.related[j];
			var imgUrl = urlToImgUrl(ritem.url);
			var obj = makeHistoryElem(imgUrl, ritem.title);
			obj.position.x = pos.x;
			obj.position.y = pos.y;
			obj.position.z = -(j+1) * ZSPACING; 
			obj.element.style.zIndex = obj.position.z;
			historyGroup.add(obj);
			historyaddToXYStack(pos.x, pos.y, obj);
		}

	}

	buildHistoryTimeline(hrange);

	console.log("TOPIC NAME=", topic);
	addDescription(topic);

	scene.add(historyGroup);
	render();

}


function historyimgTouchStart(ev) {
	// ev.preventDefault();
	// console.log(ev.stopPropagation);
	var now = (new Date()).getTime();
	if (lastTouchTime) {
		var delta = now - lastTouchTime;
		if (delta < 450 && this == lastTouchElem) {
			// ev.stopPropogation();
			console.log("you double tapped!!!", this);
			// TEMP disable

			expand(this.parentNode);

		}
	}

	lastTouchTime = now;
	lastTouchElem = this;
	// console.log("Img touch start", ev);
	touchStartX = ev.clientX;
}

// TODO swipe
/*
if touchstart in img + moving in img ...
*/



function historyimgMoveStart(ev) {
	// console.log("moving...", ev);

	if (camera.position.z < 4500) {
		ev.preventDefault();
		ev.stopPropagation();
	}

	if (camera.position.z < 4500 && lastTouchElem == this) {
		
		// controls.enabled = false;

		var now = (new Date()).getTime();
		if (lastTouchTime && touchStartX) {
			var timeDelta = now - lastTouchTime;
			var deltaX = ev.clientX - touchStartX;
			// console.log(deltaX, "deltaX");
			if (timeDelta < 1000 && this == lastTouchElem) {
				if (deltaX > SWIPE_THRESH_X) {
					console.log("swipe forward detected!!!!");
					touchStartX = null;

					hswipeForward(this.parentNode.obj);
					render();
					
				} else if (deltaX < -SWIPE_THRESH_X) {
					console.log("swipe backward detected!!!!");
					touchStartX = null;
					hswipeBackward(this.parentNode.obj);
					render();
				}
				// todo ... flip through things
			} 
		}
		// setTimeout(function() { controls.enabled = true}, 1200);
	}
}




function hswipeForward(obj) {
	// console.log("handling swipe forward....", obj, obj.xPos, obj.yPos);

	var stack;
	
	stack = historyxyStack(obj.xPos, obj.yPos); 


	// get highest
	obj = getBiggestZ(stack);

	var origZ = obj.position.z;
	// console.log("stack", stack);
	if (stack.length > 1) {
		// console.log("moving stack...");
	// 	// move this item to the back and all others up
		obj.position.z -= ZSPACING * (stack.length-1);
		obj.element.style.zIndex = obj.position.z;
		for (var i = 0; i < stack.length; i++) {
			var other = stack[i];
			// console.log("other", other);
			if (other.uuid !== obj.uuid) {
				other.position.z += ZSPACING;
				other.element.style.zIndex = other.position.z;
			}
		}
	}

}

function hswipeBackward(obj) {
	console.log("handling swipe backward....", obj, obj.xPos, obj.yPos);
	var stack;
	stack = historyxyStack(obj.xPos, obj.yPos); // : topicStack[obj.topic];


	obj = getBiggestZ(stack);
	var smallest = getSmallestZ(stack); // eek 

	var origZ = obj.position.z;
	// console.log("stack", stack);
	var slength = stack.length;

	if (slength > 1) {
		var last = -ZSPACING*(slength-1) ; //(mode === PLANE_MODE) ? -ZSPACING*(slength-1) : 0;
		var first = 0; //(mode === PLANE_MODE) ? 0 : ZSPACING * (slength-1);

		for (var i = 0; i < slength; i++) {
			var other = stack[i];

			if (other == smallest) {
				other.position.z = origZ;
				other.element.style.zIndex = origZ;
				// other.element.style.zI
			} else {
				other.position.z -= ZSPACING;
				other.element.style.zIndex = other.position.z;
			}

		}
	}
}