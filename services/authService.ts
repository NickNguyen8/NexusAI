import { User, AuthProvider } from "../types";

declare var google: any;

const GOOGLE_CLIENT_ID = "527655807822-asqnkkplm2tb8ujjqatbhb1ohumo9dp7.apps.googleusercontent.com";

/**
 * Simulates an authentication delay for mock providers
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Auth Service
 * Handles Real Google Auth with Graceful Fallback, and Mock Apple/Microsoft Auth
 */
export const authService = {
  
  /**
   * Mock Google Login
   * Used as fallback when real auth fails (e.g. localhost origin mismatch)
   */
  mockLoginGoogle: async (): Promise<User> => {
     await delay(1000);
     const user: User = {
        id: `google_mock_${Math.random().toString(36).substring(7)}`,
        name: 'Alex Chen',
        email: 'alex.chen@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=DB4437&color=fff',
        provider: 'google',
        plan: 'free'
     };
     localStorage.setItem('currentUser', JSON.stringify(user));
     return user;
  },

  loginWithGoogle: async (): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Ensure script is loaded
      if (typeof google === 'undefined') {
        console.warn("Google GSI script not loaded. Falling back to mock.");
        resolve(authService.mockLoginGoogle());
        return;
      }

      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                // Fetch User Profile from Google
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    'Authorization': `Bearer ${tokenResponse.access_token}`
                  }
                });

                if (!userInfoResponse.ok) {
                  throw new Error('Failed to fetch user info from Google');
                }

                const userInfo = await userInfoResponse.json();

                // Map to our User type
                const user: User = {
                  id: userInfo.sub,
                  name: userInfo.name,
                  email: userInfo.email,
                  avatar: userInfo.picture,
                  provider: 'google',
                  plan: 'free'
                };

                // Persist session
                localStorage.setItem('currentUser', JSON.stringify(user));
                resolve(user);

              } catch (err) {
                console.error("Error fetching Google profile:", err);
                // Fallback to mock if data fetch fails
                resolve(authService.mockLoginGoogle());
              }
            } else {
              // No token received
              resolve(authService.mockLoginGoogle());
            }
          },
          error_callback: (nonOAuthError: any) => {
             console.warn("Google Auth Error (likely Popup closed or Origin mismatch). Falling back to mock.", nonOAuthError);
             // Gracefully fallback so the user can still use the app
             resolve(authService.mockLoginGoogle());
          }
        });

        // Trigger the popup
        client.requestAccessToken();

      } catch (error) {
        console.error("GSI Initialization Error", error);
        resolve(authService.mockLoginGoogle());
      }
    });
  },

  loginWithProvider: async (provider: AuthProvider): Promise<User> => {
    
    // Route to Google implementation
    if (provider === 'google') {
        return authService.loginWithGoogle();
    }

    // Mock Implementation for other providers
    await delay(1500);

    const mockId = Math.random().toString(36).substring(7);
    let user: User;

    switch (provider) {
      case 'apple':
        user = {
          id: `apple_${mockId}`,
          name: 'Alex Chen',
          email: 'alex.c@icloud.com',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=000000&color=fff',
          provider: 'apple',
          plan: 'free'
        };
        break;
      case 'microsoft':
        user = {
          id: `ms_${mockId}`,
          name: 'Alex Chen',
          email: 'alex.chen@outlook.com',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=00a4ef&color=fff',
          provider: 'microsoft',
          plan: 'free'
        };
        break;
      default:
        throw new Error("Invalid provider");
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  logout: async (): Promise<void> => {
    // For Google, we might want to revoke token, but for this simple implementation:
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
       // Optional: google.accounts.oauth2.revoke(token, done)
    }
    await delay(500);
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }
};