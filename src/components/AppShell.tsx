import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Leaf, LayoutDashboard, Sprout, ScanSearch, Droplets, BarChart3, CloudSun, IndianRupee, History, BookOpen,
  Menu, Search, Bell, Moon, Sun, User, RotateCcw, Database,
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { resetDemo, useHistory } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crop-recommendation", label: "Crop Recommendation", icon: Sprout },
  { to: "/disease-detection", label: "Disease Detection", icon: ScanSearch },
  { to: "/irrigation", label: "Irrigation Planner", icon: Droplets },
  { to: "/yield", label: "Yield Prediction", icon: BarChart3 },
  { to: "/weather", label: "Weather Insights", icon: CloudSun },
  { to: "/market", label: "Market Prices", icon: IndianRupee },
  { to: "/history", label: "Farming History", icon: History },
  { to: "/about", label: "About Project", icon: BookOpen },
] as const;

const NOTIFS = [
  { t: "Heavy rain expected Thu–Fri (sample forecast)", tone: "warning" },
  { t: "Early blight alert on Plot A tomatoes (demo)", tone: "danger" },
  { t: "Irrigation due tomorrow 6:00 AM — Plot B", tone: "default" },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-panel text-panel-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="rounded-lg bg-success p-2 text-success-foreground"><Leaf className="h-5 w-5" /></div>
        <div>
          <p className="font-semibold leading-tight">AgriSmart AI</p>
          <p className="text-xs opacity-60">Intelligent Farming Assistant</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 px-3" aria-label="Main">
        {NAV.map((n) => {
          const active = path === n.to;
          return (
            <Link key={n.to} to={n.to} onClick={onNavigate}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                active ? "bg-panel-foreground/10 font-medium" : "opacity-70 hover:bg-panel-foreground/5 hover:opacity-100")}>
              <n.icon className={cn("h-4 w-4", active && "text-success")} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-lg border border-panel-foreground/10 p-3 text-xs opacity-70">
        Frontend-only demo. All data is simulated and stored in your browser.
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { loadSample } = useHistory();
  const title = NAV.find((n) => n.to === path)?.label ?? "AgriSmart AI";

  useEffect(() => {
    const saved = localStorage.getItem("agrismart.theme") === "dark";
    setDark(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleTheme = () => { const v = !dark; setDark(v); localStorage.setItem("agrismart.theme", v ? "dark" : "light"); };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim().toLowerCase();
    if (!term) return;
    const hit = NAV.find((n) => n.label.toLowerCase().includes(term));
    if (hit) { navigate({ to: hit.to }); setQ(""); }
    else if (["price", "mandi", "wheat", "onion"].some((w) => term.includes(w))) navigate({ to: "/market" });
    else toast.error(`No page matches "${q}"`);
  };

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block"><SidebarNav /></aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-card/90 px-3 backdrop-blur sm:px-5">
          <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <h2 className="truncate text-sm font-semibold sm:text-base">{title}</h2>
          <form onSubmit={onSearch} className="relative ml-auto hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages…" aria-label="Search" className="field h-9 w-56 pl-8" />
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="relative rounded-md p-2 hover:bg-muted" aria-label="Notifications">
                <Bell className="h-4.5 w-4.5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications (demo)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {NOTIFS.map((n) => (
                  <DropdownMenuItem key={n.t} className="items-start gap-2 text-xs" onSelect={() => navigate({ to: n.tone === "warning" ? "/weather" : n.tone === "danger" ? "/disease-detection" : "/irrigation" })}>
                    <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", n.tone === "warning" ? "bg-warning" : n.tone === "danger" ? "bg-destructive" : "bg-primary")} />{n.t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={toggleTheme} className="rounded-md p-2 hover:bg-muted" aria-label="Toggle theme">{dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}</button>
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-full border p-0.5 pr-2 hover:bg-muted" aria-label="Profile menu">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">RK</span>
                <span className="hidden text-xs font-medium sm:inline">Ravi Kumar</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal"><p className="text-sm font-medium">Ravi Kumar</p><p className="text-xs text-muted-foreground">Demo farmer profile</p></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate({ to: "/history" })}><User className="h-4 w-4" /> My records</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => { loadSample(); toast.success("Sample records loaded"); }}><Database className="h-4 w-4" /> Load sample data</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setConfirm(true)} className="text-destructive"><RotateCcw className="h-4 w-4" /> Reset demo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</main>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset the demo?</AlertDialogTitle>
            <AlertDialogDescription>This removes your saved records, tasks and preferences and restores the original sample state.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { resetDemo(); setDark(false); toast.success("Demo restored to initial state"); }}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
