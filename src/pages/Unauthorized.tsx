import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
