const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attachment: { type: String }, // Store file path or URL
  contactEmail: { type: String },
  phone: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ticket', TicketSchema);