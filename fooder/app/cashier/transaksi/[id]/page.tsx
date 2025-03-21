"use client"

import { iOrder, OrderResponse } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { getCookies } from "@/lib/server-cookies";
import { get, put } from "@/lib/api-bridge";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


const getOrder = async (id: string): Promise<OrderResponse | null> => {
  try {
    const TOKEN = (await getCookies("token")) ?? "";
    const url = `${BASE_API_URL}/order/history/${id}`;
    const { data } = await get(url, TOKEN);

    if (data?.status) return data.data;
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export default function Details() {
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const router = useRouter();
    const params = useParams();
    const [paymentStatus, setPaymentStatus] = useState<string>("");
    const [orderStatus, setOrderStatus] = useState<string>("");
    const { id } = params;
    
    const handleSumbit = async () => {
        console.log('selectedMethod');
        
        try {
          const TOKEN = (await getCookies("token")) ?? "";
    
          const url = `${BASE_API_URL}/order/${id}`;
          const payload: any = {
            order_status: orderStatus,
            payment_status:paymentStatus
          };
    
          
    
          // Baru stringify di sini
          const jsonPayload = JSON.stringify(payload);
    
          const { data } = await put(url, jsonPayload, TOKEN);
          if (data?.status) {
            const urlUpdate = `${BASE_API_URL}/order/${id}`;
            const payloadUpdate: any = {
              status: "PAID"
            };
            const jsonPayloadUpdate = JSON.stringify(payloadUpdate);
    
            const res = await put(urlUpdate, jsonPayloadUpdate, TOKEN);
            if (res.data.status) {
                window.location.reload();
              //  router.push("/cashier/menuOrder"  );
            }
            //  router.push('/cashier/payment/' + id);
          } else {
            //  toast(data?.message, {
            //    hideProgressBar: true,
            //    containerId: `toastMenu`,
            //    type: `warning`,
            //  });
          }
        } catch (error) {
          console.log(error);
        }
        
    };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof id === "string") {
        const result = await getOrder(id);
        console.log(result);
        
        if (result){ setOrder(result); setOrderStatus(result.status); setPaymentStatus(result.PaymentOrder.status)};
      }
    };
    fetchData();
  }, [id]);
  return order ? (
    <div className="text-black">
      <p>{order?.id}</p>
      <p>{order?.uuid}</p>
      <div>
        {order?.orderlist?.map((item) => (
          <p key={item.id}>{item.menu.name}</p>
        ))}
      </div>
      <select name="" id="" value={paymentStatus}  onChange={(e) => setPaymentStatus(e.target.value)}>
        <option value="BELUM_DIBAYAR">Belum Dibayar</option>
        <option value="LUNAS">Lunas</option>
        <option value="CANCELED">Cancelled</option>
        <option value="BELUM_LUNAS">Belum Lunas</option>
      </select>
      <select name="" id="" value={orderStatus}  onChange={(e) => setOrderStatus(e.target.value)}>
        <option value="NEW">New</option>
        <option value="PAID">Paid</option>
        <option value="DONE">Done</option>
      </select>
      <button onClick={handleSumbit}>Submit</button>
    </div>
  ) : <p>Tidak aa order</p>;
  
}
