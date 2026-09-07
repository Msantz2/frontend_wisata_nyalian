import { AdminLayoutProvider, AdminShell } from '@/components/admin';

export const metadata = {
  title: 'Admin',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </AdminLayoutProvider>
  );
}
