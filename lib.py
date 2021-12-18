from bs4 import BeautifulSoup
import requests
import ujson
import io

def extract(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    scripts = soup.find_all('script', type="application/ld+json")
    assert len(scripts) <= 1
    script = scripts[0]
    data = ujson.decode(script.get_text())
    if isinstance(data, list):
        # may be one or more schemas present. If more than one, look for the Recipe type.
        for s in data:
            if s['@type'] == "Recipe":
                return s
        raise Exception("Failed to find Recipe schema")
    return data

def render(data):
    buf = io.StringIO()

    print("Ingredients", file=buf)

    for ri in data['recipeIngredient']:
        print(ri, file=buf)
    
    
    print("", file=buf)
    print("Instructions", file=buf)

    for i, step in enumerate(data['recipeInstructions']):
        print(i, step['text'], file=buf)
    return buf.getvalue()