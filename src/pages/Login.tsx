
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
    .min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  // Get the intended destination from location state or default to home
  const from = location.state?.from?.pathname || "/dashboard";
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const user = await login({
        email: values.email,
        password: values.password,
      });
      
      // Redirect based on user role
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate(from);
      }
    } catch (error) {
      setAuthError("Invalid email or password. Please try again.");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (values: SignupFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const user = await signup({
        email: values.email,
        password: values.password,
      });
      
      // Redirect to home after successful signup
      navigate("/dashboard");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Signup failed. Please try again.");
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address",
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }
    
    setIsResetting(true);
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      
      toast({
        title: "Reset email sent! ✅",
        description: "Check your inbox for the password reset link",
      });
      
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      let errorMessage = "Failed to send reset email. Please try again.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later";
      }
      
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: errorMessage,
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-mockmate-light to-white dark:from-mockmate-dark dark:to-gray-900 p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Clock className="h-8 w-8 text-mockmate-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-mockmate-secondary dark:text-white">
            Welcome to <span className="text-mockmate-primary">MockMate</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Your AI interview preparation partner
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            
            {authError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <TabsContent value="login" className="mt-0">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            {...field}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setResetEmail(loginForm.getValues("email"));
                        setShowForgotPassword(true);
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com"
                            {...field}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent>
            {/* Content has been moved inside the Tabs component */}
          </CardContent>
        </Card>
      </div>
      
      {/* Forgot Password Dialog */}
      <AlertDialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Reset Password
            </AlertDialogTitle>
            <AlertDialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Input
              type="email"
              placeholder="you@example.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleForgotPassword();
                }
              }}
              disabled={isResetting}
              autoFocus
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <Button onClick={handleForgotPassword} disabled={isResetting}>
              {isResetting ? "Sending..." : "Send Reset Link"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;
