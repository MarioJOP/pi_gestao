import { Home, User, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  showSearchBar?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showSearchBar = true }) => {
  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      {showSearchBar ? (
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}
      
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
          <Home className="w-5 h-5" />
        </Link>
        <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full">
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
