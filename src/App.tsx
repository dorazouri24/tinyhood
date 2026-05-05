import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/Layout";
import Chat from "./screens/Chat";
import Feed from "./screens/Feed";
import Inbox from "./screens/Inbox";
import Login from "./screens/Login";
import Me from "./screens/Me";
import Notifications from "./screens/Notifications";
import Onboarding from "./screens/Onboarding";
import ProfileView from "./screens/ProfileView";
import SendRequest from "./screens/SendRequest";
import Welcome from "./screens/Welcome";
import { useStore } from "./store";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  if (!state.me) return <Navigate to="/" replace />;
  if (!state.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  if (state.me && state.onboardingComplete)
    return <Navigate to="/feed" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnly>
              <Welcome />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/feed" element={<Feed />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/me" element={<Me />} />
          <Route path="/profile/:id" element={<ProfileView />} />
          <Route path="/request/:id" element={<SendRequest />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
