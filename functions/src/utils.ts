export function removeFriend(friends: string[], id: string) {
  return friends.filter((fri) => fri !== id);
}
