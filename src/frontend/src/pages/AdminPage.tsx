import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ban, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NeonLoader from "../components/NeonLoader";
import TierBadge from "../components/TierBadge";
import { useActor } from "../hooks/useActor";
import {
  useDeleteChallenge,
  useDeleteExercise,
  useGetAdminUserList,
  useGetAllChallenges,
  useGetAllExercises,
  useGetReportedContent,
  useModerateContent,
} from "../hooks/useQueries";

export default function AdminPage() {
  const { actor, isFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isCallerAdmin()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false));
  }, [actor, isFetching]);

  if (isAdmin === null)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NeonLoader size="lg" />
      </div>
    );
  if (isAdmin === false) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl mb-4">🔒</p>
          <h1 className="font-orbitron font-bold text-2xl text-white mb-2">
            Access Denied
          </h1>
          <p className="text-white">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-2">
          Admin <span style={{ color: "#ff006e" }}>Panel</span>
        </h1>
        <p className="text-white">Manage platform content and users</p>
      </div>

      <Tabs defaultValue="exercises">
        <TabsList className="bg-white/5 border border-white/10 mb-8">
          {["exercises", "users", "challenges", "reports"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              data-ocid="admin.tab"
              className="capitalize data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="exercises">
          <ExercisesTab />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="challenges">
          <ChallengesTab />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExercisesTab() {
  const { data: exercises = [], isLoading } = useGetAllExercises();
  const deleteEx = useDeleteExercise();

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <NeonLoader />
      </div>
    );

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <span className="font-exo font-bold text-white">
          {exercises.length} Exercises
        </span>
        <button
          type="button"
          data-ocid="admin.add_button"
          className="btn-neon-blue px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Exercise
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {["Name", "Category", "Tier", "Difficulty", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-white font-medium"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex) => (
              <tr
                key={ex.id.toString()}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3 text-white font-medium">{ex.name}</td>
                <td className="px-4 py-3 text-white capitalize">
                  {ex.category}
                </td>
                <td className="px-4 py-3">
                  <TierBadge tier={ex.tier} />
                </td>
                <td className="px-4 py-3 text-white capitalize">
                  {ex.difficulty}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      deleteEx.mutate(ex.id);
                      toast.success("Exercise deleted");
                    }}
                    data-ocid="admin.delete_button"
                    className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersTab() {
  const { data: users = [], isLoading } = useGetAdminUserList();

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <NeonLoader />
      </div>
    );

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <span className="font-exo font-bold text-white">
          {users.length} Users
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {["Username", "Goal", "Level", "XP", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-white font-medium"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={String(idx)}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 text-white">{u.username}</td>
                <td className="px-4 py-3 text-white">{u.fitnessGoal}</td>
                <td className="px-4 py-3 text-white">{Number(u.level)}</td>
                <td className="px-4 py-3 text-white">
                  {Number(u.xp).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${u.isBanned ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"}`}
                  >
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    data-ocid="admin.ban_button"
                    className="text-orange-400 hover:text-orange-300 p-1.5 rounded hover:bg-orange-400/10 flex items-center gap-1 text-xs"
                  >
                    <Ban className="w-3.5 h-3.5" /> Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChallengesTab() {
  const { data: challenges = [], isLoading } = useGetAllChallenges();
  const deleteCh = useDeleteChallenge();

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <NeonLoader />
      </div>
    );

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <span className="font-exo font-bold text-white">
          {challenges.length} Challenges
        </span>
        <button
          type="button"
          data-ocid="admin.add_button"
          className="btn-neon-blue px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Challenge
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {["Badge", "Name", "Duration", "Reward XP", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-white font-medium"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {challenges.map((ch) => (
              <tr
                key={ch.id.toString()}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 text-2xl">{ch.badgeIcon}</td>
                <td className="px-4 py-3 text-white">{ch.name}</td>
                <td className="px-4 py-3 text-white">
                  {Number(ch.durationDays)}d
                </td>
                <td className="px-4 py-3" style={{ color: "#ff006e" }}>
                  +{Number(ch.rewardXp)} XP
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => {
                      deleteCh.mutate(ch.id);
                      toast.success("Challenge deleted");
                    }}
                    data-ocid="admin.delete_button"
                    className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsTab() {
  const { data: reports = [], isLoading } = useGetReportedContent();
  const moderate = useModerateContent();

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <NeonLoader />
      </div>
    );

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <span className="font-exo font-bold text-white">
          {reports.length} Reports
        </span>
      </div>
      {reports.length === 0 ? (
        <div
          className="p-12 text-center text-white"
          data-ocid="admin.empty_state"
        >
          No reports to review
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {reports.map(([id, reason]) => (
            <div
              key={id.toString()}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-white text-sm">{reason}</p>
                <p className="text-white text-xs mt-0.5">
                  Report #{id.toString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    moderate.mutate({ reportId: id, action: "approve" });
                    toast.success("Approved");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold btn-neon-cyan"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    moderate.mutate({ reportId: id, action: "remove" });
                    toast.success("Removed");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold btn-neon-pink"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
