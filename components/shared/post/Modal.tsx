"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function ModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="max-w-[90vw] w-full lg:max-w-6xl h-[90vh] lg:h-[85vh] p-0 overflow-hidden border-none shadow-2xl">
        <DialogTitle className="sr-only">帖子详情</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
