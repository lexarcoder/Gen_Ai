import React, { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  ArrowUp,
  Bot,
  Brain,
  Cpu,
  FileText,
  Image as ImageIcon,
  Loader2,
  LogOut,
  MessageSquareX,
  Moon,
  Paperclip,
  SearchCode,
  Settings as SettingsIcon,
  ShieldCheck,
  Trash2,
  User,
  Video,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import "../style/AIChatBot.scss";
import Header from "../components/Header";
import Slider from "../components/Slider";

function AIChatBot() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedModel, setSelectedModel] = useState("lexar-v2");
  const [isMemoryEnabled, setIsMemoryEnabled] = useState(true);


useEffect(() => {
  document.documentElement.setAttribute("data-theme", selectedTheme);
}, [selectedTheme]);

  const {user, handleLogout} = useAuth()


  const [chats] = useState([
    {
      _id: "1",
      title: "React Component Logic",
    },
    {
      _id: "2",
      title: "UI Glassmorphism Fixes",
    },
  ]);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const mediaMenuRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mediaMenuRef.current &&
        !mediaMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setSelectedFile(null);
    setActiveMode(null);
    setInputValue("");
  };

  const handleClearCurrentChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setInputValue("");
    setSelectedFile(null);
    setActiveMode(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsSettingsOpen(false);
  };

  const handleClearChatHistory = () => {
    setMessages([]);
    setActiveChatId(null);
  };

  const handleClearMemory = () => {
    setIsMemoryEnabled(false);
  };

  const handleMenuClick = (type) => {
    setIsMenuOpen(false);

    if (type === "file") {
      fileInputRef.current?.click();
      return;
    }

    setActiveMode(type);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setActiveMode(null);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() && !selectedFile) {
      return;
    }

    const userMessage = {
      role: "user",
      content: inputValue,
      mode: activeMode,
      attachments: selectedFile
        ? [
            {
              name: selectedFile.name,
              type: selectedFile.type,
              url: URL.createObjectURL(selectedFile),
            },
          ]
        : [],
    };

    const currentMode = activeMode;
    const currentText = inputValue;

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInputValue("");
    setSelectedFile(null);
    setActiveMode(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage = {
        role: "assistant",
        content:
          currentMode === "image"
            ? `Here is your generated image output for "${currentText}":`
            : "Frontend UI ready! Your API payload is ready to be sent.",

        imageUrl:
          currentMode === "image"
            ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop"
            : null,
      };

      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      setIsLoading(false);
    }, 1200);
  };

  const getPlaceholder = () => {
    if (activeMode === "image") {
      return "Describe the image you want to create...";
    }

    if (activeMode === "video") {
      return "Describe the scene for video generation...";
    }

    if (activeMode === "research") {
      return "Type topic for deep research...";
    }

    if (activeMode === "tools") {
      return "Ask coding or tool questions...";
    }

    if (selectedFile) {
      return "Add a message about this file...";
    }

    return "Ask LexarAi anything...";
  };

  const getActiveModeInfo = () => {
    if (activeMode === "image") {
      return {
        type: "image",
        label: "Create Image",
        icon: <ImageIcon size={15} />,
      };
    }

    if (activeMode === "video") {
      return {
        type: "video",
        label: "Create Video",
        icon: <Video size={15} />,
      };
    }

    if (activeMode === "research") {
      return {
        type: "research",
        label: "Deep Research",
        icon: <SearchCode size={15} />,
      };
    }

    if (activeMode === "tools") {
      return {
        type: "tools",
        label: "Tools",
        icon: <Cpu size={15} />,
      };
    }

    if (selectedFile) {
      return {
        type: "file",
        label: selectedFile.name,
        icon: <FileText size={15} />,
      };
    }

    return null;
  };

  const activeModeInfo = getActiveModeInfo();

  const isActionActive =
    isFocused || inputValue.trim().length > 0 || selectedFile || activeMode;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <section className="main-container">
        <div
          className={`left-slider ${
            isSidebarOpen ? "mobile-show" : "mobile-hide"
          }`}
        >
          <Slider
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>

        <div className="right-content">
          <div className="top-header">
            <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>

          <div className="chat-section">
            <div className="chat-messages-viewport">
              {messages.length === 0 ? (
                <div className="system-welcome-note">
                  Hello {user?.username || "there"},
                  <span className="brand-name">
                    <p>What would you like to build today?</p>
                  </span>
                </div>
              ) : (
                <div className="conversation-thread">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`chat-bubble-wrapper ${message.role}`}
                    >
                      <div className="bubble-content ">
                        {message.attachments?.length > 0 && (
                          <div className="attached-files-list">
                            {message.attachments.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="attached-file-badge"
                              >
                                {file.type?.startsWith("image/") ? (
                                  <img
                                    src={file.url}
                                    alt="upload"
                                    className="msg-attached-img"
                                  />
                                ) : (
                                  <span>{file.name}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <p>{message.content}</p>

                        {message.imageUrl && (
                          <div className="generated-image-box">
                            <img src={message.imageUrl} alt="AI Output" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="chat-bubble-wrapper assistant loading">
                      <div className="bubble-content loading-indicator">
                        <Loader2 size={16} className="spin-icon" />
                        <span>LexarAi is processing...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
          </div>

          <div className="bottom-interactive-area">
            <div
              className={`input-field-wrapper  ${
                isFocused ? "focused" : ""
              } ${activeModeInfo ? "mode-active" : ""}`}
            >
              <div className="media-upload-zone" ref={mediaMenuRef}>
                <button
                  className={`media-upload-btn ${
                    isMenuOpen || activeModeInfo ? "active-btn" : ""
                  }`}
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  title={
                    activeModeInfo ? activeModeInfo.label : "Attach or create"
                  }
                >
                  {activeModeInfo ? (
                    activeModeInfo.icon
                  ) : (
                    <Paperclip size={18} />
                  )}
                </button>

                {isMenuOpen && (
                  <div className="media-floating-menu ">
                    <button onClick={() => handleMenuClick("file")}>
                      <FileText size={16} />
                      <span>File Upload</span>
                    </button>

                    <button onClick={() => handleMenuClick("image")}>
                      <ImageIcon size={16} />
                      <span>Create Image</span>
                    </button>

                    <button onClick={() => handleMenuClick("video")}>
                      <Video size={16} />
                      <span>Create Video</span>
                    </button>

                    <button onClick={() => handleMenuClick("research")}>
                      <SearchCode size={16} />
                      <span>Deep Research</span>
                    </button>

                    <button onClick={() => handleMenuClick("tools")}>
                      <Cpu size={16} />
                      <span>Tools</span>
                    </button>
                  </div>
                )}
              </div>

              {activeModeInfo && (
                <div className={`input-mode-indicator ${activeModeInfo.type}`}>
                  {activeModeInfo.icon}

                  <span>{activeModeInfo.label}</span>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode(null);
                      setSelectedFile(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    title="Remove"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              <input
                type="text"
                placeholder={getPlaceholder()}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />

              <button
                className={`action-arrow-btn ${
                  isActionActive ? "active" : "idle"
                }`}
                type="button"
                onClick={handleSendMessage}
              >
                {isActionActive ? (
                  <ArrowUp size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
      {isSettingsOpen && (
        <div
          className="settings-modal-overlay"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="settings-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title">
                <SettingsIcon size={18} />
                <h3>Settings</h3>
              </div>

              <button
                className="close-btn"
                onClick={() => setIsSettingsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Theme */}
              <div className="setting-item">
                <label>
                  <Moon size={14} />
                  Theme Preference
                </label>

                <select
                  value={selectedTheme}
                  onChange={(event) => setSelectedTheme(event.target.value)}

                >
                  <option value="dark">Dark</option>

                  <option value="light">Light</option>
                </select>
              </div>

              {/* AI Model */}
              <div className="setting-item">
                <label>
                  <Bot size={14} />
                  AI Model Engine
                </label>

                <select
                  value={selectedModel}
                  onChange={(event) => setSelectedModel(event.target.value)}
                >
                  <option value="lexar-v2">Gemini Pro 2.0</option>

                  <option value="gpt-4o">GPT-4o Turbo</option>

                  <option value="claude-3-5">Claude 3.5 Sonnet</option>
                </select>
              </div>

              {/* Profile */}
              <div className="setting-item">
                <label>
                  <User size={14} />
                  Profile Name
                </label>

                <input
                  type="text"
                  value={user?.username || "Your Account"}
                  readOnly
                  className="read-only-input"
                />
              </div>

              {/* Memory */}
              <div className="setting-item">
                <label>
                  <Brain size={14} />
                  AI Memory
                </label>

                <button
                  type="button"
                  className={`memory-toggle ${isMemoryEnabled ? "active" : ""}`}
                  onClick={() => setIsMemoryEnabled(!isMemoryEnabled)}
                >
                  {isMemoryEnabled ? "ON" : "OFF"}
                </button>
              </div>

              {/* Clear Memory */}
              <div className="setting-item">
                <label>
                  <Trash2 size={14} />
                  Clear Memory
                </label>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleClearMemory}
                >
                  Clear Memory
                </button>
              </div>

              {/* Clear Current Chat */}
              <div className="setting-item">
                <label>
                  <MessageSquareX size={14} />
                  Current Chat
                </label>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleClearCurrentChat}
                >
                  Clear Chat
                </button>
              </div>

              {/* Delete Chat History */}
              <div className="setting-item">
                <label>
                  <Trash2 size={14} />
                  Chat History
                </label>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleClearChatHistory}
                >
                  Delete History
                </button>
              </div>

              {/* User Account */}
              <div className="setting-item">
                <label>
                  <User size={14} />
                  User Account
                </label>

                <button
                  type="button"
                  className="account-action-btn"
                  onClick={() => {}}
                >
                  Manage Account
                </button>
              </div>

              {/* Logout */}
              <div className="setting-item">
                <label>
                  <LogOut size={14} />
                  Session
                </label>

                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>

              {/* Footer */}
              <div className="settings-footer-info">
                <ShieldCheck size={14} />

                <span>LexarAi System Connected v2.4.0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatBot;
