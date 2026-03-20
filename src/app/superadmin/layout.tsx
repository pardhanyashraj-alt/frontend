import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EduFlow — Super Admin Console",
  description: "Platform owner management portal",
};

export default function SuperAdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
