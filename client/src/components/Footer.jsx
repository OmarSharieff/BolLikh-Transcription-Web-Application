import React from 'react';
import { Github, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BolLikh. All rights reserved by Mohammad Omar Sharieff
          </p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/OmarSharieff/BolLikh-Transcription-Web-Application"
              className="text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/omar_sharief_"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};