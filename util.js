// util.js
var THUMB_URL  = 'http://um.media.mit.edu:3144/view/';

var zStacks = {}; 

var imgToUIElem = {};

function maxTopicCount(topicsCount) {
	var max;
	for (var topic in topicsCount) {
		var count = topicsCount[topic];
		if (!max || count > max)
			max = count;
	}
	return max;
}

function urlToImgUrl(url) {
	var encodedUrl = encodeURIComponent(url);
	return THUMB_URL + encodedUrl;
}

function xyStack(x, y) {
	var lookup = x+":"+y;

	if (!(lookup in zStacks)) {
		zStacks[lookup] = [];
	}

	var stack = zStacks[lookup];
	return stack;
}

function addToXYStack(xPos, yPos, object) {
	var stack = xyStack(xPos, yPos);
	object.xPos = xPos;
	object.yPos = yPos;
	stack.push(object);
}

function getBiggestZ(listObjs) {
	var maxZ;
	var maxObj;

	var len = listObjs.length;
	for (var i = 0; i < len; i++) {
		var obj = listObjs[i];
		if (!maxObj || obj.position.z > maxZ) {
			maxObj = obj;
			maxZ = obj.position.z;
		}
	}
	return maxObj;
}

function getSmallestZ(listObjs) {
	var minZ;
	var minObj;

	var len = listObjs.length;
	for (var i = 0; i < len; i++) {
		var obj = listObjs[i];
		if (!minObj || obj.position.z < minZ) {
			minObj = obj;
			minZ = obj.position.z;
		}
	}
	return minObj;
}

function swipeForward(obj) {
	// console.log("handling swipe forward....", obj, obj.xPos, obj.yPos);
	console.log("topic=", obj.topic);

	var stack;
	if (mode === PLANE_MODE)
		 stack = xyStack(obj.xPos, obj.yPos); // : topicStack[obj.topic];
	else if (mode === HIST_MODE)
		stack = topicStack[obj.topic];
	else if (mode === MAP_MODE)
		stack = mapObject.children;

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

function swipeBackward(obj) {
	console.log("handling swipe backward....", obj, obj.xPos, obj.yPos);
	var stack;

	if (mode === PLANE_MODE)
		 stack = xyStack(obj.xPos, obj.yPos); // : topicStack[obj.topic];
	else if (mode === HIST_MODE) {
		console.log("NOT SUPPORTED ATM");
		// return;
		stack = topicStack[obj.topic];
	} else if (mode === MAP_MODE) {
		stack = mapObject.children;
	}

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


function getCentroid(element) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
        // use the native SVG interface to get the bounding box
    var bbox = element.getBBox();
    // return the center of the bounding box
    return {x:bbox.x + bbox.width/2, y:bbox.y + bbox.height/2};
}

function setButtonActive(btn) {
	$("button").removeClass("highlight");
	$(btn).addClass("highlight");
}

function getUiElem(newsStoryId) {
	console.log("lookg for", newsStoryId);
	var ulength = uielems.length; 
	for (var i = ulength - 1; i >= 0; i--) {
		var uielem = uielems[i];
		var news = uielem.news;
		if (news.id === newsStoryId) {
			// move to this story
			return uielem;
		}
	}
	return null;

}


function moveToArticleId(newsStoryId, articleId) {
	console.log("moving to", newsStoryId, articleId);
	var ulength = uielems.length; 
	for (var i = ulength - 1; i >= 0; i--) {
		var uielem = uielems[i];
		var news = uielem.news;
		if (news.id === newsStoryId) {
			// move to this story
			var targetPosX = uielem.xPos * (itemWidth+xGap) - backset * .5 ; // TODO backset??
			var targetPosY = uielem.yPos * (itemHeight+yGap) - 100; //TODO refactor this magic number of 100*.5 see makeElement in ui.js
 			targetPosX = camera.position.x - targetPosX ; //+ backset*.5;
 			targetPosY = camera.position.y - targetPosY;
 			// WHAT WE WANT:
 			// targetPosX + group.position.x
 			group.position.x = targetPosX;
			group.position.y = targetPosY;
			timeline.position.x = targetPosX;
			timeline.position.y = targetPosY;
			console.log("GOT IT!");
			render();
			break;

		}
	}

}

function handleMatrixClick(msg) {
	console.log("got", msg);
	moveToArticleId(msg.data.event_id, msg.data.article_id);
}

// UMevents.on('matrix-news-click', handleMatrixClick)