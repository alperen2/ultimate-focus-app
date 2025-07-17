import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

global.localStorage = localStorageMock

// Mock window.AudioContext
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    frequency: { value: 0 },
    type: 'sine',
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
}))

// Mock Notification API
global.Notification = class MockNotification {
  static permission = 'granted'
  static requestPermission = jest.fn(() => Promise.resolve('granted'))
  
  constructor() {
    // Mock constructor
  }
}

// Mock FileReader
global.FileReader = class {
  result = ''
  onload = jest.fn()
  readAsText = jest.fn(() => {
    this.onload({ target: { result: this.result } })
  })
}

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock window.alert and window.confirm
global.alert = jest.fn()
global.confirm = jest.fn(() => true)

// Mock timers
jest.useFakeTimers()