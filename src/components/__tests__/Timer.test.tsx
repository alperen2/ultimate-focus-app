import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Timer from '../Timer';
import { CategoryType } from '@/types';

const defaultProps = {
  timeLeft: 1500, // 25 minutes
  isRunning: false,
  isPaused: false,
  isBreak: false,
  currentTask: '',
  taskCategory: 'work' as CategoryType,
  todaySessions: 2,
  dailyGoal: 8,
  currentStreak: 5,
  sessionCount: 0,
  longBreakInterval: 4,
  darkMode: false,
  categories: ['work', 'personal', 'learning', 'creative', 'health'] as CategoryType[],
  onTaskChange: jest.fn(),
  onCategoryChange: jest.fn(),
  onStart: jest.fn(),
  onPause: jest.fn(),
  onResume: jest.fn(),
  onStop: jest.fn(),
  onReset: jest.fn(),
  getRandomBreakSuggestion: jest.fn(() => 'Take a short walk 🚶‍♂️'),
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
  formatTime: jest.fn((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  })
};

describe('Timer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render timer with correct time display', () => {
    render(<Timer {...defaultProps} />);
    
    expect(defaultProps.formatTime).toHaveBeenCalledWith(1500);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('should show Focus Time when not on break', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByText('Focus Time')).toBeInTheDocument();
  });

  it('should show Break Time when on break', () => {
    render(<Timer {...defaultProps} isBreak={true} />);
    
    expect(screen.getByText('Break Time')).toBeInTheDocument();
  });

  it('should display session stats correctly', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByText('2/8 today')).toBeInTheDocument();
    expect(screen.getByText('5 day streak')).toBeInTheDocument();
  });

  it('should render Start Focus button when not running and not paused', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByText('Start Focus')).toBeInTheDocument();
  });

  it('should render Start Break button when on break and not running', () => {
    render(<Timer {...defaultProps} isBreak={true} />);
    
    expect(screen.getByText('Start Break')).toBeInTheDocument();
  });

  it('should render Pause button when running', () => {
    render(<Timer {...defaultProps} isRunning={true} />);
    
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('should render Resume button when paused', () => {
    render(<Timer {...defaultProps} isPaused={true} />);
    
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('should show Stop button when running or paused', () => {
    const { rerender } = render(<Timer {...defaultProps} isRunning={true} />);
    expect(screen.getByText('Stop')).toBeInTheDocument();

    rerender(<Timer {...defaultProps} isPaused={true} />);
    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  it('should always show Reset button', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should call onStart when Start button is clicked', () => {
    render(<Timer {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Start Focus'));
    expect(defaultProps.onStart).toHaveBeenCalled();
  });

  it('should call onPause when Pause button is clicked', () => {
    render(<Timer {...defaultProps} isRunning={true} />);
    
    fireEvent.click(screen.getByText('Pause'));
    expect(defaultProps.onPause).toHaveBeenCalled();
  });

  it('should call onResume when Resume button is clicked', () => {
    render(<Timer {...defaultProps} isPaused={true} />);
    
    fireEvent.click(screen.getByText('Resume'));
    expect(defaultProps.onResume).toHaveBeenCalled();
  });

  it('should call onStop when Stop button is clicked', () => {
    render(<Timer {...defaultProps} isRunning={true} />);
    
    fireEvent.click(screen.getByText('Stop'));
    expect(defaultProps.onStop).toHaveBeenCalled();
  });

  it('should call onReset when Reset button is clicked', () => {
    render(<Timer {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Reset'));
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it('should render task input when not on break', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('What are you focusing on?')).toBeInTheDocument();
  });

  it('should not render task input when on break', () => {
    render(<Timer {...defaultProps} isBreak={true} />);
    
    expect(screen.queryByPlaceholderText('What are you focusing on?')).not.toBeInTheDocument();
  });

  it('should call onTaskChange when task input changes', () => {
    render(<Timer {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('What are you focusing on?');
    fireEvent.change(input, { target: { value: 'New task' } });
    
    expect(defaultProps.onTaskChange).toHaveBeenCalledWith('New task');
  });

  it('should render category select when not on break', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByDisplayValue(/work/i)).toBeInTheDocument();
  });

  it('should call onCategoryChange when category changes', () => {
    render(<Timer {...defaultProps} />);
    
    const select = screen.getByDisplayValue(/work/i);
    fireEvent.change(select, { target: { value: 'learning' } });
    
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('learning');
  });

  it('should disable task input and category select when running', () => {
    render(<Timer {...defaultProps} isRunning={true} />);
    
    const input = screen.getByPlaceholderText('What are you focusing on?');
    const select = screen.getByDisplayValue(/work/i);
    
    expect(input).toBeDisabled();
    expect(select).toBeDisabled();
  });

  it('should show break suggestion when on break', () => {
    render(<Timer {...defaultProps} isBreak={true} />);
    
    expect(defaultProps.getRandomBreakSuggestion).toHaveBeenCalled();
    expect(screen.getByText('Take a short walk 🚶‍♂️')).toBeInTheDocument();
  });

  it('should show regular break message for short breaks', () => {
    render(<Timer {...defaultProps} isBreak={true} sessionCount={1} />);
    
    expect(screen.getByText('Break Time! 🌱')).toBeInTheDocument();
  });

  it('should show long break message when session count is multiple of longBreakInterval', () => {
    render(<Timer {...defaultProps} isBreak={true} sessionCount={4} longBreakInterval={4} />);
    
    expect(screen.getByText('Long Break Time! 🎉')).toBeInTheDocument();
  });

  it('should render all category options', () => {
    render(<Timer {...defaultProps} />);
    
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('work');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('personal');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('learning');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('creative');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('health');
  });

  it('should show keyboard shortcuts', () => {
    render(<Timer {...defaultProps} />);
    
    expect(screen.getByText(/Shortcuts: Space/)).toBeInTheDocument();
  });

  it('should apply dark mode styles when darkMode is true', () => {
    render(<Timer {...defaultProps} darkMode={true} />);
    
    const container = screen.getByText('25:00').closest('div');
    expect(container).toHaveClass('text-indigo-400');
  });

  it('should apply light mode styles when darkMode is false', () => {
    render(<Timer {...defaultProps} darkMode={false} />);
    
    const container = screen.getByText('25:00').closest('div');
    expect(container).toHaveClass('text-indigo-600');
  });

  it('should display current task value', () => {
    render(<Timer {...defaultProps} currentTask="Write tests" />);
    
    const input = screen.getByPlaceholderText('What are you focusing on?');
    expect(input).toHaveValue('Write tests');
  });

  it('should display selected category', () => {
    render(<Timer {...defaultProps} taskCategory="learning" />);
    
    const select = screen.getByDisplayValue(/learning/i);
    expect(select).toHaveValue('learning');
  });
});