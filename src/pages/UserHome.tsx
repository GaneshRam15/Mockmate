
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInterviews } from "@/lib/firebaseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, Clock, History, User, Zap, Target, Play } from "lucide-react";

const UserHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userInterviews, setUserInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load user's interview history from Firebase
  useEffect(() => {
    const loadInterviews = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const interviews = await getUserInterviews(user.id);
        const completedInterviews = interviews.filter(interview => interview.completed);
        setUserInterviews(completedInterviews);
      } catch (error) {
        console.error('Error loading interviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInterviews();
  }, [user]);
  
  // Calculate statistics
  const totalInterviews = userInterviews.length;
  const averageScore = totalInterviews > 0
    ? userInterviews.reduce((sum, interview) => sum + (interview.score || 0), 0) / totalInterviews
    : 0;
  const latestInterview = totalInterviews > 0
    ? [...userInterviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {user?.name || user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground">
              Your personal interview training dashboard
            </p>
          </div>
          
          <Button onClick={() => navigate("/home")}>
            New Interview
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-mockmate-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-1">
                Email: {user?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Account Type: {user?.isAdmin ? 'Administrator' : 'User'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-mockmate-primary" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-muted-foreground">Total Interviews:</p>
                <p className="text-sm font-medium">{totalInterviews}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Average Score:</p>
                <p className="text-sm font-medium">
                  {averageScore > 0 ? `${averageScore.toFixed(1)}/10` : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-mockmate-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {latestInterview ? (
                <div>
                  <p className="text-sm font-medium mb-1">
                    {latestInterview.roleName} Interview
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Date: {new Date(latestInterview.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Score: {latestInterview.score?.toFixed(1)}/10
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No interviews completed yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Interview Options</CardTitle>
              <CardDescription>
                Choose between practice mode or formal test
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Practice Mode */}
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Practice Mode</h3>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Unlimited practice • No monitoring • Instant feedback
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={() => navigate("/practice")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Practice
                </Button>
              </div>
              
              {/* Test Mode */}
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Test Mode</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Formal assessment • Admin monitoring • Official results
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-100" 
                  onClick={() => navigate("/home")}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Take Test
                </Button>
              </div>
              
              {/* History */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/history")}
              >
                <History className="mr-2 h-4 w-4" />
                View Interview History
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Latest Interviews</CardTitle>
              <CardDescription>
                Your {Math.min(3, userInterviews.length)} most recent interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading interviews...</p>
                </div>
              ) : userInterviews.length > 0 ? (
                <div className="space-y-4">
                  {[...userInterviews]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3)
                    .map((interview) => (
                      <div 
                        key={interview.id} 
                        className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{interview.roleName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(interview.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-mockmate-primary">
                            {interview.score?.toFixed(1)}/10
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-xs"
                            onClick={() => navigate("/history")}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No interviews completed yet</p>
                  <Button onClick={() => navigate("/home")}>
                    Start Your First Interview
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserHome;
