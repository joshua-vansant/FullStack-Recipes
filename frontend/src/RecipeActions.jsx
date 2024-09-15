import React from 'react';
import { Button } from 'react-bootstrap';

const RecipeActions = ({ recipe, onUpdate, onDelete }) => {
    const handleUpdateClick = (e) => {
        e.stopPropagation();  // Prevents triggering <tr/> onClick event
        onUpdate(recipe);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();  // Prevents triggering <tr/> onClick event
        onDelete(recipe.id);
    };

    return (
        <div>
            <Button variant="primary" onClick={handleUpdateClick} className="me-2">
                Update
            </Button>
            <Button variant="danger" onClick={handleDeleteClick}>
                Delete
            </Button>
        </div>
    );
};

export default RecipeActions;
