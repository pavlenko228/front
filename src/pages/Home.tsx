import React from 'react';
import SideBar from '../components/Layout/SideBar';

const Home = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6">Главная страница</h1>
                <p>Добро пожаловать в систему управления аккаунтами!</p>
            </div>
        </div>
    );
};

export default Home;