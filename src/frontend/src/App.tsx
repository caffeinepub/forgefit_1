import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminPage from "./pages/AdminPage";
import ChallengesPage from "./pages/ChallengesPage";
import CommunityPage from "./pages/CommunityPage";
import DashboardPage from "./pages/DashboardPage";
import ExerciseDetailPage from "./pages/ExerciseDetailPage";
import ExercisesPage from "./pages/ExercisesPage";
import GamesPage from "./pages/GamesPage";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LoginPage from "./pages/LoginPage";
import MessagesPage from "./pages/MessagesPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import SafetyPage from "./pages/SafetyPage";
import TermsPage from "./pages/TermsPage";
import ToolsPage from "./pages/ToolsPage";
import WellnessPage from "./pages/WellnessPage";

function RootLayout() {
  return (
    <ThemeProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#0a0a0f" }}
      >
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(10,10,20,0.95)",
              border: "1px solid rgba(0,212,255,0.3)",
              color: "#e0e0e0",
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
const exercisesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exercises",
  component: ExercisesPage,
});
const exerciseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exercises/$exerciseId",
  component: ExerciseDetailPage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});
const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: LeaderboardPage,
});
const challengesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/challenges",
  component: ChallengesPage,
});
const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: CommunityPage,
});
const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: MessagesPage,
});
const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tools",
  component: ToolsPage,
});
const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games",
  component: GamesPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});
const safetyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/safety",
  component: SafetyPage,
});
const wellnessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wellness",
  component: WellnessPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  exercisesRoute,
  exerciseDetailRoute,
  profileRoute,
  leaderboardRoute,
  challengesRoute,
  communityRoute,
  messagesRoute,
  toolsRoute,
  gamesRoute,
  adminRoute,
  privacyRoute,
  termsRoute,
  safetyRoute,
  wellnessRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
