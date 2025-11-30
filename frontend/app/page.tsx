"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  Todo,
} from "@/lib/api";

export default function TodosPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const client = useQueryClient();

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodo = useMutation({
    mutationFn: () => createTodo(title, description),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      setDescription("");
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (updates: { id: string; title: string; description: string }) =>
      updateTodo(updates.id, {
        title: updates.title,
        description: updates.description,
      }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      setDescription("");
      setEditingId(null);
    },
  });

  const toggleTodo = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      updateTodo(id, { completed }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["todos"] }),
  });

  const removeTodo = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["todos"] }),
  });

  const handleSave = () => {
    if (editingId) {
      updateTodoMutation.mutate({ id: editingId, title, description });
    } else {
      addTodo.mutate();
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">Todo List</h1>

      {/* Add/Edit Task Form */}
      <div className="flex flex-col gap-3 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description..."
          className="px-3 py-2 border rounded-md h-20 resize-none focus:outline-none focus:ring focus:ring-blue-200"
        />

        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-md text-white transition ${
            editingId
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editingId ? "Save Changes" : "Add Task"}
        </button>
      </div>

      {/* Todo List */}
      <ul className="space-y-3">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="p-4 bg-white border rounded-md shadow-sm flex justify-between items-start"
          >
            <div
              className="cursor-pointer flex-1"
              onClick={() =>
                toggleTodo.mutate({ id: todo.id, completed: !todo.completed })
              }
            >
              <h2
                className={`text-lg font-medium ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </h2>
              <p
                className={`text-sm mt-1 ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {todo.description}
              </p>
            </div>

            <div className="flex flex-col gap-1 ml-4">
              <button
                onClick={() => startEdit(todo)}
                className="text-yellow-500 hover:text-yellow-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => removeTodo.mutate(todo.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
