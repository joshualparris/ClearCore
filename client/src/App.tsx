import { Switch, Route } from "wouter";
import { AppStateProvider } from "@/state/AppStateProvider";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Daily from "@/pages/Daily";
import SOS from "@/pages/SOS";
import Log from "@/pages/Log";
import Progress from "@/pages/Progress";
import Settings from "@/pages/Settings";
import Review from "@/pages/Review";
import SlipResponse from "@/pages/SlipResponse";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/daily" component={Daily} />
      <Route path="/sos" component={SOS} />
      <Route path="/log" component={Log} />
      <Route path="/progress" component={Progress} />
      <Route path="/settings" component={Settings} />
      <Route path="/review" component={Review} />
      <Route path="/slip-response" component={SlipResponse} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppStateProvider>
      <Toaster />
      <Router />
    </AppStateProvider>
  );
}

export default App;
