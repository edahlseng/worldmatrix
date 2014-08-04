// laod stuff
//var NEWS_URL = 'js/data/items.json'; 
var TRENDS_URL = 'http://um.media.mit.edu:5005/trends/48';
var MAP_URL = 'http://um.media.mit.edu:5005/map/all';

// var TRENDS_URL = 'http://um.media.mit.edu:5005/trends/24';

var NEWS_URL = 'http://um.media.mit.edu:5005/news/48';
var KEYWORD_URL = 'http://um.media.mit.edu:5005/keyword/';

var THUMB_URL  = 'http://um.media.mit.edu:3144/view/';
var YT_THUMB_PREFIX = 'http://img.youtube.com/vi/'; ///0.jpg'
var YT_THUMB_SUFFIX = '/0.jpg'

function News(callback) {
    this.data = [];
    this.callback = callback;

    this.topics = [];
}

// News.prototype.getMapData = function(callback) {
//     var request = new XMLHttpRequest();
//     console.log("getting map data");
//     request.open('GET', MAP_URL, true);

//     request.onload = function() {
//       if (request.status >= 200 && request.status < 400){
//             var tmp = JSON.parse(request.responseText);
//             callback(tmp.json_list);
//       }
//     };

//     request.onerror = function() {
//       console.warn("error getting map!");
//     };

//     request.send();
// }

News.prototype.getHistory = function(keyword, callback) {

    if (keyword === "Valeant Pharmaceuticals") {
        keyword = "Valeant";
    } else if (keyword === "Gaza Strip") {
        keyword = "Gaza";
    }

    console.log("setting up history of ", keyword);
    var request = new XMLHttpRequest();
    request.open('GET', KEYWORD_URL + keyword, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
            console.log("Got keywords!");
            var tmp = JSON.parse(request.responseText);
            callback(tmp.json_list, keyword);
      }
    };

    request.onerror = function() {
      console.log("error getting topics!!");
    };

    request.send();
}

News.prototype.getMapData = function(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', MAP_URL, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
            var tmp = JSON.parse(request.responseText);
            callback(tmp.json_list);
      }
    };

    request.onerror = function() {
      console.warn("error getting map!");
    };

    request.send();
}

News.prototype.setupTopics = function() {
    console.log("setting up topics...");
    var request = new XMLHttpRequest();
    var callback  = this.callback;
    console.log("getting trends data");
    request.open('GET', TRENDS_URL, true);
    var thisObj = this;
    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
            console.log("Got topics!");
            var tmp = JSON.parse(request.responseText);
            thisObj.topics = tmp.json_list;
            // console.log(tmp);
      }
    };

    request.onerror = function() {
      console.log("error getting topics!!");
    };

    request.send();
}

News.prototype.query = function() {
    console.log("Calling the server for news!");
    var ref = this;
    // $.getJSON(NEWS_URL, function(result) { ref.newsReady(result); });
    var request = new XMLHttpRequest();
    var callback  = this.callback;
    request.open('GET', NEWS_URL, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        // Success!
            console.log("Got news!");
            data = JSON.parse(request.responseText);
            callback(data);
      } else {
        // We reached our target server, but it returned an error

      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      console.log("error getting news!!");
    };

    request.send();
}

News.prototype.newsReady = function(result) {
    console.log("Done!");
    console.log(result);
    this.data = result.json_list;
    this.callback(this.data);
    return this.data;
}

function storyPresent(nStory) {
    for (var i in newsData) {
        var s = newsData[i];
        if (s.id === nStory.id)
            return true;
    }
    return false;
}

function getArticle(ev) {
    var related= ev.related;
    for (var i in related) {
        var r = related[i];
        if ( r.url ) {
            // articlesSeen[r.url] = true;
            return r.url;
        }
    }
    console.warn("no article found", ev);
    return null;
}

function umIdToYTImg(umId) {
    return YT_THUMB_PREFIX + umId.substr(2,11) + YT_THUMB_SUFFIX;
}

function getVideo(ev) {
    // does it have a youtube link?
    var ents = ev.entities;
    for (var i in ents) {
        var ent = ents[i];
        if (ent.type === 'YT' ) {
            return ent.value;
        }
    }
    return null;
}

function getGraphic(ev) {
    // does it have a youtube link?
    var ents = ev.entities;
    for (var i in ents) {
        var ent = ents[i];
        if (ent.type === 'YT'  ) {
            console.log("YT", ent);
            return umIdToYTImg(ent.UMID);
        }
    }
    var related = ev.related;
    for (var i in related) {
        var r = related[i];

        var encodedUrl = encodeURIComponent(r.url);
        return THUMB_URL + encodedUrl;
    }
    return null;
}

function hasEntity(newsItem, value) {
    var ents = newsItem.entities;
    if (!ents || !ents.length)
        return false;
    for (var i in ents) {
        var ent = ents[i];
        if (ent.value.toLowerCase() === value.toLowerCase()  ) {
            return true;
        }
    }
    return false;
}

