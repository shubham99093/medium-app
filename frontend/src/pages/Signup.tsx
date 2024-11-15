import { Navigate } from "react-router-dom";
import Auth from "../Components/Auth";
import Quote from "../Components/Quote";

const Signup = () => {
  // Redirect to home if a token exists in local storage
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signup" />
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

export default Signup;
