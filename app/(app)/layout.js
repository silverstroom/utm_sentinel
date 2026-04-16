import { Sidebar } from '@/components/Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] min-h-screen pt-16 lg:pt-0">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
