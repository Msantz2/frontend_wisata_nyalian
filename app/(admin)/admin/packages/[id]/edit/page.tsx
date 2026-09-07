'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/layout/PageHeader';
import { PageTitle } from '@/components/admin/layout/PageTitle';
import { PageDescription } from '@/components/admin/layout/PageDescription';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PackageForm } from '../../PackageForm';

interface EditPackagePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPackagePage({ params }: EditPackagePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const packageId = parseInt(id, 10);

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
        <PageTitle>Edit Paket Wisata</PageTitle>
        <PageDescription>Perbarui informasi paket wisata</PageDescription>
      </PageHeader>

      <div className="mt-6">
        <PackageForm
          mode="edit"
          packageId={packageId}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
