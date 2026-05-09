import type { TodoTag } from './types';

export const TAGS: Array<{ value: TodoTag; label: string; tone: string }> = [
  { value: 'urgent', label: '紧急', tone: 'urgent' },
  { value: 'important', label: '重要', tone: 'important' },
  { value: 'notUrgent', label: '不紧急', tone: 'not-urgent' },
  { value: 'notImportant', label: '不重要', tone: 'not-important' },
];

export const tagLabelMap = TAGS.reduce<Record<TodoTag, string>>(
  (labels, tag) => ({ ...labels, [tag.value]: tag.label }),
  {
    urgent: '紧急',
    important: '重要',
    notUrgent: '不紧急',
    notImportant: '不重要',
  },
);

export function normalizeTodoTags(tags: TodoTag[], preferredTag?: TodoTag): TodoTag[] {
  const uniqueTags = Array.from(new Set(tags));
  let normalizedTags = uniqueTags;

  if (normalizedTags.includes('urgent') && normalizedTags.includes('notUrgent')) {
    normalizedTags = normalizedTags.filter((tag) =>
      preferredTag === 'notUrgent' ? tag !== 'urgent' : tag !== 'notUrgent',
    );
  }

  if (normalizedTags.includes('important') && normalizedTags.includes('notImportant')) {
    normalizedTags = normalizedTags.filter((tag) =>
      preferredTag === 'notImportant' ? tag !== 'important' : tag !== 'notImportant',
    );
  }

  return normalizedTags;
}
