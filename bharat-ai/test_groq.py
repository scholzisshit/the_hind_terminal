import asyncio
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def test_groq():
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are Bharat Monitor AI, a helpful, intelligent assistant. Answer questions concisely and accurately. Use markdown formatting for readability. If you don't know the answer, say so."},
            {"role": "user", "content": "Hello"}
        ],
        "temperature": 0.5,
        "max_tokens": 512
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=10.0)
            print("Status:", response.status_code)
            try:
                import json
                print("Response:", json.dumps(response.json(), indent=2))
            except Exception as e:
                print("Text response:", response.text)
            response.raise_for_status()
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_groq())
