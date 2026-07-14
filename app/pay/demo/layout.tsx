import type { Metadata } from "next";
import { DemoCartProvider } from "@/components/pay/demo/DemoCartContext";
import DemoChrome from "@/components/pay/demo/DemoChrome";

export const metadata: Metadata = {
  title: "Demo — Zia-Pay",
  description: "NFC/QR menyu, səbət və ödəniş demo axını",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoCartProvider>
      <DemoChrome>{children}</DemoChrome>
    </DemoCartProvider>
  );
}
