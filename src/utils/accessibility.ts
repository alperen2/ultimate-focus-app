/**
 * Accessibility utilities and helpers
 */

/**
 * Announces text to screen readers
 */
export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Manages focus trap for modal dialogs
 */
export class FocusTrap {
  private focusableElements: HTMLElement[] = [];
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private previouslyFocusedElement: HTMLElement | null = null;

  constructor(private container: HTMLElement) {
    this.updateFocusableElements();
  }

  private updateFocusableElements(): void {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ];

    this.focusableElements = Array.from(
      this.container.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
    ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  activate(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }

    document.addEventListener('keydown', this.handleKeyDown);
  }

  deactivate(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault();
        this.lastFocusableElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault();
        this.firstFocusableElement?.focus();
      }
    }
  };
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Generates a unique ID for accessibility attributes
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Keyboard navigation helper
 */
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  elements: HTMLElement[],
  currentIndex: number,
  options: {
    horizontal?: boolean;
    vertical?: boolean;
    wrap?: boolean;
  } = {}
): number {
  const { horizontal = true, vertical = true, wrap = true } = options;
  
  let newIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowLeft':
      if (horizontal) {
        newIndex = currentIndex > 0 ? currentIndex - 1 : wrap ? elements.length - 1 : currentIndex;
      }
      break;
    case 'ArrowRight':
      if (horizontal) {
        newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : wrap ? 0 : currentIndex;
      }
      break;
    case 'ArrowUp':
      if (vertical) {
        newIndex = currentIndex > 0 ? currentIndex - 1 : wrap ? elements.length - 1 : currentIndex;
      }
      break;
    case 'ArrowDown':
      if (vertical) {
        newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : wrap ? 0 : currentIndex;
      }
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = elements.length - 1;
      break;
    default:
      return currentIndex;
  }
  
  if (newIndex !== currentIndex) {
    event.preventDefault();
    elements[newIndex]?.focus();
  }
  
  return newIndex;
}