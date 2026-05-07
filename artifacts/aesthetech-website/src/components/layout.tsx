import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
              <span className="font-mono font-bold">A</span>
            </div>
            AesthTech
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Home</Link>
            <Link href="/about" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/about' ? 'text-primary' : 'text-muted-foreground'}`}>About</Link>
            <Link href="/apps" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/apps' ? 'text-primary' : 'text-muted-foreground'}`}>Apps</Link>
            <Link href="/mindmap" className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/mindmap') ? 'text-primary' : 'text-muted-foreground'}`}>MindMap</Link>
            <Link href="/contact" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/contact' ? 'text-primary' : 'text-muted-foreground'}`}>Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/mindmap" className="hidden md:inline-flex">
              <Button variant="outline" className="border-primary/20 hover:border-primary/50">Explore MindMap</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-white/10 bg-black/20 mt-24">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-display font-bold text-xl">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs">
                <span className="font-mono font-bold">A</span>
              </div>
              AesthTech
            </div>
            <p className="text-sm text-muted-foreground">Building Digital Solutions for Growth, Awareness & Innovation.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/mindmap" className="hover:text-primary transition-colors">MindMap Career Compass</Link></li>
              <li><Link href="/apps" className="hover:text-primary transition-colors">Mantra Guide</Link></li>
              <li><Link href="/apps" className="hover:text-primary transition-colors">WhatsToday</Link></li>
              <li><Link href="/apps" className="hover:text-primary transition-colors">LifeLens</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 border-t border-white/5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AesthTech Solutions. All rights reserved.
        </div>
      </footer>
    </div>
  );
}