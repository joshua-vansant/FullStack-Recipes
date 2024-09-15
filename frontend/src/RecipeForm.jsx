import { useState, useEffect } from 'react';
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';

const RecipeForm = ({ existingRecipe = {}, updateCallback }) => {
  console.log('Existing Recipe:', existingRecipe);
  const [name, setName] = useState(existingRecipe.name || '');
  const [ingredients, setIngredients] = useState(
    Array.isArray(existingRecipe.ingredients) ? existingRecipe.ingredients : []
  );
  
  const [instructions, setInstructions] = useState(
    Array.isArray(existingRecipe.instructions) ? existingRecipe.instructions : []
  );

  useEffect(() => {
    console.log('Updating with existingRecipe:', existingRecipe);

    const parsedIngredients = typeof existingRecipe.ingredients === 'string'
      ? JSON.parse(existingRecipe.ingredients)
      : existingRecipe.ingredients;
    const parsedInstructions = typeof existingRecipe.instructions === 'string'
      ? JSON.parse(existingRecipe.instructions)
      : existingRecipe.instructions;

    setName(existingRecipe.name || '');
    setIngredients(Array.isArray(parsedIngredients) ? parsedIngredients : []);
    setInstructions(Array.isArray(parsedInstructions) ? parsedInstructions : []);
  }, [existingRecipe]);

  const updating = Object.entries(existingRecipe).length !== 0;

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = instructions.map((instruction, i) =>
      i === index ? value : instruction
    );
    setInstructions(updatedInstructions);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const filteredIngredients = ingredients.filter(
      ingredient => ingredient.name.trim() !== '' || ingredient.quantity.trim() !== '' || ingredient.unit.trim() !== ''
    );

    const filteredInstructions = instructions.filter(instruction => instruction.trim() !== '');

    const data = {
      name,
      ingredients: filteredIngredients,
      instructions: filteredInstructions
    };

    const url = `http://localhost:5000/${existingRecipe.id ? `update_recipe/${existingRecipe.id}` : 'add_recipe'}`;
    const options = {
      method: updating ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    if (response.status !== 200 && response.status !== 201) {
      const data = await response.json();
      alert(data.message);
    } else {
      updateCallback();
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="name">Name:</Form.Label>
        <Form.Control
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter recipe name"
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Ingredients:</Form.Label>
        {ingredients.length > 0 ? (
          <ListGroup>
            {ingredients.map((ingredient, index) => (
              <ListGroup.Item key={index}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                  />
                  <Button variant="danger" onClick={() => removeIngredient(index)}>Remove</Button>
                </InputGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No ingredients found</p>
        )}
        <Button variant="primary" onClick={addIngredient}>Add Ingredient</Button>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Instructions:</Form.Label>
        {instructions.length > 0 ? (
          <ListGroup>
            {instructions.map((instruction, index) => (
              <ListGroup.Item key={index}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder={`Step ${index + 1}`}
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                  />
                  <Button variant="danger" onClick={() => removeInstruction(index)}>Remove</Button>
                </InputGroup>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No instructions found</p>
        )}
        <Button variant="primary" onClick={addInstruction}>Add Step</Button>
      </Form.Group>

      <Button type="submit" variant="success">{updating ? 'Update' : 'Create'}</Button>
    </Form>
  );
};

export default RecipeForm;
