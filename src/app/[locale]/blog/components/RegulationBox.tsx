export default function RegulationBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg my-6">
      <div className="flex">
        <div className="ml-3">
          <div className="text-yellow-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
