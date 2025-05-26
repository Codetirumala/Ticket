import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
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
} from '@mui/material';

function UserListTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef);

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching users:", err);
        setError('Failed to fetch users. Please check permissions.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
        All Users
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="user list table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Location</TableCell>
              {/* Add more headers if needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name || 'N/A'}
                </TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>{user.role || 'user'}</TableCell>
                <TableCell>{user.department || 'N/A'}</TableCell>
                 <TableCell>{user.location || 'N/A'}</TableCell>
                {/* Add more cells if needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {users.length === 0 && !loading && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="subtitle1">No users found.</Typography>
        </Box>
      )}
    </Container>
  );
}

export default UserListTable; 