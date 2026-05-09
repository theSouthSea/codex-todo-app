import { useEffect, useMemo, useState } from 'react';
import { Pagination } from './components/Pagination';
import { QuadrantBoard } from './components/QuadrantBoard';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { createTodo, deleteTodo, listTodos, updateTodo } from './todoRepository';
import type { Todo, TodoTag, UpdateTodoPatch } from './types';

const PAGE_SIZE = 10;

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const totalPages = Math.max(1, Math.ceil(todos.length / PAGE_SIZE));
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  const visibleTodos = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return todos.slice(start, start + PAGE_SIZE);
  }, [currentPage, todos]);

  const refreshTodos = async () => {
    const nextTodos = await listTodos();
    setTodos(nextTodos);
    setErrorMessage('');
    return nextTodos;
  };

  useEffect(() => {
    refreshTodos()
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : '读取待办失败，请检查 Supabase 配置。');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const handleCreate = async (title: string, tags: TodoTag[]) => {
    try {
      await createTodo({ title, tags });
      await refreshTodos();
      setCurrentPage(1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '创建待办失败。');
    }
  };

  const handleUpdate = async (id: string, patch: UpdateTodoPatch) => {
    try {
      await updateTodo(id, patch);
      await refreshTodos();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '更新待办失败。');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      await refreshTodos();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '删除待办失败。');
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p>Todo Workspace</p>
          <h1>四象限待办</h1>
        </div>
        <div className="stats-strip" aria-label="待办统计">
          <span>
            <strong>{todos.length}</strong>
            全部
          </span>
          <span>
            <strong>{activeCount}</strong>
            进行中
          </span>
          <span>
            <strong>{completedCount}</strong>
            已完成
          </span>
        </div>
      </header>

      <section className="workspace-panel" aria-labelledby="list-title">
        <div className="section-heading">
          <div>
            <p>任务列表</p>
            <h2 id="list-title">每页显示 10 条待办事项</h2>
          </div>
          <span>默认：不紧急、不重要</span>
        </div>

        <TodoForm onCreate={handleCreate} />

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        {isLoading ? (
          <div className="empty-state">
            <strong>正在载入待办</strong>
            <span>稍等片刻。</span>
          </div>
        ) : (
          <>
            <TodoList todos={visibleTodos} onUpdate={handleUpdate} onDelete={handleDelete} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={todos.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>

      <QuadrantBoard todos={todos} />
    </main>
  );
}
