import { Fragment } from "react";
import { ArrowLeft, Download, FileText, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { useAppContext } from "../context/AppContext";
import workCategories from "../data/workCategories";

import { generateBOQPDF } from "../utils/pdfGenerator";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatQuantity(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 3,
  });
}

function getUnitLabel(unit) {
  const unitLabels = {
    m3: "m³",
    m2: "m²",
    m: "m",
    kg: "kg",
    nos: "Nos",
    ls: "LS",
  };

  return unitLabels[unit] || unit;
}

function BOQ() {
  const { id } = useParams();

  const { projects, estimationItems } = useAppContext();

  /*
   * ---------------------------------------------------------
   * FIND PROJECT
   * ---------------------------------------------------------
   */
  const project = projects.find((item) => item.id === id);

  /*
   * ---------------------------------------------------------
   * PROJECT ITEMS
   * ---------------------------------------------------------
   *
   * BOQ uses the already calculated estimation data.
   *
   * No quantity or amount calculations happen here.
   */
  const projectItems = estimationItems.filter(
    (item) => item.projectId === id
  );

  /*
   * ---------------------------------------------------------
   * GROUP ITEMS BY CATEGORY
   * ---------------------------------------------------------
   *
   * workCategories determines the display order.
   */
  const categoryGroups = workCategories
    .map((category) => {
      const items = projectItems.filter(
        (item) => item.category === category
      );

      if (items.length === 0) {
        return null;
      }

      const subtotal = items.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

      return {
        category,
        items,
        subtotal,
      };
    })
    .filter(Boolean);

  /*
   * ---------------------------------------------------------
   * GRAND TOTAL
   * ---------------------------------------------------------
   */
  const grandTotal = projectItems.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  /*
   * ---------------------------------------------------------
   * DOWNLOAD PDF
   * ---------------------------------------------------------
   *
   * Sends the existing BOQ data to the PDF generator.
   *
   * The PDF generator is responsible only for document
   * creation and downloading.
   */
  const handleDownloadPDF = () => {
    generateBOQPDF({
      project,
      projectItems,
      categoryGroups,
    });
  };

  /*
   * ---------------------------------------------------------
   * PROJECT NOT FOUND
   * ---------------------------------------------------------
   */
  if (!project) {
    return (
      <div className="space-y-5">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <Card>
          <div className="px-5 py-16 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-md bg-slate-100">
              <FileText size={22} className="text-slate-500" />
            </div>

            <h2 className="mt-4 font-semibold text-slate-900">
              Project not found
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              The project may have been deleted or is no longer available.
            </p>

            <Link to="/projects">
              <Button className="mt-5">
                Back to Projects
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * EMPTY BOQ
   * ---------------------------------------------------------
   */
  if (projectItems.length === 0) {
    return (
      <div className="space-y-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              to={`/estimate/${project.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Estimation
            </Link>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                CiviQ
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Bill of Quantities
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Civil Engineering Estimation
              </p>
            </div>
          </div>

          <Link to={`/estimate/${project.id}`}>
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Back to Estimation
            </Button>
          </Link>
        </section>

        <Card>
          <div className="px-5 py-16 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-md bg-slate-100">
              <FileText size={22} className="text-slate-500" />
            </div>

            <h2 className="mt-4 font-semibold text-slate-900">
              No estimation items available
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
              Add estimation items first to generate the BOQ for this
              project.
            </p>

            <Link to={`/estimate/${project.id}`}>
              <Button className="mt-5">
                <Plus size={16} />
                Add Work Item
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * BOQ
   * ---------------------------------------------------------
   */

  let itemNumber = 0;

  return (
    <div className="space-y-6 pb-8">
      {/* =====================================================
          HEADER
          ===================================================== */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            to={`/estimate/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Estimation
          </Link>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              CiviQ
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Bill of Quantities
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Civil Engineering Estimation
            </p>
          </div>
        </div>

        {/* =================================================
            BOQ ACTIONS
            ================================================= */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to={`/estimate/${project.id}`}>
            <Button variant="secondary">
              <ArrowLeft size={16} />
              Edit Estimation
            </Button>
          </Link>

          <Button onClick={handleDownloadPDF}>
            <Download size={16} />
            Download BOQ PDF
          </Button>
        </div>
      </section>

      {/* =====================================================
          PROJECT INFORMATION
          ===================================================== */}
      <Card>
        <div className="border-b border-slate-200 pb-4">
          <h2 className="font-semibold text-slate-900">
            Project Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Details associated with this estimation.
          </p>
        </div>

        <div className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Project Name
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {project.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Client
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {project.clientName || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Location
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {project.location || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Status
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {project.status || "Draft"}
            </p>
          </div>
        </div>
      </Card>

      {/* =====================================================
          BOQ TABLE
          ===================================================== */}
      <Card padding="p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Bill of Quantities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {projectItems.length} estimation item
                {projectItems.length !== 1 ? "s" : ""} included in this
                BOQ.
              </p>
            </div>

            <Link
              to={`/estimate/${project.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Edit Estimation
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="w-16 px-5 py-3 text-center font-medium text-slate-600">
                  No.
                </th>

                <th className="px-5 py-3 font-medium text-slate-600">
                  Description
                </th>

                <th className="w-24 px-5 py-3 font-medium text-slate-600">
                  Unit
                </th>

                <th className="w-32 px-5 py-3 text-right font-medium text-slate-600">
                  Quantity
                </th>

                <th className="w-32 px-5 py-3 text-right font-medium text-slate-600">
                  Rate
                </th>

                <th className="w-40 px-5 py-3 text-right font-medium text-slate-600">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {categoryGroups.map((group, categoryIndex) => (
                <Fragment key={group.category}>
                  {/* Category Header */}
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <td
                      colSpan={6}
                      className="px-5 py-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {String.fromCharCode(65 + categoryIndex)}.
                        </span>

                        <span className="font-semibold text-slate-900">
                          {group.category}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Category Items */}
                  {group.items.map((item) => {
                    itemNumber += 1;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-center text-slate-500">
                          {itemNumber}
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-900">
                          {item.description}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {getUnitLabel(item.unit)}
                        </td>

                        <td className="px-5 py-4 text-right text-slate-700">
                          {formatQuantity(item.quantity)}
                        </td>

                        <td className="px-5 py-4 text-right text-slate-700">
                          {formatCurrency(item.rate)}
                        </td>

                        <td className="px-5 py-4 text-right font-medium text-slate-900">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Category Subtotal */}
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <td
                      colSpan={5}
                      className="px-5 py-3 text-right text-sm font-medium text-slate-600"
                    >
                      {group.category} Subtotal
                    </td>

                    <td className="px-5 py-3 text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(group.subtotal)}
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>

            {/* Grand Total */}
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-100">
                <td
                  colSpan={5}
                  className="px-5 py-5 text-right font-semibold text-slate-800"
                >
                  Total Estimated Cost
                </td>

                <td className="px-5 py-5 text-right text-lg font-bold text-blue-700">
                  {formatCurrency(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* =====================================================
          SUMMARY
          ===================================================== */}
      <Card>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              BOQ Summary
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {projectItems.length} item
              {projectItems.length !== 1 ? "s" : ""} across{" "}
              {categoryGroups.length} categor
              {categoryGroups.length !== 1 ? "ies" : "y"}.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-500">
              Grand Total
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {formatCurrency(grandTotal)}
            </p>
          </div>
        </div>
      </Card>

      {/* =====================================================
          DOWNLOAD CTA
          ===================================================== */}
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium text-slate-900">
              BOQ ready for download
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Generate a professional PDF report containing the
              project details, estimation items, subtotals, and
              total estimated cost.
            </p>
          </div>

          <Button onClick={handleDownloadPDF}>
            <Download size={16} />
            Download BOQ PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default BOQ;