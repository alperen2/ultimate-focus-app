import { useState } from 'react';
import { Task, CategoryType, PriorityType } from '@/types';
import { useLocalStorage } from './useLocalStorage';

export function useTaskQueue() {
  const [taskQueue, setTaskQueue] = useLocalStorage<Task[]>('focus-app-taskQueue', []);
  const [newQueueTask, setNewQueueTask] = useState('');
  const [taskCategory, setTaskCategory] = useState<CategoryType>('work');
  const [taskPriority, setTaskPriority] = useState<PriorityType>('medium');

  const addToQueue = () => {
    if (newQueueTask.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: newQueueTask.trim(),
        description: '',
        projectId: undefined,
        category: taskCategory,
        priority: taskPriority,
        completed: false,
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: undefined
      };
      setTaskQueue(prev => [...prev, newTask]);
      setNewQueueTask('');
    }
  };

  const removeFromQueue = (id: number) => {
    setTaskQueue(prev => prev.filter(task => task.id !== id));
  };

  const moveToCurrentTask = (task: Task, onTaskSelect: (text: string, category: CategoryType) => void) => {
    onTaskSelect(task.text, task.category as CategoryType);
    removeFromQueue(task.id);
  };

  const clearAllTasks = () => {
    setTaskQueue([]);
  };

  const importTasks = (tasks: Task[]) => {
    setTaskQueue(tasks);
  };

  return {
    taskQueue,
    newQueueTask,
    setNewQueueTask,
    taskCategory,
    setTaskCategory,
    taskPriority,
    setTaskPriority,
    addToQueue,
    removeFromQueue,
    moveToCurrentTask,
    clearAllTasks,
    importTasks
  };
}