"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchCollections } from "@/lib/redux/slices/collectionSlice";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function CollectionsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { collections, status, error } = useSelector(
    (state: RootState) => state.collections
  );

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    // Sadece oturum açılmışsa, accessToken varsa ve veriler henüz alınmadıysa isteği gönder
    if (
      sessionStatus === "authenticated" &&
      session.accessToken &&
      status === "idle"
    ) {
      dispatch(fetchCollections(session.accessToken));
    }
  }, [sessionStatus, session, status, dispatch]);

  const renderContent = () => {
    if (status === "loading" || sessionStatus === "loading") {
      return <div className="text-center">Yükleniyor...</div>;
    }

    if (status === "failed") {
      return <div className="text-center text-red-500">Hata: {error}</div>;
    }

    if (status === "succeeded" && collections.length === 0) {
      return (
        <div className="text-center">Gösterilecek koleksiyon bulunamadı.</div>
      );
    }

    return (
      <div className="overflow-x-auto bg-white rounded-lg ">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="py-3  border-b font-semibold pl-6 w-1/5">
                Başlık
              </th>
              <th className="py-3  border-b font-semibold w-2/5">Açıklama</th>

              <th className="py-3  border-b font-semibold pr-6 text-right w-[120px]">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id}>
                {/* <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {collection.id}
                </td> */}
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  {collection.info.name}
                </td>
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: collection.info.description,
                    }}
                  />
                </td>
                {/* <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <span
                    className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${
                      collection.type === 0
                        ? "bg-blue-200 text-blue-900"
                        : "bg-green-200 text-green-900"
                    }`}
                  >
                    {collection.type === 0 ? "Manuel" : "Filtreli"}
                  </span>
                </td> */}
                {/* <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <Link href={`/collections/edit/${collection.id}`}>
                    <span className="px-4 py-2 font-semibold text-white bg-indigo-500 rounded cursor-pointer hover:bg-indigo-600">
                      Sabitleri Düzenle
                    </span>
                  </Link>
                </td> */}
                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 flex justify-end">
                  <Link href={`/collections/edit/${collection.id}`}>
                    <button className="cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (sessionStatus === "authenticated") {
    return (
      <div className="flex h-screen p-[10px] gap-[20px]">
        <Sidebar />
        {/* <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
          <h1 className="mb-4 text-3xl font-bold md:mb-0">Koleksiyonlar</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        </div> */}

        <div className="flex-1 flex flex-col  gap-[10px]">
          <Header title="Koleksiyon" subtitle="Koleksiyon Listesi" />
          <div className=" border border-[#9F9EA0] rounded-[8.57px] p-[30px]">
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      Yükleniyor...
    </div>
  );
}
