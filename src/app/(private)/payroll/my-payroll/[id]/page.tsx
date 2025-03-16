'use client';

import React, { useState } from 'react';
import EmployeeDetails from '../../../../../components/data/Payroll/Tabs/EmployeeDetails';
import PayrollDetails from '../../../../../components/data/Payroll/Tabs/PayrollDetail';
import { MdArrowBackIos } from 'react-icons/md';

const PayrollDetail = () => {
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' or 'payroll'

  return (
    <div className="p-4 bg-white  rounded-xl shadow">
      <div className="flex items-center  gap-2 mb-4">
        <button>
          <MdArrowBackIos />
        </button>
        <h2 className="text-2xl font-semibold ">Detail Payroll</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 text-sm ${
            activeTab === 'employee'
              ? 'border-b-2 border-primary text-primary font-semibold'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('employee')}
        >
          Employee Information
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'payroll'
              ? 'border-b-2 border-primary text-primary font-semibold'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('payroll')}
        >
          Payroll Detail
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'employee' && <EmployeeDetails />}
        {activeTab === 'payroll' && <PayrollDetails />}
      </div>
    </div>
  );
};

export default PayrollDetail;
