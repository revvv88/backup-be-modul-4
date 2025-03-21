"use client";

import { OrderResponse } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { getCookies } from "@/lib/server-cookies";
import { get } from "@/lib/api-bridge";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "../alert/page";
import Link from "next/link";

const getHistory = async (search: string): Promise<OrderResponse[]> => {
  try {
    const TOKEN = (await getCookies("token")) ?? "";
    const url = `${BASE_API_URL}/order/history?search=${search}`;
    const { data } = await get(url, TOKEN);
    return data?.status ? [...data.data] : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
const TransaksiPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [history, setHistory] = useState<OrderResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getHistory(search);
      setHistory(result);
    };
    fetchData();
  }, [search]);
  return (
    <div className="relative overflow-x-auto font-poppins ">
      <h1 className="text-hitamGaHitam text-2xl capitalize font-bold my-4">
        transaction history
      </h1>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg overflow-hidden border-collapse">
        <thead className="text-base text-hitamGaHitam text-center uppercase bg-white border-b dark:border-gray-700 rounded-t-lg">
          <tr>
            <th scope="col" className="px-6 py-3">
              Booking ID
            </th>
            <th scope="col" className="px-6 py-3">
              Date & Time
            </th>
            <th scope="col" className="px-6 py-3">
              Customer
            </th>
            <th scope="col" className="px-6 py-3">
              Table Number
            </th>
            <th scope="col" className="px-6 py-3">
              Status Order
            </th>
            <th scope="col" className="px-6 py-3">
              Payment Type
            </th>
            <th scope="col" className="px-6 py-3">
              Status Payment
            </th>
            <th scope="col" className="px-6 py-3">
              Total
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {
            history.length === 0 ? (
              <Alert>No data available</Alert>
            ) : Array.isArray(history) && history.length > 0 ? (
              history.map((data, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:border-gray-700 rounded-b-lg"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    {data.uuid}
                  </th>
                  <td className="px-6 py-4">{data.createdAt}</td>
                  <td className="px-6 py-4">{data.customer}</td>
                  <td className="px-6 py-4">{data.nomor_meja.nomor}</td>
                  <td className="px-6 py-4">{data.status}</td>
                  <td className="px-6 py-4">{data.PaymentOrder.paymentMethod.nama}</td>
                  <td className="px-6 py-4">{data.PaymentOrder.status}</td>
                  <td className="px-6 py-4">{data.total_price}</td>
                  <td className="px-6 py-4">
                    <Link href={`/cashier/transaksi/${data.id}`} className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600">
                      See Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <Alert>No menu data available</Alert>
            ) 
          }
        </tbody>
      </table>
    </div>
  );
};

export default TransaksiPage;
