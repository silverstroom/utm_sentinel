import { Sidebar } from '@/components/Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />
      <main className="flex-1 ml-[260px] min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
