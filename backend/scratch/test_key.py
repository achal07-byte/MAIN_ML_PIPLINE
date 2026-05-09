import os
import httpx
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")

if not api_key:
    print("ERROR: ANTHROPIC_API_KEY not found in .env")
    exit(1)

print(f"Testing key starting with: {api_key[:10]}...")

url = "https://openrouter.ai/api/v1/auth/key"
headers = {
    "Authorization": f"Bearer {api_key}"
}

try:
    with httpx.Client() as client:
        response = client.get(url, headers=headers)
        if response.status_code == 200:
            print("SUCCESS: API Key is valid.")
            print(f"Response: {response.text}")
        else:
            print(f"FAILURE: Status {response.status_code}")
            print(f"Error: {response.text}")
except Exception as e:
    print(f"EXCEPTION: {str(e)}")
