import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Briefcase, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && profile) {
      navigate(`/${profile.role}/dashboard`);
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <GraduationCap className="h-6 w-6" />
            <span>Campus Catalyst</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/auth/login')}>
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate('/auth/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Gateway to<br />
            <span className="text-accent">Career Success</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with internship opportunities and learn from alumni experiences at Thapar University
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth/signup')} className="gap-2">
              Join Campus Catalyst
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20" onClick={() => navigate('/auth/login')}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-slide-in">
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl">Find Internships</h3>
                <p className="text-muted-foreground">
                  Browse and apply to curated internship opportunities tailored for Thapar students
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold text-xl">Alumni Insights</h3>
                <p className="text-muted-foreground">
                  Learn from detailed interview experiences and tips shared by successful alumni
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-success/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-bold text-xl">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your applications, manage bookmarks, and stay updated on deadlines
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/80 mb-4">Trusted by Thapar students and alumni</p>
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <GraduationCap className="h-4 w-4" />
            <span>Thapar Institute of Engineering & Technology</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
