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
				makeElement(uielems[i], j, related[j].url);
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
		var d = news.user;
		if (!minTime || d < minTime)
			minTime = d;
		if (!maxTime || d > maxTime)
			maxTime = d;
	}
	return {min : minTime, max: maxTime};
}

function calcXPos(timestamp) {

}

function buildTimeline(range) {
	// var range = _timeRange(uielems);

	var timedelta_mins = (range.max.getTime() - range.min.getTime()) / (1000*60);

	var timebucket = 120;
	var numBuckets = Math.ceil(timedelta_mins / timebucket);

	console.log("numBuckets", numBuckets);
	
	var d  = new Date();
	d.setTime(range.min.getTime());
	var startHr = d.getHours();
    for (var xPos = 0; xPos < numBuckets; xPos++) {
		var div = document.createElement("div");
		var hr = (startHr + xPos * 2) % 24;
	    div.className = 'timebar';

		var txt = hr + ':00';
		if (hr === 0) { 
			txt = 'Midnight';
			div.className += ' midnight';
		}
		else if (hr === 6) { 
			txt = 'Morning';
		}
		else if (hr === 18) txt = 'Evening'
		else if (hr === 12) txt = 'Noon';

	    div.innerText =  txt;
	    var object = new THREE.CSS3DObject( div );
		object.position.x = ( xPos * (itemWidth+xGap) ) - backset;
		object.position.y = -itemHeight*.5;
		timeline.add(object); 
	}
    scene.add(timeline);
    
}

function makeElement(uielem, zPos, url) {
		var element = document.createElement( 'div' );
		element.className = 'element';
		element.style.backgroundColor = 'rgb(0,127,227)'; // + ( Math.random() * 0.5 + 0.25 ) + ')';
		element.style.zIndex = -zPos * ZSPACING;

		var symbol = document.createElement( 'img' );
		symbol.className = 'previewimg';
		symbol.src = urlToImgUrl(url); // || uielem.url;
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

	if (!lastIMoveY) {
		lastIMoveY = ev.clientY;
	} else {

		var dY = -2*(ev.clientY - lastIMoveY);
		this.contentWindow.scrollBy(0, dY);
		lastIMoveY = ev.clientY;
	}
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
			shrink(this.parentNode);
			currElem = null;
		} else {
			// TODO scroll iframe
			//iframe.contentWindow.scrollBy(0, -.25 * ev.gesture.deltaY);
		}
	}

	lastITime = now;
}



function shrink(elem) {
	var duration = 500;
	var $elem = $(elem);
	var size = {width: $elem.width(), height: $elem.height()};
	var obj = elem.obj;

	// remove any stuff
    $elem.children("iframe").remove();
    $elem.children("video").remove();
	$elem.children("img").show();

	new TWEEN.Tween(obj.position)
		.easing(TWEEN.Easing.Quadratic.Out)
		.to({z: obj.position.z - zMove}, duration)
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
}


