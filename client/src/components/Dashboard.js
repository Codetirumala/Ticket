import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(
          collection(db, 'tickets'),
          where('createdBy', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        const ticketStats = {
          total: 0,
          open: 0,
          inProgress: 0,
          resolved: 0,
        };

        querySnapshot.forEach((doc) => {
          const ticket = doc.data();
          ticketStats.total++;
          switch (ticket.status) {
            case 'open':
              ticketStats.open++;
              break;
            case 'in-progress':
              ticketStats.inProgress++;
              break;
            case 'resolved':
              ticketStats.resolved++;
              break;
            default:
              break;
          }
        });

        setStats(ticketStats);
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Tickets
            </Typography>
            <Typography variant="h3">{stats.total}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Open
            </Typography>
            <Typography variant="h3">{stats.open}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.light',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              In Progress
            </Typography>
            <Typography variant="h3">{stats.inProgress}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'info.light',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Resolved
            </Typography>
            <Typography variant="h3">{stats.resolved}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-ticket')}
              >
                Create New Ticket
              </Button>
              <Button
                variant="outlined"
                startIcon={<ListAltIcon />}
                onClick={() => navigate('/tickets')}
              >
                View All Tickets
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 