from datetime import timedelta  
from flask import Flask, make_response, request, current_app  
from functools import update_wrapper
import sys
import json
import urllib, urllib2, cookielib
from random import randrange
from urlparse import urlparse

# email modules
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
app.debug = True


def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):  
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

publishers = [

 {
   "type":"Helios",
   "name":"Savannah Niles",
   "url":"Savannah",
   "thumbnail":" http://viral.media.mit.edu/img/people/savannah.jpg"
 },
  {
   "type":"",
   "name":"Business Insider",
   "url":"http://www.businessinsider.com/",
   "thumbnail":" http://i0.wp.com/edge.alluremedia.com.au/assets/technetwork/img/businessinsider/gravatar.jpg"
 },
 {
   "type":"",
   "name":"Business Week",
   "url":"http://www.businessweek.com/",
   "thumbnail":" https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRmFuAUYRoh0gZPs3jrnOx-gO-4JIlJTRLLpuI8i4EIQ-RwymR-"
 },
 {
   "type":"",
   "name":"USA Today",
   "url":"http://www.usatoday.com/",
   "thumbnail":" http://uniq3d.files.wordpress.com/2012/09/usa-app-logo.png"
 },
 {
   "type":"Helios",
   "name":"Eric Dahlseng",
   "url":"eric.dahlseng",
   "thumbnail":" http://pldb.media.mit.edu/face/dahlseng"
 },
 {
   "type":"",
   "name":"CBS",
   "url":"http://www.cbsnews.com/",
   "thumbnail":" http://www.threeifbyspace.net/wp-content/uploads/2013/05/cbs-logo.png"
 },
 {
   "type":"",
   "name":"Fox Sports",
   "url":"http://www.foxsports.com/",
   "thumbnail":" http://a1.phobos.apple.com/us/r1000/035/Purple/e9/ec/f4/mzi.dwnmuumh.png"
 },
 {
   "type":"Helios",
   "name":"Amir Lazarovich",
   "url":"amirl",
   "thumbnail":" http://viral.media.mit.edu/img/people/amir.jpg"
 },
 {
   "type":"Helios",
   "name":"Jon Ferguson",
   "url":"jon@media.mit.edu",
   "thumbnail":" http://pldb.media.mit.edu/face/jonf"
 },
 {
   "type":"",
   "name":"ESPN",
   "url":"http://espn.go.com/",
   "thumbnail":" http://athletics.mtholyoke.edu/sports/news/2011-12/photos/martha_ackmann_photos/espnlogo.jpg"
 },
 {
   "type":"",
   "name":"Reuters",
   "url":"http://www.reuters.com/",
   "thumbnail":" http://www.gunnars.com/wp-content/uploads/2014/01/Reuters-logo.jpg"
 },
 {
   "type":"",
   "name":"Huffington Post",
   "url":"http://www.huffingtonpost.com/",
   "thumbnail":" http://malaikaforlife.org/wp-content/uploads/2013/08/huff-post.jpg"
 },
 {
   "type":"Helios",
   "name":"Andy Lippman",
   "url":"lip",
   "thumbnail":" http://viral.media.mit.edu/img/people/lip.jpeg"
 },
 {
   "type":"",
   "name":"Miami Herald",
   "url":"http://www.miamiherald.com/",
   "thumbnail":" http://www.nwdesigninc.com/images/thumb_miamiherald.jpg"
 },
 {
   "type":"",
   "name":"Washington Post",
   "url":"http://www.washingtonpost.com/",
   "thumbnail":" http://www.kurzweilai.net/images/The-Washington-Post-logo.jpg"
 },
 {
   "type":"",
   "name":"New York Magazine",
   "url":"http://nymag.com/",
   "thumbnail":" http://nymag.com/img/nymag-1500x1500.png"
 },
 {
   "type":"",
   "name":"LA Times",
   "url":"http://www.latimes.com/",
   "thumbnail":" http://www.becketfund.org/wp-content/uploads/2013/02/LA-Times-logo-square-e1360163706629.jpg"
 },
 {
   "type":"",
   "name":"US Weekly",
   "url":"http://www.usmagazine.com/",
   "thumbnail":" http://prw.memberclicks.net/assets/Press_Images/us%20weekly.png"
 },
 {
   "type":"Helios",
   "name":"Vivian Diep",
   "url":"diep",
   "thumbnail":" http://viral.media.mit.edu/img/people/vivian.jpg"
 },
 {
   "type":"",
   "name":"Newsweek",
   "url":"http://www.newsweek.com/",
   "thumbnail":" http://asklogo.com/images/N/newsweek%20logo.jpg"
 },
 {
   "type":"",
   "name":"Bloomberg",
   "url":"http://www.bloomberg.com/",
   "thumbnail":" http://redalertpolitics.com/files/2013/08/Bloomberg-News-logo.jpg"
 },
 {
   "type":"",
   "name":"Telegraph",
   "url":"http://www.telegraph.co.uk/",
   "thumbnail":" http://ny1.createit.netdna-cdn.com/wp-content/uploads/2014/01/telegraph-logo.jpg"
 },
 {
   "type":"",
   "name":"Wikipedia",
   "url":"http://en.wikipedia.org/",
   "thumbnail":" http://tctechcrunch2011.files.wordpress.com/2010/05/wikipedia1.png"
 },
 {
   "type":"",
   "name":"Travis Rich",
   "url":"trich",
   "thumbnail":" http://viral.media.mit.edu/img/people/trich.jpeg"
 }
]

def getPublisherIndex(publisherName):
    # print "publisherName: " + publisherName
    # if publisherName in 
    for index, publisher in enumerate(publishers):
        # print "comparing: " + publisherName + " & " + publisher["url"]
        if publisherName == publisher["url"]:
            print "Yes! " + publisherName
            return index
    return -1
    # return randrange(24)

@app.route('/faketrixData')
@crossdomain(origin='*')
def faketrixData():
    #get News data for sources
    NEWS_URL = 'http://um.media.mit.edu:5005/news/48'
    newsData = json.loads(urllib2.urlopen(NEWS_URL).read())
    responseData = {
        "publishers": publishers, 
        "json_list": []
    }

    for i in range(len(newsData['json_list'])):
        related = newsData['json_list'][i]['related'] #newsData['json_list'][i]['publisher'] = randrange(24)
        domain = ""
        if len(related) > 0:
            parsed_uri = urlparse(related[0]['url'])
            domain = '{uri.scheme}://{uri.netloc}/'.format(uri=parsed_uri)
            publisherIndex = getPublisherIndex(domain)
            if getPublisherIndex(domain) != -1:
                newsData['json_list'][i]['publisher'] = publisherIndex
                responseData['json_list'].append(newsData['json_list'][i])

    #get Helios data for people
    cookie_jar = cookielib.CookieJar()
    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookie_jar))
    urllib2.install_opener(opener)

    heliosUrl = "http://um-helios.media.mit.edu/login"
    post_data_dictionary = {'username':'matrix', "password":"v1r@l!!"}
    post_data_encoded = urllib.urlencode(post_data_dictionary)
    request_object = urllib2.Request(heliosUrl, post_data_encoded)
    response = urllib2.urlopen(request_object)
    html_string = response.read()
    print html_string

    for index, publisher in enumerate(publishers):
        if publisher['type'] == "Helios":
            videoData = {
                "publisher": index, 
                "title": "",
                "timestamp": "",
                "related": []
            }
            try:
                #http://um-helios.media.mit.edu/getVideos?user=Savannah
                data = urllib2.urlopen("http://um-helios.media.mit.edu/getVideos?limit=20&user=" + urllib.quote_plus(publisher['url']))#.read()
                j = json.load(data)
                print j
                print ""
                for video in j['videos']:
                    videoData['title'] = video['videoTitle']
                    videoData['timestamp'] = video['lastViewTime']
                    related = {
                        "url": "https://www.youtube.com/watch?v=" + video['videoID'],
                        "id": video['videoID'],
                        "title": video['videoTitle'],
                        "type": "YT",
                        "UMID": "YTISGH0KVSJzA"
                    }
                    videoData['related'].append(related)
                    responseData['json_list'].append(videoData)
            except:
                print "HTTPError. Something terrible has happened."

    #return response
    return json.dumps(responseData)

@app.route('/share', methods=['POST'])
def emailPerson():
    url = request.form['url']
    msg = MIMEText('Someone shared a video with you: ' + url)

    to = "savannah@mit.edu"

    msg['Subject'] = 'Message from the Matrix'
    msg['From'] = "viralgrads@media.mit.edu"
    msg['To'] = to

    s = smtplib.SMTP('localhost')
    s.sendmail("viralgrads@media.mit.edu", to, msg.as_string())
    s.quit()

if __name__ == '__main__':
	if len(sys.argv) != 2:
		print 'USAGE: python server.py [port #]'
	else:
		app.run(host='0.0.0.0', port=int(sys.argv[1]))