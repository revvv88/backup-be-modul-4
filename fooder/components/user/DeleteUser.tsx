"use client";

import { IUser } from "@/app/types";
import { BASE_API_URL } from "@/global";
import { drop } from "@/lib/api-bridge";
import { getCookie } from "@/lib/client-cookies";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ButtonPrimary, ButtonDanger } from "@/components/buttonComponents";
import Modal from "@/components/modal";

const DeleteUser = ({ selectedUser }: { selectedUser: IUser }) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const [user, setUser] = useState<IUser>({ ...selectedUser });

  const router = useRouter();

  const TOKEN = getCookie("token") || "";

  const openModal = () => {
    setUser({ ...selectedUser });
    setIsShow(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const url = `${BASE_API_URL}/user/${selectedUser.id}`;
      const { data } = await drop(url, TOKEN);
      if (data?.status) {
        setIsShow(false);
        toast(data?.message, {
          hideProgressBar: true,
          containerId: `toastUser`,
          type: `success`,
        });
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast(data?.message, {
          hideProgressBar: true,
          containerId: `toastUser`,
          type: `warning`,
        });
      }
    } catch (error) {
      console.log(error);
      toast(`Something Wrong`, {
        hideProgressBar: true,
        containerId: `toastUser`,
        type: `error`,
      });
    }
  };
  return (
    <div>
      <ToastContainer containerId={`toastUser`} />
      <ButtonDanger type="button" onClick={() => openModal()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </ButtonDanger>
      <Modal isShow={isShow} onClose={state => setIsShow(state)}>
               <form onSubmit={handleSubmit} className="font-poppins">
                   {/* modal header */}
                   <div className="sticky top-0 bg-white px-5 pt-5  ">
                       <div className="w-full flex items-center">
                           <div className="flex flex-col">
                               <strong className="font-bold text-2xl">Delete User</strong>
                               {/* <small className="text-slate-400 text-sm">Menus with existing transaction data cannot be deleted from this page.</small> */}
                           </div>
                           <div className="ml-auto">
                               <button type="button" className="text-slate-400" onClick={() => setIsShow(false)}>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                   </svg>
                               </button>
                           </div>
                       </div>
                   </div>
                   {/* end modal header */}

                   {/* modal body */}
                   <div className="px-5 py-2">
                   Are you sure you want to delete this user <span className="font-bold capitalize">{user.name}?</span>
                   </div>
                   {/* end modal body */}

                   {/* modal footer */}
                   <div className="w-full p-5 flex rounded-b-2xl shadow">
                       <div className="flex ml-auto gap-2">
                           <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                               Cancel
                           </ButtonDanger>
                           <ButtonPrimary type="submit">
                               Save
                           </ButtonPrimary>
                       </div>
                   </div>
                   {/* end modal footer */}
               </form>
           </Modal>

    </div>
  );
};
export default DeleteUser;
