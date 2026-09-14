import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building,
  Home,
  Calendar,
  FileText,
  Pencil,
  LogOut,
  Camera,
  CheckCircle2,
  Briefcase,
  Hash,
  Save,
} from "lucide-react";
import "../style/UserProfile.scss";
import SocialMedia from "../../ui/components/SocialLinks"
import { useAuth } from "../../hooks/useAuth";

const INITIAL_FORM_STATE = {
  profileImg: "",
  firstName: "",
  lastName: "",
  contact: "",
  email: "",
  role: "",
  gender: "",
  dob: "",
  bio: "",
  country: "",
  state: "",
  district: "",
  pincode: "",
};

const UserProfile = () => {
  const navigate = useNavigate();

  const {
    user,
    profile,
    handleProfile,
    handleResendVerifyEmail,
    handleLogout,
  } = useAuth();


  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    if (!profile && !user) return;

    setFormData({
      profileImg: profile?.profileImg || user?.profileImg || "",

      firstName: profile?.firstName || user?.firstName || "",
      lastName: profile?.lastName || user?.lastName || "",

      contact: profile?.contact || user?.contact || "",

      email: profile?.email || user?.email || "",

      role: profile?.role || user?.role || "",
      gender: profile?.gender || user?.gender || "",

      dob: profile?.dob ? profile.dob.split("T")[0] : "",

      bio: profile?.bio || user?.bio || "",

      country: profile?.country || user?.country || "",
      state: profile?.state || user?.state || "",
      district: profile?.district || user?.district || "",
      pincode: profile?.pincode || user?.pincode || "",
    });
  }, [profile, user]);

  const avatarSrc =
    typeof formData.profileImg === "string"
      ? formData.profileImg || "/default-avatar.png"
      : formData.profileImg
        ? URL.createObjectURL(formData.profileImg)
        : "/default-avatar.png";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profileImg: file,
    }));
  };

  const handleResendEmail = async () => {
    try {
      await handleResendVerifyEmail();
      alert("Verification email sent successfully.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email.");
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/");
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await handleProfile(formData);
      alert("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <main className="profile-wrapper">
        <SocialMedia />

        <div className="profile-top-nav">
          <Link to="/" className="top-nav-home">
            <Home size={18} />
          </Link>
          <h1 className="top-nav-title">Your Profile</h1>
          <Link to="/contact" className="top-nav-contact">
            <Mail size={18} />
          </Link>
        </div>
        {/* Profile Header */}
        <section className="profile-card page header-banner">
          <div className="header-left">
            <div className="avatar-wrapper">
              <img src={avatarSrc} alt="Profile" className="profile-avatar" />

              <input
                type="file"
                accept="image/*"
                id="profileImage"
                hidden
                disabled={!isEditing}
                onChange={handleImageChange}
              />

              <label htmlFor="profileImage" className="avatar-edit-btn">
                <Camera size={14} />
              </label>
            </div>

            <div className="profile-info">
              <div className="username-row">
                <h1>
                  {formData.firstName} {formData.lastName}
                </h1>
              </div>

              <p className="user-handle ">
                {user?.username}{" "}
                <CheckCircle2
                  size={18}
                  className={`verified-badge ${
                    user?.verified ? "verified-blue" : "unverified-gray"
                  }`}
                />
              </p>

              <div className="role-tag">
                <Briefcase size={14} />
                <span>{formData.role || "No role selected"}</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            <button className="btn btn-outline" onClick={handleEditToggle}>
              {isEditing ? (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Pencil size={15} />
                  <span>Edit Profile</span>
                </>
              )}
            </button>

            <button className="btn btn-danger" onClick={handleLogoutClick}>
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </section>

        <div className="forms-column">
          {/* Personal Information */}
          <section className="profile-card page form-section">
            <div className="section-title">
              <User size={18} />
              <h2>Personal Information</h2>
            </div>

            <div className="grid-2-col">
              <div className="input-group">
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />

                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />

                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon" />

                  <input
                    type="tel"
                    placeholder="Contact Number"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    maxLength={10}
                    inputMode="numeric"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Briefcase size={16} className="input-icon" />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="" disabled hidden>
                      Select your role
                    </option>

                    <option value="web-developer">Web Developer</option>
                    <option value="software-engineer">Software Engineer</option>
                    <option value="ui-ux-designer">UI/UX Designer</option>
                    <option value="frontend-developer">
                      Frontend Developer
                    </option>
                    <option value="backend-developer">Backend Developer</option>
                    <option value="data-scientist">Data Scientist</option>
                    <option value="devops-engineer">DevOps Engineer</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="qa-engineer">QA Engineer</option>
                    <option value="mobile-app-developer">
                      Mobile App Developer
                    </option>
                    <option value="full-stack-developer">
                      Full Stack Developer
                    </option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper email-wrapper">
                  <Mail size={16} className="input-icon" />

                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />

                  <button
                    type="button"
                    className={`verify-btn ${user?.verified ? "verified" : ""}`}
                    disabled={!isEditing || user?.verified}
                    onClick={handleResendEmail}
                  >
                    {user?.verified ? "✅ Verified" : "Verify"}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="" disabled hidden>
                      Select gender
                    </option>

                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Calendar size={16} className="input-icon" />

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper align-start">
                  <FileText size={16} className="input-icon textarea-icon" />

                  <textarea
                    rows={3}
                    placeholder="Write something about yourself..."
                    className="fixed-textarea"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Location Information */}
          <section className="profile-card page form-section">
            <div className="section-title">
              <MapPin size={18} />
              <h2>Location Information</h2>
            </div>

            <div className="grid-2-col">
              <div className="input-group">
                <div className="input-wrapper">
                  <Globe size={16} className="input-icon" />

                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="" disabled hidden>
                      Select your country
                    </option>

                    <option value="india">India</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="japan">Japan</option>
                    <option value="brazil">Brazil</option>
                    <option value="south-africa">South Africa</option>
                    <option value="singapore">Singapore</option>
                    <option value="uae">United Arab Emirates</option>
                    <option value="russia">Russia</option>
                    <option value="china">China</option>
                    <option value="mexico">Mexico</option>
                    <option value="italy">Italy</option>
                    <option value="spain">Spain</option>
                    <option value="netherlands">Netherlands</option>
                    <option value="switzerland">Switzerland</option>
                    <option value="new-zealand">New Zealand</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Building size={16} className="input-icon" />

                  <input
                    type="text"
                    placeholder="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Home size={16} className="input-icon" />

                  <input
                    type="text"
                    placeholder="District / City"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Hash size={16} className="input-icon" />

                  <input
                    type="text"
                    placeholder="Pincode / ZIP Code"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
