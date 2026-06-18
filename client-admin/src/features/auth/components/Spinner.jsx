export const Spinner = ({ small = false }) => {
  if (small) {
    return (
      <span
        className="inline-block border-2 border-white border-t-transparent rounded-full animate-spin"
        style={{ width: 16, height: 16 }}
      />
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div
        className="rounded-full border-4 border-orange-200 border-t-orange-600 animate-spin"
        style={{ width: 48, height: 48 }}
      />
      <p className="text-orange-600 font-medium text-sm">Cargando mesas…</p>
    </div>
  );
};