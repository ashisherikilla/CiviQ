export default function Input({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={[
          "w-full rounded-md border bg-white px-3 py-2.5 text-sm",
          "text-slate-900 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/10",
          disabled
            ? "cursor-not-allowed bg-slate-50 text-slate-400"
            : "",
        ].join(" ")}
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}