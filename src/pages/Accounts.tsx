import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bankService } from '../api/bankService';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import AccountList from '../components/Bank/AccountList';

interface Account {
  id: string;
  balance: number;
  currency: string;
}

export default function Accounts() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchAccounts = async () => {
      try {
        const response = await bankService.getAccounts();
        setAccounts(response.data);
      } catch (err) {
        setError('Failed to fetch accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token]);

  if (!token) return <Alert severity="warning">Please login to view accounts</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Accounts
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <AccountList accounts={accounts} />
      )}
    </Box>
  );
}