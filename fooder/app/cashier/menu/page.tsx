"use client";

import { IMenu } from "@/app/types";
import { getCookies } from "../../../lib/server-cookies";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-bridge";
import Alert from "../../../components/alert/page";
import Image from "next/image";
import Search from "../../../components/menu/Search";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddMenu from "../../../components/menu/AddMenu";
import EditMenu from "../../../components/menu/EditMenu";
import DeleteMenu from "@/components/menu/DeleteMenu";

const getMenu = async (search: string): Promise<IMenu[]> => {
  try {
    const TOKEN = (await getCookies("token")) ?? "";
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const { data } = await get(url, TOKEN);
    return data?.status ? [...data.data] : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const MenuPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [menu, setMenu] = useState<IMenu[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMenu(search);
      setMenu(result);
    };
    fetchData();
  }, [search]);

  const category = (category: string): React.ReactNode => {
    const categories = {
      FOOD: "bg-blue-100 text-blue-800",
      SNACK: "bg-indigo-100 text-indigo-800",
      DRINK: "bg-purple-100 text-purple-800",
    };
    return (
      <span className={`${categories[category] || "bg-gray-100 text-gray-800"} text-sm font-medium px-3 py-1 rounded-full`}>{category}</span>
    );
  };

  return (
    <div className="p-6  font-poppins">
      <h4 className="text-2xl font-bold mb-2">Menu Data</h4>
      <p className="text-sm text-gray-600 mb-6">
        This page displays menu data, allowing users to view details, search, and manage menu items.
      </p>

      {/* Search Bar */}
      <div className="flex justify-between mb-6">
        <Search url={`/cashier/menu`} search={search} className="w-[90%] mr-2" />
        <AddMenu className="ml-4" />
      </div>

      {/* Alert jika data kosong */}
      {menu.length === 0 ? (
        <Alert>No data available</Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map((data, index) => (
            <div
              key={`menu-${index}`}
              className="bg-gray-50 p-4 rounded-lg shadow flex flex-row items-center gap-4 overflow-hidden"
            >
              <Image
                width={100}
                height={100}
                src={`${BASE_IMAGE_MENU}/${data.picture}`}
                className="rounded-md object-cover"
                alt="Menu Preview"
                unoptimized
              />
              <div className="flex flex-col flex-grow">
                <h5 className="text-lg font-semibold mb-1 capitalize">{data.name}</h5>
                <p className="text-lg font-medium text-gray-500 mb-2">{data.price}</p>
                <p className="text-sm text-gray-700 line-clamp-2 capitalize">{data.description}</p>
                <div className="flex items-center justify-between mt-2">
                  {category(data.category)}
                  <div className="flex gap-2">
                    <EditMenu selectedMenu={data} />
                    <DeleteMenu selectedMenu={data} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;