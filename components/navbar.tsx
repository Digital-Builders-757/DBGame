"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const { user, userRole, signOut } = useAuth();

  // Determine if the current page is the homepage
  const isHomepage = pathname === "/" || pathname === null;

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle sign out
  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    try {
      setIsSigningOut(true);
      setIsMenuOpen(false);
      const { error } = await signOut();
      if (error) {
        console.error("Sign out error:", error);
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Digital Builders brand styling - dark background with neon accents
  const navbarBg = isScrolled
    ? "bg-brand-background/95 backdrop-blur-md border-b border-brand-border shadow-lg shadow-brand-primary/10"
    : isHomepage
      ? "bg-brand-background/95 backdrop-blur-md"
      : "bg-brand-background border-b border-brand-border";

  const textColor = "text-brand-text-light";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/solo_logo.png"
              alt="Digital Builders"
              width={180}
              height={70}
              className="h-16 w-auto group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className={`${textColor} hover:text-white font-medium transition-all duration-300 hover-lift relative group`}
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {userRole === "admin" && (
              <Link
                href="/admin/dashboard"
                className={`${textColor} hover:text-white font-medium transition-all duration-300 hover-lift relative group`}
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                  <Button
                    variant="ghost"
                    className={`${textColor} hover:text-brand-primary font-medium transition-colors flex items-center font-mono`}
                  >
                    My Account
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                <div className="absolute right-0 mt-2 w-48 bg-brand-card rounded-md shadow-lg shadow-brand-primary/20 overflow-hidden z-20 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 backdrop-blur-sm border border-brand-border">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="block w-full text-left px-4 py-2 text-sm text-brand-text-dark hover:bg-brand-primary/10 hover:text-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`${textColor} hover:text-brand-primary font-medium transition-colors font-mono`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="default"
                    className="bg-brand-primary text-brand-background hover:bg-brand-primary/90 font-mono font-semibold neon-shadow-primary"
                  >
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-brand-text-dark hover:text-brand-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-card shadow-lg shadow-brand-primary/20 backdrop-blur-sm border-t border-brand-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="text-brand-text-light hover:text-brand-primary font-medium transition-colors py-2"
              >
                Dashboard
              </Link>
              <div className="border-t border-brand-border pt-4 mt-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block py-2 text-brand-text-light hover:text-brand-primary font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="block py-2 text-brand-text-light hover:text-brand-primary font-medium transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      className="block py-2 text-brand-text-light hover:text-brand-primary font-medium transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="block py-2 text-brand-text-light hover:text-brand-primary font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSigningOut ? "Signing Out..." : "Sign Out"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-2 text-brand-text-light hover:text-brand-primary font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <div className="mt-4">
                      <Link href="/signup">
                        <Button className="w-full bg-brand-primary text-brand-background hover:bg-brand-primary/90 font-mono font-semibold neon-shadow-primary">
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
