import LeftSide from '@/src/components/Layouts/NonAuthLayout/LeftSide';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen grid md:[grid-template-columns:530px_1fr] ">
      {/* Left Side - Fixed */}
      <div className="hidden md:block h-screen bg-[#551A8B] overflow-y-auto ">
        <LeftSide />
      </div>

      <div className="w-full p-5 max-w-[500px] mx-auto grid place-items-center h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
