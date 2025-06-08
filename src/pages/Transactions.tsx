import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bankService } from '../api/bankService';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import TransactionForm from '../components/bank/TransactionForm';

interface TransactionAccount {
  id: string;
  number: number;
  currency: string;
  balance: number;
}

export default function Transactions() {
  const { token, userId } = useAuth();
  const [accounts, setAccounts] = useState<TransactionAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAccounts = async () => {
    if (!userId) {
      setError('User ID not available');
      setLoading(false);
      return;
    }

    try {
      const response = await bankService.getAccounts(userId);
      setAccounts(response.data.map((acc: any) => ({
        id: acc.id.toString(),
        number: acc.number,
        balance: acc.balance,
        currency: acc.currency || 'USD'
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAccounts();
  }, [token, userId]);

  const handleTransactionSuccess = () => {
    fetchAccounts(); // Обновляем список счетов после успешной транзакции
  };

  if (!token) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Please login to make transactions</Alert>
      </Box>
    );
  }

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
          accounts={accounts.map(acc => ({
            id: acc.id,
            currency: acc.currency
          }))} 
          onSuccess={handleTransactionSuccess} 
        />
      )}
    </Box>
  );
}