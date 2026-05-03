import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Search, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-agriculture.jpg';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: t('feature.decision.title'),
      description: t('feature.decision.desc'),
      link: '/decision-support',
      color: 'bg-primary',
    },
    {
      icon: Search,
      title: t('feature.disease.title'),
      description: t('feature.disease.desc'),
      link: '/disease-detection',
      color: 'bg-accent',
    },
    {
      icon: History,
      title: t('feature.history.title'),
      description: t('feature.history.desc'),
      link: '/history',
      color: 'bg-chart-3',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
              <Leaf className="h-4 w-4" />
              <span>{t('home.subtitle')}</span>
            </div>
          </div>

          <h1 className="animate-slide-up mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl text-shadow-premium">
            {t('home.title')}
          </h1>

          <p className="animate-slide-up mb-4 max-w-2xl text-xl font-bold text-primary sm:text-2xl glass px-6 py-2 rounded-xl" style={{ animationDelay: '0.1s' }}>
            {t('home.tagline')}
          </p>

          <p className="animate-slide-up mb-8 max-w-2xl text-muted-foreground" style={{ animationDelay: '0.2s' }}>
            {t('home.description')}
          </p>

          <div className="animate-slide-up flex flex-col gap-4 sm:flex-row" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="gap-2 shadow-lg">
              <Link to="/decision-support">
                {t('home.get_started')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-sm">
              <Link to="/disease-detection">
                {t('home.learn_more')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-primary/50 p-1">
            <div className="h-2 w-1 rounded-full bg-primary mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              {t('home.subtitle')}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('home.description')}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden glass-card transition-all duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    {t('home.get_started')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '50+', label: 'Crop Types' },
              { value: '20+', label: 'Disease Types' },
              { value: '95%', label: 'Accuracy' },
              { value: '24/7', label: 'Available' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
