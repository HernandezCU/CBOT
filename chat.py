import json 
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, FileResponse, StreamingResponse
from jinja2 import Environment, FileSystemLoader
import pickle
import uvicorn



app = FastAPI()
templates = Environment(loader=FileSystemLoader('templates'))
app.mount("/assets", StaticFiles(directory="assets"), name="assets")



with open("new_intents.json") as file:
    data = json.load(file)


model = tf.keras.models.load_model('chat_model')

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

with open('label_encoder.pickle', 'rb') as enc:
    lbl_encoder = pickle.load(enc)

max_len = 20


@app.api_route("/", response_class=HTMLResponse)
def root():
    return templates.get_template("index.html").render()

@app.api_route("/q")
def query(q: str):
    t = ""
    resp = ""
    result = model.predict(tf.keras.preprocessing.sequence.pad_sequences(tokenizer.texts_to_sequences([q]),truncating='post', maxlen=max_len))
    tag = lbl_encoder.inverse_transform([np.argmax(result)])
    for i in data['intents']:
        if i['tag'] == tag:
            t = str(tag)
            resp = np.random.choice(i['responses'])
    return JSONResponse({"tag": t, "response": resp})

if __name__ == "__main__":
    uvicorn.run("chat:app", host="localhost", port=8000, reload=True)