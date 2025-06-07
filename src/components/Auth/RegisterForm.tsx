import React, { useState } from 'react';

const RegisterForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6">Регистрация</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                    Имя
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                    Пароль
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Зарегистрироваться
            </button>
        </form>
    );
};

export default RegisterForm;