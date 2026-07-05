import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Completed", value: 40 },
  { name: "Running", value: 15 },
  { name: "Queued", value: 25 },
];

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

export default function JobsPieChart() {
  return (
    <div className="w-full h-80 bg-white p-4 rounded shadow">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}