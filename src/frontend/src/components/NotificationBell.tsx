import { Bell, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Notification } from "../backend.d";
import { NotificationType } from "../backend.d";
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAllRead,
  useMarkNotificationRead,
} from "../hooks/useQueries";

function formatRelTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function notifIcon(type: NotificationType): string {
  switch (type) {
    case NotificationType.streak:
      return "🔥";
    case NotificationType.levelup:
      return "⚡";
    case NotificationType.challenge:
      return "🏆";
    case NotificationType.friendAchievement:
      return "👥";
    default:
      return "🔔";
  }
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: notifications = [] } = useGetNotifications();
  const { data: unreadCount = BigInt(0) } = useGetUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  const count = Number(unreadCount);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const recent = notifications.slice(0, 10);

  return (
    <div ref={ref} className="relative" data-ocid="notifications.panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-ocid="notifications.button"
        className="relative p-2 rounded-lg text-white hover:text-white transition-colors hover:bg-white/5"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center notification-badge-pulse"
            style={{
              background: "var(--theme-accent, #00d4ff)",
              color: "#000",
            }}
          >
            {count > 9 ? "9+" : count}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 mt-2 w-80 glass-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            style={{ boxShadow: "0 0 30px rgba(0,212,255,0.15)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="font-orbitron text-sm font-bold text-white">
                ALERTS
              </span>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllRead.mutate()}
                    data-ocid="notifications.button"
                    className="text-xs text-white hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  data-ocid="notifications.close_button"
                  className="text-white hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {recent.length === 0 ? (
                <div
                  className="py-8 text-center"
                  data-ocid="notifications.empty_state"
                >
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-white text-sm">No alerts yet</p>
                </div>
              ) : (
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-white/5"
                >
                  {recent.map((n: Notification, idx: number) => (
                    <motion.li
                      key={n.id.toString()}
                      variants={itemVariants}
                      data-ocid={`notifications.item.${idx + 1}`}
                      onClick={() => {
                        if (!n.isRead) markRead.mutate(n.id);
                      }}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5 ${
                        !n.isRead ? "bg-white/3" : ""
                      }`}
                    >
                      <span className="text-xl mt-0.5 flex-shrink-0">
                        {notifIcon(n.notificationType)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-snug truncate ${
                            !n.isRead ? "text-white" : "text-white"
                          }`}
                        >
                          {n.message}
                        </p>
                        <p className="text-xs text-white mt-0.5">
                          {formatRelTime(n.timestamp)}
                        </p>
                      </div>
                      {!n.isRead && (
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{
                            background: "var(--theme-accent, #00d4ff)",
                            boxShadow: "0 0 6px var(--theme-accent, #00d4ff)",
                          }}
                        />
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
