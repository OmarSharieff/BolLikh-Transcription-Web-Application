import React from "react";
import { Link } from "react-router-dom"; // Fixed import
import { FileAudio, Headphones, MessageSquare, Upload } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const stepVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
    },
  },
};

export const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-secondary/20 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Transform Audio to Text with{" "}
                <motion.span
                  className="text-primary inline-block"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  AudioScribe
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Easily transcribe your audio recordings, podcasts, interviews, and
              more with our powerful speech-to-text technology.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="rounded-md bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="rounded-md border border-input bg-background px-5 py-3 hover:bg-secondary/50"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-center text-3xl font-bold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Key Features
            </motion.h2>

            <motion.div
              className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                className="rounded-lg border border-border bg-card p-6"
                variants={featureVariant}
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="mb-4 inline-flex rounded-md bg-primary/10 p-3 text-primary"
                  whileHover={{ rotate: 15 }}
                >
                  <Upload className="h-6 w-6" />
                </motion.div>
                <h3 className="text-xl font-medium">
                  Audio Upload & Recording
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Upload audio files or record directly in your browser with our
                  easy-to-use interface.
                </p>
              </motion.div>

              <motion.div
                className="rounded-lg border border-border bg-card p-6"
                variants={featureVariant}
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="mb-4 inline-flex rounded-md bg-primary/10 p-3 text-primary"
                  whileHover={{ rotate: 15 }}
                >
                  <MessageSquare className="h-6 w-6" />
                </motion.div>
                <h3 className="text-xl font-medium">Realtime Transcription</h3>
                <p className="mt-2 text-muted-foreground">
                  Leverages Assembly AI to get transcription data from live
                  streaming audio in real time.
                </p>
              </motion.div>

              <motion.div
                className="rounded-lg border border-border bg-card p-6"
                variants={featureVariant}
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="mb-4 inline-flex rounded-md bg-primary/10 p-3 text-primary"
                  whileHover={{ rotate: 15 }}
                >
                  <FileAudio className="h-6 w-6" />
                </motion.div>
                <h3 className="text-xl font-medium">Transcription Storage</h3>
                <p className="mt-2 text-muted-foreground">
                  Save and organize all your transcriptions in one place with
                  secure cloud storage.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-secondary/20 py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-center text-3xl font-bold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How It Works
            </motion.h2>

            <motion.div
              className="mt-12 grid gap-8 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="text-center" variants={stepVariant}>
                <motion.div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  1
                </motion.div>
                <h3 className="mt-4 text-xl font-medium">Upload or Record</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload an audio file or record directly in your browser.
                </p>
              </motion.div>

              <motion.div className="text-center" variants={stepVariant}>
                <motion.div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  2
                </motion.div>
                <h3 className="mt-4 text-xl font-medium">Transcribe It</h3>
                <p className="mt-2 text-muted-foreground">
                  Everything you say turns into text instantly with AssemblyAI!
                </p>
              </motion.div>

              <motion.div className="text-center" variants={stepVariant}>
                <motion.div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  3
                </motion.div>
                <h3 className="mt-4 text-xl font-medium">Get Transcription</h3>
                <p className="mt-2 text-muted-foreground">
                  Get your transcript in seconds, save it to your account or
                  download it!
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="rounded-lg bg-primary/10 p-8 text-center md:p-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Headphones className="mx-auto h-12 w-12 text-primary" />
              </motion.div>

              <motion.h2
                className="mt-6 text-3xl font-bold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Ready to Get Started?
              </motion.h2>

              <motion.p
                className="mx-auto mt-4 max-w-2xl text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Join thousands of users who are already saving time with
                AudioScribe's powerful transcription tools.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-primary-foreground hover:bg-primary/90"
                >
                  Create Free Account
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
