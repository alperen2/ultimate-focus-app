import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import ProjectTaskList from '../ProjectTaskList';
import { Project, Task, CategoryType, PriorityType, ProjectStatus } from '@/types';

// Mock project data
const mockProject: Project = {
  id: 1,
  name: 'Test Project',
  description: 'Test project description',
  color: '#4F46E5',
  status: 'active' as ProjectStatus,
  estimatedPomodoros: 10,
  completedPomodoros: 3,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 1,
    text: 'Task 1',
    description: 'First task',
    projectId: 1,
    category: 'work' as CategoryType,
    priority: 'high' as PriorityType,
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 2,
    text: 'Task 2',
    description: 'Second task',
    projectId: 1,
    category: 'personal' as CategoryType,
    priority: 'medium' as PriorityType,
    completed: true,
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock functions
const mockCreateTask = vi.fn();
const mockUpdateTask = vi.fn();
const mockDeleteTask = vi.fn();
const mockStartTask = vi.fn();

const defaultProps = {
  project: mockProject,
  tasks: mockTasks,
  darkMode: false,
  categories: ['work', 'personal', 'learning', 'creative', 'health'] as CategoryType[],
  priorities: ['low', 'medium', 'high', 'urgent'] as PriorityType[],
  onCreateTask: mockCreateTask,
  onUpdateTask: mockUpdateTask,
  onDeleteTask: mockDeleteTask,
  onStartTask: mockStartTask
};

describe('ProjectTaskList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders project information correctly', () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test project description')).toBeInTheDocument();
    expect(screen.getByText('Görev Ekle')).toBeInTheDocument();
  });

  it('displays project statistics correctly', () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    expect(screen.getByText('2')).toBeInTheDocument(); // Total tasks
    expect(screen.getByText('1')).toBeInTheDocument(); // Completed tasks
    expect(screen.getByText('5')).toBeInTheDocument(); // Total estimated pomodoros (3+2)
    expect(screen.getByText('2')).toBeInTheDocument(); // Total completed pomodoros
  });

  it('shows progress bar with correct percentage', () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    // Progress should be 2/5 = 40%
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('separates pending and completed tasks', () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    expect(screen.getByText('Bekleyen Görevler (1)')).toBeInTheDocument();
    expect(screen.getByText('Tamamlanan Görevler (1)')).toBeInTheDocument();
  });

  it('opens create task form when "Görev Ekle" is clicked', () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Görev Ekle'));
    
    expect(screen.getByText('Yeni Görev Ekle')).toBeInTheDocument();
    expect(screen.getByLabelText('Görev Adı *')).toBeInTheDocument();
  });

  it('creates new task with valid data', async () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    // Open create form
    fireEvent.click(screen.getByText('Görev Ekle'));
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Görev Adı *'), {
      target: { value: 'New Task' }
    });
    fireEvent.change(screen.getByLabelText('Açıklama'), {
      target: { value: 'New task description' }
    });
    fireEvent.change(screen.getByLabelText('Tahmini Pomodoro'), {
      target: { value: '4' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Ekle'));
    
    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        text: 'New Task',
        description: 'New task description',
        projectId: 1,
        category: 'work',
        priority: 'medium',
        completed: false,
        estimatedPomodoros: 4,
        completedPomodoros: 0,
        dueDate: undefined
      });
    });
  });

  it('does not create task with empty name', async () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    // Open create form
    fireEvent.click(screen.getByText('Görev Ekle'));
    
    // Submit form without filling name
    fireEvent.click(screen.getByText('Ekle'));
    
    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('toggles task completion status', () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    // Find the first task checkbox (pending task)
    const taskCheckboxes = screen.getAllByRole('button');
    const taskCheckbox = taskCheckboxes.find(button => 
      button.querySelector('svg') && 
      button.getAttribute('class')?.includes('mt-0.5')
    );
    
    if (taskCheckbox) {
      fireEvent.click(taskCheckbox);
      
      expect(mockUpdateTask).toHaveBeenCalledWith(1, { 
        completed: true,
        completedPomodoros: 3
      });
    }
  });

  it('starts task when "Başla" button is clicked', () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    // Find and click "Başla" button for pending task
    const startButton = screen.getByText('Başla');
    fireEvent.click(startButton);
    
    expect(mockStartTask).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('shows empty state when no tasks', () => {
    render(<ProjectTaskList {...defaultProps} tasks={[]} />);
    
    expect(screen.getByText('Henüz görev yok')).toBeInTheDocument();
    expect(screen.getByText('İlk görevinizi eklemek için "Görev Ekle" butonuna tıklayın')).toBeInTheDocument();
  });

  it('deletes task through dropdown menu', async () => {
    render(<ProjectTaskList {...defaultProps} />);
    
    // Find and click the dropdown button for a task
    const dropdownButtons = screen.getAllByRole('button');
    const taskDropdown = dropdownButtons.find(button => 
      button.querySelector('svg') && 
      button.getAttribute('class')?.includes('p-1 rounded hover:bg-opacity-10')
    );
    
    if (taskDropdown) {
      fireEvent.click(taskDropdown);
      
      // Wait for dropdown to appear and click delete option
      await waitFor(() => {
        const deleteButton = screen.getByText('Sil');
        fireEvent.click(deleteButton);
      });
      
      expect(mockDeleteTask).toHaveBeenCalledWith(1);
    }
  });

  it('renders in dark mode correctly', () => {
    render(<ProjectTaskList {...defaultProps} darkMode={true} />);
    
    const container = screen.getByText('Test Project').closest('div');
    expect(container).toHaveClass('bg-gray-800');
  });
});