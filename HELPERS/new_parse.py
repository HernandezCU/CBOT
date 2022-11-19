import json
from json import JSONEncoder
    
class data_set:
    def __init__(self, t, patt: list, resp: list):
        self.tag = t
        self.patterns = patt
        self.responses = resp

    def __repr__(self):
        return "structure(%s, %s, %s)" % (self.tag, self.patterns, self.responses)
    
class data_set_encoder(JSONEncoder):
        def default(self, o):
            return o.__dict__
        
def parse_file(path):
    
    tags = []
    
    jfile = json.load(open(path, "r"))
    for tag in jfile["intents"]:
        if tag["tag"] not in tags:
            tags.append(tag["tag"])
            
    p = [[] for i in range(len(tags))] 
    r = [[] for i in range(len(tags))]
    
    for i in jfile['intents']:
        if i['tag'] in tags:
            p[tags.index(i['tag'])].append(i['patterns'][0])
            r[tags.index(i['tag'])].append(i['responses'][0])
    
    dataS = [data_set(tags[i], p[i], r[i]) for i in range(len(tags))]
    
    return dataS


if __name__ == "__main__":
    #parse_file("n_intents.json")
    with open("new_intents.json", "a") as file:
        json.dump(parse_file("n_intents.json"), file, indent=4, cls=data_set_encoder)
    
    
    
    
    