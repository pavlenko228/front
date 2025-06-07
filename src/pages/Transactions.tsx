import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bankService } from '../api/bankService';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import TransactionForm from '../components/Bank/TransactionForm';

interface Account {
  id: string;
  currency: string;
}

export default function Transactions() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (token) fetchAccounts();
  }, [token]);

  if (!token) return <Alert severity="warning">Please login to make transactions</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Make a Transaction
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TransactionForm 
          accounts={accounts} 
          onSuccess={fetchAccounts} 
        />
      )}
    </Box>
  );
}