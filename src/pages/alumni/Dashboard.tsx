import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const AlumniDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPosts: 0,
    approvedPosts: 0,
    pendingPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentPosts();
  }, [profile]);

  const fetchStats = async () => {
    if (!profile) return;

    const { count: totalCount } = await supabase
      .from('alumni_posts')
      .select('*', { count: 'exact', head: true })
      .eq('alumni_id', profile.id);

    const { count: approvedCount } = await supabase
      .from('alumni_posts')
      .select('*', { count: 'exact', head: true })
      .eq('alumni_id', profile.id)
      .eq('approved', true);

    const { count: pendingCount } = await supabase
      .from('alumni_posts')
      .select('*', { count: 'exact', head: true })
      .eq('alumni_id', profile.id)
      .eq('approved', false);

    setStats({
      totalPosts: totalCount || 0,
      approvedPosts: approvedCount || 0,
      pendingPosts: pendingCount || 0,
    });
  };

  const fetchRecentPosts = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('alumni_posts')
      .select('*')
      .eq('alumni_id', profile.id)
      .order('posted_at', { ascending: false })
      .limit(5);

    setRecentPosts(data || []);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.full_name}! 🎓
              </h1>
              <p className="text-muted-foreground">
                Share your experiences and help students succeed
              </p>
            </div>
            <Button onClick={() => navigate('/alumni/posts/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">All experiences</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.approvedPosts}</div>
                <p className="text-xs text-muted-foreground">Live posts</p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{stats.pendingPosts}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>My Posts</CardTitle>
              <CardDescription>Your interview experiences and tips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You haven't created any posts yet
                  </p>
                  <Button onClick={() => navigate('/alumni/posts/new')}>
                    Create Your First Post
                  </Button>
                </div>
              ) : (
                <>
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/alumni/posts/${post.id}/edit`)}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{post.role}</h4>
                          <Badge variant={post.approved ? 'default' : 'secondary'}>
                            {post.approved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.company}</p>
                        <p className="text-xs text-muted-foreground">
                          Posted: {new Date(post.posted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/alumni/posts')}
                  >
                    View All Posts
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
