import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full border-b border-gray-800 bg-black/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="JobVerse Logo"
            className="h-14 sm:h-12 object-contain"
          />
          {/* <span className="text-2xl font-bold text-white">
            JobVerse
          </span> */}
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <SignedOut>
            <Link to="/sign-in">
              <Button
                variant="outline"
                className="text-white border-gray-600 px-6 hover:bg-white hover:text-black transition"
              >
                Login
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;