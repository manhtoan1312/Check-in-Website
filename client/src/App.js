import { Fragment, React }  from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import getRoutes from "./routes";
function App() {
  const { isLoggedIn } = useAuth(); 
  const appRoutes = getRoutes(isLoggedIn); 
  return (
    <Router>
      <div className="App relative">
        <Routes>
          {appRoutes.map((router, index) => {
            const Layout = router.layout === null ? Fragment : router.layout;
            const Page = router.component;
            return (
              <Route
                key={index}
                path={router.path}
                element={
                  <Layout> 
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

function MainApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default MainApp;
