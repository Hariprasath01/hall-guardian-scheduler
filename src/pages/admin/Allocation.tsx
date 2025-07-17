import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shuffle, CheckCircle, Eye, Edit3 } from 'lucide-react';
import { Allocation } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function AllocationPage() {
  const { invigilators, venues, allocations, setAllocations } = useApp();
  const [selectedWeek, setSelectedWeek] = useState('current');
  
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const generateDraftAllocation = () => {
    const newAllocations: Allocation[] = [];
    const availableInvigilators = [...invigilators.filter(i => i.status === 'active')];
    const availableVenues = [...venues.filter(v => v.status === 'active')];
    
    // Simple first-come-first-serve allocation
    weekDays.forEach((day, dayIndex) => {
      const dayInvigilators = availableInvigilators.filter(inv => 
        inv.availability.includes(day)
      );
      
      availableVenues.forEach((venue, venueIndex) => {
        if (dayInvigilators[venueIndex % dayInvigilators.length]) {
          const invigilator = dayInvigilators[venueIndex % dayInvigilators.length];
          const date = new Date();
          date.setDate(date.getDate() + dayIndex);
          
          newAllocations.push({
            id: `${Date.now()}-${dayIndex}-${venueIndex}`,
            invigilatorId: invigilator.id,
            venueId: venue.id,
            date: date.toISOString().split('T')[0],
            day: day,
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      });
    });
    
    setAllocations([...allocations, ...newAllocations]);
    toast({
      title: "Success",
      description: `Generated ${newAllocations.length} draft allocations`,
    });
  };

  const approveAllocation = (allocationId: string) => {
    setAllocations(allocations.map(allocation => 
      allocation.id === allocationId 
        ? { ...allocation, status: 'approved' as const, updatedAt: new Date() }
        : allocation
    ));
    toast({
      title: "Success",
      description: "Allocation approved successfully",
    });
  };

  const publishAllocation = (allocationId: string) => {
    setAllocations(allocations.map(allocation => 
      allocation.id === allocationId 
        ? { ...allocation, status: 'published' as const, updatedAt: new Date() }
        : allocation
    ));
    toast({
      title: "Success",
      description: "Allocation published! Invigilator will be notified.",
    });
  };

  const publishedAllocations = allocations.filter(a => a.status === 'published');
  const approvedAllocations = allocations.filter(a => a.status === 'approved');
  const draftAllocations = allocations.filter(a => a.status === 'draft');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Allocation Management</h1>
          <p className="text-muted-foreground">
            Generate, approve, and publish invigilator allocations
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Week</SelectItem>
              <SelectItem value="next">Next Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={generateDraftAllocation} className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            Generate Draft
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              Draft Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{draftAllocations.length}</div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              Approved Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{approvedAllocations.length}</div>
            <p className="text-sm text-muted-foreground">Ready to publish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Published Allocations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{publishedAllocations.length}</div>
            <p className="text-sm text-muted-foreground">Live for invigilators</p>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Tables by Day */}
      {weekDays.map((day) => {
        const dayAllocations = allocations.filter(a => a.day === day);
        
        if (dayAllocations.length === 0) return null;
        
        return (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{day} Allocations</span>
                <Badge variant="outline">{dayAllocations.length} assignments</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dayAllocations.map((allocation) => {
                  const invigilator = invigilators.find(i => i.id === allocation.invigilatorId);
                  const venue = venues.find(v => v.id === allocation.venueId);
                  
                  return (
                    <div key={allocation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-4">
                          <p className="font-medium text-foreground">{invigilator?.name}</p>
                          <p className="text-sm text-muted-foreground">→</p>
                          <p className="font-medium text-foreground">
                            {venue?.name} {venue?.hallNumber}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(allocation.date).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            allocation.status === 'published' ? 'default' :
                            allocation.status === 'approved' ? 'secondary' : 'outline'
                          }
                        >
                          {allocation.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          {allocation.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={() => approveAllocation(allocation.id)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                          )}
                          
                          {allocation.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => publishAllocation(allocation.id)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Publish
                            </Button>
                          )}
                          
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {allocations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shuffle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Allocations Yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate draft allocations to get started with the scheduling process.
            </p>
            <Button onClick={generateDraftAllocation} className="flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              Generate Draft Allocation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}