import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Types
  type ApplicationId = Nat;
  type FileId = Text;

  type Course = {
    #engineering;
    #arts;
    #science;
    #commerce;
  };

  module Course {
    public func fromText(course : Text) : ?Course {
      switch (course) {
        case ("Engineering") { ?#engineering };
        case ("Arts") { ?#arts };
        case ("Science") { ?#science };
        case ("Commerce") { ?#commerce };
        case (_) { null };
      };
    };

    public func toText(course : Course) : Text {
      switch (course) {
        case (#engineering) { "Engineering" };
        case (#arts) { "Arts" };
        case (#science) { "Science" };
        case (#commerce) { "Commerce" };
      };
    };
  };

  type ApplicationStatus = {
    #pending;
    #underReview;
    #accepted;
    #rejected;
  };

  module ApplicationStatus {
    public func fromText(status : Text) : ?ApplicationStatus {
      switch (status) {
        case ("Pending") { ?#pending };
        case ("UnderReview") { ?#underReview };
        case ("Accepted") { ?#accepted };
        case ("Rejected") { ?#rejected };
        case (_) { null };
      };
    };

    public func toText(status : ApplicationStatus) : Text {
      switch (status) {
        case (#pending) { "Pending" };
        case (#underReview) { "UnderReview" };
        case (#accepted) { "Accepted" };
        case (#rejected) { "Rejected" };
      };
    };
  };

  public type Application = {
    id : ApplicationId;
    applicant : Principal;
    fullName : Text;
    dob : Text;
    gender : Text;
    email : Text;
    phone : Text;
    address : Text;
    course : Course;
    previousQualification : Text;
    marksheetFileId : ?FileId;
    photoFileId : ?FileId;
    status : ApplicationStatus;
    submittedAt : Int;
  };

  type ApplicationInput = {
    course : Course;
    fullName : Text;
    dob : Text;
    gender : Text;
    email : Text;
    phone : Text;
    address : Text;
    previousQualification : Text;
    marksheetFileId : ?FileId;
    photoFileId : ?FileId;
  };

  // State
  var nextApplicationId = 1;
  let applicationsStorage = Map.empty<ApplicationId, Application>();

  // User functions
  public shared ({ caller }) func submitApplication(input : ApplicationInput) : async ApplicationId {
    // Require at least user role to submit applications (prevents anonymous spam)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can submit applications");
    };

    let newId = nextApplicationId;
    nextApplicationId += 1;

    let application : Application = {
      id = newId;
      applicant = caller;
      fullName = input.fullName;
      dob = input.dob;
      gender = input.gender;
      email = input.email;
      phone = input.phone;
      address = input.address;
      course = input.course;
      previousQualification = input.previousQualification;
      marksheetFileId = input.marksheetFileId;
      photoFileId = input.photoFileId;
      status = #pending;
      submittedAt = Time.now();
    };

    applicationsStorage.add(newId, application);
    newId;
  };

  public query ({ caller }) func getApplicationById(applicationId : ApplicationId) : async ?Application {
    switch (applicationsStorage.get(applicationId)) {
      case (null) { null };
      case (?application) {
        // Only the applicant who submitted it or an admin can view the application
        if (application.applicant != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own applications");
        };
        ?application;
      };
    };
  };

  // Admin function
  public query ({ caller }) func getApplications() : async [Application] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    applicationsStorage.values().toArray();
  };

  public shared ({ caller }) func updateApplicationStatus(applicationId : ApplicationId, newStatus : ApplicationStatus) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (applicationsStorage.get(applicationId)) {
      case (null) { Runtime.trap("Application does not exist") };
      case (?application) {
        let updatedApplication = {
          application with status = newStatus;
        };
        applicationsStorage.add(applicationId, updatedApplication);
        true;
      };
    };
  };
};
