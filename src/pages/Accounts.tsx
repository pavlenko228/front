import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bankService } from '../api/bankService';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import AccountList from '../components/Bank/AccountList';

// Определяем тип прямо в файле
interface Account {
  id: string;
  balance: number;
  currency: string;
  name: string;
}

export default function Accounts() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await bankService.getAccounts();
        setAccounts(response.data.map((acc: any) => ({
          id: acc.id,
          balance: acc.balance,
          currency: acc.currency || 'USD', // Значение по умолчанию
          name: acc.name || `Account ${acc.id.slice(0, 4)}`
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token]);

  if (!token) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Please login to view your accounts
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Accounts
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : accounts.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You don't have any accounts yet
        </Alert>
      ) : (
        <AccountList accounts={accounts} />
      )}
    </Box>
  );
}