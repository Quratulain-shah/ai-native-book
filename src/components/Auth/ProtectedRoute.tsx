import React from 'react';
import { Redirect } from '@docusaurus/router';
import { authClient } from '../../lib/auth-client';
import Layout from '@theme/Layout';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return <Layout><div className="container margin-vert--lg">Loading...</div></Layout>;
  }

  if (!session) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
