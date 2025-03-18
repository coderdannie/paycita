import React from 'react';
import Link from 'next/link';

interface SettingsTabsProps {
  activeTab: string;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab }) => {
  const tabs = [
    { name: 'Profile', path: '/settings/profile', key: 'profile' },
    { name: 'Password', path: '/settings/password', key: 'password' },
    {
      name: 'Bank Account',
      path: '/settings/bank-account',
      key: 'bank-account',
    },
    { name: 'User Role', path: '/settings/user-role', key: 'user-role' },
    {
      name: 'Resumption Time',
      path: '/settings/resumption-time',
      key: 'resumption-time',
    },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex flex-wrap">
        {tabs.map((tab) => (
          <Link
            href={tab.path}
            key={tab.name}
            className={`mr-8 py-4 px-1 relative ${
              activeTab === tab.key
                ? 'text-[#692E9F] font-medium border-b-2 border-[#692E9F]'
                : 'text-gray-500 hover:text-purple-600'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsTabs;
