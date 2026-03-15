import Order "mo:core/Order";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

import MixinAuthorization "authorization/MixinAuthorization";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Exercise Types
  type ExerciseCategory = {
    #chest;
    #back;
    #shoulders;
    #arms;
    #legs;
    #core;
    #fullBody;
  };

  type ExerciseDifficulty = {
    #beginner;
    #intermediate;
    #advanced;
  };

  type FitnessGoal = {
    #strengthBuilding;
    #weightlifting;
    #fatLoss;
    #athleticPerformance;
    #mobilityFlexibility;
    #generalFitness;
    #enduranceCardio;
    #homeWorkouts;
  };

  type Exercise = {
    id : Nat;
    name : Text;
    category : ExerciseCategory;
    difficulty : ExerciseDifficulty;
    tier : Text;
    musclesWorked : [Text];
    equipment : Text;
    setsReps : Text;
    instructions : [Text];
    commonMistakes : [Text];
  };

  type WorkoutLog = {
    exerciseId : Nat;
    completedAt : Int;
    xpAwarded : Nat;
    notes : Text;
  };

  type Challenge = {
    id : Nat;
    name : Text;
    description : Text;
    durationDays : Nat;
    rewardXp : Nat;
    badgeIcon : Text;
    targetCount : Nat;
  };

  type UserChallenge = {
    challengeId : Nat;
    joinedAt : Int;
    currentCount : Nat;
    completed : Bool;
  };

  type Achievement = {
    id : Nat;
    name : Text;
    description : Text;
    icon : Text;
  };

  type ActivityFeedEntry = {
    userId : Principal;
    message : Text;
    xpGained : Nat;
    timestamp : Int;
    activityType : Text;
  };

  type Message = {
    senderId : Principal;
    receiverId : Principal;
    content : Text;
    timestamp : Int;
  };

  type BodyMetric = {
    weight : Float;
    bodyFat : Float;
    chest : Float;
    waist : Float;
    hips : Float;
    biceps : Float;
    bmi : Float;
    timestamp : Int;
  };

  // Notifications
  type NotificationType = {
    #streak;
    #challenge;
    #friendAchievement;
    #levelup;
  };

  type Notification = {
    id : Nat;
    userId : Principal;
    notificationType : NotificationType;
    message : Text;
    timestamp : Int;
    isRead : Bool;
  };

  type NotificationPreferences = {
    streaks : Bool;
    challenges : Bool;
    friends : Bool;
    levelups : Bool;
  };

  // Wellness Log
  type SleepData = {
    hours : Float;
    quality : Nat;
    bedtime : Text;
    wakeTime : Text;
  };

  type WellnessLog = {
    date : Int;
    userId : Principal;
    sleepData : SleepData;
    hydration : Nat;
  };

  type UserProfile = {
    username : Text;
    level : Nat;
    xp : Nat;
    streak : Nat;
    fitnessGoal : Text;
    profilePic : ?Storage.ExternalBlob;
    lastWorkoutDate : Int;
    isBanned : Bool;
    isAdmin : Bool;
    activeTheme : Text;
  };

  // Data Storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let exercises = Map.empty<Nat, Exercise>();
  let workoutLogs = Map.empty<Principal, List.List<WorkoutLog>>();
  let challenges = Map.empty<Nat, Challenge>();
  let userChallenges = Map.empty<Principal, List.List<UserChallenge>>();
  let achievements = Map.empty<Nat, Achievement>();
  let userAchievements = Map.empty<Principal, Set.Set<Nat>>();
  let following = Map.empty<Principal, Set.Set<Principal>>();
  let activityFeed = Map.empty<Nat, ActivityFeedEntry>();
  let messages = Map.empty<Nat, Message>();
  let blockedUsers = Map.empty<Principal, Set.Set<Principal>>();
  let bodyMetrics = Map.empty<Principal, List.List<BodyMetric>>();
  let reportedContent = Map.empty<Nat, Text>();
  let notifications = Map.empty<Principal, List.List<Notification>>();
  let notificationPrefs = Map.empty<Principal, NotificationPreferences>();
  let wellnessLogs = Map.empty<Principal, List.List<WellnessLog>>();

  // Counters
  var nextExerciseId : Nat = 0;
  var nextChallengeId : Nat = 0;
  var nextAchievementId : Nat = 0;
  var nextActivityId : Nat = 0;
  var nextMessageId : Nat = 0;
  var nextNotificationId : Nat = 0;
  var nextReportId : Nat = 0;

  // ============ USER PROFILE FUNCTIONS ============
  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile does not exist") };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be admin");
    };
    switch (userProfiles.get(user)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile does not exist") };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, { profile with activeTheme = "default" });
  };

  public shared ({ caller }) func updateCallerProfile(newUsername : Text, newGoal : Text, newLevel : Nat, newXp : Nat, newStreak : Nat, newPicId : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) {
        Runtime.trap("Profile does not exist");
      };
    };

    userProfiles.add(caller, {
      existingProfile with
      username = newUsername;
      fitnessGoal = newGoal;
      level = newLevel;
      xp = newXp;
      streak = newStreak;
      profilePic = newPicId;
    });
  };

  public shared ({ caller }) func updateActiveTheme(newTheme : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update theme");
    };
    let existingProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("Profile does not exist") };
    };
    userProfiles.add(caller, { existingProfile with activeTheme = newTheme });
  };

  public query ({ caller }) func isBanned() : async Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.isBanned };
      case (null) { false };
    };
  };

  // ============ EXERCISE FUNCTIONS ============
  public query ({ caller }) func getExerciseById(id : Nat) : async ?Exercise {
    // Public access
    exercises.get(id);
  };

  public query ({ caller }) func getAllExercises() : async [Exercise] {
    // Public access
    exercises.values().toArray();
  };

  public query ({ caller }) func getExercisesByCategory(category : ExerciseCategory) : async [Exercise] {
    // Public access
    let allExercises = exercises.values().toArray();
    allExercises.filter<Exercise>(func(ex) { ex.category == category });
  };

  public shared ({ caller }) func addExercise(exercise : Exercise) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exercises");
    };
    let id = nextExerciseId;
    nextExerciseId += 1;
    exercises.add(id, { exercise with id = id });
    id;
  };

  public shared ({ caller }) func editExercise(id : Nat, exercise : Exercise) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit exercises");
    };
    exercises.add(id, exercise);
  };

  public shared ({ caller }) func deleteExercise(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete exercises");
    };
    exercises.remove(id);
  };

  // ============ WORKOUT FUNCTIONS ============
  public shared ({ caller }) func logWorkout(exerciseId : Nat, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log workouts");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Profile does not exist") };
    };

    if (profile.isBanned) {
      Runtime.trap("Banned users cannot log workouts");
    };

    let exercise = switch (exercises.get(exerciseId)) {
      case (?ex) { ex };
      case (null) { Runtime.trap("Exercise not found") };
    };

    let xpAwarded = switch (exercise.tier) {
      case ("C") { 10 };
      case ("B") { 20 };
      case ("A") { 40 };
      case ("S") { 80 };
      case (_) { 10 };
    };

    let log : WorkoutLog = {
      exerciseId = exerciseId;
      completedAt = Time.now();
      xpAwarded = xpAwarded;
      notes = notes;
    };

    let existingLogs = switch (workoutLogs.get(caller)) {
      case (?logs) { logs };
      case (null) { List.empty<WorkoutLog>() };
    };

    existingLogs.add(log);
    workoutLogs.add(caller, existingLogs);
  };

  public query ({ caller }) func getCallerWorkoutLogs() : async [WorkoutLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout logs");
    };
    switch (workoutLogs.get(caller)) {
      case (?logs) { logs.toArray() };
      case (null) { [] };
    };
  };

  // ============ LEADERBOARD FUNCTIONS ============
  func take(array : [UserProfile], n : Nat) : [UserProfile] {
    let len = array.size();
    if (n >= len) { return array };
    let result = Array.tabulate(n, func(i) { array[i] });
    result;
  };

  public query ({ caller }) func getGlobalLeaderboard() : async [UserProfile] {
    // Public access
    let profiles = userProfiles.values().toArray();
    let sorted = profiles.sort(func(a, b) {
      Nat.compare(b.xp, a.xp);
    });
    take(sorted, 50);
  };

  public query ({ caller }) func getStreakLeaderboard() : async [UserProfile] {
    // Public access
    let profiles = userProfiles.values().toArray();
    let sorted = profiles.sort(func(a, b) {
      Nat.compare(b.streak, a.streak);
    });
    take(sorted, 50);
  };

  // ============ CHALLENGE FUNCTIONS ============
  public query ({ caller }) func getAllChallenges() : async [Challenge] {
    // Public access
    challenges.values().toArray();
  };

  public shared ({ caller }) func joinChallenge(challengeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join challenges");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Profile does not exist") };
    };

    if (profile.isBanned) {
      Runtime.trap("Banned users cannot join challenges");
    };

    let challenge = switch (challenges.get(challengeId)) {
      case (?c) { c };
      case (null) { Runtime.trap("Challenge not found") };
    };

    let userChallenge : UserChallenge = {
      challengeId = challengeId;
      joinedAt = Time.now();
      currentCount = 0;
      completed = false;
    };

    let existing = switch (userChallenges.get(caller)) {
      case (?uc) { uc };
      case (null) { List.empty<UserChallenge>() };
    };

    existing.add(userChallenge);
    userChallenges.add(caller, existing);
  };

  public shared ({ caller }) func updateChallengeProgress(_challengeId : Nat, _count : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update challenge progress");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Profile does not exist") };
    };

    if (profile.isBanned) {
      Runtime.trap("Banned users cannot update challenges");
    };

    // Implementation would update the specific challenge progress
  };

  public query ({ caller }) func getCallerChallenges() : async [UserChallenge] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their challenges");
    };
    switch (userChallenges.get(caller)) {
      case (?uc) { uc.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func createChallenge(challenge : Challenge) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create challenges");
    };
    let id = nextChallengeId;
    nextChallengeId += 1;
    challenges.add(id, { challenge with id = id });
    id;
  };

  public shared ({ caller }) func editChallenge(id : Nat, challenge : Challenge) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit challenges");
    };
    challenges.add(id, challenge);
  };

  public shared ({ caller }) func deleteChallenge(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete challenges");
    };
    challenges.remove(id);
  };

  // ============ ACHIEVEMENT FUNCTIONS ============
  public query ({ caller }) func getCallerAchievements() : async [Nat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view achievements");
    };
    switch (userAchievements.get(caller)) {
      case (?achs) { achs.toArray() };
      case (null) { [] };
    };
  };

  // ============ SOCIAL FUNCTIONS ============
  public shared ({ caller }) func followUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow others");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Profile does not exist") };
    };

    if (profile.isBanned) {
      Runtime.trap("Banned users cannot follow others");
    };

    let currentFollowing : Set.Set<Principal> = switch (following.get(caller)) {
      case (?f) { f };
      case (null) { Set.empty<Principal>() };
    };

    currentFollowing.add(user);
    following.add(caller, currentFollowing);
  };

  public shared ({ caller }) func unfollowUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unfollow others");
    };

    let currentFollowing : Set.Set<Principal> = switch (following.get(caller)) {
      case (?f) { f };
      case (null) { Set.empty<Principal>() };
    };

    currentFollowing.add(user);
    following.add(caller, currentFollowing);
  };

  public query ({ caller }) func getActivityFeed() : async [ActivityFeedEntry] {
    // Public access
    activityFeed.values().toArray();
  };

  // ============ MESSAGES ============
  public shared ({ caller }) func sendMessage(receiverId : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Profile does not exist") };
    };

    if (profile.isBanned) {
      Runtime.trap("Banned users cannot send messages");
    };

    let blocked = switch (blockedUsers.get(receiverId)) {
      case (?b) { b.contains(caller) };
      case (null) { false };
    };

    if (blocked) {
      Runtime.trap("You are blocked by this user");
    };

    let message : Message = {
      senderId = caller;
      receiverId = receiverId;
      content = content;
      timestamp = Time.now();
    };

    let id = nextMessageId;
    nextMessageId += 1;
    messages.add(id, message);
  };

  public query ({ caller }) func getConversation(otherUser : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    let allMessages = messages.values().toArray();
    allMessages.filter<Message>(func(msg) {
      (msg.senderId == caller and msg.receiverId == otherUser) or
      (msg.senderId == otherUser and msg.receiverId == caller);
    });
  };

  public shared ({ caller }) func blockUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can block others");
    };

    let currentBlocked : Set.Set<Principal> = switch (blockedUsers.get(caller)) {
      case (?b) { b };
      case (null) { Set.empty<Principal>() };
    };

    currentBlocked.add(user);
    blockedUsers.add(caller, currentBlocked);
  };

  public shared ({ caller }) func reportUser(_user : Principal, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report others");
    };

    let id = nextReportId;
    nextReportId += 1;
    reportedContent.add(id, reason);
  };

  // ============ BODY METRICS ============
  public shared ({ caller }) func addBodyMetric(metric : BodyMetric) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add body metrics");
    };

    let existing = switch (bodyMetrics.get(caller)) {
      case (?m) { m };
      case (null) { List.empty<BodyMetric>() };
    };

    existing.add(metric);
    bodyMetrics.add(caller, existing);
  };

  public query ({ caller }) func getCallerBodyMetrics() : async [BodyMetric] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view body metrics");
    };
    switch (bodyMetrics.get(caller)) {
      case (?m) { m.toArray() };
      case (null) { [] };
    };
  };

  // ============ ADMIN FUNCTIONS ============
  public query ({ caller }) func getAdminUserList() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view user list");
    };
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func banUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can ban users");
    };

    let profile = switch (userProfiles.get(user)) {
      case (?p) { p };
      case (null) { Runtime.trap("User not found") };
    };

    let updated = { profile with isBanned = true };
    userProfiles.add(user, updated);
  };

  public shared ({ caller }) func suspendUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can suspend users");
    };

    let profile = switch (userProfiles.get(user)) {
      case (?p) { p };
      case (null) { Runtime.trap("User not found") };
    };

    let updated = { profile with isBanned = true };
    userProfiles.add(user, updated);
  };

  public query ({ caller }) func getReportedContent() : async [(Nat, Text)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view reported content");
    };
    reportedContent.entries().toArray();
  };

  public shared ({ caller }) func moderateContent(reportId : Nat, _action : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can moderate content");
    };
    reportedContent.remove(reportId);
  };

  // ============ RECOMMENDATIONS ============
  public query ({ caller }) func getRecommendedExercises() : async [Exercise] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get recommendations");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("Profile does not exist") };
    };

    // Return exercises based on fitness goal
    exercises.values().toArray();
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    // Public access
    userProfiles.values().toArray();
  };

  // ============ NOTIFICATION FUNCTIONS ============
  public shared ({ caller }) func addNotification(userId : Principal, notificationType : NotificationType, message : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add notifications");
    };

    let id = nextNotificationId;
    nextNotificationId += 1;

    let notification : Notification = {
      id;
      userId;
      notificationType;
      message;
      timestamp = Time.now();
      isRead = false;
    };

    let existing = switch (notifications.get(userId)) {
      case (?n) { n };
      case (null) { List.empty<Notification>() };
    };

    existing.add(notification);
    notifications.add(userId, existing);
    id;
  };

  public query ({ caller }) func getCallerNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };
    switch (notifications.get(caller)) {
      case (?n) { n.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    let userNotifications = switch (notifications.get(caller)) {
      case (?n) { n };
      case (null) { List.empty<Notification>() };
    };

    let updated = userNotifications.map<Notification, Notification>(
      func(n) {
        if (n.id == notificationId) {
          { n with isRead = true };
        } else {
          n;
        };
      }
    );

    notifications.add(caller, updated);
  };

  public shared ({ caller }) func markAllNotificationsRead() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };

    let userNotifications = switch (notifications.get(caller)) {
      case (?n) { n };
      case (null) { List.empty<Notification>() };
    };

    let updated = userNotifications.map<Notification, Notification>(
      func(n) { { n with isRead = true } }
    );

    notifications.add(caller, updated);
  };

  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notification count");
    };
    switch (notifications.get(caller)) {
      case (?n) {
        let unread = n.filter(func(notif) { not notif.isRead });
        let unreadCount = unread.toArray().size();
        unreadCount;
      };
      case (null) { 0 };
    };
  };

  // ============ NOTIFICATION PREFS ============
  public query ({ caller }) func getCallerNotificationPreferences() : async NotificationPreferences {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notification preferences");
    };
    switch (notificationPrefs.get(caller)) {
      case (?prefs) { prefs };
      case (null) {
        {
          streaks = true;
          challenges = true;
          friends = true;
          levelups = true;
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerNotificationPreferences(prefs : NotificationPreferences) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update notification prefs");
    };
    notificationPrefs.add(caller, prefs);
  };

  // ============ WELLNESS LOGS ============
  public shared ({ caller }) func addWellnessLog(log : WellnessLog) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add wellness logs");
    };

    let existing = switch (wellnessLogs.get(caller)) {
      case (?w) { w };
      case (null) { List.empty<WellnessLog>() };
    };

    existing.add(log);
    wellnessLogs.add(caller, existing);
  };

  public query ({ caller }) func getCallerWellnessLogs() : async [WellnessLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wellness logs");
    };
    switch (wellnessLogs.get(caller)) {
      case (?w) { w.toArray() };
      case (null) { [] };
    };
  };
};
