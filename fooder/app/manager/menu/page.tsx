"use client"; // Tambahkan agar jadi Client Component

import { IMenu } from "@/app/types";
import { getCookies } from "../../../lib/server-cookies";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get } from "@/lib/api-bridge";
import Alert from "../../../components/alert/page";
import Image from "next/image";
import Search from "../../../components/menu/SearchData";
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
    let result: IMenu[] = [];
    if (data?.status) result = [...data.data];
    return result;
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
    if (category === "FOOD") {
      return (
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          Food
        </span>
      );
    }
    if (category === "SNACK") {
      return (
        <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          Snack
        </span>
      );
    }
    return (
      <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
        Drink
      </span>
    );
  };

  return (
    <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md">
      <h4 className="text-xl font-bold mb-2">Menu Data</h4>
      <p className="text-sm text-secondary mb-4">
        This page displays menu data, allowing menus to view details, search,
        and manage menu items by adding, editing, or deleting them.
      </p>

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center w-full max-w-md flex-grow">
          <Search url={`/manager/menu`} search={search} />
        </div>
        <div className="ml-4">
          <AddMenu />
        </div>
      </div>

      {/* Alert jika data kosong */}
      {menu.length === 0 ? (
        <Alert>No data available</Alert>
      ) : (
        <div className="m-2">
          {menu.map((data, index) => (
            <div
              key={`keyPrestasi${index}`}
              className="flex flex-wrap shadow m-2"
            >
              <div className="w-full md:w-1/12 p-2">
                <small className="text-sm font-bold text-primary">
                  Picture
                </small>
                <br />
                <Image
                  width={40}
                  height={40}
                  src={`${BASE_IMAGE_MENU}/${data.picture}`}
                  className="rounded-sm overflow-hidden"
                  alt="preview"
                  unoptimized
                />
              </div>

              <div className="w-full md:w-2/12 p-2">
                <small className="text-sm font-bold text-primary">Name</small>
                <br />
                {data.name}
              </div>

              <div className="w-full md:w-1/12 p-2">
                <small className="text-sm font-bold text-primary">Price</small>
                <br />
                {data.price}
              </div>

              <div className="w-full md:w-5/12 p-2">
                <small className="text-sm font-bold text-primary">
                  Description
                </small>
                <br />
                {data.description}
              </div>

              <div className="w-full md:w-1/12 p-2">
                <small className="text-sm font-bold text-primary">
                  Category
                </small>
                <br />
                {category(data.category)}
              </div>

              <div className="w-full md:w-2/12 p-2">
                <small className="text-sm font-bold text-primary">Action</small>
                <br />
                <EditMenu selectedMenu={data} />
                <DeleteMenu selectedMenu={data} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
