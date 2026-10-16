import { useMemo, useState } from "react";
import { ArrowLeft, Calculator, Plus, Trash2 } from "lucide-react";

import { Link, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import WorkItemModal from "../components/project/WorkItemModal";

import { useAppContext } from "../context/AppContext";

export default function Estimation() {
  const { id } = useParams();

  const { projects, estimationItems, deleteEstimationItem } = useAppContext();

  const [showModal, setShowModal] = useState(false);

  const project = projects.find((item) => item.id === id);

  const projectItems = estimationItems.filter((item) => item.projectId === id);

  const totalAmount = useMemo(() => {
    return projectItems.reduce(
      (total, item) => total + Number(item.amount || 0),
      0,
    );
  }, [projectItems]);

  if (!project) {
    return (
      <div className="space-y-5">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <Card>
          <div className="px-5 py-12 text-center">
            <h2 className="font-semibold text-slate-900">Project not found</h2>

            <p className="mt-1 text-sm text-slate-500">
              The project may have been deleted.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
            {project.name}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Estimation Workspace
            {project.location ? ` · ${project.location}` : ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {projectItems.length > 0 && (
            <Link to={`/boq/${project.id}`}>
              <Button variant="secondary">Review BOQ</Button>
            </Link>
          )}

          <Button onClick={() => setShowModal(true)}>
            <Plus size={17} />
            Add Work Item
          </Button>
        </div>
      </section>

      {/* SUMMARY */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-slate-100">
              <Calculator size={19} className="text-slate-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500">Work Items</p>

              <p className="text-xl font-semibold text-slate-900">
                {projectItems.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-xs text-slate-500">Estimated Value</p>

            <p className="mt-1 text-xl font-semibold text-slate-900">
              ₹{totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-xs text-slate-500">Status</p>

            <p className="mt-1 text-xl font-semibold text-slate-900">
              {project.status || "Draft"}
            </p>
          </div>
        </Card>
      </section>

      {/* TABLE */}

      <Card padding="p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Estimation Items</h2>

          <p className="mt-1 text-sm text-slate-500">
            Add and review the work items included in this estimate.
          </p>
        </div>

        {projectItems.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-md bg-slate-100">
              <Calculator size={22} className="text-slate-500" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No estimation items yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Add your first civil engineering work item to start calculating
              quantities and project costs.
            </p>

            <Button className="mt-5" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Add Work Item
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-medium text-slate-600">
                    Category
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-600">
                    Description
                  </th>

                  <th className="px-5 py-3 font-medium text-slate-600">Unit</th>

                  <th className="px-5 py-3 text-right font-medium text-slate-600">
                    Quantity
                  </th>

                  <th className="px-5 py-3 text-right font-medium text-slate-600">
                    Rate
                  </th>

                  <th className="px-5 py-3 text-right font-medium text-slate-600">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-right font-medium text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {projectItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-600">
                      {item.category}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-900">
                      {item.description}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.unit === "m3"
                        ? "m³"
                        : item.unit === "m2"
                          ? "m²"
                          : item.unit === "nos"
                            ? "Nos"
                            : item.unit === "ls"
                              ? "LS"
                              : item.unit}
                    </td>

                    <td className="px-5 py-4 text-right text-slate-700">
                      {Number(item.quantity).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-right text-slate-700">
                      ₹{Number(item.rate).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-right font-medium text-slate-900">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => deleteEstimationItem(item.id)}
                        aria-label={`Delete ${item.description}`}
                        className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="border-t border-slate-200 bg-slate-50">
                  <td
                    colSpan="5"
                    className="px-5 py-4 text-right font-semibold text-slate-700"
                  >
                    Total Estimated Cost
                  </td>

                  <td className="px-5 py-4 text-right text-lg font-semibold text-blue-700">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </td>

                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {projectItems.length > 0 && (
        <Card>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Estimation complete?
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Review the organized Bill of Quantities for this project.
              </p>
            </div>

            <Link to={`/boq/${project.id}`}>
              <Button variant="secondary">Review BOQ</Button>
            </Link>
          </div>
        </Card>
      )}

      {showModal && (
        <WorkItemModal
          projectId={project.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
