import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Calendar, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { invigilators, venues, allocations } = useApp();

  const activeInvigilators = invigilators.filter(i => i.status === 'active').length;
  const activeVenues = venues.filter(v => v.status === 'active').length;
  const publishedAllocations = allocations.filter(a => a.status === 'published').length;
  const pendingApprovals = allocations.filter(a => a.status === 'approved').length;

  const recentAllocations = allocations
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage invigilators, venues, and exam allocations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Invigilators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeInvigilators}</div>
            <p className="text-xs text-muted-foreground">
              Ready for allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Venues</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{activeVenues}</div>
            <p className="text-xs text-muted-foreground">
              Available halls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{publishedAllocations}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAllocations.map((allocation) => {
              const invigilator = invigilators.find(i => i.id === allocation.invigilatorId);
              const venue = venues.find(v => v.id === allocation.venueId);
              
              return (
                <div key={allocation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {invigilator?.name} → {venue?.name} {venue?.hallNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {allocation.day}, {new Date(allocation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      allocation.status === 'published' ? 'default' :
                      allocation.status === 'approved' ? 'secondary' : 'outline'
                    }
                  >
                    {allocation.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Add Invigilator
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Add Venue
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Generate Allocation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}