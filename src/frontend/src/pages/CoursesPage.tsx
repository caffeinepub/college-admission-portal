import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Cog,
  FlaskConical,
  Palette,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const courses = [
  {
    id: "engineering",
    ocid: "courses.engineering.card",
    icon: Cog,
    name: "Engineering",
    shortDesc: "Build the future with cutting-edge technology",
    description:
      "Our Engineering program combines rigorous theoretical foundations with hands-on practical experience. Students explore disciplines including Computer Science, Mechanical, Civil, Electrical, and Electronics Engineering. Equipped with advanced labs and industry partnerships, graduates are prepared to solve the world's most complex challenges.",
    specializations: ["Computer Science", "Mechanical", "Civil", "Electrical"],
    duration: "4 Years (B.E./B.Tech)",
    seats: 180,
    eligibility: "10+2 with Physics, Chemistry, Math (min 60%)",
    color: "from-blue-600/20 to-blue-800/10",
    iconBg: "bg-blue-100 text-blue-700",
    badge: "Most Popular",
    badgeVariant: "default" as const,
  },
  {
    id: "arts",
    ocid: "courses.arts.card",
    icon: Palette,
    name: "Arts & Humanities",
    shortDesc: "Explore creativity, culture, and critical thinking",
    description:
      "The Faculty of Arts & Humanities nurtures creative thinkers, communicators, and cultural analysts. Programs include English Literature, History, Philosophy, Fine Arts, Journalism, and Mass Communication. Students develop critical reasoning, expressive skills, and deep cultural literacy that are invaluable in our diverse society.",
    specializations: ["Literature", "History", "Fine Arts", "Journalism"],
    duration: "3 Years (B.A.)",
    seats: 120,
    eligibility: "10+2 in any stream (min 55%)",
    color: "from-rose-600/20 to-rose-800/10",
    iconBg: "bg-rose-100 text-rose-700",
    badge: "Creative",
    badgeVariant: "secondary" as const,
  },
  {
    id: "science",
    ocid: "courses.science.card",
    icon: FlaskConical,
    name: "Science",
    shortDesc: "Discover the principles that govern our universe",
    description:
      "Our Science faculty offers programs in Physics, Chemistry, Biology, Mathematics, Environmental Science, and Biotechnology. Research-oriented curricula with state-of-the-art laboratories enable students to contribute to groundbreaking discoveries and pursue careers in academia, healthcare, pharmaceuticals, and emerging technologies.",
    specializations: ["Physics", "Chemistry", "Biology", "Biotechnology"],
    duration: "3 Years (B.Sc.)",
    seats: 150,
    eligibility: "10+2 with Science stream (min 60%)",
    color: "from-emerald-600/20 to-emerald-800/10",
    iconBg: "bg-emerald-100 text-emerald-700",
    badge: "Research Focus",
    badgeVariant: "outline" as const,
  },
  {
    id: "commerce",
    ocid: "courses.commerce.card",
    icon: TrendingUp,
    name: "Commerce & Business",
    shortDesc: "Lead the global economy with strategic insight",
    description:
      "The Commerce faculty delivers programs in Accounting, Finance, Business Administration, Economics, and Marketing. With a focus on real-world business challenges, internship opportunities with leading corporations, and faculty drawn from industry, our graduates are equipped to lead in dynamic global markets and entrepreneurial ventures.",
    specializations: ["Accounting", "Finance", "Marketing", "Economics"],
    duration: "3 Years (B.Com / BBA)",
    seats: 140,
    eligibility: "10+2 in any stream (min 55%)",
    color: "from-amber-600/20 to-amber-800/10",
    iconBg: "bg-amber-100 text-amber-700",
    badge: "High Placement",
    badgeVariant: "default" as const,
  },
];

export default function CoursesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top left, oklch(0.73 0.14 82), transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
              Our Programs
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Academic Programs
            </h1>
            <p className="text-primary-foreground/75 max-w-2xl mx-auto text-lg">
              Discover our four distinguished faculties offering world-class
              education designed to prepare you for a successful career and
              meaningful life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                data-ocid={course.ocid}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group bg-card rounded-2xl shadow-card border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card header with gradient */}
                <div className={cn("p-6 bg-gradient-to-br", course.color)}>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-xl",
                        course.iconBg,
                      )}
                    >
                      <course.icon className="h-7 w-7" />
                    </div>
                    <Badge variant={course.badgeVariant} className="text-xs">
                      {course.badge}
                    </Badge>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                    {course.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {course.shortDesc}
                  </p>
                </div>

                <div className="p-6">
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{course.seats} Seats Available</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary font-medium border border-primary/15"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Expand/Collapse */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-primary hover:bg-primary/5 group-hover:bg-primary/5"
                    onClick={() =>
                      setExpanded(expanded === course.id ? null : course.id)
                    }
                  >
                    <span>
                      {expanded === course.id ? "Show Less" : "Learn More"}
                    </span>
                    {expanded === course.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Expanded content */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: expanded === course.id ? "auto" : 0,
                      opacity: expanded === course.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-3 border-t border-border mt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {course.description}
                      </p>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs font-semibold text-foreground mb-1">
                          Eligibility
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.eligibility}
                        </p>
                      </div>
                      <Link to="/admission">
                        <Button
                          size="sm"
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2"
                        >
                          Apply for {course.name}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-display text-2xl font-bold text-foreground mb-3">
            Ready to take the next step?
          </h3>
          <p className="text-muted-foreground mb-6">
            Submit your application today and join thousands of students who
            call Sir Isaac Newton home.
          </p>
          <Link to="/admission">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
