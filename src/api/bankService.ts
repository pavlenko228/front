import axios from 'axios';

const API_URL = 'http://localhost:8444/api/accounts';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

type AccountType = 'SAVINGS' | 'CHECKING' | 'CREDIT'; 

export const bankService = {
  createAccount: (data: { number: number; userId: number; accountType: AccountType }) => 
    instance.post<AccountDto>('', data),

  getAccount: (userId: number, accountNumber: number) => 
    instance.get<AccountDto>(`/${userId}/${accountNumber}`),

  getAccounts: (userId: number) => 
    instance.get<AccountDto[]>(`/${userId}`),

  getAccountsByType: (userId: number, accountType: AccountType) => 
    instance.get<AccountDto[]>(`/${userId}/types/${accountType}`),

  deposit: (accountNumber: number, amount: number) => 
    instance.post<DepositResponse>(`/${accountNumber}/deposits`, null, { 
      params: { amount } 
    }),

  withdraw: (accountNumber: number, amount: number) => 
    instance.post<WithdrawResponse>(`/${accountNumber}/withdrawals`, null, { 
      params: { amount } 
    }),

  transfer: (sourceAccountNumber: number, targetAccountNumber: number, amount: number) => 
    instance.post<TransferResponse>('/transfer', null, { 
      params: { 
        sourceMoneyNumber: sourceAccountNumber,
        payeeNumber: targetAccountNumber,
        amount 
      } 
    })
};

interface AccountDto {
  id: number;
  number: number;
  userId: number;
  accountType: AccountType;
  balance: number;
}

interface DepositResponse {
    success: boolean;
    message: string;
    amount: number;
    payee: AccountDto;
}

interface WithdrawResponse {
  success: boolean;
  message: string;
  amount: number;
  sourceMoney: AccountDto;
}

interface TransferResponse {
  success: boolean;
  message: string;
  amount: number;
  sourceMoneyNumber: number;
  payeeNumber: number;
}