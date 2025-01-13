export const signOut = (setUser) => {
    // Remove tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  
    // Clear user context
    setUser(null);
  
    // Redirect to login
    window.location.href = '/login';
  };
  