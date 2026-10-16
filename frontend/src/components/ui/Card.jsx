function Card({
  children,
  className = '',
  padding = 'p-5',
}) {
  return (
    <div
      className={[
        'rounded-lg border border-slate-200',
        'bg-white shadow-sm',
        padding,
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export default Card;