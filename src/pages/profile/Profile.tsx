import { useAuth } from "../../hooks/useAuth";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>User ID:</strong> {user?.uid}
        </p>
      </div>
    </div>
  );
};
