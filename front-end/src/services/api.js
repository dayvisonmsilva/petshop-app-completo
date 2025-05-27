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

// Client API Calls
export const getClients = async () => {
  console.log('Attempting to fetch clients from API...');
  try {
    const response = await axios.get(API_BASE_URLS.clientes);
    console.log('Clients fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createClient = async (clientData) => {
  console.log('Attempting to create client:', clientData);
  try {
    const response = await axios.post(API_BASE_URLS.clientes, clientData);
    console.log('Client created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getClientById = async (id) => {
  console.log('Attempting to fetch client by ID:', id);
  try {
    const response = await axios.get(`${API_BASE_URLS.clientes}/${id}`);
    console.log('Client fetched successfully by ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching client by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  console.log('Attempting to update client:', id, clientData);
  try {
    const response = await axios.put(`${API_BASE_URLS.clientes}/${id}`, clientData);
    console.log('Client updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteClient = async (id) => {
  console.log('Attempting to delete client:', id);
  try {
    const response = await axios.delete(`${API_BASE_URLS.clientes}/${id}`);
    console.log('Client deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Pet API Calls
export const getPetsByClientId = async (clientId) => {
  console.log('Attempting to fetch pets for client ID:', clientId);
  try {
    const response = await axios.get(`${API_BASE_URLS.pets}?clienteId=${clientId}`);
    console.log('Pets fetched successfully for client:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching pets for client:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createPet = async (petData) => {
  console.log('Attempting to create pet:', petData);
  try {
    const response = await axios.post(API_BASE_URLS.pets, petData);
    console.log('Pet created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating pet:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPetById = async (id) => {
  console.log('Attempting to fetch pet by ID:', id);
  try {
    const response = await axios.get(`${API_BASE_URLS.pets}/${id}`);
    console.log('Pet fetched successfully by ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching pet by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updatePet = async (id, petData) => {
  console.log('Attempting to update pet:', id, petData);
  try {
    const response = await axios.put(`${API_BASE_URLS.pets}/${id}`, petData);
    console.log('Pet updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating pet:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deletePet = async (id) => {
  console.log('Attempting to delete pet:', id);
  try {
    const response = await axios.delete(`${API_BASE_URLS.pets}/${id}`);
    console.log('Pet deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting pet:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPets = async () => {
  console.log('Attempting to fetch all pets from API...');
  try {
    const response = await axios.get(API_BASE_URLS.pets);
    console.log('All pets fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all pets:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Appointment API Calls (Placeholders - API not yet provided)
const AGENDAMENTOS_BASE_URL = 'https://ba0wpj4u21.execute-api.us-east-1.amazonaws.com/dev/agendamentos';

export const getAppointments = async (filters = {}) => {
  console.log('Attempting to fetch appointments from API with filters:', filters);
  try {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${AGENDAMENTOS_BASE_URL}?${params}` : AGENDAMENTOS_BASE_URL;
    const response = await axios.get(url);
    console.log('Appointments fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  console.log('Attempting to create appointment:', appointmentData);
  try {
    const response = await axios.post(AGENDAMENTOS_BASE_URL, appointmentData);
    console.log('Appointment created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  console.log('Attempting to fetch appointment by ID:', id);
  try {
    const response = await axios.get(`${AGENDAMENTOS_BASE_URL}/${id}`);
    console.log('Appointment fetched successfully by ID:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateAppointment = async (id, appointmentData) => {
  console.log('Attempting to update appointment:', id, appointmentData);
  try {
    const response = await axios.put(`${AGENDAMENTOS_BASE_URL}/${id}`, appointmentData);
    console.log('Appointment updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const cancelAppointment = async (id) => {
  console.log('Attempting to cancel appointment:', id);
  try {
    // O cancelamento é feito via update de status para CANCELADO_CLIENTE ou CANCELADO_PETSHOP
    const response = await axios.put(`${AGENDAMENTOS_BASE_URL}/${id}`, { status: 'CANCELADO_CLIENTE' });
    console.log('Appointment cancelled successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error cancelling appointment:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default api;
