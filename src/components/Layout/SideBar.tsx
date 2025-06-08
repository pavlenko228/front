import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <div className="w-64 bg-blue-800 text-white p-4">
            <h2 className="text-xl font-bold mb-6">Меню</h2>
            <ul>
                <li className="mb-3">
                    <Link to="/" className="block hover:bg-blue-700 p-2 rounded">Главная</Link>
                </li>
                <li className="mb-3">
                    <Link to="/register" className="block hover:bg-blue-700 p-2 rounded">Регистрация</Link>
                </li>
                <li className="mb-3">
                    <Link to="/accounts" className="block hover:bg-blue-700 p-2 rounded">Аккаунты</Link>
                </li>
                <li className="mb-3">
                    <Link to="/transactions" className="block hover:bg-blue-700 p-2 rounded">Транзакции</Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;