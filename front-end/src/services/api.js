import axios from 'axios';

const API_BASE_URLS = {
  usuarios: 'https://fpbycte831.execute-api.us-east-1.amazonaws.com/dev/usuarios',
  servicos: 'https://rg2v5ly9wg.execute-api.us-east-1.amazonaws.com/dev/servicos',
  pets: 'https://cnhl5678t4.execute-api.us-east-1.amazonaws.com/dev/pets',
  clientes: 'https://8lfzduzzo3.execute-api.us-east-1.amazonaws.com/dev/clientes',
  agendamentos: 'abc', // WIP
};

const api = axios.create({
  baseURL: '',
});

// Interceptor para adicionar headers de autenticação se necessário
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data || '');
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

export const getUsers = async () => {
  console.log('Attempting to fetch users from API...');
  try {
    const response = await axios.get(API_BASE_URLS.usuarios);
    console.log('Users fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  console.log('Attempting to login user:', email);
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (user && user.senha === password) {
      console.log('Login successful for user:', user.nome);
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipoUsuario: user.tipoUsuario,
      }));
      return { success: true, user: { nome: user.nome, tipoUsuario: user.tipoUsuario } };
    } else {
      console.warn('Login failed: Invalid credentials for user:', email);
      return { success: false, message: 'Credenciais inválidas. Tente novamente.' };
    }
  } catch (error) {
    console.error('Error during login simulation:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Service API Calls
export const getServices = async () => {
  console.log('Attempting to fetch services from API...');
  try {
    const response = await axios.get(API_BASE_URLS.servicos);
    console.log('Services fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createService = async (serviceData) => {
  console.log('Attempting to create service:', serviceData);
  try {
    const response = await axios.post(API_BASE_URLS.servicos, serviceData);
    console.log('Service created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getServiceById = async (id) => {
  console.log('Attempting to fetch service by ID:', id);
  try {
    const response = await axios.get(`${API_BASE_URLS.servicos}/${id}`);
    console.log('Service fetched successfully by ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching service by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  console.log('Attempting to update service:', id, serviceData);
  try {
    const response = await axios.put(`${API_BASE_URLS.servicos}/${id}`, serviceData);
    console.log('Service updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteService = async (id) => {
  console.log('Attempting to delete service with ID:', id);
  try {
    const response = await axios.delete(`${API_BASE_URLS.servicos}/${id}`);
    console.log('Service deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// User (Employee) API Calls
export const createUser = async (userData) => {
  console.log('Attempting to create user (employee):', userData);
  try {
    const response = await axios.post(API_BASE_URLS.usuarios, userData);
    console.log('User (employee) created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user (employee):', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserById = async (id) => {
  console.log('Attempting to fetch user by ID:', id);
  try {
    const response = await axios.get(`${API_BASE_URLS.usuarios}/${id}`);
    console.log('User fetched successfully by ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  console.log('Attempting to update user:', id, userData);
  try {
    const response = await axios.put(`${API_BASE_URLS.usuarios}/${id}`, userData);
    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  console.log('Attempting to delete user with ID:', id);
  try {
    const response = await axios.delete(`${API_BASE_URLS.usuarios}/${id}`);
    console.log('User deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Client API Calls (Placeholders - API not yet implemented)
export const getClients = async () => {
  console.log('API: Attempting to fetch clients (placeholder)...');
  return []; // Return empty array for now
};

export const createClient = async (clientData) => {
  console.log('API: Attempting to create client (placeholder):', clientData);
  try {
    // Simulate API call and response
    const mockResponse = { id: 'mock-client-id-' + Math.random().toString(36).substring(7), ...clientData };
    console.log('API: Mock Client created successfully:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error('API: Error creating client (placeholder):', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getClientById = async (id) => {
  console.log('API: Attempting to fetch client by ID (placeholder):', id);
  // Return a mock client if needed for testing edit forms
  return { id, nome: 'Mock Client', telefone: '11999999999', email: 'mock@example.com', endereco: 'Rua Mock, 123' };
};

export const updateClient = async (id, clientData) => {
  console.log('API: Attempting to update client (placeholder):', id, clientData);
  return { id, ...clientData }; // Mock response
};

export const deleteClient = async (id) => {
  console.log('API: Attempting to delete client (placeholder):', id);
  return {}; // Mock response
};

// Pet API Calls
export const getPetsByClientId = async (clientId) => {
  console.log('API: Attempting to fetch pets for client ID:', clientId);
  // Mock data for pets by client
  if (clientId === 'mock-client-id-abc') { // Example for a specific client
    return [
      { id: 'pet1', nome: 'Rex', idade: 5, raca: 'Golden Retriever', clienteId: clientId },
      { id: 'pet2', nome: 'Mia', idade: 2, raca: 'Siamese', clienteId: clientId },
    ];
  }
  console.log('API: No pets found for client ID:', clientId);
  return [];
};

export const createPet = async (petData) => {
  console.log('API: Attempting to create pet:', petData);
  return { id: 'mock-pet-id-' + Math.random().toString(36).substring(7), ...petData };
};

export const getPetById = async (id) => {
  console.log('API: Attempting to fetch pet by ID:', id);
  // Example mock pet
  return { id, nome: 'Mock Pet', idade: 3, raca: 'Mixed', clienteId: 'mock-client-id' };
};

export const updatePet = async (id, petData) => {
  console.log('API: Attempting to update pet:', id, petData);
  return { id, ...petData };
};

export const deletePet = async (id) => {
  console.log('API: Attempting to delete pet:', id);
  return {};
};

// Appointment API Calls (Placeholders - API not yet provided)
export const getAppointments = async (filters = {}) => {
  console.log('API: Attempting to fetch appointments (placeholder) with filters:', filters);
  return []; // Mock response
};

export const createAppointment = async (appointmentData) => {
  console.log('API: Attempting to create appointment (placeholder):', appointmentData);
  return { id: 'mock-appt-id-' + Math.random().toString(36).substring(7), ...appointmentData };
};

export const getAppointmentById = async (id) => {
  console.log('API: Attempting to fetch appointment by ID (placeholder):', id);
  return null; // Mock response
};

export const updateAppointment = async (id, appointmentData) => {
  console.log('API: Attempting to update appointment (placeholder):', id, appointmentData);
  return { id, ...appointmentData };
};

export const cancelAppointment = async (id) => {
  console.log('API: Attempting to cancel appointment (placeholder):', id);
  return {}; // Mock response
};

export default api;
