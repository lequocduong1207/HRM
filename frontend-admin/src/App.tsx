import { BrowserRouter as Router, useRoutes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { routes } from "./routes";

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}