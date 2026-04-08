import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/widgets/app-header/app-header';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
