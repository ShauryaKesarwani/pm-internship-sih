from fastapi import FastAPI

# Create FastAPI instance
app = FastAPI()

# Sample route
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with uv!"}

# Another example route
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "query": q}
