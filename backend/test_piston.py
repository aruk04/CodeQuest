import urllib.request
import json

data = json.dumps({
    "language": "python",
    "version": "3.10.0",
    "files": [{"name": "main.py", "content": "print('hello piston')"}],
    "stdin": ""
}).encode('utf-8')

req = urllib.request.Request('https://emkc.org/api/v2/piston/execute', data=data, headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    print(response.read().decode('utf-8'))
except Exception as e:
    print(e)
