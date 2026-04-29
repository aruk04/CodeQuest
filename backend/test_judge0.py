import urllib.request
import json

data = json.dumps({
    "source_code": "cHJpbnQoJ2hlbGxvIHdvcmxkJyk=",  # base64 for print('hello world')
    "language_id": 71,
    "base64_encoded": True
}).encode('utf-8')

req = urllib.request.Request('http://127.0.0.1:2358/submissions?base64_encoded=true&wait=true', data=data, headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
