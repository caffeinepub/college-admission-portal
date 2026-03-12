import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Application, ApplicationStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = {
    [ApplicationStatus.pending]: {
      label: "Pending",
      className: "bg-amber-100 text-amber-700 border-amber-200",
      icon: Clock,
    },
    [ApplicationStatus.underReview]: {
      label: "Under Review",
      className: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Eye,
    },
    [ApplicationStatus.accepted]: {
      label: "Accepted",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: CheckCircle,
    },
    [ApplicationStatus.rejected]: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: XCircle,
    },
  };
  const {
    label,
    className,
    icon: Icon,
  } = config[status] ?? config[ApplicationStatus.pending];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function courseLabel(course: string) {
  const labels: Record<string, string> = {
    engineering: "Engineering",
    arts: "Arts",
    science: "Science",
    commerce: "Commerce",
  };
  return labels[course] ?? course;
}

export default function AdminPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isLoggedIn = !!identity;

  // Check admin role
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isLoggedIn) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
  });

  // Fetch applications
  const {
    data: applications,
    isLoading: loadingApps,
    refetch,
  } = useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApplications();
    },
    enabled: !!actor && !actorFetching && !!isAdmin,
  });

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: ApplicationStatus;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateApplicationStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application status updated.");
      setUpdatingId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update status.");
      setUpdatingId(null);
    },
  });

  // --- Not logged in ---
  if (!isLoggedIn) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full mx-4 text-center p-10 bg-card rounded-2xl shadow-card border border-border"
        >
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground mb-8">
            Sign in with Internet Identity to access the admin dashboard and
            manage admission applications.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === "logging-in"}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" /> Sign in with Internet
                Identity
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  // --- Checking admin status ---
  if (actorFetching || checkingAdmin) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="pt-16 min-h-screen flex items-center justify-center bg-background"
      >
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying credentials…</p>
        </div>
      </div>
    );
  }

  // --- Not admin ---
  if (!isAdmin) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4 text-center p-10 bg-card rounded-2xl shadow-card border border-border">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            Your account does not have admin privileges. Contact the system
            administrator for access.
          </p>
          <p className="text-xs text-muted-foreground mt-4 break-all">
            Principal: {identity.getPrincipal().toString()}
          </p>
        </div>
      </div>
    );
  }

  // --- Admin view ---
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary py-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top right, oklch(0.73 0.14 82), transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge className="mb-3 bg-accent/20 text-accent border-accent/30">
                Admin Portal
              </Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                Applications Dashboard
              </h1>
              <p className="text-primary-foreground/75 mt-1">
                Manage and review all student admission applications.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-white/30 text-primary-foreground bg-white/10 hover:bg-white/20"
              onClick={() => refetch()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          {/* Stats */}
          {applications && applications.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total",
                  value: applications.length,
                  icon: Users,
                  color: "text-primary",
                },
                {
                  label: "Pending",
                  value: applications.filter(
                    (a) => a.status === ApplicationStatus.pending,
                  ).length,
                  icon: Clock,
                  color: "text-amber-600",
                },
                {
                  label: "Accepted",
                  value: applications.filter(
                    (a) => a.status === ApplicationStatus.accepted,
                  ).length,
                  icon: CheckCircle,
                  color: "text-emerald-600",
                },
                {
                  label: "Rejected",
                  value: applications.filter(
                    (a) => a.status === ApplicationStatus.rejected,
                  ).length,
                  icon: XCircle,
                  color: "text-red-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-xl shadow-card border border-border p-4 flex items-center gap-3"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  <div>
                    <div className="font-display text-xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {loadingApps ? (
            <div data-ocid="admin.loading_state" className="text-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading applications…</p>
            </div>
          ) : !applications || applications.length === 0 ? (
            <motion.div
              data-ocid="admin.applications.empty_state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-card rounded-2xl border border-border shadow-card"
            >
              <Users className="h-14 w-14 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                No Applications Yet
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                When students submit applications, they will appear here for
                your review.
              </p>
            </motion.div>
          ) : (
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold text-foreground">
                        App ID
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Course
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Submitted
                      </TableHead>
                      <TableHead className="font-semibold text-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app, idx) => (
                      <TableRow
                        key={app.id.toString()}
                        data-ocid={`admin.application.row.${idx + 1}`}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          #{app.id.toString()}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {app.fullName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {courseLabel(app.course)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {app.email}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(
                            Number(app.submittedAt) / 1_000_000,
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={app.status}
                            disabled={
                              updatingId === app.id.toString() ||
                              updateMutation.isPending
                            }
                            onValueChange={(val) => {
                              setUpdatingId(app.id.toString());
                              updateMutation.mutate({
                                id: app.id,
                                status: val as ApplicationStatus,
                              });
                            }}
                          >
                            <SelectTrigger
                              data-ocid={`admin.status.select.${idx + 1}`}
                              className="w-36 h-8 text-xs"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ApplicationStatus.pending}>
                                Pending
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.underReview}>
                                Under Review
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.accepted}>
                                Accepted
                              </SelectItem>
                              <SelectItem value={ApplicationStatus.rejected}>
                                Rejected
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
