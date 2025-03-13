"use client";

import Layout from "../components/Layout";
import PasswordTab from "../components/PasswordTab";
import SettingsTabs from "../components/SettingsTabs";



export default function PasswordPage() {
  return (
    <Layout title="Password Settings">
      <SettingsTabs activeTab="password" />
      <PasswordTab />
    </Layout>
  );
}
