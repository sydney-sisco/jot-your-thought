import { useLocation } from "wouter";
import { disconnectSocket } from "../utils/socket";

function Logout({ setToken }) {

  const [location, setLocation] = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();

    // remove token from local storage
    setToken(null);

    // redirect to login page
    setLocation("/login");
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Logout</button>
    </form>
  );
}

export default Logout;
