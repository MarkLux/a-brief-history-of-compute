import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import QuizPanel from '../../src/components/QuizPanel';

const quiz = {
  lesson_id: 'ch4-03',
  questions: [
    {
      id: 'q01',
      type: 'single-choice',
      question: 'Pod 和容器的关系是什么？',
      options: ['Pod 是容器别名', 'Pod 是调度单位，可包含容器'],
      answer: 1,
      explanation: 'Pod 是 Kubernetes 的调度单位。',
      source_anchor: 'pod',
    },
  ],
};

describe('QuizPanel', () => {
  beforeEach(() => localStorage.clear());

  it('renders questions and options', () => {
    render(<QuizPanel quiz={quiz} />);
    expect(screen.getByText('Pod 和容器的关系是什么？')).toBeInTheDocument();
    expect(screen.getByText('Pod 是调度单位，可包含容器')).toBeInTheDocument();
  });

  it('shows explanation after submitting an answer', () => {
    render(<QuizPanel quiz={quiz} />);
    fireEvent.click(screen.getByLabelText('Pod 是调度单位，可包含容器'));
    fireEvent.click(screen.getByRole('button', { name: '提交答案' }));
    expect(screen.getByText('回答正确')).toBeInTheDocument();
    expect(screen.getByText('Pod 是 Kubernetes 的调度单位。')).toBeInTheDocument();
  });
});