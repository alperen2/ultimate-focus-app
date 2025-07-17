import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskQueue from '../TaskQueue';
import { Task, CategoryType, PriorityType } from '@/types';

const mockTasks: Task[] = [
  {
    id: 1,
    text: 'Write unit tests',
    category: 'work',
    priority: 'high',
    completed: false,
    createdAt: new Date()
  },
  {
    id: 2,
    text: 'Read a book',
    category: 'personal',
    priority: 'low',
    completed: false,
    createdAt: new Date()
  }
];

const defaultProps = {
  taskQueue: mockTasks,
  newQueueTask: '',
  taskCategory: 'work' as CategoryType,
  taskPriority: 'medium' as PriorityType,
  darkMode: false,
  categories: ['work', 'personal', 'learning', 'creative', 'health'] as CategoryType[],
  priorities: ['low', 'medium', 'high', 'urgent'] as PriorityType[],
  onNewTaskChange: jest.fn(),
  onCategoryChange: jest.fn(),
  onPriorityChange: jest.fn(),
  onAddToQueue: jest.fn(),
  onRemoveFromQueue: jest.fn(),
  onMoveToCurrentTask: jest.fn(),
  getCategoryIcon: jest.fn((category: string) => {
    const icons: Record<string, string> = {
      work: '💼',
      personal: '🏠',
      learning: '📚',
      creative: '🎨',
      health: '💪'
    };
    return icons[category] || '📝';
  }),
  getPriorityColor: jest.fn((priority: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  })
};

describe('TaskQueue Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component title', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(screen.getByText('Task Queue')).toBeInTheDocument();
  });

  it('should render the task input field', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Add task to queue...')).toBeInTheDocument();
  });

  it('should call onNewTaskChange when input value changes', () => {
    render(<TaskQueue {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Add task to queue...');
    fireEvent.change(input, { target: { value: 'New task' } });
    
    expect(defaultProps.onNewTaskChange).toHaveBeenCalledWith('New task');
  });

  it('should render Add Task button', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('should disable Add Task button when input is empty', () => {
    render(<TaskQueue {...defaultProps} newQueueTask="" />);
    
    const button = screen.getByText('Add Task').closest('button');
    expect(button).toBeDisabled();
  });

  it('should enable Add Task button when input has text', () => {
    render(<TaskQueue {...defaultProps} newQueueTask="Test task" />);
    
    const button = screen.getByText('Add Task').closest('button');
    expect(button).not.toBeDisabled();
  });

  it('should call onAddToQueue when Add Task button is clicked', () => {
    render(<TaskQueue {...defaultProps} newQueueTask="Test task" />);
    
    const button = screen.getByText('Add Task');
    fireEvent.click(button);
    
    expect(defaultProps.onAddToQueue).toHaveBeenCalled();
  });

  it('should call onAddToQueue when Enter key is pressed in input', () => {
    const mockOnAddToQueue = jest.fn();
    render(<TaskQueue {...defaultProps} newQueueTask="Test task" onAddToQueue={mockOnAddToQueue} />);
    
    const input = screen.getByPlaceholderText('Add task to queue...');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(mockOnAddToQueue).toHaveBeenCalled();
  });

  it('should not call onAddToQueue when other keys are pressed', () => {
    render(<TaskQueue {...defaultProps} newQueueTask="Test task" />);
    
    const input = screen.getByPlaceholderText('Add task to queue...');
    fireEvent.keyPress(input, { key: 'Space', code: 'Space' });
    
    expect(defaultProps.onAddToQueue).not.toHaveBeenCalled();
  });

  it('should render category select with all options', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(screen.getByDisplayValue(/work/i)).toBeInTheDocument();
    
    // Check that getCategoryIcon is called for each category
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('work');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('personal');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('learning');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('creative');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('health');
  });

  it('should call onCategoryChange when category changes', () => {
    render(<TaskQueue {...defaultProps} />);
    
    const select = screen.getByDisplayValue(/work/i);
    fireEvent.change(select, { target: { value: 'personal' } });
    
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('personal');
  });

  it('should render priority select with all options', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(screen.getByDisplayValue(/medium/i)).toBeInTheDocument();
  });

  it('should call onPriorityChange when priority changes', () => {
    render(<TaskQueue {...defaultProps} />);
    
    const prioritySelects = screen.getAllByDisplayValue(/medium/i);
    const prioritySelect = prioritySelects.find(select => 
      select.closest('div')?.querySelector('label')?.textContent === 'Priority'
    );
    
    if (prioritySelect) {
      fireEvent.change(prioritySelect, { target: { value: 'high' } });
      expect(defaultProps.onPriorityChange).toHaveBeenCalledWith('high');
    }
  });

  it('should render all tasks in the queue', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
    expect(screen.getByText('Read a book')).toBeInTheDocument();
  });

  it('should call getCategoryIcon for each task', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('work');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('personal');
  });

  it('should call getPriorityColor for each task', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(defaultProps.getPriorityColor).toHaveBeenCalledWith('high');
    expect(defaultProps.getPriorityColor).toHaveBeenCalledWith('low');
  });

  it('should call onMoveToCurrentTask when task is clicked', () => {
    render(<TaskQueue {...defaultProps} />);
    
    const taskElement = screen.getByText('Write unit tests');
    fireEvent.click(taskElement);
    
    expect(defaultProps.onMoveToCurrentTask).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('should render delete button for each task', () => {
    render(<TaskQueue {...defaultProps} />);
    
    const deleteButtons = screen.getAllByRole('button');
    // Filter out the Add Task button
    const taskDeleteButtons = deleteButtons.filter(button => 
      button.querySelector('svg') && !button.textContent?.includes('Add Task')
    );
    
    expect(taskDeleteButtons).toHaveLength(2);
  });

  it('should call onRemoveFromQueue when delete button is clicked', () => {
    render(<TaskQueue {...defaultProps} />);
    
    const deleteButtons = screen.getAllByRole('button');
    const taskDeleteButtons = deleteButtons.filter(button => 
      button.querySelector('svg') && !button.textContent?.includes('Add Task')
    );
    
    fireEvent.click(taskDeleteButtons[0]);
    expect(defaultProps.onRemoveFromQueue).toHaveBeenCalledWith(1);
  });

  it('should show empty state when no tasks in queue', () => {
    render(<TaskQueue {...defaultProps} taskQueue={[]} />);
    
    expect(screen.getByText('No tasks in queue')).toBeInTheDocument();
  });

  it('should not show tasks when queue is empty', () => {
    render(<TaskQueue {...defaultProps} taskQueue={[]} />);
    
    expect(screen.queryByText('Write unit tests')).not.toBeInTheDocument();
    expect(screen.queryByText('Read a book')).not.toBeInTheDocument();
  });

  it('should apply dark mode styles when darkMode is true', () => {
    render(<TaskQueue {...defaultProps} darkMode={true} />);
    
    const title = screen.getByText('Task Queue');
    expect(title).toHaveClass('text-white');
  });

  it('should apply light mode styles when darkMode is false', () => {
    render(<TaskQueue {...defaultProps} darkMode={false} />);
    
    const title = screen.getByText('Task Queue');
    expect(title).toHaveClass('text-gray-800');
  });

  it('should display current task input value', () => {
    render(<TaskQueue {...defaultProps} newQueueTask="Current input" />);
    
    const input = screen.getByPlaceholderText('Add task to queue...');
    expect(input).toHaveValue('Current input');
  });

  it('should display selected category', () => {
    render(<TaskQueue {...defaultProps} taskCategory="learning" />);
    
    const categorySelect = screen.getByDisplayValue(/learning/i);
    expect(categorySelect).toHaveValue('learning');
  });

  it('should display selected priority', () => {
    render(<TaskQueue {...defaultProps} taskPriority="urgent" />);
    
    const prioritySelects = screen.getAllByDisplayValue(/urgent/i);
    expect(prioritySelects.length).toBeGreaterThan(0);
  });

  it('should render priority badges for tasks', () => {
    render(<TaskQueue {...defaultProps} />);
    
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
  });

  it('should handle edge case with whitespace-only input', () => {
    render(<TaskQueue {...defaultProps} newQueueTask="   " />);
    
    const button = screen.getByText('Add Task').closest('button');
    expect(button).toBeDisabled();
  });
});