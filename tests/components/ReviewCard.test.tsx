import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import ReviewCard from '../../src/components/ReviewCard';

const lesson = {
  id: 'ch2-01',
  title: '高级语言的演进之路',
  chapter_id: 'ch2',
  source_md: 'ch2/01-高级语言的演进之路.md',
  level: 'intermediate',
  estimated_minutes: 45,
  prerequisites: [],
  interaction_template: 'concept-comparison',
  concepts: [
    { id: '高级语言', name: '高级语言', summary: '从机器细节中抽象出更接近业务逻辑的表达。', tags: ['core'] },
    { id: '编译器', name: '编译器', summary: '把源码翻译成更低层可执行形式的工具。', tags: ['core'] },
    { id: '运行时', name: '运行时', summary: '承接程序执行、优化和平台差异的环境。', tags: ['core'] },
  ],
  teacher_flow: {
    opening_question: '高级语言解决了程序员和机器之间的什么矛盾？',
    lesson_points: [
      '高级语言降低表达复杂度',
      '编译器负责翻译',
      '运行时屏蔽平台差异',
    ],
    closing_check: '用自己的话解释高级语言为什么会不断提高抽象层级。',
  },
};

describe('ReviewCard', () => {
  beforeEach(() => localStorage.clear());

  it('renders a warmer learning recap instead of mechanical labels', () => {
    render(<ReviewCard lesson={lesson} />);

    expect(screen.getByText('你这节课要带走什么？')).toBeInTheDocument();
    expect(screen.getByText('三句话复盘')).toBeInTheDocument();
    expect(screen.getByText('最容易混淆的点')).toBeInTheDocument();
    expect(screen.getByText('下一步行动')).toBeInTheDocument();
    expect(screen.getByText(/如果你只能记住一句话/)).toBeInTheDocument();
  });

  it('records completion when the learner marks the lesson done', () => {
    render(<ReviewCard lesson={lesson} />);

    fireEvent.click(screen.getByRole('button', { name: '标记本课完成' }));

    expect(screen.getByRole('button', { name: '已记录完成' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('abhoc-learning-progress') ?? '{}').completedLessons).toContain('ch2-01');
  });
});
