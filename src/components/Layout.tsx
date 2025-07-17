import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, Building, Calendar, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  userRole: 'admin' | 'invigilator';
}

export function Layout({ userRole }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNavItems = [
    { to: '/admin/dashboard', icon: Calendar, label: 'Dashboard' },
    { to: '/admin/invigilators', icon: Users, label: 'Invigilators' },
    { to: '/admin/venues', icon: Building, label: 'Venues' },
    { to: '/admin/allocation', icon: Settings, label: 'Allocation' },
  ];

  const invigilatorNavItems = [
    { to: '/invigilator/dashboard', icon: Calendar, label: 'My Schedule' },
    { to: '/invigilator/availability', icon: Settings, label: 'Availability' },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : invigilatorNavItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <h1 className="text-xl font-semibold text-foreground">
                Exam Invigilator Allocation System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground capitalize">
                {userRole} Portal
              </span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-card border-r border-border transition-transform duration-200 ease-in-out
          flex flex-col pt-16 lg:pt-0
        `}>
          <div className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}