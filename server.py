from flask import Flask
import sys
import json
import urllib2                                      # for querying other sites for content


app = Flask(__name__)

@app.route('/faketrixData')
@crossdomain(origin='*')
def faketrixData():
	NEWS_URL = 'http://um.media.mit.edu:5005/news/48'
	newsData = json.loads(urllib2.urlopen(NEWS_URL).read())

	from random import randrange

	for i in range(len(newsData['json_list'])):
		newsData['json_list'][i]['user'] = randrange(10)

	return json.dumps(newsData)

if __name__ == '__main__':
	if len(sys.argv) != 2:
		print 'USAGE: python server.py [port #]'
	else:
		app.run(host='0.0.0.0', port=int(sys.argv[1]))