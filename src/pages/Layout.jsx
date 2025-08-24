
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Target,
  Music,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Keyword Research",
    url: createPageUrl("KeywordResearch"),
    icon: Search,
  },
  {
    title: "Trending Artists",
    url: createPageUrl("TrendingArtists"),
    icon: TrendingUp,
  },
  {
    title: "SEO Tools",
    url: createPageUrl("SEOTools"),
    icon: Target,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        :root {
          --primary: 239 68% 68%;
          --primary-foreground: 0 0% 98%;
          --secondary: 210 40% 98%;
          --secondary-foreground: 222.2 84% 4.9%;
          --accent: 210 40% 96%;
          --accent-foreground: 222.2 84% 4.9%;
          --background: 249 250 251;
          --foreground: 15 23 42;
          --muted: 248 250 252;
          --muted-foreground: 100 116 139;
          --border: 226 232 240;
          --input: 226 232 240;
          --ring: 239 68% 68%;
          --radius: 12px;
        }
        
        * {
          border-color: hsl(var(--border));
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
          font-weight: 400;
          letter-spacing: -0.011em;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .glass {
          backdrop-filter: blur(40px) saturate(180%);
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        }
        
        .card-shadow-hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }
        
        .nav-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .nav-item:hover {
          transform: translateX(2px);
        }
      `}</style>

      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar className="border-r border-gray-200/60 bg-white/80 backdrop-blur-xl">
            <SidebarHeader className="p-6 border-b border-gray-100/60">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 tracking-tight">BeatFinder</h2>
                  <p className="text-xs text-gray-500 font-medium">Niche Discovery</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`nav-item group relative overflow-hidden rounded-lg transition-all duration-200 ${
                            location.pathname === item.url 
                              ? 'bg-black text-white shadow-sm' 
                              : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
                <h1 className="text-xl font-semibold text-gray-900">BeatFinder</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
