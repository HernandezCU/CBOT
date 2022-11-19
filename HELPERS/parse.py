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
    
    ls = []
    data_sets1 = []
    data_sets2 = []
    
    with open(path, "r") as fp:
        for line in fp:
            ls.append(line.replace("\n", "").replace("EUTHYPHRO: ", "").replace("SOCRATES: ", "")
                      .replace("Plato: ", "").replace("Socrates: ", ""))

    for i in range(0, len(ls)):
        if i%2 == 0:
            data_sets1.append(ls[i])
        else:
            data_sets2.append(ls[i])
            
    dataS = [data_set("question", [x], [y]) for x, y in zip(data_sets1, data_sets2)]
    return dataS


if __name__ == "__main__":
    with open("n_intents.json", "a") as file:
        json.dump(parse_file("Dataset/INTERACTIONS.txt"), file, indent=4, cls=data_set_encoder)
    
    
    
    
    