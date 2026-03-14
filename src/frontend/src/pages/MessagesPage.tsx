import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Principal } from "@icp-sdk/core/principal";
import { Flag, MoreVertical, Send, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import NeonLoader from "../components/NeonLoader";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllUserProfiles,
  useGetConversation,
  useSendMessage,
} from "../hooks/useQueries";
import { formatRelativeTime } from "../lib/forgefit";

export default function MessagesPage() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { data: users = [] } = useGetAllUserProfiles();
  const [selectedUser, setSelectedUser] = useState<{
    username: string;
    principal: Principal;
  } | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useGetConversation(
    selectedUser?.principal ?? null,
  );
  const sendMessage = useSendMessage();

  const myPrincipal = identity?.getPrincipal().toString();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      await sendMessage.mutateAsync({
        receiverId: selectedUser.principal,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleBlock = async () => {
    if (!actor || !selectedUser) return;
    try {
      await actor.blockUser(selectedUser.principal);
      toast.success("User blocked");
    } catch {
      toast.error("Failed to block user");
    }
  };

  const handleReport = async () => {
    if (!actor || !selectedUser) return;
    try {
      await actor.reportUser(selectedUser.principal, "Reported via messages");
      toast.success("User reported");
    } catch {
      toast.error("Failed to report user");
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-0 flex" style={{ height: "100vh" }}>
      {/* Conversation List */}
      <div
        className="w-72 flex-shrink-0 border-r border-white/10 flex flex-col"
        style={{ background: "rgba(255,255,255,0.02)" }}
        data-ocid="messages.conversation_list"
      >
        <div className="p-4 border-b border-white/10">
          <h2 className="font-orbitron font-bold text-white text-sm">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.slice(0, 20).map((user) => (
            <button
              type="button"
              key={user.username}
              onClick={() =>
                setSelectedUser({
                  username: user.username,
                  principal: null as any, // would need principal from backend
                })
              }
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${
                selectedUser?.username === user.username
                  ? "bg-white/[0.07]"
                  : ""
              }`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  color: "#00d4ff",
                }}
              >
                {user.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user.username}
                </p>
                <p className="text-gray-500 text-xs">Lv.{Number(user.level)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div
              className="px-6 py-4 border-b border-white/10 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "#00d4ff",
                  }}
                >
                  {selectedUser.username[0]?.toUpperCase()}
                </div>
                <span className="text-white font-medium">
                  {selectedUser.username}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  data-ocid="messages.dropdown_menu"
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <MoreVertical className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0a0a1a] border-white/20">
                  <DropdownMenuItem
                    onClick={handleBlock}
                    className="text-gray-300 focus:bg-white/10 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 mr-2" /> Block User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleReport}
                    className="text-red-400 focus:bg-white/10 cursor-pointer"
                  >
                    <Flag className="w-4 h-4 mr-2" /> Report User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <NeonLoader />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No messages yet. Say hello!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId.toString() === myPrincipal;
                  return (
                    <div
                      key={msg.timestamp.toString()}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                          isMe ? "rounded-tr-sm" : "rounded-tl-sm"
                        }`}
                        style={
                          isMe
                            ? {
                                background: "rgba(0,212,255,0.2)",
                                border: "1px solid rgba(0,212,255,0.4)",
                                color: "#e0e0e0",
                              }
                            : {
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#d0d0d0",
                              }
                        }
                      >
                        <p>{msg.content}</p>
                        <p className="text-xs opacity-50 mt-1">
                          {formatRelativeTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/10 flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                data-ocid="messages.input"
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={sendMessage.isPending || !newMessage.trim()}
                data-ocid="messages.send_button"
                className="btn-neon-blue px-4 py-2 rounded-xl"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-400">Select a user to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
