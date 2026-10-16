import {
  Calculator,
  FolderKanban,
  Plus,
  ReceiptText,
} from "lucide-react";

import { Link } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatCurrency } from "../utils/utilities";
import { useAppContext } from "../context/AppContext";

function Dashboard() {
  const { projects } = useAppContext();

  const stats = [
    {
      label: 'Projects',
      value: projects.length,
      icon: FolderKanban,
    },
    {
      label: 'Estimation Items',
      value: 0,
      icon: Calculator,
    },
    {
      label: 'Estimated Value',
      value: formatCurrency(0),
      icon: ReceiptText,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Welcome to CiviQ
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Civil Engineering Estimation & BOQ
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create construction projects, organize estimation
            work, and prepare professional bills of quantities.
          </p>
        </div>

        <Link to="/projects/new">
          <Button>
            <Plus size={17} />
            Create New Project
          </Button>
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100">
                  <Icon
                    size={19}
                    className="text-slate-600"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <Card padding="p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">
            Getting Started
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Start by creating your first construction project.
          </p>
        </div>

        <div className="px-5 py-8">
          <div className="max-w-xl">
            <h4 className="font-medium text-slate-900">
              Build your first estimate
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Add project information first. Estimation items,
              quantities, rates, and BOQ generation will be
              introduced in the following development phases.
            </p>

            <div className="mt-5">
              <Link to="/projects/new">
                <Button variant="secondary">
                  <Plus size={16} />
                  Create Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;