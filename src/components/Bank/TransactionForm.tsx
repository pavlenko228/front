import { useState } from 'react';
import { TextField, Button, Box, Alert, MenuItem } from '@mui/material';
import { bankService } from '../../api/bankService';

interface TransactionFormProps {
  accounts: Array<{ id: string; currency: string }>;
  onSuccess: () => void;
}

export default function TransactionForm({ accounts, onSuccess }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Исправленный вызов transfer с правильными параметрами
      await bankService.transfer(
        Number(formData.fromAccount), // sourceAccountNumber (number)
        Number(formData.amount),     // amount (number)
        Number(formData.toAccount)   // targetAccountNumber (number)
      );
      setSuccess(true);
      setError('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setSuccess(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Transaction successful!</Alert>}
      
      <TextField
        select
        label="From Account"
        fullWidth
        margin="normal"
        value={formData.fromAccount}
        onChange={(e) => setFormData({...formData, fromAccount: e.target.value})}
      >
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.id} ({account.currency})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="To Account"
        fullWidth
        margin="normal"
        value={formData.toAccount}
        onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
      >
        {accounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.id} ({account.currency})
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Amount"
        type="number"
        fullWidth
        margin="normal"
        value={formData.amount}
        onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
        inputProps={{ min: 0, step: 0.01 }}
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Send Money
      </Button>
    </Box>
  );
}