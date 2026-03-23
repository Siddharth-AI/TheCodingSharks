import { WorkshopListingPage } from '@/components/pages/workshop/workshop-listing-page';

export const metadata = {
  title: 'Workshops & Events — Coding Sharks',
  description: 'Free and paid live workshops on full-stack, AI, DevOps and more. Register now.',
};

export default function WorkshopsPage() {
  return <WorkshopListingPage />;
}
