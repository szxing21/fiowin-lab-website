import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Team from "./pages/Team";
import Publications from "./pages/Publications";
import Research from "./pages/Research";
import News from "./pages/News";
import Conferences from "./pages/Conferences";
import Contact from "./pages/Contact";
import Analytics from "./pages/Analytics";
import MemberProfile from "./pages/MemberProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminEditor from "./pages/AdminEditor";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/team"} component={Team} />
          <Route path={"/publications"} component={Publications} />
          <Route path={"/research"} component={Research} />
          <Route path={"/news"} component={News} />
          <Route path={"/conferences"} component={Conferences} />
          <Route path={"/contact"} component={Contact} />
          <Route path={"/analytics"} component={Analytics} />
          <Route path={"/member/:id"} component={MemberProfile} />
          <Route path={"/admin"} component={AdminLogin} />
          <Route path={"/admin/editor"} component={AdminEditor} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
