"use client";
import Image from "next/image";
import { BASE_IMAGE_MENU } from "@/global";

export default function Test({
  id,
  image,
  title,
  cat,
  price,
  orderClick,
}: any) {
  const clickOrder = () => {
    orderClick({ id, title, image, price });
  };

  const category = (category: string): React.ReactNode => {
    const categories = {
      FOOD: "bg-blue-100 text-blue-800",
      SNACK: "bg-red-100 text-red-800",
      DRINK: "bg-green-100 text-green-800",
    };
    return (
      <span className={`${categories[category] || "bg-gray-100 text-gray-800"} text-sm font-medium px-3 py-1 rounded-full`}>
        {category}
      </span>
    );
  };

  const rupiah = (amount:number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="text-hitamGaHitam font-poppins">
      <div className="bg-[#ffffff] flex flex-col rounded-lg py-3 overflow-hidden shadow-md w-52 min-h-[250px]">
        <div className="flex flex-col h-full">
          <div className="rounded-lg w-36 h-32 overflow-hidden relative mx-auto bg-[#F7F7F7]">
            <Image
              src={image ? `${BASE_IMAGE_MENU}/${image}` : "/menu/menu1.jpg"}
              alt="makanan"
              layout="fill"
              objectFit="cover"
              className="rounded-lg p-2"
            />
          </div>

          <div className="flex-grow flex flex-col justify-between mt-2 px-3">
            <h1 className="capitalize text-lg">{title}</h1>

            <div className="flex justify-between gap-2 mt-2">
              {category(cat)}
              <h1 className="text-gray-700 text-lg">{rupiah(price)}</h1>
            </div>
          </div>

          <div className="w-full flex justify-end mt-4 px-3">
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md"
              onClick={clickOrder}
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
