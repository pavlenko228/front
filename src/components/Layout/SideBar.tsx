import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <h2 className="text-xl font-bold mb-8">Меню</h2>
            <ul className="space-y-4">
                <li>
                    <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
                        Главная
                    </Link>
                </li>
                <li>
                    <Link to="/register" className="block hover:bg-gray-700 p-2 rounded">
                        Регистрация
                    </Link>
                </li>
                <li>
                    <Link to="/accounts" className="block hover:bg-gray-700 p-2 rounded">
                        Аккаунты
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;