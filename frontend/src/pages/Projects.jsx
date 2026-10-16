import {
  Calculator,
  FolderOpen,
  MapPin,
  Plus,
} from "lucide-react";

import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { useAppContext } from "../context/AppContext";

export default function Projects() {
  const { projects } =
    useAppContext();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your construction estimation projects.
          </p>
        </div>

        <Link to="/projects/new">
          <Button className="w-full sm:w-auto">
            <Plus size={17} />
            New Project
          </Button>
        </Link>
      </section>

      {projects.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="grid size-12 place-items-center rounded-md bg-slate-100">
              <FolderOpen
                size={22}
                className="text-slate-500"
              />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-slate-900">
              No projects yet
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Create your first construction project to begin preparing an estimate.
            </p>

            <Link
              to="/projects/new"
              className="mt-5"
            >
              <Button>
                <Plus size={16} />
                Create Project
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-md bg-blue-50">
                  <FolderOpen
                    size={19}
                    className="text-blue-600"
                  />
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {project.status ||
                    "Draft"}
                </span>
              </div>

              <div className="mt-4">
                <h2 className="font-semibold text-slate-900">
                  {project.name}
                </h2>

                {project.clientName && (
                  <p className="mt-1 text-sm text-slate-500">
                    {project.clientName}
                  </p>
                )}
              </div>

              {project.location && (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin size={14} />
                  {project.location}
                </div>
              )}

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                <Link
                  to={`/estimate/${project.id}`}
                  className="flex-1"
                >
                  <Button className="w-full">
                    <Calculator
                      size={16}
                    />
                    Open Estimation
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}