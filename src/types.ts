export type Interest =
  | "ספורט"
  | "טבע וטיולים"
  | "בישול"
  | "אומנות"
  | "מוזיקה"
  | "ספרים"
  | "משחקי קופסה"
  | "טכנולוגיה"
  | "יוגה"
  | "ריצה"
  | "הורות מודעת"
  | "התנדבות";

export interface Profile {
  id: string;
  name: string;
  age: number;
  neighborhood: string;
  kidsAges: number[];
  interests: Interest[];
  photo: string;
  bio?: string;
  distanceKm?: number;
}

export type ConnectionStatus = "pending" | "accepted" | "declined";

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: ConnectionStatus;
  message: string;
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: [string, string];
  lastMessageAt: number;
}

export interface AppNotification {
  id: string;
  kind: "request" | "accepted" | "message";
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
}
