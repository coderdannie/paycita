'use client';

import Layout from '../components/Layout';
import Resumption from '../components/ResumptionTime';
import SettingsTabs from '../components/SettingsTabs';

const ResumptionTime = () => {
  return (
    <Layout>
      <SettingsTabs activeTab="resumption-time" />
      <Resumption />
    </Layout>
  );
};
export default ResumptionTime;
