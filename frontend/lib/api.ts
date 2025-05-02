import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

//
type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  credentials?: 'include' | 'omit';
};

export async function fetchFromBackend(
  path: string,
  options: RequestOptions = {}
) {
  const proxyUrl = `/api/proxy/${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  try {
    const response = await fetch(proxyUrl, {
      method: options.method || 'GET',
      headers,
      credentials: options.credentials || 'include',
      ...(options.body && { body: JSON.stringify(options.body) })
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}//

// Auth APIs
export const authApi = {
  login: (data: { email: string; password: string; role?: string; is_manager?: boolean; is_chief?: boolean }) => 
    axios.post(`${API_BASE_URL}/users/login/`, data),
};

// Notification APIs
export const notificationApi = {
  getNotifications: (token: string) => 
    axios.get(`${API_BASE_URL}/users/notifications/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  deleteNotification: (data: { id: string }, token: string) => 
    axios.delete(`${API_BASE_URL}/users/notifications/`, {
      params: data,
      headers: { Authorization: `Token ${token}` }
    }),

  getNotificationsCount: (token: string) => 
    axios.get(`${API_BASE_URL}/users/notifications_count/`, {
      headers: { Authorization: `Token ${token}` }
    }),
};

// User Management APIs
export const userManagementApi = {
  manageUser: {
    delete: (data: { id: string }, token: string) =>
      axios.delete(`${API_BASE_URL}/users/manage_user/`, {
        params: data, // Send the ID as a query parameter
        headers: { Authorization: `Token ${token}` },
      }),
    create: (data: {
      username: string;
      first_name: string;
      last_name: string;
      birth_date?: string;
      gender?: string;
      job?: string;
      phone?: string;
      address?: string;
      start_date?: string;
    }, token: string) => 
      axios.post(`${API_BASE_URL}/users/manage_user/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    getAll: (token: string) => 
      axios.get(`${API_BASE_URL}/users/manage_user/`, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    update: (data: {
      email?: string;
      password?: string;
      first_name?: string;
      last_name?: string;
      birth_date?: string;
      gender?: string;
      job?: string;
      phone?: string;
      address?: string;
      start_date?: string;
    }, token: string) => 
      axios.put(`${API_BASE_URL}/users/manage_user/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
  },
  
  freezeUser: {
    freeze: (data: { id: string }, token: string) => 
      axios.post(`${API_BASE_URL}/users/freeze_user/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    unfreeze: (data: { id: string }, token: string) =>
        axios.delete(`${API_BASE_URL}/users/freeze_user/`, {
          params: data, // Send the ID as a query parameter
          headers: { Authorization: `Token ${token}` },
        }),
        
  },
  
  changeTeam: (data: { id: string; team: string }, token: string) => 
    axios.post(`${API_BASE_URL}/users/change_team/`, data, {
      headers: { Authorization: `Token ${token}` }
    }),
};

// Team Management APIs
export const teamManagementApi = {
  manageTeam: {
    create: (data: { name: string; description?: string }, token: string) => 
      axios.post(`${API_BASE_URL}/users/manage_team/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    getAll: (token: string) => 
      axios.get(`${API_BASE_URL}/users/manage_team/`, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    delete: (data: { id: string }, token: string) => 
      axios.delete(`${API_BASE_URL}/users/manage_team/`, {
        params: data,
        headers: { Authorization: `Token ${token}` }
      }),
    
    update: (data: { name?: string; description?: string }, token: string) => 
      axios.put(`${API_BASE_URL}/users/manage_team/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),

  
  },
};

// Profile APIs
export const profileApi = {
  getMyProfile: (token: string) => 
    axios.get(`${API_BASE_URL}/users/my_profile/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  getProfileById: (id: string, token: string) => 
    axios.get(`${API_BASE_URL}/users/my_profile/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  getOthersProfile: (id: string, token: string) => 
    axios.get(`${API_BASE_URL}/users/others_profile/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  changeProfilePicture: (data: FormData, token: string) => 
    axios.post(`${API_BASE_URL}/users/change_profile_picture/`, data, {
      headers: { 
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    }),
  
  getProfilePicture: (id: string, token: string) => 
    axios.get(`${API_BASE_URL}/users/profile_picture/${id}/`, {
      headers: { Authorization: `Token ${token}` },
      responseType: 'blob'
    }),
};

// Planning and Scheduling APIs
export const planningApi = {
  getMyPlanning: (token: string) => 
    axios.get(`${API_BASE_URL}/users/consult_my_planning/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  getMySchedule: (params: { start_date: string; end_date: string; state?: string }, token: string) => 
    axios.get(`${API_BASE_URL}/users/consult_my_schedule/`, {
      params,
      headers: { Authorization: `Token ${token}` }
    }),
  

  
  getOthersPlanning: (id: string, token: string) => 
    axios.get(`${API_BASE_URL}/users/consult_others_planning/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  getOthersSchedule: (id: string, params: { start_date: string; end_date: string; state?: string }, token: string) => 
    axios.get(`${API_BASE_URL}/users/consult_others_schedule/${id}/`, {
      params,
      headers: { Authorization: `Token ${token}` }
    }),
  
  getFilteredSchedule: (params: { start_date: string; end_date: string; state?: string }, token: string) => 
    axios.get(`${API_BASE_URL}/users/consult_filtered_schedule/`, {
      params,
      headers: { Authorization: `Token ${token}` }
    }),
  
  managePlanning: {
    bulkUpdate: (data: {
      create?: Array<{
        day: string;
        start_time: string;
        end_time: string;
        user: string;
      }>;
      delete?: string[];
      modify?: Array<{
        id: string;
        day: string;
        start_time: string;
        end_time: string;
        user: string;
      }>;
    }, token: string) => 
      axios.post(`${API_BASE_URL}/users/manage_planning/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    getAll: (token: string) => 
      axios.get(`${API_BASE_URL}/users/manage_planning/`, {
        headers: { Authorization: `Token ${token}` }
      }),
  },
};

// Demand Message APIs
export const demandMessageApi = {
  createDemand: (data: { title: string; content: string }, token: string) => 
    axios.post(`${API_BASE_URL}/users/demand_message/`, data, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  getMyDemands: (token: string) => 
    axios.get(`${API_BASE_URL}/users/demand_message/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  manageDemand: {
    getAll: (token: string) => 
      axios.get(`${API_BASE_URL}/users/manage_demand_message/`, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    accept: (data: { id: string }, token: string) => 
      axios.post(`${API_BASE_URL}/users/manage_demand_message/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    delete: (data: { id: string }, token: string) => 
      axios.delete(`${API_BASE_URL}/users/manage_demand_message/`, {
        params: data,
        headers: { Authorization: `Token ${token}` }
      }),
  },
};

// Pointing APIs
export const pointingApi = {
  getPointingSettings: (token: string) => 
    axios.get(`${API_BASE_URL}/users/get_pointing_settings/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  getMyPointing: (params: { start_date: string; end_date: string; method?: string }, token: string) => 
      axios.get(`${API_BASE_URL}/users/consult_my_pointing/`, {
        params,
        headers: { Authorization: `Token ${token}` }
      }),
  
  updatePointingSettings: (data: {
    PLATFORM_NAME?: string;
    POINTING_QR_ENABLED?: boolean;
    POINTING_FACE_RECOGNITION_ENABLED?: boolean;
    POINTING_MANUAL_ENABLED?: boolean;
  }, token: string) => 
    axios.post(`${API_BASE_URL}/users/manage_pointing_settings/`, data, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  confirmPointing: {
    confirm: (data: { id: string; schedule: string }, token: string) => 
      axios.post(`${API_BASE_URL}/users/confirm_pointing/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    delete: (data: { id: string }, token: string) => 
      axios.delete(`${API_BASE_URL}/users/confirm_pointing/`, {
        params: data,
        headers: { Authorization: `Token ${token}` }
      }),
  },
  
  pointManually: (data: { id: string }, token: string) => 
    axios.post(`${API_BASE_URL}/users/point_manually/`, data, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  pointQR: (data: { code: string }, token: string) => 
    axios.post(`${API_BASE_URL}/users/point_qr/`, data, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  getQRCode: (token: string) => 
    axios.get(`${API_BASE_URL}/users/get_point_qr/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  pointFace: (data: FormData, token: string) => 
    axios.post(`${API_BASE_URL}/users/point_face/`, data, {
      headers: { 
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    }),
};

// Justification APIs
export const justificationApi = {
  createJustification: (data: { text: string; picture?: File }, token: string) => {
    const formData = new FormData();
    formData.append('text', data.text);
    if (data.picture) formData.append('picture', data.picture);
    
    return axios.post(`${API_BASE_URL}/users/justification/`, formData, {
      headers: { 
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  getMyJustifications: (token: string) => 
    axios.get(`${API_BASE_URL}/users/justification/`, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  manageJustification: {
    getAll: (token: string) => 
      axios.get(`${API_BASE_URL}/users/manage_justification/`, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    process: (data: { id: string; start_date?: string; end_date?: string }, token: string) => 
      axios.post(`${API_BASE_URL}/users/manage_justification/`, data, {
        headers: { Authorization: `Token ${token}` }
      }),
    
    delete: (data: { id: string }, token: string) => 
      axios.delete(`${API_BASE_URL}/users/manage_justification/`, {
        params: data,
        headers: { Authorization: `Token ${token}` }
      }),
  },
  
  getJustificationPicture: (id: string, token: string) => 
    axios.get(`${API_BASE_URL}/users/justification_picture/${id}/`, {
      headers: { Authorization: `Token ${token}` },
      responseType: 'blob'
    }),
};

// System APIs
export const systemApi = {
  checkSystemSanity: (token: string) => 
    axios.post(`${API_BASE_URL}/users/check_system_sanity/`, {}, {
      headers: { Authorization: `Token ${token}` }
    }),
  
  getStatistics: (token: string) => 
    axios.get(`${API_BASE_URL}/users/statistics/`, {
      headers: { Authorization: `Token ${token}` }
    }),
};

// Configure axios defaults
axios.interceptors.request.use(config => {
  // You can add global request interceptors here if needed
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    // You can add global error handling here
    return Promise.reject(error);
  }
);

export default {
  authApi,
  notificationApi,
  userManagementApi,
  teamManagementApi,
  profileApi,
  planningApi,
  demandMessageApi,
  pointingApi,
  justificationApi,
  systemApi,
};