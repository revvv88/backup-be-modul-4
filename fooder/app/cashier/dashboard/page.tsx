"use client";

import React from "react";
import Cookies from "js-cookie";

export default function CashierPage() {
  const role = Cookies.get("role") || "Guest";
  const username = Cookies.get("username") || "Cashier";

  return (
    <div className="m-4 p-4 bg-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Welcome to Cashier Dashboard</h1>
      <p className="text-lg mb-2">Hello, {username}!</p>
      <p className="text-sm text-gray-600">Role: {role}</p>
      <p className="mt-4">
        This is the cashier page where you can manage sales, view transactions,
        and more.
      </p>
    </div>
  );
}
