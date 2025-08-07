from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from prompts import GeminiBlogGenerator
from fastapi.middleware.cors import CORSMiddleware

class PromptRequest(BaseModel):
    user_prompt: str

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return JSONResponse(content={"message": "Hello from FastAPI!"})

@app.post("/generate")
async def generate(request: PromptRequest):
    generator = GeminiBlogGenerator()
    response_text = generator.generate(request.user_prompt)
    return JSONResponse(content={"response": response_text})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
