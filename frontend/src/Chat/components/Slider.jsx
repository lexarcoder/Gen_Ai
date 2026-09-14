import React from "react";

import {
  SquarePen,
  Search,
  Wand2,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

import "../style/Slider.scss";

const Slider = ({
  isOpen,
  toggleSidebar,
  onNewChat,
  onOpenSettings,
  onAccountClick,
}) => {

  const {user,profile} = useAuth()

  return (
    <div
      className={`slider-wrapper ${
        isOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <aside className="sidebar-nav">
        {/* Toggle */}
        <div className="toggle-zone">
          <button
            className="nav-btn collapse-toggle-btn"
            onClick={toggleSidebar}
            title={isOpen ? "Collapse Menu" : "Expand Menu"}
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Top Actions */}
        <div className="top-actions-group">
          <button
            className="nav-btn action-pill new-chat-btn"
            title="New Chat"
            onClick={onNewChat}
          >
            <SquarePen size={20} className="icon-shrink primary-glow-icon" />

            {isOpen && <span className="nav-text">New Chat</span>}
          </button>

          <button className="nav-btn action-pill" title="Search Chats">
            <Search size={20} className="icon-shrink" />

            {isOpen && <span className="nav-text">Search</span>}
          </button>

          <button className="nav-btn action-pill" title="AI Tools">
            <Wand2 size={20} className="icon-shrink" />

            {isOpen && <span className="nav-text">Tools / Images</span>}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="bottom-actions-group">
          {/* Settings */}
          <button
            className="nav-btn action-pill settings-btn"
            title="Settings"
            onClick={onOpenSettings}
          >
            <Settings size={20} className="icon-shrink" />

            {isOpen && <span className="nav-text">Settings</span>}
          </button>

          {/* User Account */}
          <button
            className="nav-btn account-btn"
            title="Account"
            onClick={onAccountClick}
          >
            <div className="account-avatar">
              {profile?.profileImg || user?.profileImg ? (
                <img
                  src={profile?.profileImg || user?.profileImg}
                  alt={user?.username || "Profile"}
                />
              ) : (
                <UserRound size={19} />
              )}
            </div>

            {isOpen && (
              <div className="account-info">
                <span className="account-name">{user?.email}</span>

                <span className="account-status">Free Plan</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Slider;
