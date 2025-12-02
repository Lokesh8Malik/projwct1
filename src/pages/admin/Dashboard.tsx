import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, FileText, CheckCircle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInternships: 0,
    totalApplications: 0,
    pendingPosts: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { count: internshipsCount } = await supabase
      .from('internships')
      .select('*', { count: 'exact', head: true });

    const { count: applicationsCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    const { count: pendingCount } = await supabase
      .from('alumni_posts')
      .select('*', { count: 'exact', head: true })
      .eq('approved', false);

    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    setStats({
      totalInternships: internshipsCount || 0,
      totalApplications: applicationsCount || 0,
      pendingPosts: pendingCount || 0,
      totalUsers: usersCount || 0,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🎯</h1>
              <p className="text-muted-foreground">
                Manage internships, applications, and user content
              </p>
            </div>
            <Button onClick={() => navigate('/admin/internships/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Internship
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInternships}</div>
                <p className="text-xs text-muted-foreground">Posted opportunities</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">Total submitted</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
                <CheckCircle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{stats.pendingPosts}</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/admin/internships')}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Manage Internships
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/admin/alumni-posts')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Review Alumni Posts
                  {stats.pendingPosts > 0 && (
                    <span className="ml-auto bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs">
                      {stats.pendingPosts}
                    </span>
                  )}
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Users
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Platform health and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Internships</span>
                    <span className="font-semibold">{stats.totalInternships}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending Reviews</span>
                    <span className="font-semibold text-warning">{stats.pendingPosts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="font-semibold">{stats.totalUsers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
