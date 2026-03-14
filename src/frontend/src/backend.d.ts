import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface NotificationPreferences {
    levelups: boolean;
    friends: boolean;
    challenges: boolean;
    streaks: boolean;
}
export interface WorkoutLog {
    completedAt: bigint;
    exerciseId: bigint;
    xpAwarded: bigint;
    notes: string;
}
export interface Exercise {
    id: bigint;
    equipment: string;
    musclesWorked: Array<string>;
    difficulty: ExerciseDifficulty;
    name: string;
    tier: string;
    instructions: Array<string>;
    category: ExerciseCategory;
    commonMistakes: Array<string>;
    setsReps: string;
}
export interface UserChallenge {
    joinedAt: bigint;
    completed: boolean;
    challengeId: bigint;
    currentCount: bigint;
}
export interface Challenge {
    id: bigint;
    durationDays: bigint;
    badgeIcon: string;
    name: string;
    description: string;
    rewardXp: bigint;
    targetCount: bigint;
}
export interface WellnessLog {
    userId: Principal;
    date: bigint;
    sleepData: SleepData;
    hydration: bigint;
}
export interface Notification {
    id: bigint;
    userId: Principal;
    notificationType: NotificationType;
    isRead: boolean;
    message: string;
    timestamp: bigint;
}
export interface BodyMetric {
    bmi: number;
    weight: number;
    bodyFat: number;
    hips: number;
    chest: number;
    timestamp: bigint;
    waist: number;
    biceps: number;
}
export interface Message {
    content: string;
    receiverId: Principal;
    timestamp: bigint;
    senderId: Principal;
}
export interface ActivityFeedEntry {
    activityType: string;
    userId: Principal;
    xpGained: bigint;
    message: string;
    timestamp: bigint;
}
export interface UserProfile {
    xp: bigint;
    streak: bigint;
    username: string;
    fitnessGoal: string;
    activeTheme: string;
    level: bigint;
    lastWorkoutDate: bigint;
    isBanned: boolean;
    isAdmin: boolean;
    profilePic?: ExternalBlob;
}
export interface SleepData {
    hours: number;
    bedtime: string;
    quality: bigint;
    wakeTime: string;
}
export enum ExerciseCategory {
    shoulders = "shoulders",
    arms = "arms",
    back = "back",
    core = "core",
    chest = "chest",
    legs = "legs",
    fullBody = "fullBody"
}
export enum ExerciseDifficulty {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum NotificationType {
    streak = "streak",
    levelup = "levelup",
    challenge = "challenge",
    friendAchievement = "friendAchievement"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBodyMetric(metric: BodyMetric): Promise<void>;
    addExercise(exercise: Exercise): Promise<bigint>;
    addNotification(userId: Principal, notificationType: NotificationType, message: string): Promise<bigint>;
    addWellnessLog(log: WellnessLog): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banUser(user: Principal): Promise<void>;
    blockUser(user: Principal): Promise<void>;
    createChallenge(challenge: Challenge): Promise<bigint>;
    deleteChallenge(id: bigint): Promise<void>;
    deleteExercise(id: bigint): Promise<void>;
    editChallenge(id: bigint, challenge: Challenge): Promise<void>;
    editExercise(id: bigint, exercise: Exercise): Promise<void>;
    followUser(user: Principal): Promise<void>;
    getActivityFeed(): Promise<Array<ActivityFeedEntry>>;
    getAdminUserList(): Promise<Array<UserProfile>>;
    getAllChallenges(): Promise<Array<Challenge>>;
    getAllExercises(): Promise<Array<Exercise>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerAchievements(): Promise<Array<bigint>>;
    getCallerBodyMetrics(): Promise<Array<BodyMetric>>;
    getCallerChallenges(): Promise<Array<UserChallenge>>;
    getCallerNotificationPreferences(): Promise<NotificationPreferences>;
    getCallerNotifications(): Promise<Array<Notification>>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWellnessLogs(): Promise<Array<WellnessLog>>;
    getCallerWorkoutLogs(): Promise<Array<WorkoutLog>>;
    getConversation(otherUser: Principal): Promise<Array<Message>>;
    getExerciseById(id: bigint): Promise<Exercise | null>;
    getExercisesByCategory(category: ExerciseCategory): Promise<Array<Exercise>>;
    getGlobalLeaderboard(): Promise<Array<UserProfile>>;
    getRecommendedExercises(): Promise<Array<Exercise>>;
    getReportedContent(): Promise<Array<[bigint, string]>>;
    getStreakLeaderboard(): Promise<Array<UserProfile>>;
    getUnreadNotificationCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    isBanned(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    joinChallenge(challengeId: bigint): Promise<void>;
    logWorkout(exerciseId: bigint, notes: string): Promise<void>;
    markAllNotificationsRead(): Promise<void>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    moderateContent(reportId: bigint, _action: string): Promise<void>;
    reportUser(_user: Principal, reason: string): Promise<void>;
    saveCallerNotificationPreferences(prefs: NotificationPreferences): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(receiverId: Principal, content: string): Promise<void>;
    suspendUser(user: Principal): Promise<void>;
    unfollowUser(user: Principal): Promise<void>;
    updateActiveTheme(newTheme: string): Promise<void>;
    updateCallerProfile(newUsername: string, newGoal: string, newLevel: bigint, newXp: bigint, newStreak: bigint, newPicId: ExternalBlob | null): Promise<void>;
    updateChallengeProgress(_challengeId: bigint, _count: bigint): Promise<void>;
}
