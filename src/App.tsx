// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchTodos, deleteTodo, addTodo, Todo } from './services/api';
import './App.css';

const App: React.FC = () => {
  return (
    <Authenticator>
      {({ signOut}) => (
        <div className="app">
          <h1>Lista TODO</h1>
          <button onClick={signOut} className="sign-out-button">
            Cerrar sesión
          </button>
          <TodoList />
        </div>
      )}
    </Authenticator>
  );
};

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data.slice(0, 10));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Error al eliminar el todo');
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Omit<Todo, 'id'> = {
      userId: 1,
      title: newTodoTitle,
      completed: false,
    };

    try {
      const createdTodo = await addTodo(newTodo);
      setTodos([createdTodo, ...todos]);
      setNewTodoTitle('');
      setShowForm(false);
    } catch (err) {
      setError('Error al agregar el todo');
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="todo-container">
      <button 
        onClick={() => setShowForm(!showForm)} 
        className="new-button"
      >
        +New
      </button>

      {showForm && (
        <div className="todo-form">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Título del todo"
          />
          <button onClick={handleAddTodo}>Guardar</button>
        </div>
      )}

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <span>{todo.title}</span>
            <button 
              onClick={() => handleDelete(todo.id)} 
              className="delete-button"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;