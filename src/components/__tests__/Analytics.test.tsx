import React from 'react';
import { render, screen } from '@testing-library/react';
import Analytics from '../Analytics';
import { Session } from '@/types';

const mockSessions: Session[] = [
  {
    id: 1,
    task: 'Write unit tests',
    category: 'work',
    duration: 25,
    completedAt: new Date('2023-10-15T10:30:00'),
    date: '2023-10-15'
  },
  {
    id: 2,
    task: 'Read documentation',
    category: 'learning',
    duration: 25,
    completedAt: new Date('2023-10-15T11:00:00'),
    date: '2023-10-15'
  },
  {
    id: 3,
    task: 'Exercise',
    category: 'health',
    duration: 30,
    completedAt: new Date('2023-10-15T12:00:00'),
    date: '2023-10-15'
  }
];

const defaultProps = {
  todaySessions: 3,
  dailyGoal: 8,
  totalFocusTime: 120, // 2 hours in minutes
  currentStreak: 5,
  completedSessions: mockSessions,
  darkMode: false,
  getCategoryIcon: jest.fn((category: string) => {
    const icons: Record<string, string> = {
      work: '💼',
      learning: '📚',
      health: '💪',
      personal: '🏠',
      creative: '🎨'
    };
    return icons[category] || '📝';
  })
};

describe('Analytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render analytics stats correctly', () => {
    render(<Analytics {...defaultProps} />);
    
    // Check Today stat
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('3/8')).toBeInTheDocument();
    
    // Check Total Time stat
    expect(screen.getByText('Total Time')).toBeInTheDocument();
    expect(screen.getByText('2h 0m')).toBeInTheDocument();
    
    // Check Streak stat
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('5 days')).toBeInTheDocument();
    
    // Check Sessions stat
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should format total time correctly with minutes', () => {
    render(<Analytics {...defaultProps} totalFocusTime={150} />); // 2h 30m
    
    expect(screen.getByText('2h 30m')).toBeInTheDocument();
  });

  it('should format total time correctly for less than an hour', () => {
    render(<Analytics {...defaultProps} totalFocusTime={45} />); // 45 minutes
    
    expect(screen.getByText('0h 45m')).toBeInTheDocument();
  });

  it('should render Recent Sessions section', () => {
    render(<Analytics {...defaultProps} />);
    
    expect(screen.getByText('Recent Sessions')).toBeInTheDocument();
  });

  it('should display completed sessions', () => {
    render(<Analytics {...defaultProps} />);
    
    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
    expect(screen.getByText('Read documentation')).toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();
  });

  it('should show session duration and time', () => {
    render(<Analytics {...defaultProps} />);
    
    // Check for duration and time display - use getAllByText since there are multiple sessions
    expect(screen.getAllByText(/25 min/).length).toBeGreaterThan(0);
    expect(screen.getByText(/30 min/)).toBeInTheDocument();
  });

  it('should call getCategoryIcon for each session', () => {
    render(<Analytics {...defaultProps} />);
    
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('work');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('learning');
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('health');
  });

  it('should show empty state when no sessions completed', () => {
    render(<Analytics {...defaultProps} completedSessions={[]} />);
    
    expect(screen.getByText('No completed sessions yet')).toBeInTheDocument();
  });

  it('should not show completed sessions when empty', () => {
    render(<Analytics {...defaultProps} completedSessions={[]} />);
    
    expect(screen.queryByText('Write unit tests')).not.toBeInTheDocument();
    expect(screen.queryByText('Read documentation')).not.toBeInTheDocument();
  });

  it('should apply dark mode styles when darkMode is true', () => {
    render(<Analytics {...defaultProps} darkMode={true} />);
    
    const statsElements = screen.getAllByText(/Today|Total Time|Streak|Sessions/);
    const todayElement = statsElements.find(el => el.textContent === 'Today');
    expect(todayElement).toHaveClass('text-gray-400');
  });

  it('should apply light mode styles when darkMode is false', () => {
    render(<Analytics {...defaultProps} darkMode={false} />);
    
    const statsElements = screen.getAllByText(/Today|Total Time|Streak|Sessions/);
    const todayElement = statsElements.find(el => el.textContent === 'Today');
    expect(todayElement).toHaveClass('text-gray-500');
  });

  it('should show trophy icons for completed sessions', () => {
    render(<Analytics {...defaultProps} />);
    
    // Check that trophy SVG elements are present by looking for the SVG class
    const trophyElements = document.querySelectorAll('.lucide-trophy');
    // Each session has a trophy icon, so we should have 3
    expect(trophyElements.length).toBe(3);
  });

  it('should display sessions in reverse chronological order (most recent first)', () => {
    render(<Analytics {...defaultProps} />);
    
    const sessionElements = screen.getAllByText(/Write unit tests|Read documentation|Exercise/);
    
    // Since sessions are displayed in reverse order (slice(-10).reverse()),
    // the most recent session "Exercise" should appear first
    expect(sessionElements[0]).toHaveTextContent('Exercise');
    expect(sessionElements[1]).toHaveTextContent('Read documentation');
    expect(sessionElements[2]).toHaveTextContent('Write unit tests');
  });

  it('should limit to 10 most recent sessions', () => {
    // Create 15 sessions
    const manySessions = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      task: `Task ${i + 1}`,
      category: 'work' as const,
      duration: 25,
      completedAt: new Date(`2023-10-15T${10 + i}:00:00`),
      date: '2023-10-15'
    }));

    render(<Analytics {...defaultProps} completedSessions={manySessions} />);
    
    // Should only show the last 10 tasks (Task 6 through Task 15)
    expect(screen.getByText('Task 15')).toBeInTheDocument();
    expect(screen.getByText('Task 6')).toBeInTheDocument();
    expect(screen.queryByText('Task 5')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  it('should handle zero values correctly', () => {
    render(<Analytics 
      {...defaultProps} 
      todaySessions={0}
      totalFocusTime={0}
      currentStreak={0}
      completedSessions={[]}
    />);
    
    expect(screen.getByText('0/8')).toBeInTheDocument();
    expect(screen.getByText('0h 0m')).toBeInTheDocument();
    expect(screen.getByText('0 days')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display stat icons correctly', () => {
    render(<Analytics {...defaultProps} />);
    
    // Check that each stat label is displayed exactly once in the stats section
    expect(screen.getAllByText('Today').length).toBe(1);
    expect(screen.getAllByText('Total Time').length).toBe(1);
    expect(screen.getAllByText('Streak').length).toBe(1);
    expect(screen.getAllByText('Sessions').length).toBe(1);
  });

  it('should format session time correctly', () => {
    const sessionWithSpecificTime = [{
      id: 1,
      task: 'Test task',
      category: 'work' as const,
      duration: 45,
      completedAt: new Date('2023-10-15T14:30:15'), // Specific time with seconds
      date: '2023-10-15'
    }];

    render(<Analytics {...defaultProps} completedSessions={sessionWithSpecificTime} />);
    
    expect(screen.getByText(/45 min/)).toBeInTheDocument();
    // Time should be formatted as locale time string
    expect(screen.getByText(/2:30:15 PM|14:30:15/)).toBeInTheDocument();
  });

  it('should handle missing category icons gracefully', () => {
    const sessionWithUnknownCategory = [{
      id: 1,
      task: 'Unknown category task',
      category: 'unknown' as CategoryType,
      duration: 25,
      completedAt: new Date('2023-10-15T10:30:00'),
      date: '2023-10-15'
    }];

    render(<Analytics {...defaultProps} completedSessions={sessionWithUnknownCategory} />);
    
    expect(defaultProps.getCategoryIcon).toHaveBeenCalledWith('unknown');
    expect(screen.getByText('Unknown category task')).toBeInTheDocument();
  });
});