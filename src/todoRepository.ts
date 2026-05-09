import { normalizeTodoTags } from './tagConfig';
import { supabaseRequest } from './supabaseClient';
import type { CreateTodoInput, Todo, TodoTag, UpdateTodoPatch } from './types';

export const DEFAULT_TAGS: TodoTag[] = ['notUrgent', 'notImportant'];

type TodoRow = {
  id: string;
  title: string;
  tags: TodoTag[];
  completed: boolean;
  created_at: string;
  updated_at: string;
};

type TodoInsert = {
  title: string;
  tags: TodoTag[];
  completed?: boolean;
};

type TodoUpdate = {
  title?: string;
  tags?: TodoTag[];
  completed?: boolean;
};

function toTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    tags: normalizeTodoTags(row.tags),
    completed: row.completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function assertReturnedRow<T>(data: T[], action: string): T {
  if (!data.length) {
    throw new Error(`${action}失败：Supabase 没有返回数据`);
  }

  return data[0];
}

export async function listTodos(): Promise<Todo[]> {
  const rows = await supabaseRequest<TodoRow[]>(
    '/todos?select=id,title,tags,completed,created_at,updated_at&order=created_at.desc',
  );

  return rows.map(toTodo);
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const payload: TodoInsert = {
    title: input.title.trim(),
    tags: normalizeTodoTags(input.tags?.length ? input.tags : DEFAULT_TAGS),
    completed: false,
  };

  const rows = await supabaseRequest<TodoRow[]>(
    '/todos?select=id,title,tags,completed,created_at,updated_at',
    {
      method: 'POST',
      body: payload,
      prefer: 'return=representation',
    },
  );

  return toTodo(assertReturnedRow(rows, '创建待办'));
}

export async function updateTodo(id: string, patch: UpdateTodoPatch): Promise<Todo> {
  const payload: TodoUpdate = {};

  if (patch.title !== undefined) {
    payload.title = patch.title.trim();
  }

  if (patch.tags !== undefined) {
    payload.tags = normalizeTodoTags(patch.tags);
  }

  if (patch.completed !== undefined) {
    payload.completed = patch.completed;
  }

  const rows = await supabaseRequest<TodoRow[]>(
    `/todos?id=eq.${encodeURIComponent(id)}&select=id,title,tags,completed,created_at,updated_at`,
    {
      method: 'PATCH',
      body: payload,
      prefer: 'return=representation',
    },
  );

  return toTodo(assertReturnedRow(rows, '更新待办'));
}

export async function deleteTodo(id: string): Promise<void> {
  await supabaseRequest<void>(`/todos?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
