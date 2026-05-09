import httpx
import json

url = "http://127.0.0.1:8001/api/chat/"
payload = {
    "message": "hello",
    "session_id": "test_session_123"
}

try:
    with httpx.Client() as client:
        response = client.post(url, json=payload, timeout=65.0)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {str(e)}")
