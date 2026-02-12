
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  LogOut, 
  Home, 
  User, 
  History as HistoryIcon,
  ShieldCheck,
  LayoutDashboard,
  Moon,
  Sun
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate("/home")}
        >
          <Clock className="h-6 w-6 text-mockmate-primary" />
          <h1 className="text-xl font-bold text-mockmate-secondary dark:text-white">
            Mock<span className="text-mockmate-primary">Mate</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            className="mr-2"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/home")}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/history")}
              >
                <HistoryIcon className="h-4 w-4 mr-2" />
                History
              </Button>
              
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/admin")}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/home")}
              >
                Home
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => navigate("/login")}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
