import AppLayout from '@/components/AppLayout';
import { SkeletonWorkflowPage } from '@/components/Skeleton';

export default function WorkflowsLoading() {
  return (
    <AppLayout>
      <SkeletonWorkflowPage />
    </AppLayout>
  );
}
