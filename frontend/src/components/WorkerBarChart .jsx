import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { worker: "Worker-1", jobs: 20 },
  { worker: "Worker-2", jobs: 35 },
  { worker: "Worker-3", jobs: 15 },
];

export default function WorkerBarChart() {
  return (
    <div className="w-full h-80 bg-white p-4 rounded shadow">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="worker" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jobs" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}