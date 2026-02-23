'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: '📝',
    title: 'AI-Powered Writing Assistant',
    description: 'Get real-time suggestions, paraphrasing, and content improvements powered by multiple AI models.',
  },
  {
    icon: '📚',
    title: 'University-Specific Templates',
    description: 'Pre-built thesis templates compliant with Kenyan university standards and formatting requirements.',
  },
  {
    icon: '📖',
    title: 'Citation Management',
    description: 'Automatically format citations in APA, MLA, Chicago, Harvard, and IEEE styles.',
  },
  {
    icon: '🔍',
    title: 'Plagiarism Detection',
    description: 'Scan your work against global databases to ensure academic integrity.',
  },
  {
    icon: '👥',
    title: 'Real-Time Collaboration',
    description: 'Invite supervisors and peers to review and provide feedback on your thesis.',
  },
  {
    icon: '📊',
    title: 'Writing Analytics',
    description: 'Track your progress with word counts, completion metrics, and writing insights.',
  },
];

const stats = [
  { number: '50K+', label: 'Students Supported' },
  { number: '100+', label: 'Universities Partnered' },
  { number: '2.5M+', label: 'Theses Completed' },
  { number: '99%', label: 'Academic Compliance' },
];

export function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground text-balance">
              Write Better Theses,
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Faster</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              AI-powered academic writing platform designed for students. Get intelligent suggestions, maintain academic standards, and collaborate with advisors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Explore Platform
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-12 border-t border-border">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-3xl sm:text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools to support your entire thesis writing journey, from planning to submission.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg border border-border hover:border-primary/50 hover:bg-background/50 transition-all duration-300 space-y-4"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-12 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Ready to Transform Your Writing?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of students who are writing better theses with our AI-powered platform.
        </p>
        <Link href="/pricing">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Your Free Trial
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function LandingPageContent() {
  return (
    <div>
      <Hero />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
