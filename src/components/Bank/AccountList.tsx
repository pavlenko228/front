import React from 'react';

const AccountList = ({ accounts }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Список аккаунтов</h2>
            <ul className="divide-y divide-gray-200">
                {accounts.map((account) => (
                    <li key={account.id} className="py-4">
                        <div className="flex justify-between">
                            <span className="font-medium">{account.name}</span>
                            <span className="text-gray-600">{account.email}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AccountList;