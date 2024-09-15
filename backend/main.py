from flask import Flask, request, jsonify
from config import app, db
from models import RecipeTable
import os
import requests
from flask_cors import CORS


SPOONACULAR_API_KEY = os.getenv('SPOONACULAR_API_KEY')


# Fetch recipe image from Spoonacular API
def fetch_recipe_image(recipe_name):
    url = f'https://api.spoonacular.com/recipes/complexSearch'
    params = {
        'query': recipe_name,
        'apiKey': SPOONACULAR_API_KEY,
        'number': 1 
    }
    
    response = requests.get(url, params=params)
    # print(f'Spoonacular API response status: {response.status_code}')
    # print(f'Spoonacular API response content: {response.content}')

    if response.status_code == 200:
        data = response.json()
        if data['results']:
            image_url = data['results'][0].get('image', None)
            print(f"Image URL for '{recipe_name}': {image_url}")
            return image_url  # Get the URL of the first image
        else:
            print(f"No results found for '{recipe_name}'")
    else:
        print(f"Failed to fetch data from Spoonacular API for '{recipe_name}'")
    
    return None  # Fallback if no image found

@app.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = RecipeTable.query.all()
    json_recipes = list(map(lambda x:x.to_json(), recipes))
    return jsonify({"recipes": json_recipes})

@app.route('/view/<int:recipe_id>', methods=['GET'])
def view_recipe(recipe_id):
    recipe = RecipeTable.query.get(recipe_id)
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    
    image_url = fetch_recipe_image(recipe.name)
    # print(f"Image URL returned for recipe '{recipe.name}': {image_url}")


    recipe_data = {
        "id": recipe.id,
        "name": recipe.name,
        "ingredients": recipe.ingredients,
        "instructions": recipe.instructions,
        "createdAt": recipe.created_at.isoformat(),
        "image_url": image_url
    }
    
    return jsonify({"recipe": recipe_data})

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    data = request.json
    name = data.get('name')
    ingredients = data.get('ingredients')
    instructions = data['instructions']
    if not name or not ingredients or not instructions:
        return jsonify({"message": "Please provide all the required fields"})
    recipe = RecipeTable(name=name, ingredients=ingredients, instructions=instructions)
    try:
        db.session.add(recipe)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": "Error adding recipe: {}".format(str(e))}), 500

    return (jsonify({"message": "Recipe added successfully"}), 201)


@app.route('/delete_recipe/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    my_pw = os.getenv('REACT_APP_RECIPE_DELETE_PASSWORD')
    data = request.json
    password = data.get('password')
    if password != my_pw:
        return jsonify({"error": "Incorrect password"}), 403

    recipe = RecipeTable.query.get(recipe_id)
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    
    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"message": "Recipe deleted successfully"}), 200


@app.route('/update_recipe/<int:recipe_id>', methods=['PATCH'])
def update_recipe(recipe_id):

    recipe = RecipeTable.query.get(recipe_id)
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    
    data = request.json
    recipe.name = data.get('name', recipe.name)
    recipe.ingredients = data.get('ingredients', recipe.ingredients)
    recipe.instructions = data.get('instructions', recipe.instructions)
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"message": "Error updating recipe: {}".format(str(e))}), 500

    return jsonify({"message": "Recipe updated successfully"}), 200

@app.route('/pexels-image', methods=['GET'])
def get_pexels_image():
    api_key = os.getenv('PEXELS_API_KEY')
    url = 'https://api.pexels.com/v1/search?query=wood%20table&per_page=1'
    headers = {
        'Authorization': api_key,
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json()) 
    else:
        return jsonify({'error': 'Failed to fetch image from Pexels'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)

