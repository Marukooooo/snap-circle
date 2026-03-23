import { AppSidebar } from "@/components/shared/AppSidebar";
import Navbar from "@/components/shared/Navbar";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />

          <main className="flex-1 overflow-y-auto ">{children}</main>

          {modal}
        </div>
      </div>
    </SidebarProvider>
  );
}
