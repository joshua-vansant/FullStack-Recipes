import React, { useEffect, useState } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';


const RecipeView = ({ recipeId, onBack }) => {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`http://localhost:5000/view/${recipeId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // console.log('Fetched data:', data);
                if (data.recipe) {
                    const parsedIngredients = JSON.parse(data.recipe.ingredients || "[]");
                    const parsedInstructions = JSON.parse(data.recipe.instructions || "[]");
                    setRecipe({ ...data.recipe, ingredients: parsedIngredients, instructions: parsedInstructions });
                    // console.log('Recipe Image URL:', data.recipe.image_url);
                } else {
                    console.error('Recipe not found in the response');
                }
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
            }
        };
    
        fetchRecipe();
    }, [recipeId]);

    if (!recipe) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <Card>
                <Card.Body>
                    <Card.Title className="mb-4">{recipe.name}</Card.Title>
                    
                    {/* Display recipe image if available */}
                    {recipe.image_url ? (
                        <div className="mb-4">
                            <img
                                src={recipe.image_url}
                                alt={recipe.name}
                                style={{ width: '100%', maxWidth: '400px', height: 'auto', display: 'block', margin: '0 auto' }}
                            />
                        </div>
                    ) : (
                        <p>No image available for this recipe.</p>
                    )}
                    
                    <Card.Subtitle className="mb-2 text-muted">Ingredients</Card.Subtitle>
                    <ListGroup variant="flush">
                        {recipe.ingredients.map((ingredient, index) => (
                            <ListGroup.Item key={index}>
                                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Card.Subtitle className="mt-4 mb-2 text-muted">Instructions</Card.Subtitle>
                    <ListGroup variant="flush">
                        {recipe.instructions.map((instruction, index) => (
                            <ListGroup.Item key={index}>
                                {instruction}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                    <Button variant="secondary" onClick={onBack}>Back to List</Button>
                </Card.Footer>
            </Card>
        </div>
    );
};

export default RecipeView;
