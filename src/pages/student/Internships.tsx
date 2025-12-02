import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Bookmark, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Internships = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [internships, setInternships] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchInternships();
    fetchBookmarks();
  }, []);

  const fetchInternships = async () => {
    const { data } = await supabase
      .from('internships')
      .select('*')
      .eq('status', 'open')
      .gte('deadline', new Date().toISOString())
      .order('deadline', { ascending: true });

    setInternships(data || []);
    setLoading(false);
  };

  const fetchBookmarks = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('bookmarks')
      .select('internship_id')
      .eq('student_id', profile.id);

    setBookmarkedIds(new Set(data?.map((b) => b.internship_id) || []));
  };

  const toggleBookmark = async (internshipId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) return;

    if (bookmarkedIds.has(internshipId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('student_id', profile.id)
        .eq('internship_id', internshipId);

      setBookmarkedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(internshipId);
        return newSet;
      });

      toast({
        title: 'Bookmark removed',
        description: 'Internship removed from bookmarks',
      });
    } else {
      await supabase.from('bookmarks').insert({
        student_id: profile.id,
        internship_id: internshipId,
      });

      setBookmarkedIds((prev) => new Set(prev).add(internshipId));

      toast({
        title: 'Bookmarked!',
        description: 'Internship added to bookmarks',
      });
    }
  };

  const filteredInternships = internships.filter(
    (internship) =>
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Internships</h1>
            <p className="text-muted-foreground">
              Find and apply to internship opportunities
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <Card className="shadow-card">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Loading internships...
                </CardContent>
              </Card>
            ) : filteredInternships.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? 'No internships match your search'
                      : 'No internships available'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredInternships.map((internship) => {
                const daysLeft = getDaysUntilDeadline(internship.deadline);
                return (
                  <Card
                    key={internship.id}
                    className="shadow-card hover:shadow-hover transition-all cursor-pointer"
                    onClick={() => navigate(`/student/internships/${internship.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {internship.title}
                          </CardTitle>
                          <p className="text-lg font-semibold text-primary">
                            {internship.company}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => toggleBookmark(internship.id, e)}
                          className={
                            bookmarkedIds.has(internship.id)
                              ? 'text-accent'
                              : 'text-muted-foreground'
                          }
                        >
                          <Bookmark
                            className="h-5 w-5"
                            fill={
                              bookmarkedIds.has(internship.id)
                                ? 'currentColor'
                                : 'none'
                            }
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{internship.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {daysLeft > 0
                              ? `${daysLeft} days left`
                              : 'Deadline today'}
                          </span>
                        </div>
                      </div>

                      {internship.tags && internship.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {internship.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {internship.description}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/student/internships/${internship.id}`);
                        }}>
                          View Details
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        {internship.stipend && (
                          <Badge variant="outline" className="text-success border-success">
                            {internship.stipend}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Internships;
