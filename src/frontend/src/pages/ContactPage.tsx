import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "123 University Road,\nNewton City, GC 10001",
    link: null,
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 800-GREENFIELD",
    link: "tel:+18004733634",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Mail,
    title: "Email",
    content: "admissions@greenfield.edu",
    link: "mailto:admissions@greenfield.edu",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Clock,
    title: "Office Hours",
    content: "Mon – Fri: 9:00 AM – 5:00 PM\nSat: 10:00 AM – 2:00 PM",
    link: null,
    color: "bg-rose-100 text-rose-700",
  },
];

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactForm.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    toast.success(
      "Message sent! We'll get back to you within 2 business days.",
    );
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary py-14 relative overflow-hidden">
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
              Get In Touch
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
              Contact Us
            </h1>
            <p className="text-primary-foreground/75 max-w-xl mx-auto">
              Have questions about admissions, courses, or campus life? Our team
              is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl shadow-card border border-border p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${info.color}`}
                >
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {info.content}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map + Contact Form Grid */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Find Us
              </h2>
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-border">
                {/* Styled map placeholder */}
                <div className="w-full h-72 bg-gradient-to-br from-primary/15 via-muted to-accent/10 flex flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <MapPin className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-semibold text-foreground">
                      Sir Isaac Newton College
                    </p>
                    <p className="text-sm text-muted-foreground">
                      123 University Road, Newton City
                    </p>
                  </div>
                  {/* Grid lines for map feel */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(15,25,60,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(15,25,60,0.5) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                </div>
                <div className="p-4 bg-card border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    123 University Road, Newton City, GC 10001
                  </p>
                </div>
              </div>

              {/* Directions info */}
              <div className="mt-6 p-5 rounded-xl bg-primary/5 border border-primary/15">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Getting Here
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>🚌 Bus routes 12, 15, 18 stop at University Gate</li>
                  <li>🚊 Nearest metro: Newton Central (10 min walk)</li>
                  <li>🚗 Parking available at Campus Lot A & B</li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Send a Message
              </h2>
              <div className="bg-card rounded-2xl shadow-card border border-border p-6">
                {sent ? (
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Thank you for reaching out. We'll respond within 2
                      business days.
                    </p>
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setSent(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSend} noValidate className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="contactName"
                        placeholder="Your full name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactMessage" className="font-semibold">
                        Message *
                      </Label>
                      <Textarea
                        id="contactMessage"
                        placeholder="How can we help you?"
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            message: e.target.value,
                          }))
                        }
                        className="min-h-[130px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      {sending ? (
                        <>
                          <span className="mr-2 inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
