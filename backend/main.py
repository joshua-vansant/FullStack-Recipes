from flask import request, jsonify
from config import app, db
from models import RecipeTable

# View all recipes
@app.route('/recipes', methods=['GET'])
def get_recipes():
    recipes = RecipeTable.query.all()
    json_recipes = list(map(lambda x:x.to_json(), recipes))
    return jsonify({"recipes": json_recipes})

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    data = request.json
    name = data.get('name')
    ingredients = data.get('ingredients')  # Expecting a list of dicts (JSON)
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
    if request.method == 'OPTIONS':
        # CORS preflight request
        return jsonify({'message': 'CORS preflight successful'}), 200
    
    recipe = RecipeTable.query.get(recipe_id)
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    
    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"message": "Recipe deleted successfully"}), 200


@app.route('/update_recipe/<int:recipe_id>', methods=['PATCH', 'OPTIONS'])
def update_recipe(recipe_id):
    if request.method == 'OPTIONS':
        # CORS preflight request
        return jsonify({'message': 'CORS preflight successful'}), 200

    recipe = RecipeTable.query.get(recipe_id)
    if not recipe:
        return jsonify({"message": "Recipe not found"}), 404
    
    data = request.json
    recipe.name = data.get('name', recipe.name)
    recipe.ingredients = data.get('ingredients', recipe.ingredients)
    recipe.instructions = data['instructions'], recipe.instructions

    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"message": "Error updating recipe: {}".format(str(e))}), 500

    return jsonify({"message": "Recipe updated successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
