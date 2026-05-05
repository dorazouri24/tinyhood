import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { mockProfiles } from "./data/mockProfiles";
import type {
  AppNotification,
  Connection,
  Conversation,
  Message,
  Profile,
} from "./types";

const STORAGE_KEY = "parents-app-state-v1";
const ME_ID = "me";

interface State {
  me: Profile | null;
  onboardingComplete: boolean;
  profiles: Profile[];
  connections: Connection[];
  conversations: Conversation[];
  messages: Message[];
  notifications: AppNotification[];
}

type Action =
  | { type: "HYDRATE"; state: State }
  | { type: "LOGIN"; phone: string }
  | { type: "LOGOUT" }
  | { type: "COMPLETE_ONBOARDING"; profile: Profile }
  | { type: "UPDATE_ME"; patch: Partial<Profile> }
  | { type: "SEND_REQUEST"; toUserId: string; message: string }
  | { type: "ACCEPT_REQUEST"; connectionId: string }
  | { type: "DECLINE_REQUEST"; connectionId: string }
  | { type: "SEND_MESSAGE"; conversationId: string; content: string }
  | { type: "MARK_CONVERSATION_READ"; conversationId: string }
  | { type: "MARK_NOTIFICATIONS_READ" }
  | { type: "SEED_INCOMING_DEMO" };

const initialState: State = {
  me: null,
  onboardingComplete: false,
  profiles: mockProfiles,
  connections: [],
  conversations: [],
  messages: [],
  notifications: [],
};

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "LOGIN": {
      if (state.me) return state;
      const draft: Profile = {
        id: ME_ID,
        name: "",
        age: 0,
        neighborhood: "",
        kidsAges: [],
        interests: [],
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          action.phone
        )}`,
      };
      return { ...state, me: draft, onboardingComplete: false };
    }

    case "LOGOUT":
      return { ...initialState };

    case "COMPLETE_ONBOARDING":
      return { ...state, me: action.profile, onboardingComplete: true };

    case "UPDATE_ME":
      if (!state.me) return state;
      return { ...state, me: { ...state.me, ...action.patch } };

    case "SEND_REQUEST": {
      if (!state.me) return state;
      const exists = state.connections.find(
        (c) =>
          c.fromUserId === state.me!.id &&
          c.toUserId === action.toUserId &&
          c.status !== "declined"
      );
      if (exists) return state;
      const conn: Connection = {
        id: uid("c"),
        fromUserId: state.me.id,
        toUserId: action.toUserId,
        status: "pending",
        message: action.message,
        createdAt: Date.now(),
      };
      return { ...state, connections: [conn, ...state.connections] };
    }

    case "ACCEPT_REQUEST": {
      const conn = state.connections.find((c) => c.id === action.connectionId);
      if (!conn) return state;
      const updated = state.connections.map((c) =>
        c.id === conn.id ? { ...c, status: "accepted" as const } : c
      );
      const participantIds: [string, string] = [conn.fromUserId, conn.toUserId];
      const existingConv = state.conversations.find(
        (cv) =>
          cv.participantIds.includes(participantIds[0]) &&
          cv.participantIds.includes(participantIds[1])
      );
      const conv: Conversation =
        existingConv ?? {
          id: uid("cv"),
          participantIds,
          lastMessageAt: Date.now(),
        };
      const initialMsg: Message = {
        id: uid("m"),
        conversationId: conv.id,
        senderId: conn.fromUserId,
        content: conn.message,
        createdAt: conn.createdAt,
        read: false,
      };
      const otherProfile = state.profiles.find((p) => p.id === conn.fromUserId);
      const note: AppNotification = {
        id: uid("n"),
        kind: "accepted",
        title: "החיבור התקבל",
        body: otherProfile
          ? `${otherProfile.name} מחכה לשיחה איתך`
          : "מישהו מחכה לשיחה איתך",
        createdAt: Date.now(),
        read: false,
      };
      return {
        ...state,
        connections: updated,
        conversations: existingConv
          ? state.conversations
          : [conv, ...state.conversations],
        messages: existingConv ? state.messages : [initialMsg, ...state.messages],
        notifications: [note, ...state.notifications],
      };
    }

    case "DECLINE_REQUEST": {
      const updated = state.connections.map((c) =>
        c.id === action.connectionId
          ? { ...c, status: "declined" as const }
          : c
      );
      return { ...state, connections: updated };
    }

    case "SEND_MESSAGE": {
      if (!state.me) return state;
      const conv = state.conversations.find(
        (c) => c.id === action.conversationId
      );
      if (!conv) return state;
      const msg: Message = {
        id: uid("m"),
        conversationId: action.conversationId,
        senderId: state.me.id,
        content: action.content,
        createdAt: Date.now(),
        read: true,
      };
      const updatedConvs = state.conversations.map((c) =>
        c.id === conv.id ? { ...c, lastMessageAt: msg.createdAt } : c
      );
      return {
        ...state,
        messages: [...state.messages, msg],
        conversations: updatedConvs,
      };
    }

    case "MARK_CONVERSATION_READ": {
      const updated = state.messages.map((m) =>
        m.conversationId === action.conversationId && m.senderId !== ME_ID
          ? { ...m, read: true }
          : m
      );
      return { ...state, messages: updated };
    }

    case "MARK_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case "SEED_INCOMING_DEMO": {
      if (!state.me) return state;
      const fromProfile = state.profiles.find((p) => p.id === "u3");
      if (!fromProfile) return state;
      const already = state.connections.find(
        (c) => c.fromUserId === fromProfile.id && c.toUserId === state.me!.id
      );
      if (already) return state;
      const conn: Connection = {
        id: uid("c"),
        fromUserId: fromProfile.id,
        toUserId: state.me.id,
        status: "pending",
        message:
          "היי! ראיתי שיש לנו ילדים בגיל דומה ושנינו אוהבות אומנות. בא לך לקבוע מפגש משותף בפארק?",
        createdAt: Date.now() - 1000 * 60 * 60 * 3,
      };
      const note: AppNotification = {
        id: uid("n"),
        kind: "request",
        title: "בקשת חיבור חדשה",
        body: `${fromProfile.name} שלחה לך בקשה`,
        createdAt: conn.createdAt,
        read: false,
      };
      return {
        ...state,
        connections: [conn, ...state.connections],
        notifications: [note, ...state.notifications],
      };
    }

    default:
      return state;
  }
}

interface StoreContextValue {
  state: State;
  login: (phone: string) => void;
  logout: () => void;
  completeOnboarding: (profile: Profile) => void;
  updateMe: (patch: Partial<Profile>) => void;
  sendRequest: (toUserId: string, message: string) => void;
  acceptRequest: (connectionId: string) => void;
  declineRequest: (connectionId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markConversationRead: (conversationId: string) => void;
  markNotificationsRead: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return init;
      const parsed = JSON.parse(raw) as State;
      return { ...init, ...parsed };
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota errors */
    }
  }, [state]);

  useEffect(() => {
    if (state.me && state.onboardingComplete && state.connections.length === 0) {
      dispatch({ type: "SEED_INCOMING_DEMO" });
    }
  }, [state.me, state.onboardingComplete, state.connections.length]);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      login: (phone) => dispatch({ type: "LOGIN", phone }),
      logout: () => dispatch({ type: "LOGOUT" }),
      completeOnboarding: (profile) =>
        dispatch({ type: "COMPLETE_ONBOARDING", profile }),
      updateMe: (patch) => dispatch({ type: "UPDATE_ME", patch }),
      sendRequest: (toUserId, message) =>
        dispatch({ type: "SEND_REQUEST", toUserId, message }),
      acceptRequest: (connectionId) =>
        dispatch({ type: "ACCEPT_REQUEST", connectionId }),
      declineRequest: (connectionId) =>
        dispatch({ type: "DECLINE_REQUEST", connectionId }),
      sendMessage: (conversationId, content) =>
        dispatch({ type: "SEND_MESSAGE", conversationId, content }),
      markConversationRead: (conversationId) =>
        dispatch({ type: "MARK_CONVERSATION_READ", conversationId }),
      markNotificationsRead: () => dispatch({ type: "MARK_NOTIFICATIONS_READ" }),
    }),
    [state]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const useMe = () => useStore().state.me;

export function useUnreadCounts() {
  const { state } = useStore();
  const incoming = state.connections.filter(
    (c) => c.toUserId === "me" && c.status === "pending"
  ).length;
  const unreadMessages = state.messages.filter(
    (m) => m.senderId !== "me" && !m.read
  ).length;
  const unreadNotifications = state.notifications.filter((n) => !n.read).length;
  return { incoming, unreadMessages, unreadNotifications };
}

export const ME = ME_ID;
