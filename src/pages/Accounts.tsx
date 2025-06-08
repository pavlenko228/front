import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bankService } from '../api/bankService';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import AccountList from '../components/bank/AccountList';


// Интерфейс для данных из API
interface ApiAccount {
  id: number;
  number: number;
  userId: number;
  accountType: string;
  balance: number;
  currency?: string;
}

interface IAccount {
  id: string;
  balance: number;
  currency: string;
  name?: string;
}

export default function Accounts() {
  const { token, userId } = useAuth();
  const [accounts, setAccounts] = useState<ApiAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await bankService.getAccounts(userId);
        setAccounts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token, userId]);

  // Преобразование данных для AccountList
  const formatAccounts = (apiAccounts: ApiAccount[]): IAccount[] => {
    return apiAccounts.map(account => ({
      id: account.id.toString(),
      balance: account.balance,
      currency: account.currency || 'USD',
      name: `Account ${account.number.toString().slice(-4)}` // Генерируем имя из номера
    }));
  };

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
        <AccountList accounts={formatAccounts(accounts)} />
      )}
    </Box>
  );
}