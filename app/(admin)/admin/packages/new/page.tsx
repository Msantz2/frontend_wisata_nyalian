'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { PageDescription } from '@/components/admin/layout/PageDescription';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PackageForm } from '../PackageForm';

export default function NewPackagePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/packages');
    router.refresh();
  };

  return (
    <div>
      <PageHeader>
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/packages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>
        <PageTitle>Tambah Paket Wisata Baru</PageTitle>
        <PageDescription>Buat paket wisata baru untuk wisatawan</PageDescription>
      </PageHeader>

      <div className="mt-6">
        <PackageForm mode="create" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
