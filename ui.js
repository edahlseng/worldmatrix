var ZSPACING = 60;

var PLANE_MODE = 1;
var HIST_MODE = 2;
var MAP_MODE = 3;
var MISC_TOPICS = -200;
var mode = null;

function UINews(news, url, x, y) {
    this.news = news,
    this.url = url;
    this.xPos = x;
    this.yPos = y;

    // var related = this.news.related;
    // this.news.related = related.filter(blacklist)
}

function height3dWithZ(z, pxHeight) {
    var theta = THREE.Math.degToRad(camera.fov / 2);
    var full3dHeight = 2 * Math.tan(theta) * z;

    var fullPxHeight = window.innerHeight;
    var ratio =   pxHeight / fullPxHeight;
    var worldHeight = ratio * full3dHeight;

    // zzobj.position.y = 1450; zzobj.position.x = -2900;

    return worldHeight;
}


function height3d() {
    var theta = THREE.Math.degToRad(camera.fov / 2);
    var full3dHeight = 2*Math.tan(theta) * camera.position.z;
    return full3dHeight;
}

function width3d() {
	return height3d() * camera.aspect;
}

function populateZ(uielems) {
	var length = uielems.length;
	for (var i = 0; i < length; i++) {
		var related = uielems[i].news.related;
		if (related && related.length > 0) {
			// TODO
			var rlength = related.length;
			rlength = Math.min(11, rlength);
			for (var j = 1; j < rlength*.39; j++) {
				makeElement(uielems[i], j, related[j].url, related[j].thumbnail);
			}
			console.log("related");
		}
	}
}

function _timeRange(uielems) {
	var length = uielems.length;
	var minTime;
	var maxTime;
	for (var i = 0; i < length; i++) {
		var uielem = uielems[i];
		var news = uielem.news;
		// var d = new Date(news.timestamp);
		var d = news.publisher;
		if (!minTime || d < minTime)
			minTime = d;
		if (!maxTime || d > maxTime)
			maxTime = d;
	}
	return {min : minTime, max: maxTime};
}

function calcXPos(timestamp) {

}

function buildTimeline(range, publishers) {
	// var range = _timeRange(uielems);

	// var timedelta_mins = (range.max.getTime() - range.min.getTime()) / (1000*60);

	var timebucket = 120;
	// var numBuckets = Math.ceil(timedelta_mins / timebucket);
	var numBuckets = publishers.length;

	console.log("numBuckets", numBuckets);
	
	// var d  = new Date();
	// d.setTime(range.min.getTime());
	// var startHr = d.getHours();
    for (var xPos = 0; xPos < numBuckets; xPos++) {
    	console.log ("Adding timeline!");
		var div = document.createElement("div");
		// var hr = (startHr + xPos * 2) % 24;
		var idName = publishers[xPos].name.replace( /\W/g , '');
	    div.className = 'timebar ' + publishers[xPos].type + ' ' + idName;

		// var txt = hr + ':00';
		// if (hr === 0) { 
		// 	txt = 'Midnight';
		// 	div.className += ' midnight';
		// }
		// else if (hr === 6) { 
		// 	txt = 'Morning';
		// }
		// else if (hr === 18) txt = 'Evening'
		// else if (hr === 12) txt = 'Noon';
	    // div.innerText =  txt;

	    var thumbnail = document.createElement("img");
	    thumbnail.setAttribute('src', publishers[xPos].thumbnail);
	    thumbnail.setAttribute('id', idName);
	    var nameTitle = document.createElement("p");
	    nameTitle.innerText = publishers[xPos].name;
	    div.appendChild(thumbnail);
	    div.appendChild(nameTitle);

	    var object = new THREE.CSS3DObject( div );
		object.position.x = ( xPos * (itemWidth+xGap) ) - backset;
		object.position.y = -itemHeight*.5;
		div.obj = object;
		timeline.add(object); 
	}
    scene.add(timeline);
    
}

function makeElement(uielem, zPos, url, thumbnailUrl) {
		var element = document.createElement( 'div' );
		element.className = 'element';
		element.style.backgroundColor = 'rgb(0,127,227)'; // + ( Math.random() * 0.5 + 0.25 ) + ')';
		element.style.zIndex = -zPos * ZSPACING;

		var symbol = document.createElement( 'img' );
		symbol.className = 'previewimg';

		symbol.src = thumbnailUrl || urlToImgUrl(url); // || uielem.url;
		symbol.addEventListener('touchstart', imgTouchStart);
		symbol.addEventListener('touchmove', imgMoveStart);
		element.appendChild( symbol );

		// var details = document.createElement( 'div' );
		// details.className = 'details';
		// details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
		// element.appendChild( details );

		var object = new THREE.CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		object.isRelatedElement = true;
		group.add( object );
		element.obj = object;
		objects.push( object );

		addToXYStack(uielem.xPos, uielem.yPos, object);
		addToTopicStack(uielem.topic, object);

		//
		var object = new THREE.Object3D();
		object.position.x = ( uielem.xPos * (itemWidth+xGap) ) - backset;
		object.position.y = ( uielem.yPos * (itemHeight+yGap) ) + 100;
		object.position.z = -zPos * ZSPACING;



		targets.table.push( object );
		var objectgrid = new THREE.Object3D();

		var topicData = matchToTopic(uielem.news, news.topics);
		var topicIndex = topicData.index;
		var topic = topicData.title;
		var xPos = topicIndex;
		objectgrid.position.x = ( topicIndex * (itemWidth+xGap) ) - backset;
		objectgrid.position.y = 0; //( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		if (!topicCount[topic]) topicCount[topic] = 0;
		objectgrid.position.z = ( topicCount[topic]++ ) * ZSPACING - 1500; //2000;
			

		// objectgrid.position.x =-4000;
		// objectgrid.position.y = -20000;
		// objectgrid.position.z= -4000;
		targets.grid.push( objectgrid );
		
}

function buildTopicLabels(topics, topicsCount) {
	// var range = _timeRange(uielems);

	// console.log("maxcount", maxCount(topicsCount));

    for (var i = 0; i < topics.length; i++) {
    	var topic = topics[i];
		var div = document.createElement("div");		
	    div.className = 'timebar topic';
	    // if (topic === 'Entertainment') topic = 'Showbiz';
	    div.innerText =  topic;
	    if (topicsCount[topic] && topicsCount[topic] > 0) {
		    var object = new THREE.CSS3DObject( div );
			object.position.x = ( i * (itemWidth+xGap) ) - backset;
			object.position.y = -200;
			object.position.z = -900;
			div.obj = object;
			topicLabels.add(object); 
		}
	}
	topicLabels.position.y = -5000;
	scene.add(topicLabels);

}



function buildMap(uielems) {
	var mapDiv = document.createElement("div");	
	mapDiv.id = 'mappy';
	// mapDiv.style.width = "6000px";
	// mapDiv.style.height = "3000px";
	// mapDiv.style.border="thin red solid";
	var object = new THREE.CSS3DObject( mapDiv );
	object.position.x = 0;
	object.position.y = -4500;
	object.position.z = -1;
	scene.add(object);

	return object;
}

var lastTouchTime;
var lastTouchElem;

var currElem;
var START_WIDTH = itemWidth;
var START_HEIGHT = itemHeight;

var touchStartX = null; 
var SWIPE_THRESH_X = 35;


function imgTouchStart(ev) {
	// ev.preventDefault();
	// console.log(ev.stopPropagation);
	var now = (new Date()).getTime();
	if (lastTouchTime) {
		var delta = now - lastTouchTime;
		if (delta < 450 && this == lastTouchElem) {
			// ev.stopPropogation();
			console.log("you double tapped!!!", this);
			// TEMP disable

			if (mode === PLANE_MODE && this.parentNode.style.zIndex >= -ZSPACING)
				expand(this.parentNode);
			else if (mode === HIST_MODE) {
				console.log("do hist expand");
				topicSelect(this.parentNode);
			} else if (mode === MAP_MODE) {
				console.log("doing map expand");
				expand(this.parentNode);
			}

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



function imgMoveStart(ev) {
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

					swipeForward(this.parentNode.obj);
					render();
					
				} else if (deltaX < -SWIPE_THRESH_X) {
					console.log("swipe backward detected!!!!");
					touchStartX = null;
					swipeBackward(this.parentNode.obj);
					render();
				}
				// todo ... flip through things
			} 
		}
		// setTimeout(function() { controls.enabled = true}, 1200);
	}
}

var zMove = 60;

function histExpand(elem) {

}

function topicSelect(elem) {
	var obj = elem.obj;
	var topic = obj.topic;
	kickoffHistory(topic);
}

function expand(elem) {
	if (currElem) {
		shrink(currElem, elem);
	}
	console.log("expanding", elem);
	var duration = 800;
	var obj = elem.obj;

	// faketrix added:
	startingPosition = {x:obj.position.x, y:obj.position.y};

	new TWEEN.Tween(obj.position)
		.easing(TWEEN.Easing.Quadratic.In)
		.to({z: obj.position.z + zMove}, duration)
		.start();

	var $elem = $(elem);
	// console.log($elem.width);
	var width = $elem.width();
	var height = $elem.height();
	var size = {"width": width, "height": height};
	console.log("size",size);

	showContent(elem);
	
	// var targetWidth = (elem.vidUrl) ? 480 : 960;

	new TWEEN.Tween(size)
		.easing(TWEEN.Easing.Quadratic.In)
		.to({width: 1280, height: 720}, duration)
		.onUpdate(function() {
			elem.style.width = this.width + "px";
			elem.style.height = this.height + "px";
		})
		.start();

	new TWEEN.Tween( this )
		.easing(TWEEN.Easing.Quadratic.In)
		.to( {}, duration * 1.05)
		.onUpdate( render )
		.start();
	currElem = elem;

	// // Faketrix added:
	// touchHandler.registerOnTouch(obj, null, dragEnd, dragMove);

	setTimeout(function () {expanded = true;}, duration);

	// $(document).on({
	// 		'touchstart': touchHandler.onTouchStart,
	// 		'touchmove': touchHandler.onTouchMove,
	// 		'touchend': touchHandler.onTouchEnd
	// 		});
}

function showContent(elem) {
	var $elem = $(elem);

	var targetUrl = "http://nypost.com";
	var imgTags = $(elem).children("img");
    if (imgTags) {
        var arr = imgTags[0].src.split(THUMB_URL); 
        if (arr.length > 1) {
            // its a website
            targetUrl = decodeURIComponent(arr[1]);
            console.log("url target", targetUrl);

			var iframe = document.createElement("iframe");
		    iframe.className = 'wpreviewframe';
		    iframe.src = targetUrl;
		    iframe.sandbox = "";
		    // iframe.style.overflow = "hidden";
		    // // console.log(iframe.src);
		    iframe.addEventListener('touchstart', contentTouchStart);
			iframe.addEventListener("touchmove", iframeTouchMove);
		    imgTags.hide();
		    elem.appendChild(iframe); 
        } else {
        	// TODO video stuff...
        	var video = document.createElement("video");
        	video.autoplay = true;
		    video.src = elem.vidUrl; //getVideo(elem.obj.news);
		    imgTags.hide();
		    video.addEventListener('touchstart', contentTouchStart);

		    // faketrix added:
		    video.addEventListener('touchmove', iframeTouchMove);

		    elem.appendChild(video);
        }
        console.warn(" *** no image tag!");
    }


	
}

var lastITime;

var lastIMoveY = null;

function iframeTouchMove(ev) {
	ev.preventDefault();
	ev.stopPropagation();
	zframe = this;



	// faketrix added:
	var obj = this.parentNode.obj;
	if (!timelineObjects)
	{
		var timebarElements = document.querySelectorAll('.timebar.Helios:not(.topic)');
		timelineObjects = [];
		for (var i = 0; i < timebarElements.length; i++)
		{
			timelineObjects.push(timebarElements[i].obj);
		}
		// console.log(timelineObjects);
	}
	// var z = obj.position.z;

	// console.log("z pos", z);

	// var mouse3D = new THREE.Vector3(
 //    ( event.clientX / window.innerWidth ) * 2 - 1,
 //    - ( event.clientY / window.innerHeight ) * 2 + 1,
 //    z );

	// projector.unprojectVector( mouse3D, camera );

	// var dir = mouse3D.sub( camera.position ).normalize();

	// var distance = - camera.position.z / dir.z;

	// var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

	// console.log("position, ", pos);
	
	if (!initialTouch)
	{
		initialTouch = {x:ev.clientX, y:ev.clientY};
	} else {
		var dy = Math.abs(ev.clientY - initialTouch.y);
		var dx = Math.abs(ev.clientX - initialTouch.x);
		if (!dragging && expanded && (dy > 50 || dx > 50) && camera.position.z < 4500)
		{
			dragging = true;
			console.log("adding");
			this.addEventListener("touchend", dragEnd);
		}
	}

	if (!dragging) {
		return;
	}

	if (!previousPosition) {
		previousPosition = {x: ev.clientX, y: ev.clientY};
		return;
	}

	var movementDifference = {x: ev.clientX - previousPosition.x, y: ev.clientY - previousPosition.y};
	
	var yIn3d = -screenDeltaToWorldWithZ(obj.position.z, movementDifference.y);
	var xIn3d = screenDeltaToWorldWithZ(obj.position.z, movementDifference.x);

	var newPosition = {x: obj.position.x + xIn3d, y: obj.position.y + yIn3d};
	var duration = 0.1;

    new TWEEN.Tween(obj.position)
		.easing(TWEEN.Easing.Quadratic.Out)
		.to(newPosition, duration)
		.start();

	new TWEEN.Tween( this )
		.to( {}, duration * 1.05)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate( render )
		.start();

	previousPosition = {x: ev.clientX, y: ev.clientY};



	//if (!lastIMoveY) {
	//	lastIMoveY = ev.clientY;
	//} else {

	//	var dY = -2*(ev.clientY - lastIMoveY);
		// this.contentWindow.scrollBy(0, dY);
		// lastIMoveY = ev.clientY;
	//}
	
	// console.log("iframe touch move", ev);
}

function contentTouchStart(ev) {
	console.log("touch!!");
	lastIMoveY = null;
	var now = (new Date()).getTime();
	if (lastITime) {
		var delta = now - lastITime;
		if (delta < 450) {
			// ev.stopPropogation();
			console.log("you double tapped iframe!!!", this);
			this.removeEventListener("touchend", dragEnd);
			expanded = false;
			shrink(this.parentNode);
			currElem = null;
		} else {
			// TODO scroll iframe
			//iframe.contentWindow.scrollBy(0, -.25 * ev.gesture.deltaY);
		}
	}

	lastITime = now;
}

function shrink(elem, position) {
	var duration = 500;
	var $elem = $(elem);
	var size = {width: $elem.width(), height: $elem.height()};
	var obj = elem.obj;



	// remove any stuff
    $elem.children("iframe").remove();
    $elem.children("video").remove();
	$elem.children("img").show();

	// if (position) {
		// position.z = obj.position.z - zMove;
	// } else {
	// 	position = {z: obj.position.z - zMove};
	// }
	startingPosition.z = obj.position.z - zMove;

	new TWEEN.Tween(obj.position)
		.easing(TWEEN.Easing.Quadratic.Out)
		.to(startingPosition, duration)
		.start();
	
	new TWEEN.Tween(size)
		.easing(TWEEN.Easing.Quadratic.Out)
		.to({width: START_WIDTH, height: START_HEIGHT}, duration)
		.onUpdate(function() {
			elem.style.width = this.width + "px";
			elem.style.height = this.height + "px";
		})
		.start();

	new TWEEN.Tween( this )
		.to( {}, duration * 1.05)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate( render )
		.start();


	// faketrix added:
	// $(document).off({
	// 		'touchstart': touchHandler.onTouchStart,
	// 		'touchmove': touchHandler.onTouchMove,
	// 		'touchend': touchHandler.onTouchEnd
	// 		});
}

// faketrix added:

var projector = new THREE.Projector();

// var touchHandler; 
// function loadTouchHandler() {
// 	// camera is defined in index.html
// 	var config = null;
// 	touchHandler = new TouchHandler(new Utils(), camera, config);
// 	// GeometryUtils.init(config, touchHandler, AnimationUtils);
// }

var startingPosition;
var dragging;
var initialTouch;
var previousPosition;
var expanded = false;
var timelineObjects;

function mousePositionIntersectsObjects(mousePosition, objects) {
	var x = (mousePosition.x / window.innerWidth ) * 2 - 1;
	var y = - (mousePosition.y / window.innerHeight ) * 2 + 1;

	console.log("x, y", x, y);

	var projector = new THREE.Projector();
	var vector = new THREE.Vector3(x, y, 1);
	
	projector.unprojectVector( vector, camera );

	// var direction = vector.sub(camera.position);
	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	// var raycaster = projector.pickingRay(vector.clone(), camera);

	var planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -800); // the timeline has a z position of 800

	var position = raycaster.ray.intersectPlane(planeZ);

	var relativeTimelinePosition = {x: position.x - timeline.position.x, y: position.y - timeline.position.y};

	console.log("relative position", relativeTimelinePosition);

	var rTP = relativeTimelinePosition;

	for (var i = 0; i < objects.length; i++)
	{
		var object = objects[i];
		var oP = {x: object.position.x - (object.element.clientWidth / 2.0), y: object.position.y + (object.element.clientHeight / 2.0)}; // need to account for some translations
		var oS = {width: object.element.clientWidth, height: object.element.clientHeight};

		if (rTP.x > oP.x && rTP.x < (oP.x + oS.width) && rTP.y < oP.y && rTP.y > (oP.y - oS.height))
		{
			console.log(object);
			if (object.element.className == "timebar Helios AndyLippman") {
				return "AndyLippman";
			}
			return "User";
		}
	}

	return null;
}

function screenDeltaToWorldWithZ(z, pxHeight) {
    // var theta = THREE.Math.degToRad(camera.fov / 2);
    var theta = camera.fov / 2.0;
    var full3dHeight = 2.0 * Math.tan(theta) * z;

    var fullPxHeight = window.innerHeight * 1.0;
    var ratio =   pxHeight * 1.0 / fullPxHeight;
    var worldHeight = ratio * full3dHeight;

    // console.log("z", z);
    // console.log("worldHeight", worldHeight);

    // zzobj.position.y = 1450; zzobj.position.x = -2900;

    return worldHeight * 7.0;
}


// function width3dWithZ(z, pxWidth) {
//     var theta = THREE.Math.degToRad(camera.fov / 2);
//     var full3dWidth = 2 * Math.tan(theta) * z;

//     var fullPxWidth = window.innerWidth;
//     var ratio =   pxWidth / fullPxWidth;
//     var worldWidth = ratio * full3dWidth;

//     // zzobj.position.y = 1450; zzobj.position.x = -2900;

//     return worldWidth;
// }

function dragEnd(event)
{
	console.log("drag ended");
	// console.log(event);
	var mouseIntersectsPerson = mousePositionIntersectsObjects({x: event.clientX, y: event.clientY}, timelineObjects);
	console.log(mouseIntersectsPerson);
	if (mouseIntersectsPerson) {
		var notice = document.createElement('div');
		notice.style.position = "absolute";
		notice.style.top = 0;
		notice.style.left = 0;
		notice.style.width = '100%';
		notice.style.height = '100%';
		notice.style.lineHeight = '100%';
		notice.style.horizontalAlign = "center";
		notice.style.background = "black";
		notice.style.opacity = .85;
		notice.innerHTML = '<p style="position: absolute; width: 100%; text-align: center; height: 300px; line-height: 300px; top: 50%; margin-top: -150px;">Article Sent</p>';
		notice.style.fontSize = '200px';
		notice.style.color = "white";
		notice.style.fontFamily = "Arial";

		document.querySelector('html').appendChild(notice);
		setTimeout(function () {
			document.querySelector('html').removeChild(notice);
		}, 1500);

		// send an email if someone shared something with Andy
		if (mouseIntersectsPerson == 'AndyLippman') 
		{
			var request = new XMLHttpRequest();
			request.open('POST', 'http://um.media.mit.edu:10018/share', true);
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.send('url=' + encodeURIComponent(this.src));
		}
	}
	// shrink(this.parentNode, startingPosition);
	// currElem = null;
	lastITime = (new Date()).getTime();
	contentTouchStart.call(this);
	previousPosition = null;
	dragging = false;
}
