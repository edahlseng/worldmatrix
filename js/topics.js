// topics.js
var topicStack = {};

function addToTopicStack(topic, object) {
	if (! (topic in topicStack) )
		topicStack[topic] = [];
	object.topic = topic;
	topicStack[topic].push(object);
}

function filterTopics() {
	// TODO
	var tlength = news.topics.length;
	var ulength = uielems.length;

	var topicsUsed = {};
	for (var i = 0; i < ulength; i++) {
		var uielem = uielems[i];
		var newsItem = uielem.news;
		
		var result = matchToTopic(newsItem, news.topics);
		if (result.index >= 0) {
			topicsUsed[result.title] = true;
		}
	}

	return Object.keys(topicsUsed);
}

function matchToTopic(newsItem, topics) {
	var tlength = topics.length;

	// 
	var index = Math.floor(Math.random()*tlength);
	var title = topics[index];

	var content = newsItem.title + ' ' + newsItem.description;

	for (var i = 0; i < tlength; i++) {
		var topic = topics[i];
		if (content.indexOf(topic) >= 0) {
			return {'index': i, 'title': topic};
		} 
	}


	return {'index': MISC_TOPICS, 'title': 'Misc'};
}