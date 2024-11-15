import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Signup } from "./pages";
import { Signin } from "./pages";
import { Blog } from "./pages";
import Home from "./pages/Home.tsx";
import Blogs from "./pages/Blogs";
import NewStory from "./pages/NewStory";
import "./index.css";
import Context, { useUser } from "./Context";
import AppBar from "./Components/Header/AppBar";
import DemoAppBar from "./Components/Header/DemoAppBar";
import { Profile } from "./pages/Profile";
import NotFound from "./pages/NotFound";
import EditPost from "./pages/EditPost.tsx";
import ContectUs from "./pages/ContectUs.tsx";
import About from "./pages/About.tsx";
import Policy from "./pages/Policy.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Context>
          <ShowHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/post/:postId" element={<Blog />} />
            <Route path="/new-story" element={<NewStory />} />
            <Route path="/editPost/:postId" element={<EditPost />} />
            <Route path="/contect-us" element={<ContectUs />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/about-us" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Context>
      </BrowserRouter>
    </>
  );
}

function ShowHeader() {
  const location = useLocation();
  const { pathname } = location;
  const { currentUser } = useUser();
  if (!(pathname === "/signin" || pathname === "/signup")) {
    return <>{currentUser ? <AppBar /> : <DemoAppBar />}</>;
  } else {
    return;
  }
}

export default App;
