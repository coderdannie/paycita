"use client";

import BankAccountTab from "../components/BankAccountTab";
import Layout from "../components/Layout";
import SettingsTabs from "../components/SettingsTabs";



export default function BankAccountPage() {
  return (
    <Layout title="Bank Account Settings">
      <SettingsTabs activeTab="bank-account" />
      <BankAccountTab />
    </Layout>
  );
}
