import { Folder, Info, LayoutDashboard, Plus, X } from "lucide-react";

import { NavLink } from "react-router-dom";

import mainLogo from "../../assets/CiviQ_Logo.png";

const workspaceNavigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: Folder,
  },
];

const informationNavigation = [
  {
    name: "About CiviQ",
    path: "/about",
    icon: Info,
  },
];

function Sidebar({ mobile = false, onClose }) {
  return (
    <aside
      className={[
        "flex h-full w-64 flex-col border-r border-slate-200 bg-white",
        mobile ? "shadow-xl" : "",
      ].join(" ")}
    >
      {/* =====================================================
          CIVIQ BRAND AREA
          ===================================================== */}
      <div className="flex h-24 shrink-0 items-center border-b border-slate-200 px-5">
        <NavLink
          to="/"
          onClick={onClose}
          aria-label="CiviQ home"
          className="flex h-full w-full items-center justify-center"
        >
          <div className="flex h-16 w-full items-center justify-center">
            <img
              src={mainLogo}
              alt="CiviQ - Civil + Quantity"
              className="h-auto w-full max-w-[190px] object-contain"
            />
          </div>
        </NavLink>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-2 shrink-0 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* =====================================================
          NAVIGATION
          ===================================================== */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {workspaceNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                  "transition-colors duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <NavLink
          to="/projects/new"
          onClick={onClose}
          className={[
            "mt-3 flex items-center gap-3 rounded-md",
            "border border-dashed border-slate-300",
            "px-3 py-2.5 text-sm font-medium",
            "text-slate-600",
            "transition-colors duration-150",
            "hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          ].join(" ")}
        >
          <Plus size={18} />
          <span>New Project</span>
        </NavLink>

        <div className="my-5 border-t border-slate-100" />

        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Information
        </p>

        {informationNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                  "transition-colors duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* =====================================================
          FOOTER
          ===================================================== */}
      <div className="shrink-0 border-t border-slate-200 p-4">
        <p className="text-xs leading-5 text-slate-400">
          Civil engineering estimation and BOQ workspace.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
