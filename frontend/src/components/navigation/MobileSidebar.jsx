import Sidebar from './Sidebar';

function MobileSidebar({
  open,
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />

      <div className="relative h-full w-72 max-w-[85vw]">
        <Sidebar
          mobile
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default MobileSidebar;