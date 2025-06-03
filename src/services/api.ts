import axios from 'axios';

// Tipos para los datos de la API (igual que en el proyecto original)
export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // API de prueba
});

// Obtener todos los "todos" (simulando los datos locales del proyecto original)
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await api.get<Todo[]>('/todos');
  return response.data;
};

export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await api.post<Todo>('/todos', todo);
  return response.data;
};

// Eliminar un "todo" (DELETE)
export const deleteTodo = async (id: number): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

export default api;