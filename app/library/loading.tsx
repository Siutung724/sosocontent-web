import AppLayout from '@/components/AppLayout';
import { SkeletonLibraryPage } from '@/components/Skeleton';

export default function LibraryLoading() {
  return (
    <AppLayout>
      <SkeletonLibraryPage />
    </AppLayout>
  );
}
