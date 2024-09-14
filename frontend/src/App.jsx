import { useState, useEffect } from 'react';
import RecipeList from './RecipeList';
import RecipeForm from './RecipeForm';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button, Modal } from 'react-bootstrap'; // Import Button and Modal from react-bootstrap

function App() {
  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({});

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const response = await fetch('http://localhost:5000/recipes');
    const data = await response.json();
    console.log(data.recipes);
    setRecipes(data.recipes);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecipe({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (recipe) => {
    if (isModalOpen) return;
    setCurrentRecipe(recipe);
    setIsModalOpen(true);
  };

  const onUpdateRecipe = () => {
    fetchRecipes();
    setIsModalOpen(false);
  };

  return (
    <>
      <RecipeList recipes={recipes} updateRecipe={openEditModal} updateCallback={onUpdateRecipe} />
      
      <Button variant="primary" onClick={openCreateModal}>
        Create Recipe
      </Button>

      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentRecipe.id ? 'Edit Recipe' : 'Create Recipe'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RecipeForm existingRecipe={currentRecipe} updateCallback={onUpdateRecipe} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
