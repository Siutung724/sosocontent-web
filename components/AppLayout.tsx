import Nav from './Nav';

/**
 * AppLayout — Server Component
 * Wraps all authenticated pages with the sticky Nav.
 * Toast is provided globally via app/layout.tsx (ToastProvider).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-body text-primary">
      <Nav />
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 pb-24 md:pb-12">
        {children}
      </div>
    </div>
  );
}
