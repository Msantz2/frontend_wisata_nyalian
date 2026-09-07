import { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { PageDescription } from '@/components/admin/layout/PageDescription';
import PackagesTable from './PackagesTable';

export const metadata: Metadata = {
  title: 'Paket Wisata | Admin',
  description: 'Kelola paket wisata Desa Nyalian',
};

export default function PackagesPage() {
  return (
    <div>
      <PageHeader>
        <div className="flex items-center justify-between">
          <div>
            <PageTitle>Paket Wisata</PageTitle>
            <PageDescription>Kelola paket wisata yang ditawarkan</PageDescription>
          </div>
          <Link href="/admin/packages/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Paket
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="mt-6">
        <PackagesTable />
      </div>
    </div>
  );
}
