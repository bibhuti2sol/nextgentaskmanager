'use client';

import LoginForm from './LoginForm';

const LoginInteractive = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Brand Header - Top Left Corner */}
      <div className="absolute top-6 left-6 z-10">
        <div className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
            <span className="text-primary-foreground font-heading font-bold text-2xl">N</span>
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NextGenTask
            </h2>
            <p className="text-sm font-caption text-accent font-semibold tracking-wide">Manager</p>
          </div>
        </div>
      </div>
      
      {/* Centered Login Panel */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-20 relative z-10">
        <LoginForm />
        
        {/* Security Badges - Below Login Panel */}
        <div className="mt-8 mb-8">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-success text-xl">✓</span>
              </div>
              <span className="text-xs font-caption font-medium text-foreground">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-success text-xl">✓</span>
              </div>
              <span className="text-xs font-caption font-medium text-foreground">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-success text-xl">✓</span>
              </div>
              <span className="text-xs font-caption font-medium text-foreground">GDPR Ready</span>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-0 left-0 right-0 py-6 border-t border-border/50 bg-card/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-caption text-muted-foreground">
              &copy; 2026 NextGenTask Manager. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button className="text-xs font-caption text-muted-foreground hover:text-foreground transition-smooth">
                Privacy Policy
              </button>
              <button className="text-xs font-caption text-muted-foreground hover:text-foreground transition-smooth">
                Terms of Service
              </button>
              <button className="text-xs font-caption text-muted-foreground hover:text-foreground transition-smooth">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginInteractive;