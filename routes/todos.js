const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// @route   GET api/todos
// @desc    Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/todos
// @desc    Create a todo
router.post('/', async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text
    });
    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/todos/:id
// @desc    Update a todo (mark as complete/incomplete)
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }

    // Update text if provided
    if (req.body.text) {
      todo.text = req.body.text;
    }

    // Toggle completed status if provided
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    } else if (req.body.text === undefined) {
      // Original toggle behavior if no body is sent
      todo.completed = !todo.completed;
    }

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/todos/:id
// @desc    Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }
    await todo.deleteOne();
    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
