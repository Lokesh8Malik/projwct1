import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, BookmarkPlus, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeApplications: 0,
    bookmarked: 0,
    upcomingDeadlines: 0,
  });
  const [recentInternships, setRecentInternships] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentInternships();
  }, [profile]);

  const fetchStats = async () => {
    if (!profile) return;

    const { count: applicationsCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', profile.id);

    const { count: bookmarksCount } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', profile.id);

    const { count: upcomingCount } = await supabase
      .from('internships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open')
      .gte('deadline', new Date().toISOString());

    setStats({
      activeApplications: applicationsCount || 0,
      bookmarked: bookmarksCount || 0,
      upcomingDeadlines: upcomingCount || 0,
    });
  };

  const fetchRecentInternships = async () => {
    const { data } = await supabase
      .from('internships')
      .select('*')
      .eq('status', 'open')
      .gte('deadline', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(3);

    setRecentInternships(data || []);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {profile?.full_name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your internship applications
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeApplications}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
                <BookmarkPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bookmarked}</div>
                <p className="text-xs text-muted-foreground">Saved opportunities</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Internships</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                <p className="text-xs text-muted-foreground">Apply now</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Internships</CardTitle>
                <CardDescription>Latest opportunities for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentInternships.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No internships available</p>
                ) : (
                  recentInternships.map((internship) => (
                    <div
                      key={internship.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/student/internships/${internship.id}`)}
                    >
                      <div className="space-y-1">
                        <h4 className="font-semibold">{internship.title}</h4>
                        <p className="text-sm text-muted-foreground">{internship.company}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            Deadline: {new Date(internship.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/student/internships')}
                >
                  View All Internships
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/student/internships')}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Internships
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/student/applications')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  My Applications
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/student/profile')}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
