import React from 'react';
import { Sun, Moon, Download, Upload, Trash2 } from 'lucide-react';
import { AppSettings, AmbientSoundType } from '@/types';

interface SettingsProps {
  settings: AppSettings;
  darkMode: boolean;
  ambientSounds: AmbientSoundType[];
  onSettingChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAllData: () => void;
}

export default function Settings({
  settings,
  darkMode,
  ambientSounds,
  onSettingChange,
  onExportData,
  onImportData,
  onClearAllData
}: SettingsProps) {
  return (
    <div className="space-y-6">
      {/* Timer Settings */}
      <div className={`rounded-xl shadow-lg p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Timer Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Focus Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.focusDuration}
              onChange={(e) => onSettingChange('focusDuration', Number(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Short Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.shortBreakDuration}
              onChange={(e) => onSettingChange('shortBreakDuration', Number(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Long Break (minutes)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.longBreakDuration}
              onChange={(e) => onSettingChange('longBreakDuration', Number(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Daily Goal (sessions)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.dailyGoal}
              onChange={(e) => onSettingChange('dailyGoal', Number(e.target.value))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className={`rounded-xl shadow-lg p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Automation</h3>
        
        <div className="space-y-4">
          {[
            { 
              key: 'autoStartBreaks' as const,
              label: 'Auto-start breaks', 
              desc: 'Automatically start break timer when focus session ends'
            },
            { 
              key: 'autoStartSessions' as const,
              label: 'Auto-start sessions', 
              desc: 'Automatically start next focus session after break'
            },
            { 
              key: 'soundEnabled' as const,
              label: 'Sound notifications', 
              desc: 'Play sound when timer completes'
            }
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {setting.label}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {setting.desc}
                </p>
              </div>
              <button
                onClick={() => onSettingChange(setting.key, !settings[setting.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[setting.key] ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance Settings */}
      <div className={`rounded-xl shadow-lg p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Appearance & Audio</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dark Mode
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={() => onSettingChange('darkMode', !darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Ambient Sound</label>
            <select
              value={settings.ambientSound}
              onChange={(e) => onSettingChange('ambientSound', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {ambientSounds.map(sound => (
                <option key={sound} value={sound} className={darkMode ? 'bg-gray-700' : 'bg-white'}>
                  {sound === 'none' ? '🔇 None' : `🎵 ${sound.charAt(0).toUpperCase() + sound.slice(1).replace('-', ' ')}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className={`rounded-xl shadow-lg p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Data Management</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExportData}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 active:bg-green-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
          
          <button
            onClick={() => document.getElementById('import-file')?.click()}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <Upload className="w-5 h-5" />
            <span>Import Data</span>
          </button>
          
          <button
            onClick={onClearAllData}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear All Data</span>
          </button>
          
          <input
            id="import-file"
            type="file"
            accept=".json"
            className="hidden"
            onChange={onImportData}
          />
        </div>
        
        <div className={`mt-4 p-3 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            💾 <strong>Auto-Save:</strong> All your data is automatically saved to your browser&apos;s local storage. 
            Your progress, settings, and tasks will be preserved between sessions.
          </p>
        </div>
      </div>

      {/* Notification Status */}
      <div className={`rounded-xl shadow-lg p-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>Notifications</h3>
        
        <div className="flex items-center justify-between">
          <span className={`text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Desktop Notifications
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            'Notification' in window && Notification.permission === 'granted'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {'Notification' in window 
              ? Notification.permission === 'granted' 
                ? '✓ Enabled' 
                : 'Click Start to enable'
              : 'Not supported'
            }
          </span>
        </div>
      </div>
    </div>
  );
}