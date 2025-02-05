import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Alert,
  Snackbar
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";

const TicketList = ({ tickets: initialTickets }) => {
  const [tickets, setTickets] = useState(initialTickets);
  const [status, setStatus] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, ticketId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/tickets/${deleteDialog.ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter((ticket) => ticket._id !== deleteDialog.ticketId));
      setSnackbar({ open: true, message: "Ticket deleted successfully", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to delete ticket", severity: "error" });
    }
    setDeleteDialog({ open: false, ticketId: null });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `http://localhost:5000/api/tickets/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(
        tickets.map((ticket) =>
          ticket._id === id ? { ...ticket, status: newStatus } : ticket
        )
      );
      setSnackbar({ open: true, message: "Status updated successfully", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "success",
      medium: "warning",
      high: "error"
    };
    return colors[priority] || "default";
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "info",
      "in-progress": "warning",
      closed: "success"
    };
    return colors[status] || "default";
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id} hover>
                <TableCell>{ticket._id.slice(-6)}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.priority} 
                    color={getPriorityColor(ticket.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={ticket.status}
                    size="small"
                    onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{ticket.createdBy?.email}</TableCell>
                <TableCell>{ticket.assignedTo?.email || "Unassigned"}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteDialog({ open: true, ticketId: ticket._id })}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, ticketId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ticket?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, ticketId: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TicketList;