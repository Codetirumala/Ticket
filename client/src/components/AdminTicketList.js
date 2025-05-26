import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function AdminTicketList({ statusFilter = null }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statuses = ['pending', 'resolved', 'closed']; // Define possible statuses

  useEffect(() => {
    setLoading(true);
    const ticketsCollectionRef = collection(db, 'tickets');
    let q = query(ticketsCollectionRef, orderBy('createdAt', 'desc'));

    if (statusFilter) {
      q = query(ticketsCollectionRef, where('status', '==', statusFilter), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const ticketsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTickets(ticketsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tickets:", err);
        setError('Failed to fetch tickets. Please check permissions.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [statusFilter]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        status: newStatus,
        updatedAt: new Date(), // Update updatedAt field
      });
      console.log(`Ticket ${ticketId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      // Optionally show an error message to the user
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tickets` : 'All Tickets'}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="admin tickets table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Created By (Email)</TableCell>
              <TableCell>Created At</TableCell>
              {/* Add more headers if needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {ticket.title}
                </TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      label="Status"
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{ticket.priority}</TableCell>
                <TableCell>{ticket.userEmail}</TableCell>
                <TableCell>{ticket.createdAt ? new Date(ticket.createdAt.toDate()).toLocaleString() : 'N/A'}</TableCell>
                {/* Add more cells if needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       {tickets.length === 0 && !loading && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="subtitle1">{`No ${statusFilter || ''} tickets found.`}</Typography>
        </Box>
      )}
    </Container>
  );
}

export default AdminTicketList; 