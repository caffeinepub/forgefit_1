# FORGEFIT – Version 4: Engagement Upgrade

## Current State
- Full-stack fitness platform with user accounts, exercise library (145 exercises), 110 challenges, XP/leveling, leaderboard, community, messages, tools, games, and admin panel.
- Dark neon glassmorphism UI.
- Dashboard has basic XP bar, body metrics form/chart, streak heatmap, and workout logs chart.
- Navbar has standard nav links and auth buttons.
- Backend stores user profiles, workout logs, body metrics, challenges, achievements, messages.
- No notifications system, no wellness tools section, no unlockable themes, no motivational quotes.

## Requested Changes (Diff)

### Add
- **Notifications system**: `Notification` type in backend with id, userId, type (streak/challenge/friend/levelup), message, timestamp, read flag. CRUD: addNotification, getCallerNotifications, markNotificationRead, markAllRead, getUnreadCount. Notification preferences per user (notif settings map).
- **Wellness data**: `WellnessLog` type for sleep (hours, quality, bedtime, wakeTime) and hydration (glasses). Backend: addWellnessLog, getCallerWellnessLogs.
- **Unlockable themes**: `UserTheme` field on UserProfile (string: "default", "crimson", "voidwalker", "solarapex"). updateCallerTheme function.
- **Motivational quotes**: Static array in backend (optional) or frontend-only daily rotation.
- **Frontend – Bell notification center**: Animated bell icon in Navbar with unread badge. Dropdown panel with gamified notification cards.
- **Frontend – Body silhouette**: SVG silhouette on Dashboard that morphs based on body fat % and weight inputs.
- **Frontend – Neon animated graphs**: Upgraded recharts with glowing stroke filters, animated entry, area fills.
- **Frontend – Confetti/particle bursts**: canvas-confetti on level-up and milestone achievements.
- **Frontend – Daily quote card**: Rotating motivational quote on Dashboard/HomePage.
- **Frontend – Unlockable themes**: Theme context that applies CSS variable overrides at Level 10/25/50. Unlocked themes shown in Profile page.
- **Frontend – Wellness Tools page** (new route `/wellness`): Meditation guide cards, stretching guide cards, sleep tracker (log & chart), hydration tracker (log & progress ring), weekly wellness tips.
- **Frontend – Micro-interactions**: Hover scale, tap feedback, staggered entrance animations on all major cards.
- **Frontend – XP bar glow animation**: Pulsing glow on XP bar fill.

### Modify
- `UserProfile` type: add `activeTheme: Text` field.
- Dashboard: Add silhouette panel, upgrade XP bar with glow pulse, add confetti on level-up.
- Navbar: Add bell icon with notification dropdown.
- App.tsx: Add `/wellness` route. Wrap app in ThemeContext provider.

### Remove
- Nothing removed.

## Implementation Plan
1. Update Motoko backend: add Notification type + CRUD, WellnessLog type + CRUD, add activeTheme to UserProfile, add updateCallerTheme.
2. Frontend ThemeContext: reads profile.activeTheme and applies CSS variable overrides globally.
3. Navbar: add NotificationBell component with animated badge, dropdown list, mark-read actions.
4. DashboardPage: add BodySilhouette SVG component, upgrade XP bar with glow, add canvas-confetti on level-up, add daily quote card.
5. New WellnessPage: sleep tracker, hydration tracker, meditation/stretching guides, weekly tips -- wired to backend wellnessLogs.
6. ProfilePage: add Themes section showing unlocked/locked themes with activate button.
7. Global micro-interactions: motion.div whileHover/whileTap on all cards and buttons.
8. App.tsx: add /wellness route, wrap in ThemeProvider.
