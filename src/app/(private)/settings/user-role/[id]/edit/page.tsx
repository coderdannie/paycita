"use client";

import React from "react";
import Layout from "../../../components/Layout";
import UserRoleEdit from "../../../components/UserRoleEdit";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserRoleEditPage({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title="Edit Role">
      <UserRoleEdit roleId={resolvedParams.id} />
    </Layout>
  );
}
