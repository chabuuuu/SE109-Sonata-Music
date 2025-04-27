import RootLayout from "@/components/layout"; // <- layout tổng của bạn

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>; // <- wrap children trong layout tổng
}
