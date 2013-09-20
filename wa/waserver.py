import wap, sqlite3, xmltodict
from flask import Flask, request
from flask.ext.jsonpify import jsonify

wa_url = 'http://api.wolframalpha.com/v2/query'
appid = 'TTQKX3-6K2GA4RXR3'
waeo = wap.WolframAlphaEngine(appid, wa_url)
query_stub = 'nutritional information of '

conn = sqlite3.connect('cache.db')
conn.text_factory = str
cursor = conn.cursor()
try:
	cursor.execute('CREATE TABLE cache (query text, response text)')
	conn.commit()
	print 'DB is fresh, creating table...'
except sqlite3.OperationalError:
	print 'DB is already setup, resuming use...'

def run_query(input_query):
	input_query = query_stub + input_query
	cursor.execute('SELECT response FROM cache WHERE query=?', (input_query,))
	response = cursor.fetchone()

	if response:
		print "	Cache hit on: %s" % (input_query)
		response = response[0]
	else:
		print "	Cache miss on: %s" % (input_query)
		query = waeo.CreateQuery(input_query)
		response = waeo.PerformQuery(query)
		try:
			cursor.execute('INSERT INTO cache VALUES (?, ?)', (input_query, response,))
		except sqlite3.Error as e:
			print "Error occurred: %s" % (e.args[0])
		conn.commit()
	
	output_json = xmltodict.parse(response)
	return jsonify(output_json)

app = Flask('WA_API')

@app.route('/wa')
def handle():
	if(request.args.get('item')):
		query = request.args.get('item')
		return run_query(query)
	return '<html>You forgot something.</html>'

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8080)
