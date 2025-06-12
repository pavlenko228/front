import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bankService, AccountType, AccountDto } from '../api/bankService';
import { jwtDecode } from 'jwt-decode';
import { 
  Box, Typography, CircularProgress, Alert, Button, 
  MenuItem, Select, TextField, List, ListItem, 
  ListItemText, Paper, Chip
} from '@mui/material';

type AccountFilterType = AccountType | 'ALL';

type AppState = {
  accounts: AccountDto[];
  filteredAccounts: AccountDto[];
  loading: boolean;
  error: string | null;
  view: 'welcome' | 'list' | 'create' | 'operation' | 'transferExternal';
  operation?: {
    type: 'deposit' | 'withdraw' | 'transfer' | 'transferExternal';
    accountNumber?: number;
  };
  createForm: {
    number: string;
    accountType: AccountType;
  };
  filterType: AccountFilterType;
  transferData: {
    amount: string;
    targetAccount: string;
  };
};

const AccountsManager = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AppState>({
    accounts: [],
    filteredAccounts: [],
    loading: false,
    error: null,
    view: 'welcome',
    createForm: {
      number: '',
      accountType: 'SAVING'
    },
    filterType: 'ALL',
    transferData: {
      amount: '',
      targetAccount: ''
    }
  });

  const getUserIdFromToken = (): number => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }

    try {
      const decoded = jwtDecode<{ id: number }>(token);
      return decoded.id;
    } catch (error) {
      console.error('Failed to decode token', error);
      navigate('/login');
      throw new Error('Invalid token');
    }
  };

  const loadAccounts = async (accountType?: AccountFilterType) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const userId = getUserIdFromToken();
      const response = accountType === 'ALL' || !accountType
        ? await bankService.getAccounts(userId)
        : await bankService.getAccountsByType(userId, accountType);

      // Обработка случая, когда счетов нет
      if (!response.data || response.data.length === 0) {
        setState(prev => ({
          ...prev,
          accounts: [],
          filteredAccounts: [],
          loading: false,
          view: 'welcome',
          error: null
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        accounts: response.data,
        filteredAccounts: response.data,
        loading: false,
        view: 'list'
      }));
    } catch (error: any) {
      // Обработка ошибки 404 (нет счетов)
      if (error.response?.status === 404) {
        setState(prev => ({
          ...prev,
          accounts: [],
          filteredAccounts: [],
          loading: false,
          view: 'welcome',
          error: null
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Ошибка загрузки счетов'
        }));
      }
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (state.filterType === 'ALL') {
      setState(prev => ({ ...prev, filteredAccounts: prev.accounts }));
    } else {
      setState(prev => ({
        ...prev,
        filteredAccounts: prev.accounts.filter(acc => acc.accountType === prev.filterType)
      }));
    }
  }, [state.filterType, state.accounts]);

  const handleCreateAccount = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await bankService.createAccount({
        userId: getUserIdFromToken(),
        number: Number(state.createForm.number),
        accountType: state.createForm.accountType
      });
      await loadAccounts();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Ошибка создания счета'
      }));
    }
  };

  const handleOperation = async (amount: number, targetAccount?: number) => {
    if (!state.operation) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const { type, accountNumber } = state.operation;
      
      if (type === 'deposit' && accountNumber) {
        await bankService.deposit(accountNumber, amount);
      } else if (type === 'withdraw' && accountNumber) {
        await bankService.withdraw(accountNumber, amount);
      } else if (type === 'transfer' && accountNumber && targetAccount) {
        await bankService.transfer({
          sourceMoneyNumber: accountNumber,
          payeeNumber: targetAccount,
          amount
        });
      } else if (type === 'transferExternal' && accountNumber && state.transferData.targetAccount) {
        await bankService.transfer({
          sourceMoneyNumber: accountNumber,
          payeeNumber: Number(state.transferData.targetAccount),
          amount
        });
      }
      
      await loadAccounts();
      setState(prev => ({
        ...prev,
        view: 'list',
        loading: false,
        transferData: { amount: '', targetAccount: '' }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Ошибка операции'
      }));
    }
  };

  const renderWelcomeView = () => (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>Добро пожаловать в банк!</Typography>
      <Typography sx={{ mb: 3 }}>У вас пока нет счетов. Хотите создать первый?</Typography>
      <Button 
        variant="contained" 
        size="large" 
        onClick={() => setState(prev => ({ ...prev, view: 'create' }))}
      >
        Создать счет
      </Button>
    </Paper>
  );

  const renderListView = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Select
          value={state.filterType}
          onChange={(e) => setState(prev => ({
            ...prev,
            filterType: e.target.value as AccountFilterType
          }))}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="ALL">Все счета</MenuItem>
          <MenuItem value="SAVING">Сберегательные</MenuItem>
          <MenuItem value="CHECKING">Расчетные</MenuItem>
          <MenuItem value="FIXED">Фиксированные</MenuItem>
        </Select>

        <Button
          variant="contained"
          onClick={() => setState(prev => ({ ...prev, view: 'create' }))}
        >
          Создать новый счет
        </Button>
      </Box>

      <List component={Paper}>
        {state.filteredAccounts.map(account => (
          <ListItem key={account.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText
                primary={`Счет #${account.number}`}
                secondary={`Баланс: $${account.balance.toFixed(2)}`}
              />
              <Chip 
                label={
                  account.accountType === 'SAVING' ? 'Сберегательный' :
                  account.accountType === 'CHECKING' ? 'Расчетный' : 'Фиксированный'
                }
                color="primary"
                size="small"
              />
            </Box>
            
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setState(prev => ({
                  ...prev,
                  view: 'operation',
                  operation: { type: 'deposit', accountNumber: account.number }
                }))}
              >
                Пополнить
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setState(prev => ({
                  ...prev,
                  view: 'operation',
                  operation: { type: 'withdraw', accountNumber: account.number }
                }))}
              >
                Снять
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setState(prev => ({
                  ...prev,
                  view: 'operation',
                  operation: { type: 'transfer', accountNumber: account.number }
                }))}
                disabled={state.filteredAccounts.length < 2}
              >
                Перевод между своими
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                color="secondary"
                onClick={() => setState(prev => ({
                  ...prev,
                  view: 'transferExternal',
                  operation: { type: 'transferExternal', accountNumber: account.number }
                }))}
              >
                Перевод другому клиенту
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </>
  );

  const renderCreateView = () => (
    <Paper sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>Создание нового счета</Typography>
      <TextField
        label="Номер счета"
        fullWidth
        margin="normal"
        type="number"
        value={state.createForm.number}
        onChange={(e) => setState(prev => ({
          ...prev,
          createForm: { ...prev.createForm, number: e.target.value }
        }))}
      />
      <Select
        fullWidth
        margin="dense"
        value={state.createForm.accountType}
        onChange={(e) => setState(prev => ({
          ...prev,
          createForm: { ...prev.createForm, accountType: e.target.value as AccountType }
        }))}
      >
        <MenuItem value="SAVING">Сберегательный</MenuItem>
        <MenuItem value="CHECKING">Расчетный</MenuItem>
        <MenuItem value="FIXED">Фиксированный</MenuItem>
      </Select>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleCreateAccount}>
          Создать
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => setState(prev => ({
            ...prev,
            view: prev.accounts.length ? 'list' : 'welcome'
          }))}
        >
          Отмена
        </Button>
      </Box>
    </Paper>
  );

  const renderOperationView = () => {
    if (!state.operation) return null;

    return (
      <Paper sx={{ p: 3, maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          {{
            deposit: 'Пополнение счета',
            withdraw: 'Снятие средств',
            transfer: 'Перевод между счетами',
            transferExternal: 'Перевод другому клиенту'
          }[state.operation.type]}
        </Typography>

        {state.operation.type === 'transfer' && (
          <>
            <Typography sx={{ mb: 1 }}>С вашего счета: #{state.operation.accountNumber}</Typography>
            <Select
              fullWidth
              margin="dense"
              value={state.transferData.targetAccount}
              onChange={(e) => setState(prev => ({
                ...prev,
                transferData: { ...prev.transferData, targetAccount: e.target.value }
              }))}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Выберите целевой счет</MenuItem>
              {state.accounts
                .filter(account => account.number !== state.operation?.accountNumber)
                .map(account => (
                  <MenuItem key={account.id} value={account.number.toString()}>
                    Счет #{account.number} (${account.balance.toFixed(2)})
                  </MenuItem>
                ))}
            </Select>
          </>
        )}

        {state.operation.type === 'transferExternal' && (
          <>
            <Typography sx={{ mb: 1 }}>С вашего счета: #{state.operation.accountNumber}</Typography>
            <TextField
              label="Номер счета получателя"
              fullWidth
              margin="normal"
              type="number"
              value={state.transferData.targetAccount}
              onChange={(e) => setState(prev => ({
                ...prev,
                transferData: { ...prev.transferData, targetAccount: e.target.value }
              }))}
            />
          </>
        )}

        <TextField
          label="Сумма"
          type="number"
          fullWidth
          margin="normal"
          value={state.transferData.amount}
          onChange={(e) => setState(prev => ({
            ...prev,
            transferData: { ...prev.transferData, amount: e.target.value }
          }))}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => handleOperation(
              Number(state.transferData.amount),
              state.operation?.type === 'transfer' 
                ? Number(state.transferData.targetAccount) 
                : undefined
            )}
            disabled={
              !state.transferData.amount || 
              (['transfer', 'transferExternal'].includes(state.operation.type) && 
              !state.transferData.targetAccount
    )}
          >
            Подтвердить
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setState(prev => ({
              ...prev,
              view: 'list',
              transferData: { amount: '', targetAccount: '' }
            }))}
          >
            Отмена
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {state.loading && <CircularProgress />}
      {state.error && (
        <Alert 
          severity="error" 
          onClose={() => setState(prev => ({ ...prev, error: null }))}
          sx={{ mb: 2 }}
        >
          {state.error}
        </Alert>
      )}

      {state.view === 'welcome' && renderWelcomeView()}
      {state.view === 'list' && renderListView()}
      {state.view === 'create' && renderCreateView()}
      {(state.view === 'operation' || state.view === 'transferExternal') && renderOperationView()}
    </Box>
  );
};

export default AccountsManager;