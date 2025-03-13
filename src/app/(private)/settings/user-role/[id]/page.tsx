"use client";

import React from "react";
import Layout from "../../components/Layout";
import UserRoleDetail from "../../components/UserRoleDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserRoleDetailPage({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = React.useState<{
    id: string;
  } | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="Role Details">
      <UserRoleDetail roleId={resolvedParams.id} />
    </Layout>
  );
}
