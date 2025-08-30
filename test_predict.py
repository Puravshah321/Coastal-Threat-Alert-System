# simple test script to call the predict endpoint (run from project root)
import requests
print("Testing predict...")
resp = requests.post("http://localhost:8000/predict", json={"features":[0.1,0.2,0.3,0.4]})
print(resp.status_code, resp.text)
