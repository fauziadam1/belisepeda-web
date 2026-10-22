import { Route, Routes } from "react-router";
import Home from "./pages/home/Index";
import { Layout } from "./components/Layout";
import Guest from "./components/Guest";
import ProfileUser from "./pages/profile-user/Index";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<Guest />}>
            <Route path="/profile" element={<ProfileUser />} />
          </Route>
        </Routes>
      </Layout>
    </>
  );
}

export default App;
