import React from 'react';
import SideBar from '../components/Layout/SideBar';
import AccountList from '../components/Bank/AccountList';

const Home = () => {
    // Пример данных для счетов
    const accounts = [
        { id: '1', balance: 10000, currency: 'RUB', name: 'Основной счёт' },
        { id: '2', balance: 5000, currency: 'USD', name: 'Долларовый счёт' },
        { id: '3', balance: 2000, currency: 'EUR', name: 'Евро счёт' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar />
            <div className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Главная страница</h1>
                <AccountList accounts={accounts} />
            </div>
        </div>
    );
};

export default Home;