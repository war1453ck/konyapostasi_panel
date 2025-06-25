import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Layout } from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard";
import NewsList from "@/pages/news/news-list";
import NewsForm from "@/pages/news/news-form";
import Articles from "@/pages/articles";
import Categories from "@/pages/categories";
import Users from "@/pages/users";
import Media from "@/pages/media";
import Comments from "@/pages/comments";
import SEO from "@/pages/seo";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Advertisements from "@/pages/advertisements";
import ClassifiedAds from "@/pages/classified-ads";
import Newspaper from "@/pages/newspaper";
import MenuSettings from "@/pages/menu-settings";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/news" component={NewsList} />
        <Route path="/news/new" component={NewsForm} />
        <Route path="/articles" component={Articles} />
        <Route path="/categories" component={Categories} />
        <Route path="/users" component={Users} />
        <Route path="/media" component={Media} />
        <Route path="/comments" component={Comments} />
        <Route path="/newspaper" component={Newspaper} />
        <Route path="/advertisements" component={Advertisements} />
        <Route path="/classified-ads" component={ClassifiedAds} />
        <Route path="/seo" component={SEO} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/menu-settings" component={MenuSettings} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
