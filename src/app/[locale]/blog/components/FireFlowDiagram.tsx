export default function FireFlowDiagram() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 my-6">
      <h3 className="text-lg font-bold mb-4">Fire Protection Flow</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Detection</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span>Alarm</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Suppression</span>
        </div>
      </div>
    </div>
  );
}
