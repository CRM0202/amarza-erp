import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        marginLeft: '210px',
        flex: 1,
        minHeight: '100vh',
        background: 'var(--amz-bg)',
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  )
}
