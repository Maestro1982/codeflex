'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import {
  DumbbellIcon,
  HomeIcon,
  UserIcon,
  ZapIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3'>
      <div className='container mx-auto flex items-center justify-between'>
        {/* LOGO */}
        <Link href='/' className='flex items-center gap-2' onClick={closeMenu}>
          <div className='p-1 bg-primary/10 rounded'>
            <ZapIcon className='w-4 h-4 text-primary' />
          </div>
          <span className='text-xl font-bold font-mono'>
            code<span className='text-primary'>flex</span>.ai
          </span>
        </Link>

        {/* Hamburger Icon - Mobile Only */}
        <button
          className='md:hidden p-2'
          onClick={toggleMenu}
          aria-label='Toggle Menu'
        >
          {isMobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>

        {/* NAVIGATION */}
        <nav
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } absolute top-full left-0 w-full md:static md:w-auto md:flex md:items-center md:gap-5 
  md:border-none md:bg-transparent 
  bg-muted/90 shadow-lg border-t border-border backdrop-blur-md transition-all`}
        >
          <div className='flex flex-col md:flex-row md:items-center md:gap-5 p-4 md:p-0'>
            {isSignedIn ? (
              <>
                <Link
                  href='/'
                  onClick={closeMenu}
                  className='flex items-center gap-1.5 text-sm hover:text-primary transition-colors py-2 md:py-0'
                >
                  <HomeIcon size={16} />
                  <span>Home</span>
                </Link>

                <Link
                  href='/generate-program'
                  onClick={closeMenu}
                  className='flex items-center gap-1.5 text-sm hover:text-primary transition-colors py-2 md:py-0'
                >
                  <DumbbellIcon size={16} />
                  <span>Generate</span>
                </Link>

                <Link
                  href='/profile'
                  onClick={closeMenu}
                  className='flex items-center gap-1.5 text-sm hover:text-primary transition-colors py-2 md:py-0'
                >
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>

                <Button
                  asChild
                  variant='outline'
                  className='mt-2 md:mt-0 border-primary/50 text-primary hover:text-white hover:bg-primary/10'
                >
                  <Link href='/generate-program' onClick={closeMenu}>
                    Get Started
                  </Link>
                </Button>

                <div className='mt-2 md:mt-0'>
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <SignInButton>
                  <Button
                    variant={'outline'}
                    className='mt-2 md:mt-0 border-primary/50 text-primary hover:text-white hover:bg-primary/10'
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button className='mt-2 md:mt-0 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-white'>
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
