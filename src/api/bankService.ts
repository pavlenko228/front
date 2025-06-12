import axios from 'axios';

const API_URL = 'http://localhost:8444/api/accounts';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'  
  }
});

export type AccountType = 'SAVING' | 'CHECKING' | 'FIXED'; 

export const bankService = {
  createAccount: (data: {  userId: number, number: number, accountType: AccountType }) => 
    instance.post<AccountDto>('', data)
      .then(response => { return response; })
      .catch(error => {
            console.error('Creation error', error.response?.data);
            throw error;
      }),

  getAccount: (userId: number, number: number) => 
    instance.get<AccountDto>(`/${number}`, {
        params: { userId }
      })
      .then(response => { return response; })
      .catch(error => {
            console.error('Creation error', error.response?.data);
            throw error;
      }),

  getAccounts: (userId: number) => 
    instance.get<AccountDto[]>(``, {
        params: { userId }
      })
      .then(response => { return response; })
      .catch(error => {
            console.error('Creation error', error.response?.data);
            throw error;
      }),

  getAccountsByType: (userId: number, accountType: AccountType) => 
    instance.get<AccountDto[]>(`/types/${accountType}`, {
        params: { userId }
      })
      .then(response => { return response; })
      .catch(error => {
            console.error('Creation error', error.response?.data);
            throw error;
      }),

  deposit: (payeeNumber: number, amount: number) => 
    instance.post<DepositResponse>(`/${payeeNumber}/deposits`, 
      amount,
      )
      .then(response => { return response; })
      .catch(error => {
            console.error('Creation error', error.response?.data);
            throw error;
      }),

  withdraw: (sourceMoneyNumber: number, amount: number) => 
    instance.post<WithdrawResponse>(`/${sourceMoneyNumber}/withdrawals`, 
      amount,
    )
      .then(response => { return response; })
      .catch(error => {
            console.error('Creation error', error.response?.data);
            throw error;
      }),

  transfer: (data: { sourceMoneyNumber: number, payeeNumber: number, amount: number }) => 
    instance.post<TransferResponse>('/transfers', {
      sourceMoneyNumber: data.sourceMoneyNumber,
      payeeNumber: data.payeeNumber,
      amount: data.amount
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Transfer error', error.response?.data);
      throw error;
    })
};

export interface AccountDto {
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