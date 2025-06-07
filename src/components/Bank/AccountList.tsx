import React from 'react';

interface IAccount {
  id: string;
  balance: number;
  currency: string;
  name?: string; // Добавим опциональное поле для имени счета
}

interface AccountListProps {
  accounts: IAccount[];
}

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div 
          key={account.id} 
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">
              {account.name || `Account ${account.id.slice(0, 6)}`}
            </h3>
            <span className="text-xl font-bold">
              {account.balance.toFixed(2)} {account.currency}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            ID: {account.id}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountList;