import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaTwitter,
  FaFacebookF,
} from "react-icons/fa";
import "../style/SocialLinks.scss";

const SOCIALS = [
  {
    icon: FaGithub,
    name: "GitHub",
    link: "https://github.com/LexarCoder",
  },
  {
    icon: FaLinkedin,
    name: "LinkedIn",
    link: "https://www.linkedin.com/feed/",
  },
  {
    icon: FaInstagram,
    name: "Instagram",
    link: "https://www.instagram.com/lexarcoder/",
  },
  {
    icon: FaTwitter,
    name: "Twitter",
    link: "https://x.com/NiteshPandey378",
  },
  {
    icon: FaFacebookF,
    name: "Facebook",
    link: "https://www.facebook.com/lexarcoder",
  },
  {
    icon: FaEnvelope,
    name: "Email",
    link: "mailto:lexarcoder@gmail.com",
  },
];

export default function SocialLinks() {
  // Duplicate array 3 times for continuous ticker loop
  const tickerItems = [...SOCIALS, ...SOCIALS, ...SOCIALS];

  return (
    <div className="social-strip">
      <div className="social-track ">
        {tickerItems.map((social, index) => {
          const Icon = social.icon;

          return (
            <a
              key={`${social.name}-${index}`}
              href={social.link}
              className="social-item page"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <span className="social-icon">
                <Icon />
              </span>
              <span className="social-name">{social.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
