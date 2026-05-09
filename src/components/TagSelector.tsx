import { normalizeTodoTags, TAGS } from '../tagConfig';
import type { TodoTag } from '../types';

type TagSelectorProps = {
  selectedTags: TodoTag[];
  onChange: (tags: TodoTag[]) => void;
  compact?: boolean;
  visibleTags?: TodoTag[];
};

export function TagSelector({ selectedTags, onChange, compact = false, visibleTags }: TagSelectorProps) {
  const toggleTag = (tag: TodoTag) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((selectedTag) => selectedTag !== tag));
      return;
    }

    onChange(normalizeTodoTags([...selectedTags, tag], tag));
  };

  const renderedTags = visibleTags ? TAGS.filter((tag) => visibleTags.includes(tag.value)) : TAGS;

  return (
    <div className={compact ? 'tag-selector tag-selector--compact' : 'tag-selector'}>
      {renderedTags.map((tag) => (
        <label className={`tag-check tag-check--${tag.tone}`} key={tag.value}>
          <input
            type="checkbox"
            checked={selectedTags.includes(tag.value)}
            onChange={() => toggleTag(tag.value)}
          />
          <span>{tag.label}</span>
        </label>
      ))}
    </div>
  );
}
