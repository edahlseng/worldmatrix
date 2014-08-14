/**
 * Touch Handler
 *
 * @author Amir Lazarovich
 */
function TouchHandler(Utils, camera, configuration) {
	//////////////////////////////////////////////////////
 	////// Private
 	//////////////////////////////////////////////////////
 	var config;
 	var trackedEvent;
 	var items = [];
 	var touchEvents = new Map();
 	var me = this;

	//////////////////////////////////////////////////////
 	////// Public
 	//////////////////////////////////////////////////////
 	this.isTracking = true;

	this.onTouchStart = function(event) {
		if (!me.isTracking) {
			return;
		}

		event.preventDefault();
		var touches = event.originalEvent.touches;

		for (var i = 0, max = touches.length; i < max; i++) {
			var touch = touches[i];
			var intersects = Utils.getTouchIntersection(touch, items, camera);
			for (var j = 0, jmax = intersects.length; j < jmax; j++) {
				var intersectedObject = intersects[j].object;
				if (!intersectedObject.visible) {
					continue;
				} else {
					touchEvents.put(touch.identifier, {
						mesh: intersectedObject,
						point: intersects[0].point,
						onMove: intersectedObject.userData.onTouchMove,
						onEnd: intersectedObject.userData.onTouchEnd,
						timeStamp: event.timeStamp
					});

					if (intersectedObject.userData.onTouchStart) {
						intersectedObject.userData.onTouchStart(event, touch, intersectedObject, intersects[0].point)
					}
					break;
				}
			}
		}
	};

	this.onTouchMove = function(event) {
		event.preventDefault();
		var touches = event.originalEvent.changedTouches;

		for (var i = 0, max = touches.length; i < max; i++) {
			var touch = touches[i];

			touchEvent = touchEvents.get(touch.identifier);
			if (touchEvent != null && touchEvent.onMove) {
				touchEvent.onMove(event, touch, touchEvent.mesh, touchEvent.point);
			} else if (config.ENABLE_IDLE_MOVEMENT_TRACKING && touchEvent == null) {
				var intersects = getTouchIntersection(touch, allItems);
				for (var j = 0, jmax = intersects.length; j < jmax; j++) {
					var obj = intersects[j].object;
					if (!obj.visible) {
						continue;
					} else {
						if (trackedEvent.obj != null && obj != trackedEvent.obj) {
							// notify of onTouchMove ended for previous object
							trackedEvent.obj.userData.onTouchMove(event, touch, trackedEvent.obj, trackedEvent.point, true);
							trackedEvent.obj = null;
							trackedEvent.point = null;	
						}

						if (obj.userData.trackIdleMovement && obj.userData.onTouchMove) {
							obj.userData.onTouchMove(event, touch, obj, intersects[0].point, false);
							trackedEvent.obj = obj;
							trackedEvent.point = intersects[0].point;
						}
						break;
					}
				}

				if (intersects.length == 0 && trackedEvent.obj != null) {
					trackedEvent.obj.userData.onTouchMove(event, touch, trackedEvent.obj, trackedEvent.point, true);
					trackedEvent.obj = null;
					trackedEvent.point = null;
				}
			}
		}
	};

	this.onTouchEnd = function(event) {
		event.preventDefault();
		var touches = event.originalEvent.changedTouches;

		for (var i = 0, max = touches.length; i < max; i++) {
			var touch = touches[i];

			var touchEvent = touchEvents.remove(touch.identifier);
			if (touchEvent != null && touchEvent.onEnd) {
				touchEvent.onEnd(event, touch, touchEvent.mesh, touchEvent.point);
			}
		}
	};

	this.onMouseDown = function(event) {
		// proxy to touch controller
		return me.onTouchStart(me.createTouchEvent(event));
	};

	this.onMouseMove = function(event) {
		// proxy to touch controller
		return me.onTouchMove(me.createTouchEvent(event));
	};

	this.onMouseUp = function(event) {
		// proxy to touch controller
		return me.onTouchEnd(me.createTouchEvent(event));
	};

	this.createTouchEvent = function(event) {
		event.originalEvent = {
			timeStamp: event.timeStamp,
			changedTouches: [
				{
					identifier: 0, // TODO MULTI-TOUCH need to generate more than one when supporting kinect multi-touch 
					clientX: event.clientX,
					clientY: event.clientY
				}
			]
		};

		event.originalEvent.touches = event.originalEvent.changedTouches;
		return event;
	};

	this.registerOnTouch = function(obj, startCallback, endCallback, moveCallback, trackIdleMovement) {
		obj.userData.onTouchStart = startCallback;
		obj.userData.onTouchMove = moveCallback;
		obj.userData.onTouchEnd = endCallback;
		obj.userData.trackIdleMovement = trackIdleMovement;

		// keep track of this object
		items.push(obj);
	};

	this.track = function(obj) {
		if ($.isArray(obj)) {
			obj.forEach(function(item) {
				items.push(item);		
			})
		} else {
			items.push(obj);
		}
	};

	this.unTrack = function(obj) {
		if ($.isArray(obj)) {
			obj.forEach(function(item) {
				var index = items.indexOf(item);
				if (index >= 0) {
					items.splice(index, 1);
				}
			});
		} else {
			var index = items.indexOf(obj);
			if (index >= 0) {
				items.splice(index, 1);
			}
		}
	};

	//////////////////////////////////////////////////////
 	////// Constructor
 	//////////////////////////////////////////////////////	
 	(function TouchHandler(Utils, camera, configuration) {
 		if (!Utils) {
 			throw "TouchHandler must receive a Utils object"
 		}

 		if (!camera) {
 			throw "TouchHandler must receive a Camera object"	
 		}

 		if (!configuration) {
 			Utils.log("TouchHandler is using default configuration");
 			config = {
 				ENABLE_IDLE_MOVEMENT_TRACKING: false
 			};
 		} else {
 			config = configuration;
 		}
 	})(Utils, camera, configuration);
}