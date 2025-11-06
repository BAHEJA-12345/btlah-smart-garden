import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-plants.jpg";

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  Welcome to btlah 🌱
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Smart Plant Care Companion
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover the perfect plants for your space. Get personalized recommendations, care reminders, and expert guidance from our AI assistant.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/recommendations">
                  <Button size="lg" className="gap-2 text-lg px-8 shadow-lg hover:shadow-xl transition-shadow bg-gradient-primary">
                    <Sparkles className="h-5 w-5" />
                    Start Now
                  </Button>
                </Link>
                <Link to="/assistant">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Talk to AI Assistant
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-10 blur-3xl" />
              <img
                src={heroImage}
                alt="Beautiful indoor plants"
                className="relative rounded-3xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "1000+ Plants",
              description: "Extensive database with detailed care information",
            },
            {
              title: "Smart Filters",
              description: "Find plants by size, light, water, and more",
            },
            {
              title: "AI Guidance",
              description: "Get personalized advice from our AI assistant",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card shadow-card hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
