"use client";

import Layout from "../components/Layout";
import ProfileTab from "../components/ProfileTab";
import SettingsTabs from "../components/SettingsTabs";

export default function ProfilePage() {
  return (
    <Layout title="Profile Settings">
      <SettingsTabs activeTab="profile" />
      <ProfileTab />
    </Layout>
  );
}
