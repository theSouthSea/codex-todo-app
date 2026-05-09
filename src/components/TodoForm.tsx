import { FormEvent, useState } from 'react';
import { DEFAULT_TAGS } from '../todoRepository';
import type { TodoTag } from '../types';
import { TagSelector } from './TagSelector';

type TodoFormProps = {
  onCreate: (title: string, tags: TodoTag[]) => Promise<void>;
};

export function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<TodoTag[]>(DEFAULT_TAGS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onCreate(title, tags);
    setTitle('');
    setTags(DEFAULT_TAGS);
    setIsSubmitting(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__field">
        <label htmlFor="todo-title">新建待办</label>
        <div className="todo-form__row">
          <input
            id="todo-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="输入一个待办事项"
          />
          <button className="button button--primary" disabled={!title.trim() || isSubmitting} type="submit">
            添加
          </button>
        </div>
      </div>
      <TagSelector selectedTags={tags} onChange={setTags} visibleTags={['urgent', 'important']} />
    </form>
  );
}
