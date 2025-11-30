import axios from "axios";

const API = "http://localhost:8000/todos/";

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export async function fetchTodos(): Promise<Todo[]> {
  const res = await api.get<Todo[]>("");
  return res.data;
}

export async function createTodo(
  title: string,
  description: string,
): Promise<Todo> {
  const res = await api.post<Todo>("", { title, description });
  return res.data;
}

export async function updateTodo(
  id: string,
  updates: { title?: string; description?: string; completed?: boolean },
): Promise<Todo> {
  const res = await api.patch<Todo>(`${id}/`, updates);
  return res.data;
}

export async function deleteTodo(id: string) {
  const res = await api.delete(`${id}/`);
  return res.data;
}
