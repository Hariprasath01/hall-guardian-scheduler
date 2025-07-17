import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Building, Hash } from 'lucide-react';
import { Venue } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Venues() {
  const { venues, setVenues } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVenue, setNewVenue] = useState({
    name: '',
    hallNumber: '',
    capacity: ''
  });

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.hallNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVenue = () => {
    if (!newVenue.name || !newVenue.hallNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (venues.length >= 20) {
      toast({
        title: "Error",
        description: "Maximum of 20 halls allowed.",
        variant: "destructive"
      });
      return;
    }

    const venue: Venue = {
      id: Date.now().toString(),
      name: newVenue.name,
      hallNumber: newVenue.hallNumber,
      capacity: newVenue.capacity ? parseInt(newVenue.capacity) : undefined,
      status: 'active'
    };

    setVenues([...venues, venue]);
    setNewVenue({ name: '', hallNumber: '', capacity: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Venue added successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exam Venues</h1>
          <p className="text-muted-foreground">
            Manage exam halls and venues (Maximum: 20 halls)
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2"
              disabled={venues.length >= 20}
            >
              <Plus className="h-4 w-4" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Venue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venueName">Building/Block Name *</Label>
                <Input
                  id="venueName"
                  value={newVenue.name}
                  onChange={(e) => setNewVenue(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="IT Block"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hallNumber">Hall Number *</Label>
                <Input
                  id="hallNumber"
                  value={newVenue.hallNumber}
                  onChange={(e) => setNewVenue(prev => ({ ...prev, hallNumber: e.target.value }))}
                  placeholder="Hall 201"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (Optional)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newVenue.capacity}
                  onChange={(e) => setNewVenue(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="50"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddVenue} className="flex-1">
                  Add Venue
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Venues</span>
            </div>
            <p className="text-2xl font-bold text-primary mt-1">{venues.length}/20</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Active Halls</span>
            </div>
            <p className="text-2xl font-bold text-secondary mt-1">
              {venues.filter(v => v.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Total Capacity</span>
            </div>
            <p className="text-2xl font-bold text-success mt-1">
              {venues.reduce((sum, v) => sum + (v.capacity || 0), 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search venues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{venue.name}</CardTitle>
                <Badge variant={venue.status === 'active' ? 'default' : 'secondary'}>
                  {venue.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-4 w-4" />
                {venue.hallNumber}
              </div>
              
              {venue.capacity && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  Capacity: {venue.capacity} students
                </div>
              )}
              
              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No venues found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}