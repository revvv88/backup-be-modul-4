"use client";

import { OrderResponse } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { getCookies } from "@/lib/server-cookies";
import { get } from "@/lib/api-bridge";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Alert from "../alert/page";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
  // setTimeout(() => window.location.reload(), 500);
  return (
    <div>
      {/* <div className="relative overflow-x-auto font-poppins ">
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
            {history.length === 0 ? (
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
                  <td className="px-6 py-4">
                    {data.createdAt
                      ? format(
                          new Date(data.createdAt),
                          "dd MMM yyyy, HH:mm:ss",
                          { locale: id }
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4">{data.customer}</td>
                  <td className="px-6 py-4">{data.nomor_meja.nomor}</td>
                  <td className="px-6 py-4">{data.status}</td>
                  <td className="px-6 py-4">
                    {data.PaymentOrder?.paymentMethod.nama}
                  </td>
                  <td className="px-6 py-4">{data.PaymentOrder?.status}</td>
                  <td className="px-6 py-4">{data.total_price}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/cashier/transaksi/${data.id}`}
                      className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                    >
                      See Detail
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <Alert>No menu data available</Alert>
            )}
          </tbody>
        </table>
      </div> */}
      <div className="flex flex-col justify-center">
  <h1 className="font-bold text-2xl mt-10">Transaction History</h1>
  <div className="bg-white my-10 p-6 rounded-lg w-full h-max box-border text-gray-800 overflow-x-auto shadow-md">
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-gray-600 space-x-4">
          {["#", "Date & Time", "Customer Name", "Order Status", "Total Payment", "Payment Status", "Orders"].map(
            (header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-sm font-medium bg-[#f7f7f7] rounded-full w-max"
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="text-center">
        {history.length === 0 ? (
          <tr>
            <td colSpan="7" className="px-6 py-4">
              <Alert>No data available</Alert>
            </td>
          </tr>
        ) : (
          history.map((data, index) => (
            <tr key={index} className="border-b border-gray-200 text-sm">
              <td className="px-4 py-4 w-max">{String(index + 1)}</td>
              <td className="px-4 py-4 w-max">
                {data.createdAt
                  ? format(new Date(data.createdAt), "dd/MM/yyyy - HH:mm a")
                  : "-"}
              </td>
              <td className="px-4 py-4 w-max capitalize">{data.customer}</td>
              <td className="px-4 py-4 w-max">{data.status}</td>
              <td className="px-4 py-4 w-max">
                USD {parseFloat(data.total_price).toFixed(2)}
              </td>
              <td className="px-4 py-4 w-max">
                <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                  {data.PaymentOrder?.status}
                </span>
              </td>
              <td className="px-4 py-4 w-max">
                <Link
                  href={`/cashier/transaksi/${data.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Detail
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>


    </div>
  );
};

export default TransaksiPage;
