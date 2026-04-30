// API service for communicating with the secure backend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.vercel.app' 
  : 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from Firebase
  async getAuthToken() {
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  // Make authenticated API requests
  async makeAuthenticatedRequest(endpoint, options = {}) {
    const token = await this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Chat API
  async sendMessage(message, history = []) {
    try {
      const response = await this.makeAuthenticatedRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          history,
        }),
      });
      
      return response;
    } catch (error) {
      console.error('Chat API error:', error);
      // Return fallback response
      return {
        reply: 'ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ',
        status: 'error',
        error: error.message
      };
    }
  }

  // User profile API
  async getUserProfile() {
    try {
      return await this.makeAuthenticatedRequest('/api/user/profile');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // User settings API
  async updateUserSettings(settings) {
    try {
      return await this.makeAuthenticatedRequest('/api/user/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      });
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  // Saved prompts API
  async savePrompt(promptData) {
    try {
      return await this.makeAuthenticatedRequest('/api/user/save-prompt', {
        method: 'POST',
        body: JSON.stringify(promptData),
      });
    } catch (error) {
      console.error('Save prompt error:', error);
      throw error;
    }
  }

  async getSavedPrompts() {
    try {
      return await this.makeAuthenticatedRequest('/api/user/saved-prompts');
    } catch (error) {
      console.error('Get saved prompts error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
