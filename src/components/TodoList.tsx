import { useState } from 'react';
import { tagLabelMap, TAGS } from '../tagConfig';
import type { Todo, TodoTag } from '../types';
import { TagSelector } from './TagSelector';

type TodoListProps = {
  todos: Todo[];
  onUpdate: (id: string, patch: Partial<Pick<Todo, 'title' | 'tags' | 'completed'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

type TodoRowProps = Omit<TodoListProps, 'todos'> & {
  todo: Todo;
};

export function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  if (!todos.length) {
    return (
      <div className="empty-state">
        <strong>这一页还没有待办</strong>
        <span>添加一个任务后，它会自动进入不紧急、不重要象限。</span>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoRow key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}

function TodoRow({ todo, onUpdate, onDelete }: TodoRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftTags, setDraftTags] = useState<TodoTag[]>(todo.tags);

  const saveEdit = async () => {
    if (!draftTitle.trim()) {
      return;
    }

    await onUpdate(todo.id, { title: draftTitle, tags: draftTags });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setDraftTitle(todo.title);
    setDraftTags(todo.tags);
    setIsEditing(false);
  };

  return (
    <article className={todo.completed ? 'todo-row todo-row--done' : 'todo-row'}>
      <label className="todo-row__complete">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
          aria-label={todo.completed ? '恢复待办' : '完成待办'}
        />
      </label>

      <div className="todo-row__content">
        {isEditing ? (
          <>
            <input
              className="todo-row__edit-input"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              aria-label="编辑待办标题"
            />
            <TagSelector compact selectedTags={draftTags} onChange={setDraftTags} />
          </>
        ) : (
          <>
            <h3>{todo.title}</h3>
            <div className="todo-row__tags" aria-label="待办标签">
              {TAGS.filter((tag) => todo.tags.includes(tag.value)).map((tag) => (
                <span className={`tag-pill tag-pill--${tag.tone}`} key={tag.value}>
                  {tagLabelMap[tag.value]}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="todo-row__actions">
        {isEditing ? (
          <>
            <button className="button button--quiet" disabled={!draftTitle.trim()} onClick={saveEdit} type="button">
              保存
            </button>
            <button className="button button--ghost" onClick={cancelEdit} type="button">
              取消
            </button>
          </>
        ) : (
          <>
            <button className="button button--quiet" onClick={() => setIsEditing(true)} type="button">
              编辑
            </button>
            <button className="button button--danger" onClick={() => onDelete(todo.id)} type="button">
              删除
            </button>
          </>
        )}
      </div>
    </article>
  );
}
