// Helper functions for the Ultimate Focus App

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getPriorityColor = (priority: string, darkMode: boolean): string => {
  const colors = {
    low: darkMode ? 'text-green-400' : 'text-green-600',
    medium: darkMode ? 'text-yellow-400' : 'text-yellow-600',
    high: darkMode ? 'text-orange-400' : 'text-orange-600',
    urgent: darkMode ? 'text-red-400' : 'text-red-600'
  };
  return colors[priority as keyof typeof colors];
};

export const getCategoryIcon = (category: string): string => {
  const icons = {
    work: '💼', 
    personal: '🏠', 
    learning: '📚', 
    creative: '🎨', 
    health: '💪'
  };
  return icons[category as keyof typeof icons] || '📝';
};

export const getRandomBreakSuggestion = (): string => {
  const breakSuggestions = {
    physical: [
      "🚶‍♀️ Take a 2-minute walk around your space",
      "🤸‍♂️ Do 10 jumping jacks or push-ups",
      "🧘‍♀️ Try some neck and shoulder rolls",
      "👀 Look out the window at something far away",
      "🤲 Stretch your wrists and fingers",
      "🧍‍♂️ Stand up and do some gentle twists",
      "🦵 Do some calf raises or leg stretches",
      "💪 Stretch your arms above your head"
    ],
    mental: [
      "🧠 Practice 2 minutes of deep breathing",
      "🎵 Listen to your favorite song",
      "📱 Text someone you care about",
      "📝 Jot down 3 things you're grateful for",
      "🌟 Visualize your next accomplishment",
      "🧘‍♂️ Try a quick meditation",
      "📚 Read a few pages of something inspiring",
      "🎨 Doodle or sketch for a few minutes"
    ],
    refresh: [
      "💧 Drink a full glass of water",
      "☕ Make your favorite beverage",
      "🍎 Grab a healthy snack",
      "🌱 Check on your plants",
      "🪟 Open a window for fresh air",
      "💦 Splash cool water on your face",
      "🧴 Apply some hand lotion",
      "🍃 Step outside for fresh air"
    ],
    social: [
      "👋 Say hi to a colleague or roommate",
      "📞 Make a quick call to family",
      "💬 Send an encouraging message to a friend",
      "🤝 Give someone a genuine compliment",
      "📧 Reply to a personal message",
      "👥 Check in with your team",
      "🎉 Share a small win with someone",
      "❤️ Express appreciation to someone"
    ]
  };

  const categories = Object.keys(breakSuggestions);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const suggestions = breakSuggestions[randomCategory as keyof typeof breakSuggestions];
  return suggestions[Math.floor(Math.random() * suggestions.length)] || 'Take a break and relax';
};