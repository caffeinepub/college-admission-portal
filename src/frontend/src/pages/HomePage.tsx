import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

const stats = [
  { icon: Award, value: "50+", label: "Years of Excellence" },
  { icon: Users, value: "10,000+", label: "Alumni Worldwide" },
  { icon: BookOpen, value: "4", label: "Faculties" },
  { icon: GraduationCap, value: "98%", label: "Placement Rate" },
];

const announcements = [
  "🎓 Admissions Open for 2026–27 Academic Year!",
  "📅 Application Deadline: July 31, 2026",
  "🏆 Sir Isaac Newton College Ranked #1 in Regional Excellence 2025",
  "📢 Merit Scholarships Available — Apply Today!",
  "🎯 Campus Open Day: June 15, 2026 — Register Now!",
];

const tickerItems = [...announcements, ...announcements].map((msg, i) => ({
  msg,
  key: i < announcements.length ? `a-${i}` : `b-${i - announcements.length}`,
}));

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Announcement Ticker */}
      <div className="bg-accent text-accent-foreground overflow-hidden py-2">
        <div className="ticker-track inline-flex gap-16 text-sm font-semibold">
          {tickerItems.map(({ msg, key }) => (
            <span key={key} className="flex items-center gap-2">
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative hero-diagonal bg-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/greenfield-campus-hero.dim_1200x500.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.4) 30px, rgba(255,255,255,0.4) 31px)",
          }}
        />

        <div className="relative container mx-auto px-4 py-28 md:py-40">
          <div className="max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
            >
              <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 px-3 py-1">
                <Star className="h-3 w-3 mr-1.5 fill-accent" />
                Admissions Open 2026–27
              </Badge>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6"
            >
              Welcome to <span className="gold-shimmer">Sir Isaac Newton</span>
              <br />
              University
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl leading-relaxed"
            >
              Empowering minds, transforming futures. Join a community of
              scholars, innovators, and leaders dedicated to academic excellence
              since 1974.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-wrap gap-4"
            >
              <Link to="/admission">
                <Button
                  size="lg"
                  data-ocid="hero.apply_now.button"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-8 shadow-gold"
                >
                  Apply Now
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-primary-foreground bg-white/10 hover:bg-white/20 font-semibold text-base px-8"
                >
                  Explore Courses
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/30 to-transparent" />
      </section>

      {/* Stats */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-card shadow-card border border-border hover:shadow-lg transition-shadow"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-body">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                About Us
              </Badge>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6 leading-tight">
                A Legacy of Academic{" "}
                <span className="text-primary">Excellence</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 1974, Sir Isaac Newton College has been a beacon of
                higher education, producing graduates who lead industries, shape
                policy, and drive innovation across the globe.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                With state-of-the-art facilities, distinguished faculty, and a
                vibrant campus life, we offer an unparalleled educational
                experience across Engineering, Arts, Science, and Commerce.
              </p>
              <Link to="/courses">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Explore Our Programs
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                {
                  title: "Our Mission",
                  text: "To provide transformative education that equips students with the knowledge, skills, and values to become responsible global citizens and innovators.",
                  icon: "🎯",
                },
                {
                  title: "Our Vision",
                  text: "To be a world-class institution recognized for academic excellence, research innovation, and social impact by 2030.",
                  icon: "🌟",
                },
                {
                  title: "Our Values",
                  text: "Integrity, innovation, inclusivity, and intellectual curiosity form the foundation of everything we do at Sir Isaac Newton.",
                  icon: "💎",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-5 rounded-xl bg-card shadow-card border border-border"
                >
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.73 0.14 82) 0%, transparent 50%), radial-gradient(circle at 80% 50%, oklch(0.73 0.14 82) 0%, transparent 50%)",
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Begin Your Journey at Sir Isaac Newton College
            </h2>
            <p className="text-primary-foreground/75 mb-8 max-w-xl mx-auto">
              Applications for the 2026–27 academic year are now open. Limited
              seats available — apply before July 31, 2026.
            </p>
            <Link to="/admission">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base px-10 shadow-gold"
              >
                Start Your Application
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
