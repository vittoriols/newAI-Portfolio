import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Play, Pause, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { askMeContext, getContextSummary } from '../../data/askme-context';

function AskMeSection() {
  const messagesData = [
    {
      role: 'assistant',
      content: "Hi! I'm an AI assistant trained on Vittorio's professional background. Ask me anything about his experience, skills, projects, or achievements!"
    }
  ];

  const suggestedQuestionsData = [
    "What's your technical background?",
    "Tell me about your SAP Ariba experience",
    "What major projects have you led?",
    "What are your key certifications and awards?"
  ];

  const [messages, setMessages] = useState(messagesData);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  
  // Leggi token Groq da variabile d'ambiente
  const GROQ_TOKEN = process.env.REACT_APP_GROQ_TOKEN;

  const scrollToBottom = function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(scrollToBottom, [messages]);

  // Setup audio player
  useEffect(function() {
    // Path assoluto per GitHub Pages
    const audioPath = process.env.PUBLIC_URL + '/audio/AI_Audio_3_Short.mp3';
    
    // Crea elemento audio
    audioRef.current = new Audio(audioPath);
    
    // Event listeners per l'audio
    const audio = audioRef.current;
    
    const updateProgress = function() {
      if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setAudioProgress(progress);
        setCurrentTime(audio.currentTime);
      }
    };
    
    const handleLoadedMetadata = function() {
      setDuration(audio.duration);
      setAudioError(null);
      console.log('Audio loaded successfully:', audioPath);
    };
    
    const handleEnded = function() {
      setIsPlaying(false);
      setAudioProgress(0);
      setCurrentTime(0);
    };
    
    const handleError = function(e) {
      console.error('Audio error:', e);
      console.error('Audio path:', audioPath);
      setAudioError('Audio file not found. Please check if the file exists in public/audio/');
      setIsPlaying(false);
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Test caricamento
    audio.load();
    
    // Cleanup
    return function() {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Funzione per preparare il context
  const prepareContext = function() {
    const contextSummary = `
ABOUT VITTORIO LORIS SIMONETTI:
${getContextSummary()}

KEY PROJECTS:
${askMeContext.keyProjects.slice(0, 4).map(p => 
  `- ${p.name} (${p.period}): ${p.description.substring(0, 120)}...`
).join('\n')}

PUBLICATIONS:
${askMeContext.publications.map(p => 
  `- ${p.title} (${p.type}, ${p.year || p.date})`
).join('\n')}

TOP CERTIFICATIONS:
${askMeContext.certifications.slice(0, 6).map(c => 
  `- ${c.name} (${c.issuer})`
).join('\n')}`;
    
    return contextSummary;
  };

  // Funzione per chiamare Groq API
  const callGroqAPI = async function(userQuestion) {
    if (!GROQ_TOKEN) {
      throw new Error('Groq token not configured. Please add REACT_APP_GROQ_TOKEN to your .env.local file.');
    }

    const contextInfo = prepareContext();

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant representing Vittorio Loris Simonetti, an Electronic Engineer and SAP Solution Architect at IBM. Answer questions about Vittorio\'s professional background based ONLY on the context provided. Be conversational, helpful, and professional. Keep answers concise (2-3 paragraphs max). If asked about something not in the context, politely say you don\'t have that specific information.'
            },
            {
              role: 'user',
              content: `Context about Vittorio:\n\n${contextInfo}\n\n---\n\nUser Question: ${userQuestion}\n\nPlease provide a helpful, conversational answer based on the context above.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      
      if (response.status === 401) {
        throw new Error('Invalid Groq API token. Please check your configuration.');
      }
      
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    
    throw new Error('No response generated');
  };

  const handleSendMessage = async function() {
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputValue
    };

    setMessages(function(prev) { return prev.concat(userMessage); });
    const currentQuestion = inputValue;
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      const aiResponseText = await callGroqAPI(currentQuestion);
      
      const aiResponse = {
        role: 'assistant',
        content: aiResponseText
      };
      
      setMessages(function(prev) { return prev.concat(aiResponse); });
      
    } catch (err) {
      console.error('Error calling Groq API:', err);
      
      const errorMessage = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${err.message}. Please try again in a moment.`,
        isError: true
      };
      
      setMessages(function(prev) { return prev.concat(errorMessage); });
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuestionClick = function(question) {
    setInputValue(question);
  };

  const handleKeyPress = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleAudio = function() {
    if (!audioRef.current) {
      setAudioError('Audio player not initialized');
      return;
    }
    
    if (audioError) {
      setAudioError('Cannot play audio: file not found');
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(function(err) {
        console.error('Audio play error:', err);
        setAudioError('Could not play audio: ' + err.message);
      });
      setIsPlaying(true);
    }
  };

  // Formatta tempo in mm:ss
  const formatTime = function(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return React.createElement('section', { 
    className: 'space-y-6 max-w-5xl mx-auto px-4',
    id: 'askme-section' 
  },
    // Header
    React.createElement('div', { className: 'mb-12' },
      React.createElement('h2', { 
        className: 'text-5xl md:text-6xl font-bold mb-4',
        style: {
          background: 'linear-gradient(to right, rgb(96, 165, 250), rgb(6, 182, 212), rgb(59, 130, 246))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }
      }, 'Ask Me Anything'),
      React.createElement('p', { className: 'text-xl text-slate-400 max-w-2xl' },
        "Have questions? Chat with my AI assistant or listen to my professional story"
      )
    ),

    // Error banner (se presente)
    (error || audioError) && React.createElement('div', {
      className: 'p-4 rounded-xl flex items-start gap-3',
      style: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      }
    },
      React.createElement(AlertCircle, { 
        size: 20, 
        className: 'text-red-400 flex-shrink-0 mt-0.5' 
      }),
      React.createElement('div', null,
        React.createElement('p', { 
          className: 'text-sm font-semibold text-red-400 mb-1' 
        }, audioError ? 'Audio Issue' : 'Connection Issue'),
        React.createElement('p', { 
          className: 'text-xs text-slate-300' 
        }, audioError || error)
      )
    ),

    // Container principale
    React.createElement('div', { 
      className: 'flex gap-6',
      style: {
        flexDirection: isMobile ? 'column' : 'row'
      }
    },
      
      // ========== CHAT ==========
      React.createElement('div', { 
        className: 'flex-1',
        style: {
          order: isMobile ? 1 : 2,
          opacity: 0,
          animation: 'fadeInUp 0.6s ease-out 0.4s forwards'
        }
      },
        React.createElement('div', { 
          className: 'chat-container rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-2 border-cyan-500/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-cyan-500/20' 
        },
          // Area messaggi
          React.createElement('div', { 
            className: 'messages-area p-6 h-[350px] overflow-y-auto space-y-4' 
          },
            messages.map(function(msg, i) {
              return React.createElement('div', {
                key: i,
                className: 'message-bubble',
                style: {
                  opacity: 0,
                  animation: 'fadeInFromBottom 0.4s ease-out ' + (i * 0.1) + 's forwards'
                }
              },
                React.createElement('div', {
                  className: 'flex gap-3 items-start ' + (msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')
                },
                  React.createElement('div', {
                    className: 'avatar ' + (msg.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : (msg.isError ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-cyan-500 to-blue-500'))
                  }, 
                    React.createElement(msg.role === 'user' ? User : (msg.isError ? AlertCircle : Bot), { size: 20, className: 'text-white' })
                  ),
                  React.createElement('div', {
                    className: 'message-content ' + (msg.role === 'user' ? 'user-bubble' : 'assistant-bubble')
                  }, msg.content)
                )
              );
            }),

            isTyping && React.createElement('div', { className: 'message-bubble' },
              React.createElement('div', { className: 'flex gap-3 items-start' },
                React.createElement('div', { className: 'avatar bg-gradient-to-br from-cyan-500 to-blue-500' }, 
                  React.createElement(Bot, { size: 20, className: 'text-white' })
                ),
                React.createElement('div', { className: 'message-content assistant-bubble' },
                  React.createElement('div', { className: 'typing-indicator' },
                    React.createElement('span'),
                    React.createElement('span'),
                    React.createElement('span')
                  )
                )
              )
            ),
            React.createElement('div', { ref: messagesEndRef })
          ),

          // Suggested questions
          messages.length === 1 && React.createElement('div', { 
            className: 'px-6 pb-4 border-t border-slate-700/50 pt-4' 
          },
            React.createElement('div', { 
              className: 'text-sm text-slate-400 mb-3 font-semibold' 
            }, 'Suggested questions:'),
            React.createElement('div', { className: 'flex flex-wrap gap-2' },
              suggestedQuestionsData.map(function(q, i) {
                return React.createElement('button', {
                  key: i,
                  onClick: function() { handleQuestionClick(q); },
                  className: 'px-4 py-2 text-sm bg-slate-800/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all text-slate-300 hover:text-cyan-300'
                }, q);
              })
            )
          ),

          // Input area
          React.createElement('div', { 
            className: 'input-area p-4 border-t border-slate-700/50 bg-slate-900/60' 
          },
            React.createElement('div', { className: 'flex gap-3' },
              React.createElement('input', {
                type: 'text',
                value: inputValue,
                onChange: function(e) { setInputValue(e.target.value); },
                onKeyPress: handleKeyPress,
                placeholder: 'Ask me anything about Vittorio...',
                disabled: isTyping,
                className: 'flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50'
              }),
              React.createElement('button', {
                onClick: handleSendMessage,
                disabled: !inputValue.trim() || isTyping,
                className: 'px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white'
              },
                React.createElement(Send, { size: 20 })
              )
            )
          )
        )
      ),

      // ========== AUDIO PLAYER ==========
      React.createElement('div', { 
        className: 'flex-shrink-0',
        style: {
          width: isMobile ? '100%' : '280px',
          order: isMobile ? 2 : 1,
          opacity: 0,
          animation: 'fadeInUp 0.6s ease-out 0.2s forwards'
        }
      },
        React.createElement('div', {
          className: 'rounded-2xl overflow-hidden relative p-6',
          style: {
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15))',
            border: '2px solid rgba(6, 182, 212, 0.4)',
            backdropFilter: 'blur(10px)'
          }
        },
          // Badge AI centrato
          React.createElement('div', {
            className: 'flex justify-center mb-4'
          },
            React.createElement('div', {
              className: 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold',
              style: {
                background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)'
              }
            },
              React.createElement(Sparkles, { size: 14 }),
              React.createElement('span', null, 'AI POWERED')
            )
          ),

          // Titolo
          React.createElement('div', {
            className: 'text-center mb-6'
          },
            React.createElement('h3', {
              className: 'text-lg font-bold mb-1',
              style: {
                background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }
            }, 'Professional Story'),
            React.createElement('p', {
              className: 'text-xs text-slate-400'
            }, 'AI narration by NotebookLM')
          ),

          // Play button
          React.createElement('div', {
            className: 'flex justify-center mb-6'
          },
            React.createElement('div', {
              className: 'relative'
            },
              React.createElement('div', {
                className: 'absolute inset-0 rounded-full',
                style: {
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent)',
                  animation: isPlaying ? 'pulse 2s ease-in-out infinite' : 'none',
                  transform: 'scale(1.4)'
                }
              }),
              
              React.createElement('button', {
                onClick: toggleAudio,
                disabled: !!audioError,
                className: 'relative rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
                style: {
                  width: '64px',
                  height: '64px',
                  aspectRatio: '1 / 1',
                  background: audioError ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  boxShadow: isPlaying 
                    ? '0 0 30px rgba(6, 182, 212, 0.6)' 
                    : '0 6px 20px rgba(6, 182, 212, 0.4)',
                  transform: isPlaying ? 'scale(1.05)' : 'scale(1)'
                }
              },
                React.createElement(isPlaying ? Pause : Play, {
                  size: 24,
                  className: 'text-white',
                  style: { marginLeft: isPlaying ? '0' : '3px' }
                })
              )
            )
          ),

          // Onde sonore
          React.createElement('div', {
            className: 'flex items-center justify-center gap-1 mb-6'
          },
            [8, 14, 18, 24, 18, 14, 20, 16, 12].map(function(height, i) {
              return React.createElement('div', {
                key: i,
                className: 'rounded-full',
                style: {
                  width: '3px',
                  height: height + 'px',
                  background: 'linear-gradient(to top, #06b6d4, #3b82f6)',
                  animation: isPlaying ? 'wave 1s ease-in-out infinite' : 'none',
                  animationDelay: (i * 0.1) + 's',
                  opacity: isPlaying ? 1 : 0.4
                }
              });
            })
          ),

          // Progress bar
          React.createElement('div', { className: 'mb-3' },
            React.createElement('div', {
              className: 'h-1 rounded-full overflow-hidden',
              style: {
                background: 'rgba(15, 23, 42, 0.5)'
              }
            },
              React.createElement('div', {
                className: 'h-full rounded-full transition-all duration-300',
                style: {
                  width: audioProgress + '%',
                  background: 'linear-gradient(to right, #06b6d4, #3b82f6)'
                }
              })
            ),
            React.createElement('div', {
              className: 'flex justify-between text-xs text-slate-400 mt-1'
            },
              React.createElement('span', null, formatTime(currentTime)),
              React.createElement('span', null, formatTime(duration))
            )
          ),

          // Info footer
          React.createElement('div', {
            className: 'flex items-center justify-center gap-2 text-xs text-slate-400 pt-3 border-t border-slate-600/50'
          },
            React.createElement(Volume2, { size: 12 }),
            React.createElement('span', null, audioError ? 'Audio unavailable' : 'Generated with Google AI')
          )
        )
      )
    ),

    React.createElement('div', { 
      className: 'text-center text-sm text-slate-500 mt-4' 
    },
      React.createElement('span', null, '⚡ Powered by '),
      React.createElement('span', { 
        className: 'font-semibold',
        style: {
          background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }
      }, 'Groq Llama 3.1'),
      React.createElement('span', null, ' • Lightning-fast AI responses')
    ),

    // CSS
    React.createElement('style', null, `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInFromBottom {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 0.5;
          transform: scale(1.5);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.8);
        }
      }

      @keyframes wave {
        0%, 100% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(1.5);
        }
      }

      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .message-content {
        padding: 12px 16px;
        border-radius: 16px;
        max-width: 80%;
        line-height: 1.5;
      }

      .user-bubble {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.3));
        border: 1px solid rgba(59, 130, 246, 0.4);
        color: white;
        margin-left: auto;
      }

      .assistant-bubble {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
        border: 1px solid rgba(71, 85, 105, 0.5);
        color: rgb(226, 232, 240);
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 8px 0;
      }

      .typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgb(6, 182, 212);
        animation: typing 1.4s ease-in-out infinite;
      }

      .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes typing {
        0%, 60%, 100% {
          transform: translateY(0);
          opacity: 0.7;
        }
        30% {
          transform: translateY(-10px);
          opacity: 1;
        }
      }

      .messages-area::-webkit-scrollbar {
        width: 8px;
      }

      .messages-area::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.3);
        border-radius: 10px;
      }

      .messages-area::-webkit-scrollbar-thumb {
        background: rgba(6, 182, 212, 0.3);
        border-radius: 10px;
      }

      .messages-area::-webkit-scrollbar-thumb:hover {
        background: rgba(6, 182, 212, 0.5);
      }
    `)
  );
}

export default AskMeSection;