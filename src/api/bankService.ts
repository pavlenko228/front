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
    instance.post<AccountDto>('', data)
      .then(response => { return response; }),

  getAccount: (userId: number, accountNumber: number) => 
    instance.get<AccountDto>(`/${userId}/${accountNumber}`)
      .then(response => { return response; }),

  getAccounts: (userId: number) => 
    instance.get<AccountDto[]>(`/${userId}`)
      .then(response => { return response; }),

  getAccountsByType: (userId: number, accountType: AccountType) => 
    instance.get<AccountDto[]>(`/${userId}/types/${accountType}`)
      .then(response => { return response; }),

  deposit: (accountNumber: number, amount: number) => 
    instance.post<DepositResponse>(`/${accountNumber}/deposits`, null, { 
      params: { amount } 
    })
      .then(response => { return response; }),

  withdraw: (accountNumber: number, amount: number) => 
    instance.post<WithdrawResponse>(`/${accountNumber}/withdrawals`, null, { 
      params: { amount } 
    })
      .then(response => { return response; }),

  transfer: (sourceAccountNumber: number, targetAccountNumber: number, amount: number) => 
    instance.post<TransferResponse>('/transfer', null, { 
      params: { 
        sourceMoneyNumber: sourceAccountNumber,
        payeeNumber: targetAccountNumber,
        amount 
      } 
    })
      .then(response => { return response; }),
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