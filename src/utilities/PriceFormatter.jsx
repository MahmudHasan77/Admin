import React from "react";
import { twMerge } from 'tailwind-merge';

const PriceFormatter = ({ price, className }) => {
  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return <span className={twMerge(className)}>{formatUSD(price)}</span>;
};

export default PriceFormatter;
