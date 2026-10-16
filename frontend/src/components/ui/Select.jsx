export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={[
          "w-full rounded-md border border-slate-300",
          "bg-white px-3 py-2.5 text-sm text-slate-900",
          "outline-none transition",
          "focus:border-blue-500",
          "focus:ring-2 focus:ring-blue-500/20",
          "disabled:cursor-not-allowed",
          "disabled:bg-slate-100",
          "disabled:text-slate-500",
        ].join(" ")}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value ?? option}
            value={option.value ?? option}
          >
            {option.label ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}