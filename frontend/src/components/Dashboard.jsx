import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Menu as MenuIcon, Notifications, ExitToApp } from '@mui/icons-material';
import axios from 'axios';
import TicketList from './TicketList';
import TicketForm from './TicketForm';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    closed: 0
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
        
        // Calculate stats
        const open = res.data.filter(ticket => ticket.status === 'open').length;
        setStats({
          total: res.data.length,
          open,
          closed: res.data.length - open
        });
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Help Desk Dashboard
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Tickets
                </Typography>
                <Typography variant="h3">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Open Tickets
                </Typography>
                <Typography variant="h3" color="primary">{stats.open}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Closed Tickets
                </Typography>
                <Typography variant="h3" color="success.main">{stats.closed}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ mt: 4, p: 2 }}>
          <TicketForm />
          <Divider sx={{ my: 3 }} />
          <TicketList tickets={tickets} />
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;