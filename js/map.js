// map.js

var mapStack = {};
var countryGroup = new THREE.Object3D();


var MAX_STACK = 18;

function mapDataReady(rawData) {
    // 
    console.log("Map Data Ready!");
    var mapuielems = generateUIElems(rawData);
    console.log(mapuielems);

    mapObject = buildMap(mapuielems);
    countries = setupMapTargets(mapuielems);
    setTimeout(function() { d3map(mapuielems); }, 500);
}


function generateUIElems(rawData) {
    var mapuielems = [];

    for (var i = 0; i < rawData.length; i++) {
        var raw = rawData[i];
        var gfx = getGraphic(raw);
        if (!gfx) continue; 
        var uielem = new UINews(raw, gfx, 0, 0);
        mapuielems.push(uielem);
    }
    return mapuielems;
}



function setupMapTargets(mapuielems) {
    // first organize by countries
    var ulength = mapuielems.length;
    
    var countries = {};
    
    for (var i = ulength - 1; i >= 0; i--) {
        var uielem = mapuielems[i];
        var news = uielem.news;
        var ents = news.entities;
        var elength = ents.length;
        for (var j = 0; j < elength; j++) {
            var ent = ents[j];
            if (ent.type === 'Country') {
                var val = ent.value;
                if (!countries[val])
                    countries[val] = [];
                var size = countries[val].length;
                if (size < MAX_STACK)
                    countries[val].unshift(uielem);
            }
        }
    }

    return countries;
}

function makeCountryElem(url, index, x, y) {
    var element = document.createElement( 'div' );
    element.className = 'mapelement';
    element.style.backgroundColor = 'rgb(0,127,227)'; 

    var symbol = document.createElement( 'img' );
    symbol.className = 'previewimg';
    symbol.src = url; // || uielem.url;
    symbol.addEventListener('touchstart', imgTouchStart);
    symbol.addEventListener('touchmove', imgMoveStart);

    element.appendChild( symbol );
    
    var object = new THREE.CSS3DObject( element );
    object.isCountryRelated = true;
    object.position.x = x;
    object.position.y = y;
    object.position.z = ZSPACING * index;

    element.obj = object;

    return object;
}

function worldOrigin() {
    var $mapElem = $(mapObject.element);
    
    var y = $mapElem.height() / 2;
    var x = $mapElem.width() / -2; // moving to top left corner

    return {"x": x, "y" : y, "z": mapObject.position.z};
}

function countryClick(x, svgPath, iso3) {
    console.log("main thing", x);
    // gather related countries
    if (x === 'United States of America')
        x = 'United States';
    else if (x === 'Papua New Guinea' || 'Guinea Bissau' === x)
        x = 'Guinea';
    else if (x === 'United Republic of Tanzania')
        x = 'Tanzania';

    var things = countries[x];
    
    if (!things) {
        console.log("nuthing for ", x);
        return;
    }



    // zzpath = svgPath;
    //1450; zzobj.position.x = -2970;

    // var centroid = getCentroid(svgPath);
    // console.log("centroid", centroid);

    var len = mapObject.children.length;
    while (len--) {
        var obj = mapObject.children[len];
        if (obj.isCountryRelated) {
            var elem = obj.element;
            elem.parentNode.removeChild(elem);
            mapObject.children.splice(len);
        }

    }

    var count = 0;
    
    var centroid = getCentroid(svgPath);
    var origin = worldOrigin();
    var finalPos = {x: centroid.x + origin.x, y: origin.y - centroid.y, z: origin.z};
    
    if (iso3) {
        console.log("iso3" , iso3);
        if (iso3 === 'USA') {
            finalPos.x += 350;
        } else if (iso3 === 'RUS') {
            finalPos.x += 1500;
            finalPos.y += 100;
        }
    }

    for (var i =0;i < things.length;i++) {
        var gfx = getGraphic(things[i]);
        
        var obj = makeCountryElem(things[i].url, count++, finalPos.x, finalPos.y);
        // obj.position.x += centroid.x * .75;
        mapObject.add(obj);
        zzobj = obj;
    }


    moveCameraToPos(finalPos);

    render();
}

function moveCameraToPos(pos) {
    var duration = 650;

    pos.x -= camera.position.x;
    pos.y -= camera.position.y + 400; /// +400 adds y delta so that 3d stack is visible

    new TWEEN.Tween(mapObject.position)
        .to({x:-pos.x, y: -pos.y}, duration)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();

    new TWEEN.Tween( this )
        .easing(TWEEN.Easing.Quadratic.In)
        .to( {}, duration )
        .onUpdate( render )
        .start();

}

function cleanUpMap() {
    var len = mapObject.children.length - 1;
    while (len--) {
        var obj = mapObject.children[len];
        if (obj.isCountryRelated) {
            var elem = obj.element;
            elem.parentNode.removeChild(elem);
            mapObject.children.splice(len);

        }
    }
    render();
}


function addToStack(country, obj) {
    if (! (country in mapStack) ) {
        mapStack[country] = [];
    }
    mapStack[country].push(obj);
}

function getStack(country) {
    return mapStack[country];
}

function processData(map, data) {
    // console.log("proccesing data", data);
    // console.log("isready", ready);
    var test = { "RUS" : map.options.fills.LOW, "USA" : map.options.fills.HIGH } ;


    var countryScores = {};

    var datalen = data.length;
    for (var i = 0; i < datalen; i++) {
        var uielem = data[i];
        var obj = uielem.news;
        for (var j in obj.entities) {
            var ent = obj.entities[j];
            if (ent.type === 'Country') {
                
                var c = ent.value;

                if (!countryScores[c])
                    countryScores[c] = 1;
                else
                    countryScores[c] += 1;
                // console.log(ent.value);
                // var cCode = countryCodes[ent.value.toLowerCase()];
                // console.log(cCode, "filling");
            }
        }
    }

    var mapping = {};
    for (var country in countryScores) {
        if (! (country in countryCodes )) {
            console.log("NEED TO ADD CODE FOR", country);
        } else {
            var score = countryScores[country];
            var code = countryCodes[country];
            var scoreColor = map.options.fills.LOW;
            if (score >= 6)
                scoreColor = map.options.fills.HIGH;
            else if (score >= 2)
                scoreColor = map.options.fills.MEDIUM;

            mapping[code] = scoreColor;
        }
    }
    console.log(mapping);
    console.log(countryScores);
    map.updateChoropleth(mapping);

    
}

function d3map(mapuielems) {
    var map = new Datamap({
        element: document.getElementById("mappy"),
        fills: {
            defaultFill: '#7f8c8d' ,
            authorHasTraveledTo: "#fa0fa0",
            LOW: '#1f77b4',
            MEDIUM: '#e67e22',
            HIGH: '#e74c3c',

        },
        
        geographyConfig: {
            borderWidth: 0,
            popupOnHover: false, //disable the popup while hovering

            highlightOnHover: true
        },
        done: function(datamap) {
            
            console.log("doneeee");
            datamap.svg.selectAll('.datamaps-subunit').on('touchstart', function(geography) {
                console.log(geography);

                // "this" is svg path


                var country = geography.properties.name;
                countryClick(country, this,geography.id);
           });

        }
    });
    zzmap = map;
    processData(map, mapuielems);
}


function cleanUpMap() {
    console.log("todo clean!");
    var i  = mapObject.children.length;
    while (i--) {
        var obj = mapObject.children[i];
        obj.element.parentNode.removeChild(obj.element);
        mapObject.remove(obj);
    }

}

function mapTouchStart(ev) {
    console.log("touch!", ev);
}

function mapTouch(ev) {
    console.log("map touched!", ev.properties);
    console.log(ev, this);
}


