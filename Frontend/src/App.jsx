import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Page/Home";
import ChatPage from "./Page/ChatPage";
import Register from "./Components/Authentication/Register";
import Login from "./Components/Authentication/Login";

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<ChatPage />} />
            {/* <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
