from typing import Union
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return { "message": "Hello, Friend!" }


@app.get("/{name}")
def read_name(name: str):
    return { "message": f"Hello, {name}!" }
