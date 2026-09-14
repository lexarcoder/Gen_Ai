import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Sparkles,
  User,
  MoreHorizontal,
  MoreVertical,
  Share2,
  Check,
  Download,
  Mail,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import "../style/Header.scss";

function Header({ onMenuClick, onExportChat }) {
  const { user, profile, handleLogout } = useAuth();

  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const copyTimerRef = useRef(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(e.target)
      ) {
        setIsDesktopMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDesktopMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(copyTimerRef.current);
    };
  }, []);

  const closeMenus = () => {
    setIsDesktopMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getInitial = () => {
    const name = profile?.firstName || user?.username || "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LexarAi",
          text: "Check out this conversation on LexarAi!",
          url: currentUrl,
        });
      } catch {
        // dismissed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setIsCopied(false), 2000);
    } catch {
      console.error("Failed to copy URL");
    }
  };

  const handleExport = () => {
    closeMenus();
    if (onExportChat) onExportChat();
  };

  // Reusable Avatar Component
  const Avatar = () => (
    <Link
      to="/profile"
      className="account-avatar-btn"
      aria-label="User profile"
      title={profile?.firstName || user?.username || "Profile"}
    >
      {user?.profileImg ? (
        <img
          src={user.profileImg}
          alt={profile?.firstName || user?.username || "Avatar"}
          className="avatar-img"
        />
      ) : (
        <span className="avatar-initial">{getInitial()}</span>
      )}
    </Link>
  );

  // Reusable Menu Content
  const DropdownContent = () => (
    <div className="dropdown-menu" role="menu">
      <button
        type="button"
        className="dropdown-item"
        role="menuitem"
        onClick={handleShare}
      >
        {isCopied ? (
          <Check className="item-icon" />
        ) : (
          <Share2 className="item-icon" />
        )}
        <span>{isCopied ? "Link Copied!" : "Share Chat"}</span>
      </button>

      <button
        type="button"
        className="dropdown-item"
        role="menuitem"
        onClick={handleExport}
      >
        <Download className="item-icon" />
        <span>Export Chat</span>
      </button>

      <Link
        to="/contact"
        className="dropdown-item"
        role="menuitem"
        onClick={closeMenus}
      >
        <Mail className="item-icon" />
        <span>Contact</span>
      </Link>

      <div className="dropdown-divider" role="separator" />

      {user ? (
        <button
          type="button"
          className="dropdown-item danger"
          role="menuitem"
          // onClick={closeMenus}
          onClick={handleLogout}
        >
          <LogOut className="item-icon" />
          <span>Logout</span>
        </button>
      ) : (
        <Link
          to="/login"
          className="dropdown-item"
          role="menuitem"
          onClick={closeMenus}
        >
          <LogIn className="item-icon" />
          <span>Sign In</span>
        </Link>
      )}
    </div>
  );

  return (
    <header className="header-nav">
      {/* Left: Mobile Sidebar Toggle */}
      <div className="header-left">
        <button
          type="button"
          className="header-icon-btn mobile-menu-toggle"
          aria-label="Toggle Sidebar"
          onClick={onMenuClick}
        >
          <Menu className="icon-svg" />
        </button>
      </div>

      {/* Center: Brand */}
      <div className="header-center">
        <Link to="/" className="brand-logo" aria-label="LexarAi Home">
          <Sparkles className="brand-icon" />
          <span className="brand-name">LexarAi</span>
        </Link>
      </div>

      {/* Right — Desktop */}
      <div className="header-right desktop-only">
        {/* User Avatar */}
        {user && <Avatar />}

        {/* More Menu */}
        <div className="dropdown-container" ref={desktopMenuRef}>
          <button
            type="button"
            className={`header-icon-btn ${isDesktopMenuOpen ? "active" : ""}`}
            aria-label="More options"
            aria-haspopup="true"
            aria-expanded={isDesktopMenuOpen}
            onClick={() => setIsDesktopMenuOpen((prev) => !prev)}
          >
            <MoreHorizontal className="icon-svg" />
          </button>

          {isDesktopMenuOpen && <DropdownContent />}
        </div>
      </div>

      {/* Right — Mobile */}
      <div className="header-right mobile-only">
        {user && <Avatar />}

        <div className="dropdown-container" ref={mobileMenuRef}>
          <button
            type="button"
            className={`header-icon-btn ${isMobileMenuOpen ? "active" : ""}`}
            aria-label="More options"
            aria-haspopup="true"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <MoreVertical className="icon-svg" />
          </button>
          {isMobileMenuOpen && <DropdownContent />}
        </div>
      </div>
    </header>
  );
}

export default Header;
