import { useState, useEffect } from 'react'
import RecipeList from './RecipeList'
import RecipeForm from './RecipeForm'
import './App.css'

function App() {
  const [recipes, setRecipes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState({})

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    const response = await fetch('http://localhost:5000/recipes')
    const data = await response.json()
    console.log(data.recipes)
    setRecipes(data.recipes)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentRecipe({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (recipe) => {
    if (isModalOpen) return
    setCurrentRecipe(recipe)
    setIsModalOpen(true)
  }

  const onUpdateRecipe = () => {
    fetchRecipes()
    setIsModalOpen(false)
  }

  return<>
  <RecipeList recipes={recipes} updateRecipe={openEditModal} updateCallback={onUpdateRecipe}/>
  <button onClick={openCreateModal}>Create Recipe</button>
  { isModalOpen && <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <RecipeForm existingRecipe={currentRecipe} updateCallback={onUpdateRecipe}/>
      </div>
    </div>
    }
  
  </> 
}

export default App
