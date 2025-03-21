"use client";

import { IMenu, IChart, iNoMeja } from "@/app/types";
import { getCookies } from "../../../lib/server-cookies";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";
import { get, post } from "@/lib/api-bridge";
import Alert from "../../../components/alert/page";
import Image from "next/image";
import Search from "../../../components/menu/Search";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CardMenu from "@/components/cardMenu";
import { toast } from "react-toastify";

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
const getNoMeja = async (): Promise<iNoMeja[]> => {
  try {
    const TOKEN = (await getCookies("token")) ?? "";
    const url = `${BASE_API_URL}/no-meja`;
    const { data } = await get(url, TOKEN);
    let result: iNoMeja[] = [];
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
  const [noMeja, setNoMeja] = useState<iNoMeja[]>([]);
  const [orderMenu, setOrderMenu] = useState<IChart[]>([]);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [selectedNoMeja, setSelectedNoMeja] = useState<string>("0");
  const [customerName, setCustomerName] = useState<string>("");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string>("0");
const [orderNote, setOrderNote] = useState("");


  const router = useRouter();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNoMeja(event.target.value);
  };
  const handleChangePlace = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlace(event.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      const result = await getMenu(search);
      setMenu(result);
      const resultNoMeja = await getNoMeja();
      setNoMeja(resultNoMeja);
    };
    fetchData();
  }, [search]);

  const addOrder = ({ id, title, image, price }: any) => {
    setOrderMenu((prevOrders) => {
      const existingItem = prevOrders.find((item) => item.id === id);
      if (existingItem) {
        return prevOrders.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevOrders, { id, title, image, price, qty: 1 }];
      }
    });
  };

  const decQty = (id: any) => {
    setOrderMenu((prevOrders) =>
      prevOrders.map((item) =>
        item.id === id ? { ...item, qty: Math.max(item.qty - 1, 1) } : item
      )
    );
  };

  const addQty = (id: any) => {
    setOrderMenu((prevOrders) =>
      prevOrders.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const deleteOrder = (id: any) => {
    setOrderMenu((prevOrders) => prevOrders.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const subtotal = orderMenu.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const total = subtotal;
    setSubTotal(subtotal);
    setTotal(total);
    if (orderMenu.length > 0) {
      setCheckoutOpen(true);
    } else {
      setCheckoutOpen(false);
    }
  }, [orderMenu]);

  const checkoutOrder = async () => {
    try {
      const TOKEN = (await getCookies("token")) ?? "";
      const url = `${BASE_API_URL}/order`;
      const payload = JSON.stringify({
        customer: customerName,
        table_number: selectedNoMeja,
        orderlists: orderMenu,
        note : orderNote === "" ? null : orderNote,
        dine_in : selectedPlace
      });

      const { data } = await post(url, payload, TOKEN);
      if (data?.status) {
        const id = data.data.id;
        const payloadPay = JSON.stringify({
          id_order: id,
          status: "BELUM_DIBAYAR",
        });

        const urlPay = `${BASE_API_URL}/pay-order`;
        const res = await post(urlPay, payloadPay, TOKEN);
        if (res.data.status) {
          router.push("/cashier/payment/" + id);
        }
      } else {
        toast(data?.message, {
          hideProgressBar: true,
          containerId: `toastMenu`,
          type: `warning`,
        });
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

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
    <div className="flex">
      <div className={` p-10 ${checkoutOpen ? "w-[71.5%]" : "w-full"} `}>
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
          {/* <div className="ml-4">
          <AddMenu />
        </div> */}
        </div>

        {/* Alert jika data kosong */}
        {menu.length === 0 ? (
          <Alert>No data available</Alert>
        ) : (
          <div className=" flex flex-wrap justify-center gap-4">
            {menu.map((data, index) => (
              <div key={index} className=" shadow m-2">
                <CardMenu
                  id={data.id}
                  image={data.picture}
                  title={data.name}
                  cat={data.category}
                  price={data.price}
                  orderClick={addOrder}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {checkoutOpen && (
  <div className="w-[28.5%] bg-white shadow-sm rounded-lg text-hitamGaHitam font-poppins flex flex-col h-screen relative">
    {/* Bagian Atas: Input & Pilihan */}
    <div className="p-4 flex-none">
      <div className="flex w-full items-center">
        <div className="bg-[#f7f7f7] rounded-full h-max w-max p-4 cursor-pointer" onClick={() => setShowNoteModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25px"
            viewBox="0 -960 960 960"
            width="25px"
            fill="rgb(41,48,58)"
          >
            <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
          </svg>
        </div>
        <div className="ml-20 w-40 flex flex-col justify-center">
          <input
            placeholder="Customer Name"
            type="text"
            onChange={(e) => setCustomerName(e.target.value)}
            className="text-center border rounded-xl px-2 py-3"
          />
        </div>
      </div>
      <div className="flex justify-between my-4">
        <select
          name="noMeja"
          className="bg-[#f7f7f7] py-2 px-3 my-2 rounded-full w-36"
          onChange={handleChange}
        value={selectedNoMeja}

        >
          <option value="0">Select</option>
          {noMeja.map((data, index) => (
            <option value={data.id} key={index}>
              Table {data.nomor}
            </option>
          ))}
        </select>
        <select className="bg-[#f7f7f7] py-2 px-3 my-2 rounded-full w-36"
        onChange={handleChangePlace}
        value={selectedPlace}
        >
          <option value="0">Select</option>
          <option value="1">Dine In</option>
          <option value="2">Dine Out</option>
        </select>
      </div>
    </div>

    <div className="p-4 flex-1 overflow-y-auto">
      {orderMenu.map((data, index) => (
        <div className="h-max flex p-2" key={index}>
          <div className="bg-[#f7f7f7] p-5 w-44 h-32 rounded-lg">
            <Image
              src={data.image ? `${BASE_IMAGE_MENU}/${data.image}` : "/menu/menu1.jpg"}
              alt="makanan"
              width={100}
              height={100}
              className="h-24 w-24 object-contain"
            />
          </div>
          <div className="w-full">
            <div className="flex justify-between mt-2">
              <p className="ml-3 text-lg capitalize">{data.title}</p>
              <p className="ml-3 text-lg">{data.price * data.qty}</p>
            </div>
            <div className="flex flex-row items-center mt-5 w-full justify-between">
              <div className="ml-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#E4252C"
                  onClick={() => deleteOrder(data.id)}
                  className="cursor-pointer"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
              </div>
              <div className="flex">
                <p
                  onClick={() => decQty(data.id)}
                  className="text-hitamGaHitam border-2 border-hitamGaHitam rounded-lg px-2 ml-14 mr-1 cursor-pointer hover:bg-slate-200 transition-all"
                >
                  -
                </p>
                <p className="text-hitamGaHitam px-2 mx-1">{data.qty}</p>
                <p
                  onClick={() => addQty(data.id)}
                  className="text-white border-orange-600 hover:bg-orange-600/90 hover:border-orange-600/90 bg-orange-600 border-2 rounded-lg px-2 mx-1 cursor-pointer transition-all"
                >
                  +
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>


    <div className="p-4 border-t bg-white sticky bottom-0 shadow-md">
      <div className="flex flex-row justify-between text-lg font-medium">
        <h1>Total</h1>
        <h1>Rp.{total}</h1>
      </div>
      <button
        onClick={checkoutOrder}
        className="bg-orange-500 text-white p-2 text-center cursor-pointer w-full rounded-lg mt-3"
      >
        Order
      </button>
    </div>
  </div>
)}

{/* modal note */}
{showNoteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
    <div className="bg-white p-5 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-2">Catatan Pesanan</h2>
      <textarea
        className="w-full border p-2 rounded-md"
        placeholder="Tambahkan catatan..."
        value={orderNote}
        onChange={(e) => setOrderNote(e.target.value)}
      ></textarea>
      <div className="flex justify-end mt-3">
        <button className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2" onClick={() => setShowNoteModal(false)}>
          Batal
        </button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md" onClick={() => setShowNoteModal(false)}>
          Simpan
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default MenuPage;
