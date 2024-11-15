import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../Components/Loading";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface UserSchema {
  id: string;
  email?: string;
  name?: string;
  imgUrl: string | null;
  bio?: string;
}

interface UpdateData {
  postId: string;
  title: string;
  content: string;
}

interface UserContextType {
  currentUser: UserSchema | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserSchema | null>>;
  publish: boolean;
  setPublish: React.Dispatch<React.SetStateAction<boolean>>;
  updateData: UpdateData | null;
  setUpdateData: React.Dispatch<React.SetStateAction<UpdateData | null>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const defaultContextValue: UserContextType = {
  currentUser: null,
  setCurrentUser: () => {},
  publish: false,
  setPublish: () => {},
  updateData: null,
  setUpdateData: () => {},
  title: "",
  setTitle: () => {},
  content: "",
  setContent: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContextValue);

interface ContextProps {
  children: ReactNode;
}

async function getUser(token: string) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/auth`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

const Context: React.FC<ContextProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
  const [publish, setPublish] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [updateData, setUpdateData] = useState<UpdateData | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getUser(token);
          setCurrentUser(data);
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        publish,
        setPublish,
        updateData,
        setUpdateData,
        title,
        setTitle,
        content,
        setContent,
      }}
    >
      {loading ? <Loading /> : children}
    </UserContext.Provider>
  );
};

export default Context;

export const useUser = () => useContext(UserContext);
