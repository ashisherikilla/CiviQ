import { useMemo, useState } from "react";
import { X } from "lucide-react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

import { useAppContext } from "../../context/AppContext";

import workCategories from "../../data/workCategories";
import estimationUnits from "../../data/estimationUnits";

import {
  calculateAmount,
  calculateQuantity,
} from "../../utils/estimationCalculations";

export default function WorkItemModal({
  projectId,
  onClose,
}) {
  const { addEstimationItem } =
    useAppContext();

  const [formData, setFormData] =
    useState({
      category: "",
      description: "",
      unit: "",
      length: "",
      width: "",
      depth: "",
      manualQuantity: "",
      rate: "",
    });

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  const quantity = useMemo(() => {
    return calculateQuantity({
      unit: formData.unit,
      length: formData.length,
      width: formData.width,
      depth: formData.depth,
      manualQuantity:
        formData.manualQuantity,
    });
  }, [
    formData.unit,
    formData.length,
    formData.width,
    formData.depth,
    formData.manualQuantity,
  ]);

  const amount = useMemo(() => {
    return calculateAmount(
      quantity,
      formData.rate
    );
  }, [
    quantity,
    formData.rate,
  ]);

  const selectedUnit =
    estimationUnits.find(
      (unit) =>
        unit.value === formData.unit
    );

  const usesDimensions =
    selectedUnit?.type === "volume" ||
    selectedUnit?.type === "area" ||
    selectedUnit?.type === "length";

  function handleSubmit(event) {
    event.preventDefault();

    const item = {
      id: crypto.randomUUID(),

      projectId,

      category:
        formData.category,

      description:
        formData.description,

      unit:
        formData.unit,

      dimensions: {
        length:
          Number(formData.length) || 0,
        width:
          Number(formData.width) || 0,
        depth:
          Number(formData.depth) || 0,
      },

      manualQuantity:
        Number(
          formData.manualQuantity
        ) || 0,

      quantity,

      rate:
        Number(formData.rate) || 0,

      amount,

      createdAt:
        new Date().toISOString(),
    };

    addEstimationItem(item);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Work Item
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Add an estimation item to this project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              id="category"
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleChange}
              required
              options={workCategories}
            />

            <Select
              id="unit"
              name="unit"
              label="Unit"
              value={formData.unit}
              onChange={handleChange}
              required
              options={estimationUnits.map(
                (unit) => ({
                  value: unit.value,
                  label: `${unit.label} — ${unit.name}`,
                })
              )}
            />
          </div>

          <Input
            id="description"
            name="description"
            label="Work Description"
            placeholder="e.g. RCC slab concrete"
            value={
              formData.description
            }
            onChange={handleChange}
            required
          />

          {/* DIMENSIONS */}

          {usesDimensions ? (
            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">
                Dimensions
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  id="length"
                  name="length"
                  label="Length"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={
                    formData.length
                  }
                  onChange={
                    handleChange
                  }
                />

                {selectedUnit?.type !==
                  "length" && (
                  <Input
                    id="width"
                    name="width"
                    label="Width"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={
                      formData.width
                    }
                    onChange={
                      handleChange
                    }
                  />
                )}

                {selectedUnit?.type ===
                  "volume" && (
                  <Input
                    id="depth"
                    name="depth"
                    label="Depth / Height"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={
                      formData.depth
                    }
                    onChange={
                      handleChange
                    }
                  />
                )}
              </div>
            </div>
          ) : (
            <Input
              id="manualQuantity"
              name="manualQuantity"
              label="Quantity"
              type="number"
              min="0"
              step="any"
              placeholder="Enter quantity"
              value={
                formData.manualQuantity
              }
              onChange={handleChange}
              required
            />
          )}

          <Input
            id="rate"
            name="rate"
            label="Rate"
            type="number"
            min="0"
            step="any"
            placeholder="Enter project-specific rate"
            value={formData.rate}
            onChange={handleChange}
            required
          />

          {/* PREVIEW */}

          <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">
                Quantity
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                {quantity.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Rate
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                ₹
                {Number(
                  formData.rate || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Amount
              </p>

              <p className="mt-1 text-lg font-semibold text-blue-700">
                ₹
                {amount.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">
              Add Work Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}