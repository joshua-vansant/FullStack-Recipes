import { useState, useEffect } from 'react';
import RecipeList from './RecipeList';
import RecipeForm from './RecipeForm';
import RecipeView from './RecipeView';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Button, Modal } from 'react-bootstrap';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({});
  const [currentView, setCurrentView] = useState('list');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/pexels-image');
        const data = await response.json();
        // console.log('Pexels API response:', data);
  
        if (data.photos && data.photos.length > 0) {
          const imageUrl = data.photos[0].src.original;
          // console.log('Image URL:', imageUrl);
          setBackgroundImage(imageUrl);
        } else {
          console.error('No photos found in the Pexels API response');
        }
      } catch (error) {
        console.error('Error fetching image from Flask:', error);
      }
    };
  
    fetchRecipes();
    fetchBackgroundImage();
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
    setCurrentRecipe(recipe);
    setIsModalOpen(true);
  };

  const onUpdateRecipe = () => {
    fetchRecipes();
    setIsModalOpen(false);
    setCurrentView('list');
  };

  const handleViewRecipe = (recipeId) => {
    setSelectedRecipeId(recipeId);
    setCurrentView('view');
  };

  const handleBackToList = () => {
    setSelectedRecipeId(null);
    setCurrentView('list');
  };

  let content;

  if (currentView === 'list') {
    content = (
      <>
        <RecipeList recipes={recipes} updateRecipe={openEditModal} updateCallback={onUpdateRecipe} onViewRecipe={handleViewRecipe} />
        <Button variant="primary" onClick={openCreateModal}>Create Recipe</Button>
      </>
    );
  } else if (currentView === 'view' && selectedRecipeId !== null) {
    content = <RecipeView recipeId={selectedRecipeId} onBack={handleBackToList} />;
  }

  return (
    <div 
      className="app-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {content}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentRecipe.id ? 'Edit Recipe' : 'Create Recipe'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RecipeForm existingRecipe={currentRecipe} updateCallback={onUpdateRecipe} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
