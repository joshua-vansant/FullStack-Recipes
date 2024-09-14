import { useState } from 'react'

const RecipeForm = ({ existingRecipe = {}, updateCallback}) => {
  const [name, setName] = useState(existingRecipe.name || '')
  const [ingredients, setIngredients] = useState(existingRecipe.ingredients || '')
  const [instructions, setInstructions] = useState(existingRecipe.instructions || '')

  const updating = Object.entries(existingRecipe).length !== 0

  const onSubmit = async (e) => {
    e.preventDefault()

    const data = {
      name,
      ingredients,
      instructions
    }
    const url = 'http://localhost:5000/' + (updating ? `update_recipe/${existingRecipe.id}` : 'add_recipe')
    const options = {
      method: updating ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    const response = await fetch(url, options)
    if(response.status !== 200 && response.status !== 201){
        const data = await response.json()
        alert(data.message)
    } else {
        //successful
        updateCallback()
    }
  }

    return(
    <form onSubmit={onSubmit}>
        <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
            <label htmlFor="ingredients">Ingredients:</label>
            <input type="text" id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </div>
        <div>
            <label htmlFor="instructions">Instructions:</label>
            <input type="text" id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </div>
        <button type="submit">{updating ? "Update" : "Create"}</button>
    </form>
    );
};

export default RecipeForm