import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  Stack
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import axios from "axios";

const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    category: "",
    contactEmail: "",
    phone: "",
    attachment: null,
  });
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await axios.post("http://localhost:5000/api/tickets", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setAlert({ show: true, type: "success", message: "Ticket submitted successfully!" });
      setFormData({
        title: "",
        description: "",
        priority: "low",
        category: "",
        contactEmail: "",
        phone: "",
        attachment: null,
      });
    } catch (err) {
      setAlert({ show: true, type: "error", message: "Failed to submit ticket" });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit a Ticket
      </Typography>
      
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="email"
              label="Contact Email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  name="attachment"
                />
              </Button>
              {formData.attachment && (
                <Typography variant="body2">
                  {formData.attachment.name}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >
              Submit Ticket
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TicketForm;