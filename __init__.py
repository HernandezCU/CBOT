import json
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from flask import Flask, jsonify, render_template, request, send_from_directory
import pickle


app = Flask(__name__)
app.config['SECRET_KEY'] = "CBOT@1234"


with open("/root/CBOT/new_intents.json") as file:
    data = json.load(file)


model = tf.keras.models.load_model('/root/CBOT/chat_model')

with open('/root/CBOT/tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

with open('/root/CBOT/label_encoder.pickle', 'rb') as enc:
    lbl_encoder = pickle.load(enc)

max_len = 20



@app.route("/")
def home():
	return render_template("index.html")


@app.route("/tags")
def get_tags():
    tags = []
    for i in data['intents']:
        tags.append(i['tag'])
    return jsonify({"tags": tags})


@app.route("/tags/patterns")
def get_responses():
    responses = []
    r = request.args.get('tag')
    for i in data['intents']:
        if i['tag'] == r:
            responses.append(i['patterns'])
    return jsonify({"patterns": responses})


@app.route('/query', methods=['GET', 'POST'])
def query():
    q = request.args.get('q')
    
    t = ""
    resp = ""
    result = model.predict(tf.keras.preprocessing.sequence.pad_sequences(tokenizer.texts_to_sequences([q]),truncating='post', maxlen=max_len))
    tag = lbl_encoder.inverse_transform([np.argmax(result)])
    for i in data['intents']:
        if i['tag'] == tag:
            t = str(tag)
            resp = np.random.choice(i['responses'])
            
    return jsonify({"tag": t, "response": resp})
   

@app.route('/<path:path>')
def send_report(path):
    return send_from_directory("", path)


@app.errorhandler(404)
def not_found(e):
  return render_template("404.html")
   
    
if __name__ == "__main__":
    app.run()
