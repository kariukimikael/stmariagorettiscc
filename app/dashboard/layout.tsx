export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      {/* Sidebar */}
      {children}
    </main>
  )
}
