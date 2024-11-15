import { signupInput, SignupInputType } from "@shubhampatel/meduim-app";
import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { toast } from "react-toastify";
import { UserContext } from "../Context";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState<SignupInputType>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const showError = (message: string) => {
    toast.error(message, {
      theme: "colored",
      draggable: true,
      closeOnClick: true,
      autoClose: 3000,
    });
  };

  async function sendRequest() {
    // Check for empty fields
    if (
      (type === "signup" && postInputs.name.trim() === "") ||
      postInputs.email.trim() === "" ||
      postInputs.password.trim() === ""
    ) {
      showError("Field can't be empty");
      return;
    }

    // Validate input if signing up
    if (type === "signup") {
      try {
        signupInput.parse(postInputs);
      } catch (err) {
        if (err.constructor.name === "_ZodError") {
          err.errors.forEach((e: { message: string }) => showError(e.message));
        } else {
          console.error("An unexpected error occurred:", err);
          showError("An unexpected error occurred. Please try again later.");
        }
        return;
      }
    }

    setLoading(true);
    try {
      const url = `${BACKEND_URL}/api/v1/user/${type}`;
      const response = await axios.post(url, postInputs);
      const jwt = response.data.jwt;
      setCurrentUser(true);
      localStorage.setItem("token", jwt);
      navigate("/");
      window.location.reload();
      toast.success(
        type === "signin" ? "Login successful" : "Account Created successfully",
        {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
          theme: "colored",
        }
      );
    } catch (error) {
      console.error("API request failed:", error);
      setPostInputs({ ...postInputs, password: "" }); // Clear password field on error
      showError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-3xl font-extrabold text-center mb-4">
          {type === "signin" ? "Sign In" : "Sign Up"}
        </div>
        <div className="text-center text-gray-500 mb-4">
          {type === "signin"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            className="text-blue-500 underline"
            to={type === "signin" ? "/signup" : "/signin"}
          >
            {type === "signin" ? "Create One" : "Sign In"}
          </Link>
        </div>

        <div>
          {type === "signup" && (
            <LabelledInput
              label="Username"
              placeholder="Enter your username"
              value={postInputs.name}
              onChange={(e) =>
                setPostInputs((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          )}
          <LabelledInput
            label="Email"
            placeholder="test@example.com"
            value={postInputs.email}
            onChange={(e) =>
              setPostInputs((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <LabelledInput
            label="Password"
            type="password"
            value={postInputs.password}
            onChange={(e) =>
              setPostInputs((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <button
            type="button"
            onClick={sendRequest}
            className="w-full mt-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
            disabled={loading}
          >
            {loading ? "Loading..." : type}
          </button>
        </div>
      </div>
    </div>
  );
};

const LabelledInput = ({
  label,
  placeholder,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value: string;
}) => (
  <div className="mb-4">
    <label
      htmlFor={label}
      className="block mb-2 text-sm font-semibold text-gray-900"
    >
      {label}
    </label>
    <input
      type={type}
      id={label}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

export default Auth;
