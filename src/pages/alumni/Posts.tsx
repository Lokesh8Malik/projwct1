import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Posts = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [profile]);

  const fetchPosts = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('alumni_posts')
      .select('*')
      .eq('alumni_id', profile.id)
      .order('posted_at', { ascending: false });

    setPosts(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Posts</h1>
              <p className="text-muted-foreground">
                Manage your interview experiences and tips
              </p>
            </div>
            <Button onClick={() => navigate('/alumni/posts/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <Card className="shadow-card">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Loading posts...
                </CardContent>
              </Card>
            ) : posts.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center space-y-4">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any posts yet
                    </p>
                    <Button onClick={() => navigate('/alumni/posts/new')}>
                      Create Your First Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-card hover:shadow-hover transition-shadow cursor-pointer"
                  onClick={() => navigate(`/alumni/posts/${post.id}/edit`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{post.role}</CardTitle>
                          <Badge
                            variant={post.approved ? 'default' : 'secondary'}
                            className="flex items-center gap-1"
                          >
                            {post.approved ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Approved
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-lg text-primary font-semibold">
                          {post.company}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Difficulty: {post.difficulty_rating}/5</span>
                      <span>•</span>
                      <span>
                        Posted: {new Date(post.posted_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>

                    {post.tips && post.tips.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold">{post.tips.length}</span> tips
                        shared
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Posts;
