"use client";

import Layout from "../components/Layout";
import SettingsTabs from "../components/SettingsTabs";
import UserRoleTab from "../components/UserRoleTab";

export default function UserRolePage() {
  return (
    <Layout title="Settings">
      <SettingsTabs activeTab="user-role" />
      <UserRoleTab />
    </Layout>
  );
}
