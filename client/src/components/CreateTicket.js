import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  Box,
  Alert,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

function CreateTicket() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'technical',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const ticketRef = await addDoc(collection(db, 'tickets'), {
        ...ticketData,
        status: 'open',
        createdAt: new Date(),
        createdBy: user.uid,
        createdByEmail: user.email,
        updates: [],
      });

      navigate(`/ticket/${ticketRef.id}`);
    } catch (error) {
      setError('Error creating ticket. Please try again.');
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Ticket
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={ticketData.title}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={ticketData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            margin="normal"
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={ticketData.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 2, mb: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={ticketData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="technical">Technical</MenuItem>
                <MenuItem value="billing">Billing</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="feature">Feature Request</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateTicket; 