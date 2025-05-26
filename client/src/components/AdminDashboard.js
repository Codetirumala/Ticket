import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as TicketIcon,
  CheckCircle as ResolvedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminTicketList from './AdminTicketList';
import UserListTable from './UserListTable';

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

function AdminDashboard() {
  const [user] = useAuthState(auth);
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        console.log('Fetching users...');
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;
        console.log('Total users fetched:', totalUsers);

        // Fetch tickets count and status
        console.log('Fetching tickets...');
        const ticketsSnapshot = await getDocs(collection(db, 'tickets'));
        const totalTickets = ticketsSnapshot.size;
        console.log('Total tickets fetched:', totalTickets);
        let resolvedTickets = 0;
        let pendingTickets = 0;

        ticketsSnapshot.forEach((doc) => {
          const ticket = doc.data();
          console.log('Ticket status:', ticket.status);
          if (ticket.status === 'resolved') resolvedTickets++;
          if (ticket.status === 'pending') pendingTickets++;
        });

        console.log('Resolved tickets:', resolvedTickets);
        console.log('Pending tickets:', pendingTickets);

        setStats({
          totalUsers,
          totalTickets,
          resolvedTickets,
          pendingTickets,
        });
        console.log('Stats updated:', { totalUsers, totalTickets, resolvedTickets, pendingTickets });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleCardClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Admin Dashboard
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <div onClick={() => handleCardClick('users')} style={{ cursor: 'pointer' }}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
                color={theme.palette.primary.main}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <div onClick={() => handleCardClick('allTickets')} style={{ cursor: 'pointer' }}>
              <StatCard
                title="Total Tickets"
                value={stats.totalTickets}
                icon={<TicketIcon sx={{ color: theme.palette.info.main }} />}
                color={theme.palette.info.main}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <div onClick={() => handleCardClick('resolvedTickets')} style={{ cursor: 'pointer' }}>
              <StatCard
                title="Resolved Tickets"
                value={stats.resolvedTickets}
                icon={<ResolvedIcon sx={{ color: theme.palette.success.main }} />}
                color={theme.palette.success.main}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <div onClick={() => handleCardClick('pendingTickets')} style={{ cursor: 'pointer' }}>
              <StatCard
                title="Pending Tickets"
                value={stats.pendingTickets}
                icon={<PendingIcon sx={{ color: theme.palette.warning.main }} />}
                color={theme.palette.warning.main}
              />
            </div>
          </Grid>
        </Grid>

        {/* Conditional rendering of tables based on selected category */}
        {selectedCategory === 'users' && <UserListTable />}
        {selectedCategory === 'allTickets' && <AdminTicketList />}
        {selectedCategory === 'resolvedTickets' && <AdminTicketList statusFilter="resolved" />}
        {selectedCategory === 'pendingTickets' && <AdminTicketList statusFilter="pending" />}

      </Container>
    </Box>
  );
}

export default AdminDashboard; 