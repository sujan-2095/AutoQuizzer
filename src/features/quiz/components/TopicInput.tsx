import React from 'react';

interface TopicInputProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  additionalContext: string;
  onAdditionalContextChange: (context: string) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  topic,
  onTopicChange,
  additionalContext,
  onAdditionalContextChange,
}) => {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-1">
          Topic
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="e.g., 'The Renaissance Period'"
          className="w-full px-4 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary focus:border-transparent transition-all duration-300 text-text dark:text-text-DEFAULT placeholder:text-text-light-muted dark:placeholder:text-text-muted"
        />
      </div>
      <div>
        <label htmlFor="additionalContext" className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-1">
          Additional Context (Optional)
        </label>
        <textarea
          id="additionalContext"
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
          rows={3}
          placeholder="e.g., Focus on operators and regular expressions in Python"
          className="w-full px-4 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary focus:border-transparent transition-all duration-300 text-text dark:text-text-DEFAULT placeholder:text-text-light-muted dark:placeholder:text-text-muted"
        />
      </div>
    </div>
  );
};

export default TopicInput;
