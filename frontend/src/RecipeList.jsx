import React from 'react'

const RecipeList = ({recipes, updateRecipe, updateCallback}) => {
    const onDelete = async (id) => {
        try {
            const options = {method: 'DELETE'}
            const response = await fetch(`http://localhost:5000/delete_recipe/${id}`, options)
            if (response.status === 200){
                updateCallback()
            } else {
                console.error("Failed to delete.")
            }
        } catch (error) {
            alert(error)
        }
    }
    return <div>
        <h2>Recipes</h2>
        <table>
        <thead>
            <tr>
                <th>Recipe Name</th>
                <th>Ingredients</th>
                <th>Instructions</th>
            </tr>
        </thead>
        <tbody>
            {recipes.map(recipe => (
                <tr key={recipe.id}>
                    <td>{recipe.name}</td>
                    <td>{recipe.ingredients}</td>
                    <td>{recipe.instructions}</td>
                    <td>
                        <button onClick={() => updateRecipe(recipe)}>Update</button>
                        <button onClick={() => onDelete(recipe.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>
}

export default RecipeList