import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Save, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Availability() {
  const { invigilators, setInvigilators, currentInvigilatorId } = useApp();
  const currentInvigilator = invigilators.find(i => i.id === currentInvigilatorId);
  
  const [selectedDays, setSelectedDays] = useState<string[]>(
    currentInvigilator?.availability || []
  );
  
  const weekDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleDayChange = (day: string, checked: boolean) => {
    setSelectedDays(prev => 
      checked 
        ? [...prev, day]
        : prev.filter(d => d !== day)
    );
  };

  const handleSaveAvailability = () => {
    if (selectedDays.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one day of availability.",
        variant: "destructive"
      });
      return;
    }

    setInvigilators(invigilators.map(inv => 
      inv.id === currentInvigilatorId 
        ? { ...inv, availability: selectedDays }
        : inv
    ));

    toast({
      title: "Success",
      description: "Your availability has been updated successfully!",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Availability Settings</h1>
        <p className="text-muted-foreground">
          Set your weekly availability for exam invigilation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentInvigilator?.availability.length ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You are currently available on:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentInvigilator.availability.map((day) => (
                    <Badge key={day} variant="default">
                      {day}
                    </Badge>
                  ))}
                </div>
                <div className="pt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {currentInvigilator.availability.length} days per week
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No availability set</p>
                <p className="text-sm text-muted-foreground">
                  Please update your availability settings
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Update Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the days you are available for exam invigilation:
            </p>
            
            <div className="space-y-3">
              {weekDays.map((day) => (
                <div key={day} className="flex items-center space-x-3">
                  <Checkbox
                    id={day}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                  />
                  <Label htmlFor={day} className="font-medium">
                    {day}
                  </Label>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Selected: {selectedDays.length} days
              </div>
              
              <Button 
                onClick={handleSaveAvailability}
                className="w-full flex items-center gap-2"
                disabled={JSON.stringify(selectedDays.sort()) === JSON.stringify(currentInvigilator?.availability.sort())}
              >
                <Save className="h-4 w-4" />
                Save Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Important Notes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You must select at least one day of availability</li>
                <li>• Changes will affect future allocations only</li>
                <li>• Published schedules cannot be modified by availability changes</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Allocation Process:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Allocations are made on a first-come-first-serve basis</li>
                <li>• Each hall will have only one invigilator assigned</li>
                <li>• You'll receive real-time updates of your schedule</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}