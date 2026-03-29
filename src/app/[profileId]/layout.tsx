export function generateStaticParams() {
  return [{ profileId: "mushi" }, { profileId: "stamp" }];
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
