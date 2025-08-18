import React from "react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GoDotFill } from "react-icons/go";

const Chart = () => {
  const [ChartData, setCartData] = useState([
    {
      name: "JAN",
      user: 4000,
      product: 2400,
      amt: 2400,
    },
    {
      name: "FB",
      user: 3000,
      product: 1398,
      amt: 2210,
    },
    {
      name: "MAR",
      user: 2000,
      product: 9800,
      amt: 2290,
    },
    {
      name: "APR",
      user: 2780,
      product: 3908,
      amt: 2000,
    },
    {
      name: "MAY",
      user: 2780,
      product: 3908,
      amt: 2000,
    },
    {
      name: "JUNE",
      user: 1890,
      product: 4800,
      amt: 2181,
    },
    {
      name: "JULY",
      user: 2390,
      product: 3800,
      amt: 2500,
    },
    {
      name: "AUG",
      user: 3490,
      product: 4300,
      amt: 2100,
    },
    {
      name: "SEP",
      user: 3490,
      product: 4300,
      amt: 2100,
    },
    {
      name: "OCT",
      user: 3490,
      product: 4300,
      amt: 2100,
    },
    {
      name: "NOV",
      user: 3490,
      product: 4300,
      amt: 2100,
    },
    {
      name: "DEC",
      user: 3490,
      product: 4300,
      amt: 2100,
    },
  ]);
  const [hoveringDataKey, setHoveringDataKey] = React.useState(null);

  let pvOpacity = 1;
  let uvOpacity = 1;

  if (hoveringDataKey === "uv") {
    pvOpacity = 0.5;
  }

  if (hoveringDataKey === "pv") {
    uvOpacity = 0.5;
  }

  const handleMouseEnter = (payload /*: LegendPayload */) => {
    setHoveringDataKey(payload.dataKey);
  };

  const handleMouseLeave = () => {
    setHoveringDataKey(null);
  };

  return (
    <div style={{ width: "100%" }}>
      <div className=" ml-[10%] my-3">
        <h1 className="font-semibold">Users & Products</h1>
        <div className=" flex items-center">
          <GoDotFill className=" text-green-500" />{" "}
          <p className="font-semibold text-sm">Users</p>
        </div>{" "}
        <div className=" flex items-center">
          <GoDotFill className=" text-blue-500" />{" "}
          <p className="font-semibold text-sm">Products</p>
        </div>{" "}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          width={500}
          height={300}
          data={ChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="name" fontSize={8} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Line
            type="monotone"
            dataKey="user"
            strokeOpacity={pvOpacity}
            stroke="green"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="product"
            strokeOpacity={uvOpacity}
            stroke="blue"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
