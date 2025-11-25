import { cn } from '@/lib/utils';
import Sidebar from '@/src/components/Layouts/AuthLayout/Sidebar';
import '../../styles/authenticatedLayoutStyles.css';
import Header from '@/src/components/Layouts/AuthLayout/Header';
import DashboardProvider from '@/src/context/dashboardContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardProvider>
      <div>
        {/* Main Grid */}
        <main
          className={cn(
            'grid bg-[#F4F5F6]',
            'mobile-col [grid-template-columns:252px_1fr]'
          )}
        >
          {/* Sidebar */}
          <div className="h-screen overflow-y-auto hide-sidebar">
            <Sidebar />
          </div>

          {/* Right Side Content */}
          <div className="h-screen flex flex-col">
            {/* Header */}
            <Header />
            
            <div
              className={cn(
                'flex-1 pb-6 max-w-[1277px] bg-[#F4F5F6] relative',
                'px-6 pt-24 hide-sidebar:px-5 hide-sidebar:mt-24'
              )}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
