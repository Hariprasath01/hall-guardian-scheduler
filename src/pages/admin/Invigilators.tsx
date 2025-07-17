import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Mail, Phone, Calendar } from 'lucide-react';
import { Invigilator, WeekDays } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Invigilators() {
  const { invigilators, setInvigilators } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newInvigilator, setNewInvigilator] = useState({
    name: '',
    email: '',
    phone: '',
    availability: [] as string[]
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredInvigilators = invigilators.filter(invigilator =>
    invigilator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invigilator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setNewInvigilator(prev => ({
      ...prev,
      availability: checked 
        ? [...prev.availability, day]
        : prev.availability.filter(d => d !== day)
    }));
  };

  const handleAddInvigilator = () => {
    if (!newInvigilator.name || !newInvigilator.email || newInvigilator.availability.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select at least one day of availability.",
        variant: "destructive"
      });
      return;
    }

    const invigilator: Invigilator = {
      id: Date.now().toString(),
      name: newInvigilator.name,
      email: newInvigilator.email,
      phone: newInvigilator.phone,
      availability: newInvigilator.availability,
      status: 'active',
      createdAt: new Date()
    };

    setInvigilators([...invigilators, invigilator]);
    setNewInvigilator({ name: '', email: '', phone: '', availability: [] });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Invigilator added successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invigilators</h1>
          <p className="text-muted-foreground">Manage invigilator accounts and availability</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Invigilator
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Invigilator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newInvigilator.name}
                  onChange={(e) => setNewInvigilator(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. John Smith"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInvigilator.email}
                  onChange={(e) => setNewInvigilator(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.smith@university.edu"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newInvigilator.phone}
                  onChange={(e) => setNewInvigilator(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1-234-567-8900"
                />
              </div>
              
              <div className="space-y-3">
                <Label>Availability *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={newInvigilator.availability.includes(day)}
                        onCheckedChange={(checked) => handleAvailabilityChange(day, checked as boolean)}
                      />
                      <Label htmlFor={day} className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddInvigilator} className="flex-1">
                  Add Invigilator
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search invigilators..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invigilators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvigilators.map((invigilator) => (
          <Card key={invigilator.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{invigilator.name}</CardTitle>
                <Badge variant={invigilator.status === 'active' ? 'default' : 'secondary'}>
                  {invigilator.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {invigilator.email}
              </div>
              
              {invigilator.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {invigilator.phone}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Availability:
                </div>
                <div className="flex flex-wrap gap-1">
                  {invigilator.availability.map((day) => (
                    <Badge key={day} variant="outline" className="text-xs">
                      {day.substring(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvigilators.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No invigilators found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}