import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types';
import { LogIn, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setUserRole, setCurrentInvigilatorId, invigilators } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [selectedInvigilator, setSelectedInvigilator] = useState<string>('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = () => {
    if (selectedRole === 'invigilator' && !selectedInvigilator) {
      return;
    }

    setUserRole(selectedRole);
    
    if (selectedRole === 'invigilator') {
      setCurrentInvigilatorId(selectedInvigilator);
      navigate('/invigilator/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <LogIn className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Exam Invigilator Allocation System
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Login As</Label>
            <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Administrator
                  </div>
                </SelectItem>
                <SelectItem value="invigilator">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Invigilator
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === 'invigilator' && (
            <div className="space-y-2">
              <Label htmlFor="invigilator">Select Your Account</Label>
              <Select value={selectedInvigilator} onValueChange={setSelectedInvigilator}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your account" />
                </SelectTrigger>
                <SelectContent>
                  {invigilators.map((invigilator) => (
                    <SelectItem key={invigilator.id} value={invigilator.id}>
                      {invigilator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              placeholder={selectedRole === 'admin' ? 'admin' : 'invigilator'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
            />
          </div>

          <Button 
            onClick={handleLogin} 
            className="w-full"
            disabled={selectedRole === 'invigilator' && !selectedInvigilator}
          >
            Sign In
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>Admin: admin / admin</p>
            <p>Invigilator: Select any account</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}