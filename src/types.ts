export type TodoTag = 'urgent' | 'important' | 'notUrgent' | 'notImportant';

export interface Todo {
  id: string;
  title: string;
  tags: TodoTag[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTodoInput = {
  title: string;
  tags?: TodoTag[];
};

export type UpdateTodoPatch = Partial<Pick<Todo, 'title' | 'tags' | 'completed'>>;
