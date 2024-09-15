import React, { useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import RecipeActions from './RecipeActions';

const RecipeList = ({ recipes, updateRecipe, updateCallback, onViewRecipe }) => {
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    const handleDelete = (id) => {
        setRecipeToDelete(id);
        setShowPasswordPrompt(true);
    };

    const confirmDelete = async () => {
        try {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            };
            const response = await fetch(`https://fullstack-recipes-backend.onrender.com/delete_recipe/${recipeToDelete}`, options);
            if (response.status === 200) {
                updateCallback();
            } else if (response.status === 403) {
                alert('Incorrect password.');
            } else {
                console.error('Failed to delete.');
            }
        } catch (error) {
            alert(error);
        }
        setShowPasswordPrompt(false);
        setPassword('');
        setRecipeToDelete(null);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">PB&J Favorite Recipes</h2>
            <Table striped bordered hover>
                <thead className="text-center">
                    <tr>
                        <th>Recipe Name</th>
                        <th>Ingredients</th>
                        <th>Instructions</th>
                        <th className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-left">
                    {recipes.map(recipe => (
                        <tr key={recipe.id} onClick={() => onViewRecipe(recipe.id)} style={{ cursor: 'pointer' }}>
                            <td>{recipe.name}</td>
                            <td>
                                <ul>
                                    {JSON.parse(recipe.ingredients).map((ingredient, index) => (
                                        <li key={index}>
                                            {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {JSON.parse(recipe.instructions).map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="actions">
                                {/* Update and Delete Buttons */}
                                <RecipeActions 
                                    recipe={recipe} 
                                    onUpdate={updateRecipe} 
                                    onDelete={handleDelete} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showPasswordPrompt} onHide={() => setShowPasswordPrompt(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="password"
                        placeholder="Enter password to confirm deletion"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordPrompt(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete Recipe
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RecipeList;