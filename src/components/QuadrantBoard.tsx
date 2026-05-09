import type { Todo, TodoTag } from '../types';

type Quadrant = {
  id: string;
  title: string;
  hint: string;
  requiredTags: TodoTag[];
  tone: string;
};

const quadrants: Quadrant[] = [
  {
    id: 'urgent-important',
    title: '紧急且重要',
    hint: '马上处理',
    requiredTags: ['urgent', 'important'],
    tone: 'red',
  },
  {
    id: 'urgent-not-important',
    title: '紧急不重要',
    hint: '快速安排',
    requiredTags: ['urgent', 'notImportant'],
    tone: 'amber',
  },
  {
    id: 'not-urgent-important',
    title: '不紧急重要',
    hint: '持续推进',
    requiredTags: ['notUrgent', 'important'],
    tone: 'blue',
  },
  {
    id: 'not-urgent-not-important',
    title: '不紧急不重要',
    hint: '低优先级',
    requiredTags: ['notUrgent', 'notImportant'],
    tone: 'green',
  },
];

type QuadrantBoardProps = {
  todos: Todo[];
};

export function QuadrantBoard({ todos }: QuadrantBoardProps) {
  return (
    <section className="quadrant-section" aria-labelledby="quadrant-title">
      <div className="section-heading">
        <div>
          <p>四象限图</p>
          <h2 id="quadrant-title">按紧急度和重要度查看全部任务</h2>
        </div>
        <span>{todos.length} 个任务参与归类</span>
      </div>

      <div className="quadrant-grid">
        {quadrants.map((quadrant) => {
          const quadrantTodos = todos.filter((todo) =>
            quadrant.requiredTags.every((tag) => todo.tags.includes(tag)),
          );

          return (
            <article className={`quadrant-card quadrant-card--${quadrant.tone}`} key={quadrant.id}>
              <div className="quadrant-card__header">
                <div>
                  <h3>{quadrant.title}</h3>
                  <span>{quadrant.hint}</span>
                </div>
                <strong>{quadrantTodos.length}</strong>
              </div>

              {quadrantTodos.length ? (
                <ul>
                  {quadrantTodos.map((todo) => (
                    <li className={todo.completed ? 'quadrant-task quadrant-task--done' : 'quadrant-task'} key={todo.id}>
                      {todo.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="quadrant-card__empty">暂无任务</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
