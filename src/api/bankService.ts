import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const bankService = {
  getAccounts: () => instance.get('/accounts'),
  createTransaction: (data: { fromAccount: string; toAccount: string; amount: number }) =>
    instance.post('/transactions', data)
};