export {};

declare global {
  interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  }

  interface RefreshedAccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
  }

  interface UserSession {}

  interface AuthToken {
    access_token: string;
    expiry: number;
  }

  interface AuthState {
    token: AuthToken | null;
  }

  type LoginResp =
    | {
        status: "redirect";
        url: string;
      }
    | {
        status: "success";
        payload: {
          access_token: string;
          expiry: number;
        };
      };
}
