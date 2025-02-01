import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Send, User, Bot } from 'lucide-react';
import { Input } from './ui/input';
import year1Words from '../data/year1';

const TypingAnimation = () => (
  <div className="flex space-x-1 p-2">
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Willkommen! Wähle ein Jahr zum Lernen aus:',
      options: ['Jahr 1', 'Jahr 2', 'Jahr 3', 'Jahr 4']
    
    }

  ]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSubsection, setSelectedSubsection] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState([]);
  const [toReviewWords, setToReviewWords] = useState([]);

  const addMessage = (message) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, 1000);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    addMessage({
      type: 'user',
      content: year
    });
    addMessage({
      type: 'bot',
      content: 'Wähle einen Abschnitt zum Lernen aus:',
      options: Object.keys(year1Words.sections)
    });
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    const subsections = year1Words.sections[section].map(sub => sub.name);
    
    addMessage({
      type: 'user',
      content: section
    });

    addMessage({
      type: 'bot',
      content: `Wähle ein Thema aus ${section}:`,
      options: subsections
    });
  };

  const handleSubsectionSelect = (subsectionName) => {
    const subsection = year1Words.sections[selectedSection].find(sub => sub.name === subsectionName);
    setSelectedSubsection(subsection);
    
    addMessage({
      type: 'user',
      content: subsectionName
    });

    addMessage({
      type: 'bot',
      content: 'Was möchtest du tun?',
      options: ['Alle Wörter anzeigen', 'Üben beginnen', 'Quiz starten']
    });
  };

  const handleOption = (option) => {
    // Handle year selection first
    if (option.startsWith('Jahr')) {
      handleYearSelect(option);
      return;
    }

    if (Object.keys(year1Words.sections).includes(option)) {
      handleSectionSelect(option);
      return;
    }

    // Check if option is a subsection name
    for (const section of Object.values(year1Words.sections)) {
      const subsectionNames = section.map(sub => sub.name);
      if (subsectionNames.includes(option)) {
        handleSubsectionSelect(option);
        return;
      }
    }

    switch(option) {
      case 'Alle Wörter anzeigen':
        const wordList = selectedSubsection.words
          .map(word => `${word.german} - ${word.slovenian}`)
          .join('\n');
        
        addMessage({
          type: 'user',
          content: 'Alle Wörter anzeigen'
        });

        addMessage({
          type: 'bot',
          content: `Hier sind alle Wörter aus diesem Abschnitt:\n\n${wordList}`,
          options: ['Üben beginnen', 'Anderen Abschnitt wählen']
        });
        break;

        case 'Üben beginnen':
            setIsFlashcardMode(true);
            setCurrentWordIndex(0);
            setCurrentFlashcard(selectedSubsection.words[0]);
            setIsFlipped(false);
            addMessage({
              type: 'user',
              content: 'Üben beginnen'
            });
            addMessage({
              type: 'bot',
              content: 'Klicke auf die Karte zum Umdrehen. Benutze die Pfeile für die nächste/vorherige Karte.',
              flashcard: true,
            });
            break;

        addMessage({
          type: 'bot',
          content: `Wie lautet das deutsche Wort für "${selectedSubsection.words[0].slovenian}"?`,
          waitingForAnswer: true
        });
        break;

      default:
        // Handle other options
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentWord = selectedSubsection.words[currentWordIndex];
    const isCorrect = userInput.toLowerCase().trim() === currentWord.german.toLowerCase();

    addMessage({
      type: 'user',
      content: userInput
    });

    if (isCorrect) {
      addMessage({
        type: 'bot',
        content: '✅ Richtig!'
      });
    } else {
      addMessage({
        type: 'bot',
        content: `❌ Die richtige Antwort lautet: ${currentWord.german}`
      });
    }

    if (currentWordIndex < selectedSubsection.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: `Wie lautet das deutsche Wort für "${selectedSubsection.words[currentWordIndex + 1].slovenian}"?`,
          waitingForAnswer: true
        });
      }, 1500);
    } else {
      setTimeout(() => {
        addMessage({
          type: 'bot',
          content: 'Übung abgeschlossen! Möchtest du:',
          options: ['Noch einmal üben', 'Anderen Abschnitt wählen']
        });
        setCurrentWordIndex(0);
      }, 1500);
    }

    setUserInput('');
  };

  return (
    <div className={isDarkMode ? 'dark min-h-screen w-full' : 'min-h-screen w-full'}>
      <Card className={`w-full min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors duration-200"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <CardContent className={`p-4 ${isDarkMode ? 'text-white' : ''}`}>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'bot' && (
                  <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
                    <Bot className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-semibold text-base leading-relaxed">
                    {message.content}
                  </p>
                  {message.options && (
                    <div className="mt-2 space-y-2">
                      {message.options.map((option) => (
                        <Button
                          key={option}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOption(option)}
                          className={`w-full justify-start text-left font-semibold transition-all duration-150 hover:scale-105 ${
                            isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : ''
                          }`}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {messages[messages.length - 1]?.waitingForAnswer && (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Gib deine Antwort ein..."
                  className={`flex-1 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  autoComplete="off"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!userInput.trim()}
                  className={`transition-all duration-150 hover:scale-105 ${
                    isDarkMode ? 'bg-blue-500 hover:bg-blue-400' : ''
                  }`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} flex items-center justify-center`}>
                  <Bot className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className={`bg-gray-100 rounded-lg p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <TypingAnimation />
                </div>
              </div>
            )}
          </div>

          {isFlashcardMode && currentFlashcard && (
  <div className="mt-4">
  <div className="flex justify-between items-center mb-4">
    <span className={`${isDarkMode ? 'text-white' : ''}`}>
      {currentWordIndex + 1} / {selectedSubsection.words.length}
    </span>
  </div>
  <div 
    onClick={() => setIsFlipped(!isFlipped)}
    className={`
      cursor-pointer
      perspective-1000
      transition-transform
      duration-500
      transform-style-preserve-3d
      w-full
      h-64
      rounded-xl
      shadow-lg
      ${isDarkMode ? 'bg-gray-700' : 'bg-white'}
      hover:shadow-xl
      flex
      items-center
      justify-center
      text-2xl
      font-bold
      ${isDarkMode ? 'text-white' : 'text-gray-800'}
      mb-4
    `}
    style={{
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    }}
  >
    <div className="absolute backface-hidden w-full h-full flex items-center justify-center text-center px-4">
      {isFlipped ? currentFlashcard.german : currentFlashcard.slovenian}
    </div>
  </div>
  <div className="flex justify-between gap-4">
    <Button
      onClick={() => {
        setToReviewWords([...toReviewWords, currentFlashcard]);
        if (currentWordIndex < selectedSubsection.words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setCurrentFlashcard(selectedSubsection.words[currentWordIndex + 1]);
          setIsFlipped(false);
        } else {
          // End of deck
          setIsFlashcardMode(false);
          addMessage({
            type: 'bot',
            content: `Übung beendet! Du musst ${toReviewWords.length + 1} Wörter wiederholen.`,
            options: ['Wiederholung starten', 'Anderen Abschnitt wählen']
          });
        }
      }}
      className={`flex-1 ${isDarkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'}`}
    >
      Wiederholen ←
    </Button>
    <Button
      onClick={() => {
        setKnownWords([...knownWords, currentFlashcard]);
        if (currentWordIndex < selectedSubsection.words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setCurrentFlashcard(selectedSubsection.words[currentWordIndex + 1]);
          setIsFlipped(false);
        } else {
          // End of deck
          setIsFlashcardMode(false);
          addMessage({
            type: 'bot',
            content: `Übung beendet! Du kennst ${knownWords.length + 1} Wörter gut.`,
            options: ['Wiederholung starten', 'Anderen Abschnitt wählen']
          });
        }
      }}
      className={`flex-1 ${isDarkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400'}`}
    >
      Gewusst →
    </Button>
  </div>
  <div className="mt-4 flex justify-center">
    <Button
      onClick={() => {
        setIsFlashcardMode(false);
        addMessage({
          type: 'bot',
          content: 'Möchtest du:',
          options: ['Noch einmal üben', 'Anderen Abschnitt wählen']
        });
      }}
      className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : ''}`}
    >
      Übung beenden
    </Button>
  </div>
</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
