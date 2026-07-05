import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", jobs: 10 },
  { day: "Tue", jobs: 25 },
  { day: "Wed", jobs: 18 },
  { day: "Thu", jobs: 40 },
  { day: "Fri", jobs: 30 },
];

export default function JobsLineChart() {
  return (
    <div className="w-full h-80 bg-white p-4 rounded shadow">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}