import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import Projects from '../Projects';
import { Project, ProjectStatus } from '@/types';

// Mock projects data
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Test Project 1',
    description: 'Test description',
    color: '#4F46E5',
    status: 'active' as ProjectStatus,
    estimatedPomodoros: 10,
    completedPomodoros: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    dueDate: new Date('2024-12-31')
  },
  {
    id: 2,
    name: 'Test Project 2',
    description: 'Another test project',
    color: '#059669',
    status: 'completed' as ProjectStatus,
    estimatedPomodoros: 20,
    completedPomodoros: 20,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock functions
const mockCreateProject = vi.fn();
const mockUpdateProject = vi.fn();
const mockDeleteProject = vi.fn();
const mockSelectProject = vi.fn();

const defaultProps = {
  projects: mockProjects,
  darkMode: false,
  onCreateProject: mockCreateProject,
  onUpdateProject: mockUpdateProject,
  onDeleteProject: mockDeleteProject,
  onSelectProject: mockSelectProject,
  selectedProjectId: undefined
};

describe('Projects Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders projects list correctly', () => {
    render(<Projects {...defaultProps} />);
    
    expect(screen.getByText('Projeler')).toBeInTheDocument();
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText('Yeni Proje')).toBeInTheDocument();
  });

  it('shows empty state when no projects', () => {
    render(<Projects {...defaultProps} projects={[]} />);
    
    expect(screen.getByText('Henüz proje yok')).toBeInTheDocument();
    expect(screen.getByText('İlk projenizi oluşturmak için "Yeni Proje" butonuna tıklayın')).toBeInTheDocument();
  });

  it('opens create project form when "Yeni Proje" is clicked', () => {
    render(<Projects {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Yeni Proje'));
    
    expect(screen.getByText('Yeni Proje Oluştur')).toBeInTheDocument();
    expect(screen.getByLabelText('Proje Adı *')).toBeInTheDocument();
  });

  it('creates new project with valid data', async () => {
    render(<Projects {...defaultProps} />);
    
    // Open create form
    fireEvent.click(screen.getByText('Yeni Proje'));
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Proje Adı *'), {
      target: { value: 'New Test Project' }
    });
    fireEvent.change(screen.getByLabelText('Açıklama'), {
      target: { value: 'New project description' }
    });
    fireEvent.change(screen.getByLabelText('Tahmini Pomodoro'), {
      target: { value: '15' }
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Oluştur'));
    
    await waitFor(() => {
      expect(mockCreateProject).toHaveBeenCalledWith({
        name: 'New Test Project',
        description: 'New project description',
        color: '#4F46E5',
        status: 'active',
        estimatedPomodoros: 15,
        completedPomodoros: 0,
        dueDate: undefined
      });
    });
  });

  it('does not create project with empty name', async () => {
    render(<Projects {...defaultProps} />);
    
    // Open create form
    fireEvent.click(screen.getByText('Yeni Proje'));
    
    // Submit form without filling name
    fireEvent.click(screen.getByText('Oluştur'));
    
    expect(mockCreateProject).not.toHaveBeenCalled();
  });

  it('selects project when clicked', () => {
    render(<Projects {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Test Project 1'));
    
    expect(mockSelectProject).toHaveBeenCalledWith(mockProjects[0]);
  });

  it('shows progress bar for projects with estimated pomodoros', () => {
    render(<Projects {...defaultProps} />);
    
    // Should show progress for projects with estimated pomodoros > 0
    expect(screen.getByText('5/10')).toBeInTheDocument(); // Project 1
    expect(screen.getByText('20/20')).toBeInTheDocument(); // Project 2
  });

  it('renders in dark mode correctly', () => {
    render(<Projects {...defaultProps} darkMode={true} />);
    
    const projectsContainer = screen.getByText('Projeler').closest('div');
    expect(projectsContainer).toHaveClass('bg-gray-800');
  });

  it('changes project status through dropdown', async () => {
    render(<Projects {...defaultProps} />);
    
    // Find and click the dropdown button for first project
    const dropdownButtons = screen.getAllByRole('button');
    const projectDropdown = dropdownButtons.find(button => 
      button.querySelector('svg') && 
      button.getAttribute('class')?.includes('p-1')
    );
    
    if (projectDropdown) {
      fireEvent.click(projectDropdown);
      
      // Wait for dropdown to appear and click pause option
      await waitFor(() => {
        const pauseButton = screen.getByText('Duraklat');
        fireEvent.click(pauseButton);
      });
      
      expect(mockUpdateProject).toHaveBeenCalledWith(1, { status: 'paused' });
    }
  });

  it('deletes project through dropdown', async () => {
    render(<Projects {...defaultProps} />);
    
    // Find and click the dropdown button for first project
    const dropdownButtons = screen.getAllByRole('button');
    const projectDropdown = dropdownButtons.find(button => 
      button.querySelector('svg') && 
      button.getAttribute('class')?.includes('p-1')
    );
    
    if (projectDropdown) {
      fireEvent.click(projectDropdown);
      
      // Wait for dropdown to appear and click delete option
      await waitFor(() => {
        const deleteButton = screen.getByText('Sil');
        fireEvent.click(deleteButton);
      });
      
      expect(mockDeleteProject).toHaveBeenCalledWith(1);
    }
  });
});