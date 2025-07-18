import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// shadcn-ui components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* Logo / home link */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/favicon-v2.ico"
          alt="LaunchPad"
          className="h-8 w-8 transition-transform duration-200 hover:scale-110"
        />
      </Link>


      {/* Center links */}
      <div className="flex gap-6 items-center">
        {isAuthenticated && (
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              isActive ? "font-medium text-gray-900" : "text-gray-700"
            }
          >
            Applications
          </NavLink>
        )}
      </div>

      {/* middle links */}
      <div className="flex gap-6 items-center">
        {isAuthenticated && (
          <NavLink
            to="/generate"
            className={({ isActive }) =>
              isActive ? "font-medium text-gray-900" : "text-gray-700"
            }
          >
            Generate Cover Letter
          </NavLink>
        )}
      </div>

      {/* right side, profile dropdown/logout and Login/Register links */}

      {isAuthenticated ? (
        /* profile dropdown */
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user?.avatarUrl ?? undefined} alt="avatar" />
              <AvatarFallback>
                {user?.name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        /* login / register buttons */
        <div className="flex gap-4">
          <NavLink to="/login" className="text-gray-700 hover:underline">
            Login
          </NavLink>
          <NavLink to="/register" className="text-gray-700 hover:underline">
            Register
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
