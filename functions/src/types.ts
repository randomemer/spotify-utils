export interface FriendReqDocument {
  sender: string;
  recipient: string;
  status: "pending" | "accepted";
  created_at: number;
  updated_at: number;
}

export interface UserDocument {
  username: string;
  display_name: string;
  friends: string[];
  created_at: number;
  picture: string | null;
}
