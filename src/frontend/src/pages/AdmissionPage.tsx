import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { Course } from "../backend";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { StorageClient } from "../utils/StorageClient";

interface FormValues {
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  course: string;
  previousQualification: string;
}

interface FormErrors {
  fullName?: string;
  dob?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  course?: string;
  previousQualification?: string;
}

async function uploadFileToStorage(file: File): Promise<string> {
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(console.error);
  }
  const storageClient = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { hash } = await storageClient.putFile(bytes);
  return hash;
}

const courseOptions = [
  { label: "Engineering", value: Course.engineering },
  { label: "Arts & Humanities", value: Course.arts },
  { label: "Science", value: Course.science },
  { label: "Commerce & Business", value: Course.commerce },
];

function validate(form: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!form.fullName.trim() || form.fullName.trim().length < 2)
    errors.fullName = "Full name must be at least 2 characters.";
  if (!form.dob) errors.dob = "Date of birth is required.";
  if (!form.gender) errors.gender = "Please select a gender.";
  if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    errors.email = "Please enter a valid email address.";
  if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
    errors.phone = "Phone number must have at least 10 digits.";
  if (!form.address.trim()) errors.address = "Address is required.";
  if (!form.course) errors.course = "Please select a course.";
  if (!form.previousQualification.trim())
    errors.previousQualification = "Previous qualification is required.";
  return errors;
}

const emptyForm: FormValues = {
  fullName: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  course: "",
  previousQualification: "",
};

export default function AdmissionPage() {
  const { actor } = useActor();
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const marksheetRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = document.querySelector(
        "[aria-invalid='true']",
      ) as HTMLElement;
      firstError?.focus();
      return;
    }

    if (!actor) {
      setSubmitError("Unable to connect to the server. Please try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      let marksheetFileId: string | undefined;
      let photoFileId: string | undefined;

      const uploads: Promise<void>[] = [];
      if (marksheetFile) {
        uploads.push(
          uploadFileToStorage(marksheetFile)
            .then((hash) => {
              marksheetFileId = hash;
            })
            .catch((err) => console.warn("Marksheet upload failed:", err)),
        );
      }
      if (photoFile) {
        uploads.push(
          uploadFileToStorage(photoFile)
            .then((hash) => {
              photoFileId = hash;
            })
            .catch((err) => console.warn("Photo upload failed:", err)),
        );
      }
      await Promise.all(uploads);

      const applicationId = await actor.submitApplication({
        fullName: form.fullName.trim(),
        dob: form.dob,
        gender: form.gender,
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        course: form.course as Course,
        previousQualification: form.previousQualification.trim(),
        marksheetFileId,
        photoFileId,
      });

      setSuccessId(applicationId.toString());
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-background">
        <motion.div
          data-ocid="admission.success_state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center p-10 bg-card rounded-2xl shadow-card border border-border"
        >
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground mb-4">
            Your application has been successfully submitted. Please save your
            Application ID for future reference.
          </p>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Application ID</p>
            <p className="font-display text-2xl font-bold text-primary">
              #{successId}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            We will review your application and contact you at{" "}
            <strong>{form.email}</strong> within 5–7 business days.
          </p>
          <Button
            className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              setSuccessId(null);
              setForm(emptyForm);
              setMarksheetFile(null);
              setPhotoFile(null);
            }}
          >
            Submit Another Application
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-primary py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at bottom right, oklch(0.73 0.14 82), transparent 60%)",
          }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
              2026–27 Admissions
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
              Online Admission Application
            </h1>
            <p className="text-primary-foreground/75 max-w-xl mx-auto">
              Complete the form below to apply for admission to Sir Isaac Newton
              University. All fields marked with * are required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            noValidate
            className="bg-card rounded-2xl shadow-card border border-border p-8 md:p-10"
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 pb-4 border-b border-border">
              Personal Information
            </h2>

            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  data-ocid="admission.fullname.input"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={
                    errors.fullName ? "fullName-error" : undefined
                  }
                  className={errors.fullName ? "border-destructive" : ""}
                />
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.p
                      id="fullName-error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.fullName}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Date of Birth + Gender */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dob" className="font-semibold">
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    data-ocid="admission.dob.input"
                    value={form.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    aria-invalid={!!errors.dob}
                    className={errors.dob ? "border-destructive" : ""}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <AnimatePresence>
                    {errors.dob && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.dob}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => handleChange("gender", v)}
                  >
                    <SelectTrigger
                      data-ocid="admission.gender.select"
                      className={errors.gender ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">
                        Other / Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {errors.gender && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.gender}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Email + Phone */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    data-ocid="admission.email.input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    className={errors.email ? "border-destructive" : ""}
                    autoComplete="email"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    data-ocid="admission.phone.input"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    aria-invalid={!!errors.phone}
                    className={errors.phone ? "border-destructive" : ""}
                    autoComplete="tel"
                  />
                  <AnimatePresence>
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="font-semibold">
                  Residential Address{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  data-ocid="admission.address.textarea"
                  placeholder="Enter your full residential address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  aria-invalid={!!errors.address}
                  className={`min-h-[90px] ${errors.address ? "border-destructive" : ""}`}
                  autoComplete="street-address"
                />
                <AnimatePresence>
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-destructive flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" /> {errors.address}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="border-t border-border pt-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">
                  Academic Information
                </h3>
              </div>

              {/* Course + Previous Qualification */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-semibold">
                    Course Selection <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.course}
                    onValueChange={(v) => handleChange("course", v)}
                  >
                    <SelectTrigger
                      data-ocid="admission.course.select"
                      className={errors.course ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <AnimatePresence>
                    {errors.course && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" /> {errors.course}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification" className="font-semibold">
                    Previous Qualification{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="qualification"
                    data-ocid="admission.qualification.input"
                    placeholder="e.g. 12th Grade / HSC"
                    value={form.previousQualification}
                    onChange={(e) =>
                      handleChange("previousQualification", e.target.value)
                    }
                    aria-invalid={!!errors.previousQualification}
                    className={
                      errors.previousQualification ? "border-destructive" : ""
                    }
                  />
                  <AnimatePresence>
                    {errors.previousQualification && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-destructive flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />{" "}
                        {errors.previousQualification}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="border-t border-border pt-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">
                  Upload Documents
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Marksheet Upload */}
                <div className="space-y-2">
                  <Label className="font-semibold">
                    Marksheet / Transcript
                  </Label>
                  <button
                    type="button"
                    data-ocid="admission.marksheet.upload_button"
                    className="w-full flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/30 hover:bg-primary/5"
                    onClick={() => marksheetRef.current?.click()}
                  >
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    {marksheetFile ? (
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground truncate max-w-[160px]">
                          {marksheetFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(marksheetFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG (max 10MB)
                        </p>
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-sm bg-background">
                      <Upload className="h-3.5 w-3.5" />
                      {marksheetFile ? "Change File" : "Browse"}
                    </span>
                    <input
                      ref={marksheetRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        setMarksheetFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </button>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label className="font-semibold">Passport Photo</Label>
                  <button
                    type="button"
                    data-ocid="admission.photo.upload_button"
                    className="w-full flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer bg-muted/30 hover:bg-primary/5"
                    onClick={() => photoRef.current?.click()}
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    {photoFile ? (
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground truncate max-w-[160px]">
                          {photoFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(photoFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG (max 5MB)
                        </p>
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-md text-sm bg-background">
                      <Upload className="h-3.5 w-3.5" />
                      {photoFile ? "Change Photo" : "Browse"}
                    </span>
                    <input
                      ref={photoRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) =>
                        setPhotoFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </button>
                </div>
              </div>

              {/* Error State */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    data-ocid="admission.error_state"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Submission Failed</p>
                      <p className="text-sm opacity-90">{submitError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                data-ocid="admission.submit_button"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-6 shadow-card"
              >
                {submitting ? (
                  <>
                    <Loader2
                      data-ocid="admission.loading_state"
                      className="mr-2 h-5 w-5 animate-spin"
                    />
                    Submitting Application…
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By submitting, you agree to Sir Isaac Newton College’s
                admissions terms and privacy policy.
              </p>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
