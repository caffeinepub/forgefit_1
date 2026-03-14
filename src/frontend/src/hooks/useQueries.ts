import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BodyMetric,
  Challenge,
  Exercise,
  ExerciseCategory,
  NotificationPreferences,
  WellnessLog,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllExercises() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllExercises();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetExercisesByCategory(category: ExerciseCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["exercises", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getExercisesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetExerciseById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["exercise", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getExerciseById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetRecommendedExercises() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["exercises", "recommended"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecommendedExercises();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorkoutLogs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["workoutLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerWorkoutLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogWorkout() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      exerciseId,
      notes,
    }: { exerciseId: bigint; notes: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logWorkout(exerciseId, notes);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workoutLogs"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useGetGlobalLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard", "global"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGlobalLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStreakLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard", "streak"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStreakLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllChallenges() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChallenges();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerChallenges() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["challenges", "mine"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerChallenges();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useJoinChallenge() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.joinChallenge(challengeId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["challenges"] }),
  });
}

export function useUpdateChallengeProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      challengeId,
      count,
    }: { challengeId: bigint; count: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateChallengeProgress(challengeId, count);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["challenges"] }),
  });
}

export function useGetAchievements() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerAchievements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBodyMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bodyMetrics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerBodyMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBodyMetric() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (metric: BodyMetric) => {
      if (!actor) throw new Error("Not connected");
      return actor.addBodyMetric(metric);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bodyMetrics"] }),
  });
}

export function useGetActivityFeed() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activityFeed"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivityFeed();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useGetAllUserProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFollowUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      principal: import("@icp-sdk/core/principal").Principal,
    ) => {
      if (!actor) throw new Error("Not connected");
      return actor.followUser(principal);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

export function useUnfollowUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      principal: import("@icp-sdk/core/principal").Principal,
    ) => {
      if (!actor) throw new Error("Not connected");
      return actor.unfollowUser(principal);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allUsers"] }),
  });
}

export function useGetConversation(
  otherUser: import("@icp-sdk/core/principal").Principal | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["conversation", otherUser?.toString()],
    queryFn: async () => {
      if (!actor || !otherUser) return [];
      return actor.getConversation(otherUser);
    },
    enabled: !!actor && !isFetching && !!otherUser,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      receiverId,
      content,
    }: {
      receiverId: import("@icp-sdk/core/principal").Principal;
      content: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(receiverId, content);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["conversation", vars.receiverId.toString()],
      }),
  });
}

export function useGetAdminUserList() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminUserList();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReportedContent() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reportedContent"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReportedContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      username: string;
      goal: string;
      level: bigint;
      xp: bigint;
      streak: bigint;
      picBlob: import("../backend").ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCallerProfile(
        params.username,
        params.goal,
        params.level,
        params.xp,
        params.streak,
        params.picBlob,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useBanUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      principal: import("@icp-sdk/core/principal").Principal,
    ) => {
      if (!actor) throw new Error("Not connected");
      return actor.banUser(principal);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminUsers"] }),
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (exercise: Exercise) => {
      if (!actor) throw new Error("Not connected");
      return actor.addExercise(exercise);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useDeleteExercise() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteExercise(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exercises"] }),
  });
}

export function useCreateChallenge() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (challenge: Challenge) => {
      if (!actor) throw new Error("Not connected");
      return actor.createChallenge(challenge);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["challenges"] }),
  });
}

export function useDeleteChallenge() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteChallenge(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["challenges"] }),
  });
}

export function useModerateContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reportId,
      action,
    }: { reportId: bigint; action: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.moderateContent(reportId, action);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reportedContent"] }),
  });
}

// ── Notifications ──────────────────────────────────────────────
export function useGetNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUnreadCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getUnreadNotificationCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markNotificationAsRead(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.markAllNotificationsRead();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useGetNotificationPrefs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notificationPrefs"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerNotificationPreferences();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveNotificationPrefs() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (prefs: NotificationPreferences) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerNotificationPreferences(prefs);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notificationPrefs"] }),
  });
}

// ── Wellness ───────────────────────────────────────────────────
export function useGetWellnessLogs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["wellnessLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerWellnessLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddWellnessLog() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (log: WellnessLog) => {
      if (!actor) throw new Error("Not connected");
      return actor.addWellnessLog(log);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wellnessLogs"] }),
  });
}

// ── Theme ──────────────────────────────────────────────────────
export function useUpdateTheme() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (theme: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateActiveTheme(theme);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
