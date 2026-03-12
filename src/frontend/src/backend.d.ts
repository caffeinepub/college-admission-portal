import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Application {
    id: ApplicationId;
    dob: string;
    status: ApplicationStatus;
    applicant: Principal;
    marksheetFileId?: FileId;
    fullName: string;
    submittedAt: bigint;
    email: string;
    previousQualification: string;
    address: string;
    gender: string;
    photoFileId?: FileId;
    phone: string;
    course: Course;
}
export interface ApplicationInput {
    dob: string;
    marksheetFileId?: FileId;
    fullName: string;
    email: string;
    previousQualification: string;
    address: string;
    gender: string;
    photoFileId?: FileId;
    phone: string;
    course: Course;
}
export type FileId = string;
export type ApplicationId = bigint;
export interface UserProfile {
    name: string;
}
export enum ApplicationStatus {
    pending = "pending",
    underReview = "underReview",
    rejected = "rejected",
    accepted = "accepted"
}
export enum Course {
    arts = "arts",
    engineering = "engineering",
    commerce = "commerce",
    science = "science"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getApplicationById(applicationId: ApplicationId): Promise<Application | null>;
    getApplications(): Promise<Array<Application>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitApplication(input: ApplicationInput): Promise<ApplicationId>;
    updateApplicationStatus(applicationId: ApplicationId, newStatus: ApplicationStatus): Promise<boolean>;
}
