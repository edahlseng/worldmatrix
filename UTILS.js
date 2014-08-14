/**
 * Utilities
 *
 * @author Amir Lazarovich
 */

	function Utils() {
		//////////////////////////////////////////////////////
	 	////// Private
	 	//////////////////////////////////////////////////////
	 	var raycaster = new THREE.Raycaster();
		var projector = new THREE.Projector();
		var tmpVector = new THREE.Vector3();
		var config;
		var io;
		var me = this;

		//////////////////////////////////////////////////////
	 	////// Public
	 	//////////////////////////////////////////////////////
	 	this.isCommunicationEnabled = true;
	 	this.LEVEL_DEBUG = 0;
		this.LEVEL_INFO = 1;
		this.LEVEL_ERROR = 2;

	 	this.getTouchIntersection = function(touch, targets, camera) {
			var x = (touch.clientX / window.innerWidth ) * 2 - 1;
			var y = - (touch.clientY / window.innerHeight ) * 2 + 1;
			return me.getIntersection(x, y, targets, tmpVector, raycaster, camera);
		};

		this.getIntersection = function(x, y, targets, vector, raycaster, camera) {
			if (vector == undefined) {
				vector = new THREE.Vector3();
			}

			if (raycaster == undefined) {
				raycaster = new THREE.Raycaster();
			}

			vector.set(x, y, 1);
			projector.unprojectVector(vector, camera);

			var direction = vector.sub(camera.position);
			raycaster.set(camera.position, direction.normalize());
			return $.isArray(targets) ? raycaster.intersectObjects(targets) : raycaster.intersectObject(targets);
		};

		this.swapText = function(text, mesh, parent, yOffset) {
			if (!mesh) {
				mesh = me.createTextObject(text, {size: config.text.SIZE});
			} else {
				parent.remove(mesh);
				mesh.material.opacity = 1;
				mesh = me.createTextObject(text, {
					size: config.text.SIZE, 
					material: mesh.material
				}); 
			}

			// fix position
			mesh.rotation.x = Math.PI;
			mesh.position.y += yOffset;

			// add to scene
			parent.add(mesh);
		};

		this.createTextGeometry = function(text, options) {
			return new THREE.TextGeometry(text, {
				size: ((options && options.size) ? options.size : 2),
				height: ((options && options.height) ? options.height : 0.25),
				curveSegments: ((options && options.curveSegments) ? options.curveSegments : 2),
				
				font: ((options && options.font) ? options.font : "optimer"), 
				weight: ((options && options.weight) ? options.weight : "normal"), 
				// style: "normal",
				// bevelThickness: 0.1, bevelSize: 0.1, bevelEnabled: true,
				material: 0, 
				extrudeMaterial: 1
			});
		};

		this.createTextObject = function(text, options) {
			var text3d = me.createTextGeometry(text, options);
			text3d.computeBoundingBox();

			var textMaterial;
			if (options && options.material) {
				textMaterial = options.material;
			} else {
				// var textMaterial = new THREE.MeshLambertMaterial({
				textMaterial = new THREE.MeshBasicMaterial({
				// var textMaterial = new THREE.MeshPhongMaterial({
		 		// var textMaterial = new THREE.MeshNormalMaterial({
		 			color: ((options && options.color) ? options.color : 'white'),
		 			transparent: true
		 		});
			}

			// center position
			var mesh = new THREE.Mesh(text3d, textMaterial);
			var width = Math.abs(text3d.boundingBox.max.x) - Math.abs(text3d.boundingBox.min.x);
			mesh.position.x = -width / 2;
			return mesh;
		};

		this.isEmpty = function(obj) {
			return obj == undefined || obj == null;
		};

		this.emit = function(event, msg) {
			if (me.isCommunicationEnabled) {
				io.emit(event, msg);
			}
		};

		this.init = function(_config, _io) {
			config = _config;
			io = _io;

			if (!io || !io.emit) {
				io = {
					emit: function(event, msg) {
						console.log("** SOCKET NOT CONNECTED ** " + event + ": " + msg);
					}
				}
			}

			me.LEVEL_DEBUG = config.sockets.log.events.DEBUG;
			me.LEVEL_INFO = config.sockets.log.events.INFO;
			me.LEVEL_ERROR = config.sockets.log.events.ERROR;
		};

		this.delegateEvent = function(clientname, callback) {
			return function(event) {
				if (event.client == clientname || ($.isArray(clientname) && (clientname.indexOf(event.client) != -1))) {
					callback(event.data);
				} 	
			}
		};


		this.delegateEventInGroups = function(clientname, groups, callback) {
			var clientnames = [];
			if (groups) {
				groups.forEach(function(group) {
					clientnames.push(clientname + group);
				});	
			}

			if (clientnames.length == 0) {
				clientnames.push(clientname);
			}

			return function(event) {
				if ((clientnames.indexOf(event.client) != -1) || 
						(event.client != undefined && 
						event.client != null && 
						event.client != config.CLIENT_NAME && 
						clientnames.indexOf(event.client.replace(/[0-9]/g, '')) != -1)) {
					callback(event.data);
				}
			}
		};

		this.bitCheck = function(flag, value) {
			return (flag & value) == value;
		};

		this.isEmptyString = function(str) {
			return str == "" || me.isEmpty(str);
		};

		this.splitInto = function(str, len) {
			var regex = new RegExp('.{' + len + '}|.{1,' + Number(len-1) + '}', 'g');
	    	return str.match(regex);
		};

		this.smartSplit = function(str, divisor) {
			var result = [];
			var split = str.split(" ");
			var length = split.length;
			var start = 0;
			var step = Math.ceil(length / divisor);
			while (start < length) { 
				var end = start + step;
				if (end > length - 1) {
					end = length - 1;
				}

				result.push(split.slice(start, end).join(" "));

				start += step;
			}

			return result;
		};

		this.generateRandomVideoParam = function() {
			return "?id=" + Math.random().toString(36).substring(5) + "#t=0,60";
		};

		this.log = function(msg, event) {
			// if (config.debug.LOG) {
			// 	console.log(msg);
			// }

			// if (config.debug.LOG_SERVER) {
			// 	if (event == undefined || event == null) {
			// 		event = config.sockets.log.events.DEBUG;
			// 	}

			// 	me.emit(event, msg);
			// }		
		};

		this.world2screen = function(position, camera, width, height) {
		    var pos = position.clone();
		    projScreenMat = new THREE.Matrix4();
		    projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
		    // pos.applyMatrix4(projScreenMat);
		   	pos.applyProjection(projScreenMat);
		    // projScreenMat.multiplyVector3(pos);

		    return { x: ( pos.x + 1 ) * width / 2,
		         y: ( - pos.y + 1) * height / 2};
		};

		this.screen2world = function(x, y, camera, windowWidth, windowHeight) {
			var vector = new THREE.Vector3(
			    (x / windowWidth) * 2 - 1,
			    - (y / windowHeight) * 2 + 1,
			    0.5);

			projector.unprojectVector(vector, camera);
			var dir = vector.sub(camera.position).normalize();
			var distance = - camera.position.z / dir.z;
			var pos = camera.position.clone().add(dir.multiplyScalar(distance));
			return pos;
		};

		this.getWorldDimensions = function(camera, screenWidth, screenHeight) {
			// convert vertical fov to radians
			var vFOV = camera.fov * Math.PI / 180;        

			// visible height
			var height = 2 * Math.tan(vFOV / 2) * camera.position.z; 
			
			var aspect = screenWidth / screenHeight;
			var width = height * aspect;
			return {
				width: width,
				height: height
			}
		};

		this.unitTestDelegator = function(func, args) {
			// TODO need to reference parent context
			var f = eval(func);
			if (f) {
				f(args);
			}
		};
	}