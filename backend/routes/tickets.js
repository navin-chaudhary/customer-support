const express = require('express');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// Create a ticket
router.post('/', auth, upload.single('attachment'), async (req, res) => {
  const { title, description, priority, category, contactEmail, phone } = req.body;
  const attachment = req.file ? req.file.path : null; // Save the file path

  try {
    const ticket = new Ticket({
      title,
      description,
      priority,
      category,
      attachment,
      contactEmail,
      phone,
      createdBy: req.user.id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// Get all tickets (for agents)
router.get('/', auth, async (req, res) => {
  try {
    const tickets = req.user.role === 'agent' ? await Ticket.find() : await Ticket.find({ createdBy: req.user.id });
    res.json(tickets);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update ticket status (for agents)
router.patch('/:id', auth, async (req, res) => {
  const { status, assignedTo } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send('Ticket not found');
    if (req.user.role === 'agent') {
      ticket.status = status || ticket.status;
      ticket.assignedTo = assignedTo || ticket.assignedTo;
    }
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a ticket (for customers)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send('Ticket not found');
    if (req.user.role === 'customer' && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).send('Not authorized');
    }
    await ticket.remove();
    res.send('Ticket deleted');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;