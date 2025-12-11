
import { User, AuthProvider } from "../types";

declare var google: any;
declare var FB: any;
declare var msal: any;

const GOOGLE_CLIENT_ID = "527655807822-asqnkkplm2tb8ujjqatbhb1ohumo9dp7.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "742514418258244"; 
const MICROSOFT_CLIENT_ID = "ef9bb481-8c43-4bf4-9b04-427a5d848cb2";
// Client secret is not typically used in SPA implicit/PKCE flows, but keeping declaration as requested
const MICROSOFT_CLIENT_SECRET = "a326a3da-28e3-4681-80db-de8205750c54";

/**
 * Simulates an authentication delay for mock providers
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Singleton MSAL Instance
let msalInstance: any = null;
let isMsalInitializing = false;

/**
 * Helper to get or create the MSAL Instance.
 * Compatible with MSAL Browser v2.x (which is loaded in index.html).
 */
const getMsalInstance = async () => {
  if (typeof msal === 'undefined') {
      console.error("MSAL script not loaded.");
      return null;
  }
  if (msalInstance) return msalInstance;

  // Prevent race conditions during async init
  if (isMsalInitializing) {
     while(isMsalInitializing) {
         await delay(100);
     }
     return msalInstance;
  }

  isMsalInitializing = true;

  try {
      // Azure Portal often defaults SPA Redirect URIs to have a trailing slash.
      // We append it here to match that default behavior.
      const redirectUri = window.location.origin + '/';
      
      console.log("====================================");
      console.log("Microsoft Login Debug Info:");
      console.log("Client ID:", MICROSOFT_CLIENT_ID);
      console.log("Redirect URI (Must match Azure Portal exactly):", redirectUri);
      console.log("====================================");

      const msalConfig = {
        auth: {
          clientId: MICROSOFT_CLIENT_ID,
          authority: "https://login.microsoftonline.com/common",
          redirectUri: redirectUri, 
          navigateToLoginRequestUrl: false,
        },
        cache: {
          cacheLocation: "sessionStorage", 
          storeAuthStateInCookie: false, 
        },
        system: {
           // Allow redirect handling in iframe/popup
           allowNativeBroker: false 
        }
      };

      // In MSAL v2, the constructor initializes the instance. 
      // Do NOT call .initialize() (that is for v3+).
      msalInstance = new msal.PublicClientApplication(msalConfig);
      
      return msalInstance;
  } catch (e) {
      console.error("MSAL Initialization Failed:", e);
      return null;
  } finally {
      isMsalInitializing = false;
  }
};

/**
 * Auth Service
 * Handles Real Google Auth with Graceful Fallback, and Mock Apple/Microsoft/Facebook Auth
 */
export const authService = {
  
  /**
   * Initializes Auth Providers (MSAL)
   * Must be called on App mount to handle redirect callbacks in popups
   */
  initialize: async () => {
     await getMsalInstance();
  },

  /**
   * Mock Google Login
   */
  mockLoginGoogle: async (): Promise<User> => {
     await delay(1000);
     const user: User = {
        id: `google_mock_${Math.random().toString(36).substring(7)}`,
        name: 'Nick Nguyen',
        email: 'nick.nguyen@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Nick+Nguyen&background=DB4437&color=fff',
        provider: 'google',
        plan: 'free'
     };
     localStorage.setItem('currentUser', JSON.stringify(user));
     return user;
  },

  mockLoginFacebook: async (): Promise<User> => {
    await delay(1000);
    const mockId = Math.random().toString(36).substring(7);
    const user: User = {
      id: `fb_${mockId}`,
      name: 'Nick Nguyen',
      email: 'nick.nguyen@facebook.com',
      avatar: 'https://ui-avatars.com/api/?name=Nick+Nguyen&background=1877F2&color=fff',
      provider: 'facebook',
      plan: 'free'
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  mockLoginMicrosoft: async (): Promise<User> => {
    await delay(1500);
    const mockId = Math.random().toString(36).substring(7);
    const user: User = {
      id: `ms_${mockId}`,
      name: 'Nick Nguyen',
      email: 'nick.nguyen@outlook.com',
      avatar: 'https://ui-avatars.com/api/?name=Nick+Nguyen&background=00a4ef&color=fff',
      provider: 'microsoft',
      plan: 'free'
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  loginWithGoogle: async (): Promise<User> => {
    return new Promise(async (resolve, reject) => {
      if (typeof google === 'undefined') {
         await delay(500);
         if (typeof google === 'undefined') {
            console.warn("Google GSI script not loaded. Falling back to mock.");
            resolve(authService.mockLoginGoogle());
            return;
         }
      }

      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    'Authorization': `Bearer ${tokenResponse.access_token}`
                  }
                });

                if (!userInfoResponse.ok) {
                  throw new Error('Failed to fetch user info from Google');
                }

                const userInfo = await userInfoResponse.json();

                const user: User = {
                  id: userInfo.sub,
                  name: userInfo.name,
                  email: userInfo.email,
                  avatar: userInfo.picture,
                  provider: 'google',
                  plan: 'free'
                };

                localStorage.setItem('currentUser', JSON.stringify(user));
                resolve(user);

              } catch (err) {
                console.error("Error fetching Google profile:", err);
                resolve(authService.mockLoginGoogle());
              }
            } else {
              resolve(authService.mockLoginGoogle());
            }
          },
          error_callback: (nonOAuthError: any) => {
             console.warn("Google Auth Error. Falling back to mock.", nonOAuthError);
             resolve(authService.mockLoginGoogle());
          }
        });

        client.requestAccessToken({ prompt: 'select_account' });

      } catch (error) {
        console.error("GSI Initialization Error", error);
        resolve(authService.mockLoginGoogle());
      }
    });
  },

  loginWithFacebook: async (): Promise<User> => {
    return new Promise((resolve) => {
      if (window.location.protocol !== 'https:') {
        console.warn("Facebook Login requires HTTPS. Falling back to mock login.");
        resolve(authService.mockLoginFacebook());
        return;
      }

      if (typeof FB === 'undefined') {
        console.warn("Facebook SDK not loaded. Falling back to mock.");
        resolve(authService.mockLoginFacebook());
        return;
      }

      try {
        FB.init({
          appId      : FACEBOOK_APP_ID,
          cookie     : true,
          xfbml      : true,
          version    : 'v18.0'
        });
      } catch (e) {
      }

      FB.login((response: any) => {
        if (response.status === 'connected') {
          FB.api('/me', { fields: 'name,email,picture' }, (profile: any) => {
            if (profile && !profile.error) {
               const user: User = {
                 id: profile.id,
                 name: profile.name,
                 email: profile.email || `${profile.id}@facebook.com`,
                 avatar: profile.picture?.data?.url,
                 provider: 'facebook',
                 plan: 'free'
               };
               localStorage.setItem('currentUser', JSON.stringify(user));
               resolve(user);
            } else {
               resolve(authService.mockLoginFacebook());
            }
          });
        } else {
          console.warn("Facebook Login failed or cancelled. Falling back to mock.");
          resolve(authService.mockLoginFacebook());
        }
      }, { scope: 'public_profile,email' });
    });
  },

  loginWithMicrosoft: async (): Promise<User> => {
    return new Promise(async (resolve) => {
      const instance = await getMsalInstance();
      
      if (!instance) {
        console.warn("MSAL not initialized. Falling back to mock.");
        resolve(authService.mockLoginMicrosoft());
        return;
      }

      try {
        const loginRequest = {
            scopes: ["User.Read"],
            prompt: 'select_account'
        };

        console.log("Starting MSAL Popup Login...");
        const loginResponse = await instance.loginPopup(loginRequest);
        console.log("MSAL Login Success:", loginResponse);

        if (loginResponse && loginResponse.accessToken) {
            const headers = new Headers();
            headers.append("Authorization", `Bearer ${loginResponse.accessToken}`);

            const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
                method: "GET",
                headers: headers
            });

            if (!graphResponse.ok) {
                throw new Error("Failed to fetch user profile from Microsoft Graph");
            }

            const profile = await graphResponse.json();
            console.log("Microsoft Profile:", profile);

            const user: User = {
                id: profile.id,
                name: profile.displayName || "Microsoft User",
                email: profile.mail || profile.userPrincipalName,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || 'MS')}&background=00a4ef&color=fff`,
                provider: 'microsoft',
                plan: 'free'
            };

            localStorage.setItem('currentUser', JSON.stringify(user));
            resolve(user);
        } else {
             throw new Error("No access token received");
        }

      } catch (error: any) {
        console.warn("Microsoft Login failed:", error);
        if (error.message && error.message.includes("redirect_uri")) {
            console.error("!!! URGENT !!! The Redirect URI in Azure Portal does not match.");
            console.error(`Please ensure '${window.location.origin}/' is listed in Azure -> Authentication -> Redirect URIs.`);
        }
        resolve(authService.mockLoginMicrosoft());
      }
    });
  },

  loginWithProvider: async (provider: AuthProvider): Promise<User> => {
    if (provider === 'google') return authService.loginWithGoogle();
    if (provider === 'facebook') return authService.loginWithFacebook();
    if (provider === 'microsoft') return authService.loginWithMicrosoft();
    throw new Error("Invalid provider");
  },

  logout: async (): Promise<void> => {
    const stored = localStorage.getItem('currentUser');
    const user = stored ? JSON.parse(stored) : null;

    try {
        if (user?.provider === 'facebook' && typeof FB !== 'undefined') {
            try {
                const response = await new Promise<any>(resolve => FB.getLoginStatus(resolve));
                if (response.status === 'connected') {
                     await new Promise<void>(resolve => {
                         const timeout = setTimeout(resolve, 1000);
                         FB.logout(() => {
                             clearTimeout(timeout);
                             resolve();
                         });
                     });
                }
            } catch(e) {
                console.warn("Facebook logout failed:", e);
            }
        }
        
        if (user?.provider === 'microsoft') {
             const instance = await getMsalInstance();
             if (instance) {
                 const accounts = instance.getAllAccounts();
                 if (accounts.length > 0) {
                     instance.setActiveAccount(null);
                 }
             }
        }

    } catch (error) {
        console.error("Logout error (non-fatal):", error);
    } finally {
        localStorage.removeItem('currentUser');
    }
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }
};
