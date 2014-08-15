var ZSPACING = 60;

var PLANE_MODE = 1;
var HIST_MODE = 2;
var MAP_MODE = 3;
var MISC_TOPICS = -200;
var mode = null;

var publishers = 
[
 {
   "name":"Business Insider",
   "url":" http://www.businessinsider.com",
   "thumbnail":" http://i0.wp.com/edge.alluremedia.com.au/assets/technetwork/img/businessinsider/gravatar.jpg"
 },
 {
   "name":"Savannah Niles",
   "url":" savannah",
   "thumbnail":" http://viral.media.mit.edu/img/people/savannah.jpg"
 },
 {
   "name":"Business Week",
   "url":" http://www.businessweek.com",
   "thumbnail":" https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRmFuAUYRoh0gZPs3jrnOx-gO-4JIlJTRLLpuI8i4EIQ-RwymR-"
 },
 {
   "name":"USA Today",
   "url":" http://www.usatoday.com",
   "thumbnail":" http://uniq3d.files.wordpress.com/2012/09/usa-app-logo.png"
 },
 {
   "name":"Eric Dahlseng",
   "url":" dahlseng",
   "thumbnail":" http://pldb.media.mit.edu/face/dahlseng"
 },
 {
   "name":"CBS",
   "url":" http://www.cbsnews.com",
   "thumbnail":" http://www.threeifbyspace.net/wp-content/uploads/2013/05/cbs-logo.png"
 },
 {
   "name":"Fox Sports",
   "url":" http://www.foxsports.com",
   "thumbnail":" http://a1.phobos.apple.com/us/r1000/035/Purple/e9/ec/f4/mzi.dwnmuumh.png"
 },
 {
   "name":"Amir Lazarovich",
   "url":" amirl",
   "thumbnail":" http://viral.media.mit.edu/img/people/amir.jpg"
 },
 {
   "name":"Jon Ferguson",
   "url":" jon",
   "thumbnail":" http://pldb.media.mit.edu/face/jonf"
 },
 {
   "name":"ESPN",
   "url":" http://espn.go.com",
   "thumbnail":" http://athletics.mtholyoke.edu/sports/news/2011-12/photos/martha_ackmann_photos/espnlogo.jpg"
 },
 {
   "name":"Reuters",
   "url":" http://www.reuters.com",
   "thumbnail":" http://www.gunnars.com/wp-content/uploads/2014/01/Reuters-logo.jpg"
 },
 {
   "name":"Huffington Post",
   "url":" http://www.huffingtonpost.com",
   "thumbnail":" http://malaikaforlife.org/wp-content/uploads/2013/08/huff-post.jpg"
 },
 {
   "name":"Andy Lippman",
   "url":" lip",
   "thumbnail":" http://viral.media.mit.edu/img/people/lip.jpeg"
 },
 {
   "name":"Miami Herald",
   "url":" http://www.miamiherald.com",
   "thumbnail":" http://www.nwdesigninc.com/images/thumb_miamiherald.jpg"
 },
 {
   "name":"Washington Post",
   "url":" http://www.washingtonpost.com",
   "thumbnail":" http://www.kurzweilai.net/images/The-Washington-Post-logo.jpg"
 },
 {
   "name":"New York Magazine",
   "url":" http://nymag.com",
   "thumbnail":" http://nymag.com/img/nymag-1500x1500.png"
 },
 {
   "name":"LA Times",
   "url":" http://www.latimes.com",
   "thumbnail":" http://www.becketfund.org/wp-content/uploads/2013/02/LA-Times-logo-square-e1360163706629.jpg"
 },
 {
   "name":"US Weekly",
   "url":" http://www.usmagazine.com",
   "thumbnail":" http://prw.memberclicks.net/assets/Press_Images/us%20weekly.png"
 },
 {
   "name":"Vivian Diep",
   "url":" vdiep",
   "thumbnail":" http://viral.media.mit.edu/img/people/vivian.jpg"
 },
 {
   "name":"Newsweek",
   "url":" http://www.newsweek.com",
   "thumbnail":" http://asklogo.com/images/N/newsweek%20logo.jpg"
 },
 {
   "name":"Bloomberg",
   "url":" http://www.bloomberg.com",
   "thumbnail":" http://redalertpolitics.com/files/2013/08/Bloomberg-News-logo.jpg"
 },
 {
   "name":"Telegraph",
   "url":" http://www.telegraph.co.uk",
   "thumbnail":" http://ny1.createit.netdna-cdn.com/wp-content/uploads/2014/01/telegraph-logo.jpg"
 },
 {
   "name":"Wikipedia",
   "url":" http://en.wikipedia.org",
   "thumbnail":" http://tctechcrunch2011.files.wordpress.com/2010/05/wikipedia1.png"
 },
 {
   "name":"Travis Rich",
   "url":" trich",
   "thumbnail":" http://viral.media.mit.edu/img/people/trich.jpeg"
 }
]

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

function buildTimeline(range) {
	// var range = _timeRange(uielems);

	// var timedelta_mins = (range.max.getTime() - range.min.getTime()) / (1000*60);

	var timebucket = 120;
	// var numBuckets = Math.ceil(timedelta_mins / timebucket);
	var numBuckets = 24;

	console.log("numBuckets", numBuckets);
	
	// var d  = new Date();
	// d.setTime(range.min.getTime());
	// var startHr = d.getHours();
    for (var xPos = 0; xPos < numBuckets; xPos++) {
		var div = document.createElement("div");
		// var hr = (startHr + xPos * 2) % 24;
	    div.className = 'timebar';

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
	    var idName = publishers[xPos].name.replace( /\W/g , '');
	    thumbnail.setAttribute('id', idName);
	    var nameTitle = document.createElement("p");
	    nameTitle.innerText = publishers[xPos].name;
	    div.appendChild(thumbnail);
	    div.appendChild(nameTitle);

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
		if (dy > 50 || dx > 50)
		{
			dragging = true;
		}
	}

	if (!dragging) {
		return;
	}

	if (!previousPosition) {
		previousPosition = {x: ev.clientX, y: ev.clientY};
		return;
	}

	console.log('made it');


	var movementDifference = {x: ev.clientX - previousPosition.x, y: ev.clientY - previousPosition.y};
	
	var yIn3d = height3dWithZ(obj.position.z, movementDifference.y);
	var xIn3d = height3dWithZ(obj.position.z, movementDifference.x);

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

	if (position) {
		position.z = obj.position.z - zMove;
	} else {
		position = {z: obj.position.z - zMove};
	}

	new TWEEN.Tween(obj.position)
		.easing(TWEEN.Easing.Quadratic.Out)
		.to(position, duration)
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
	$(document).off({
			'touchstart': touchHandler.onTouchStart,
			'touchmove': touchHandler.onTouchMove,
			'touchend': touchHandler.onTouchEnd
			});
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

// function width3dWithZ(z, pxWidth) {
//     var theta = THREE.Math.degToRad(camera.fov / 2);
//     var full3dWidth = 2 * Math.tan(theta) * z;

//     var fullPxWidth = window.innerWidth;
//     var ratio =   pxWidth / fullPxWidth;
//     var worldWidth = ratio * full3dWidth;

//     // zzobj.position.y = 1450; zzobj.position.x = -2900;

//     return worldWidth;
// }

function dragMove(event, touch, object, point)
{
	console.log("event ", event);
	console.log("touch", touch);
	console.log("object", object);
	console.log("point", point);

	return;

	if (!initialTouch)
	{
		initialTouch = {x:ev.clientX, y:ev.clientY};
	} else {
		var dy = Math.abs(ev.clientY - initialTouch.y);
		var dx = Math.abs(ev.clientX - initialTouch.x);
		if (dy > 50 || dx > 50)
		{
			startDragging(this, ev);
		}
	}

	elem = this.parentNode;
	
	console.log('drag is Moving');
	e.preventDefault();
	e.stopPropagation();
	zframe = this;

	var duration = 10;
	var $elem = $(elem);
	var size = {width: $elem.width(), height: $elem.height()};
	var obj = elem.obj;

	console.log("object's position", obj.position);
	console.log("object's size" );
	console.log("e.clientX", e.clientX);
	console.log("e.clientY", e.clientY);

	var newPositionOffsetX = e.clientX - 100;
	var newPositionOffsetY = (parseInt(elem.style.height) - e.clientY) - 100;

	var newPosition = {x: obj.position.x + newPositionOffsetX, y: obj.position.y + newPositionOffsetY};


	new TWEEN.Tween(obj.position)
		.easing(TWEEN.Easing.Quadratic.Out)
		.to(newPosition, duration)
		.start();

	new TWEEN.Tween( this )
		.to( {}, duration * 1.05)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate( render )
		.start();	
}

function dragEnd(event, touch, object, point)
{
	// console.log("drag ended");
	// shrink(this.parentNode, startingPosition);
	// currElem = null;
}
