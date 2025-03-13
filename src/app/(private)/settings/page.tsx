"use client";

import Layout from "./components/Layout";
import ProfileTab from "./components/ProfileTab";
import SettingsTabs from "./components/SettingsTabs";


export default function SettingsPage() {
  return (
    <Layout title="Settings">
      <SettingsTabs activeTab="profile" />
      <ProfileTab />
    </Layout>
  );
}
