import { useAuth } from "../../context/authcontext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="pixel-label">canbook / profile</div>
      <h1 className="profile-title">your profile.</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className="profile-role">{user?.role}</span>
        </div>
      </div>
    </div>
  );
}
