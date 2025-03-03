import React from 'react';
import { Link } from 'react-router-dom';
import { FileAudio, Headphones, MessageSquare, Upload } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-secondary/20 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Transform Audio to Text with{' '}
              <span className="text-primary">AudioScribe</span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Easily transcribe your audio recordings, podcasts, interviews, and more with our
              powerful speech-to-text technology.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard"
                className="rounded-md bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Link>
              
              <Link
                to="/login"
                className="rounded-md border border-input bg-background px-5 py-3 hover:bg-secondary/50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold">Key Features</h2>
            
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 inline-flex rounded-md bg-primary/10 p-3 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium">Audio Upload & Recording</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload audio files or record directly in your browser with our easy-to-use
                  interface.
                </p>
              </div>
              
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 inline-flex rounded-md bg-primary/10 p-3 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium">Multiple API Options</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose from OpenAI Whisper, Google Speech-to-Text, or Mozilla DeepSpeech for
                  transcription.
                </p>
              </div>
              
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 inline-flex rounded-md bg-primary/10 p-3 text-primary">
                  <FileAudio className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium">Transcription Storage</h3>
                <p className="mt-2 text-muted-foreground">
                  Save and organize all your transcriptions in one place with secure cloud storage.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="bg-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold">How It Works</h2>
            
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-medium">Upload or Record</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload an audio file or record directly in your browser.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-medium">Choose API</h3>
                <p className="mt-2 text-muted-foreground">
                  Select your preferred speech-to-text API for transcription.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-xl font-medium">Get Transcription</h3>
                <p className="mt-2 text-muted-foreground">
                  Receive your transcription in seconds and save it to your account.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-lg bg-primary/10 p-8 text-center md:p-12">
              <Headphones className="mx-auto h-12 w-12 text-primary" />
              
              <h2 className="mt-6 text-3xl font-bold">Ready to Get Started?</h2>
              
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Join thousands of users who are already saving time with AudioScribe's powerful
                transcription tools.
              </p>
              
              <Link
                to="/register"
                className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/90"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};