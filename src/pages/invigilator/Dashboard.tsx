import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function InvigilatorDashboard() {
  const { allocations, venues, invigilators, currentInvigilatorId } = useApp();
  
  const currentInvigilator = invigilators.find(i => i.id === currentInvigilatorId);
  const myAllocations = allocations.filter(a => 
    a.invigilatorId === currentInvigilatorId && a.status === 'published'
  );
  
  const upcomingAllocations = myAllocations.filter(a => 
    new Date(a.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const thisWeekAllocations = myAllocations.filter(a => {
    const allocDate = new Date(a.date);
    const today = new Date();
    const weekFromToday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return allocDate >= today && allocDate <= weekFromToday;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {currentInvigilator?.name}
        </h1>
        <p className="text-muted-foreground">
          Your invigilation schedule and upcoming assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{thisWeekAllocations.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{upcomingAllocations.length}</div>
            <p className="text-xs text-muted-foreground">
              Future assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Availability</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {currentInvigilator?.availability.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Days per week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Week Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {thisWeekAllocations.length > 0 ? (
            <div className="space-y-4">
              {thisWeekAllocations.map((allocation) => {
                const venue = venues.find(v => v.id === allocation.venueId);
                const date = new Date(allocation.date);
                
                return (
                  <div key={allocation.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-accent/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge>{allocation.day}</Badge>
                        <span className="font-medium text-foreground">
                          {venue?.name} {venue?.hallNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {venue?.name}
                      </div>
                    </div>
                    <Badge variant="default">Confirmed</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No assignments this week</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAllocations.length > 0 ? (
            <div className="space-y-3">
              {upcomingAllocations.slice(0, 5).map((allocation) => {
                const venue = venues.find(v => v.id === allocation.venueId);
                const date = new Date(allocation.date);
                
                return (
                  <div key={allocation.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {venue?.name} {venue?.hallNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {allocation.day}, {date.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{allocation.status}</Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming assignments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Availability Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentInvigilator?.availability.map((day) => (
              <Badge key={day} variant="secondary">
                {day}
              </Badge>
            )) || <p className="text-muted-foreground">No availability set</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}