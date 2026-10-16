import { Menu } from "lucide-react";

import { useLocation } from "react-router-dom";

import squareLogo from "../../assets/CiviQ_Logo_square.png";

const pageTitles = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/projects/new": "Create Project",
};

function Header({ onMenuClick }) {
  const location = useLocation();

  let title = pageTitles[location.pathname];

  if (!title && location.pathname.startsWith("/estimate/")) {
    title = "Estimation";
  }

  if (!title && location.pathname.startsWith("/boq/")) {
    title = "Bill of Quantities";
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="mr-2 rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
      >
        <Menu size={21} />
      </button>

      {/* Mobile CiviQ logo */}
      <div className="mr-4 flex items-center lg:hidden">
        <img
          src={squareLogo}
          alt="CiviQ"
          className="h-9 w-9 object-contain"
        />
      </div>

      {/* Page information */}
      <div className="border-l border-slate-200 pl-4">
        <h1 className="text-base font-semibold text-slate-900 md:text-lg">
          {title}
        </h1>

        <p className="hidden text-xs text-slate-400 sm:block">
          Civil estimation workspace
        </p>
      </div>
    </header>
  );
}

export default Header;