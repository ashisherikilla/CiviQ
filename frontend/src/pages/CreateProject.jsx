import { ArrowLeft } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/TextArea";

import { useAppContext } from "../context/AppContext";

const initialForm = {
  name: "",
  clientName: "",
  location: "",
  description: "",
};

export default function CreateProject() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { addProject, setError: setContextError } = useAppContext();

  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!form.clientName.trim()) {
      setError("Please enter a client name.");
      return;
    }

    if (!form.location.trim()) {
      setError("Please enter the project location.");
      return;
    }

    setSaving(true);

    try {
      await addProject({
        name: form.name.trim(),
        clientName: form.clientName.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        status: "Draft",
      });

      navigate("/projects");
    } catch (err) {
      setError(err.message || "Unable to create the project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* PAGE HEADER */}

      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
          Create Project
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Enter the basic information for a construction estimation project.
        </p>
      </div>

      {/* FORM */}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <Input
            id="project-name"
            name="name"
            label="Project Name"
            placeholder="e.g. Residential Building"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            id="client-name"
            name="clientName"
            label="Client Name"
            placeholder="e.g. ABC Constructions"
            value={form.clientName}
            onChange={handleChange}
            required
          />

          <Input
            id="location"
            name="location"
            label="Project Location"
            placeholder="e.g. Kolkata, West Bengal"
            value={form.location}
            onChange={handleChange}
            required
          />

          <Textarea
            id="description"
            name="description"
            label="Project Description"
            placeholder="Briefly describe the project..."
            value={form.description}
            onChange={handleChange}
          />

          {/* ERROR */}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Link to="/projects">
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? "Creating Project..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
