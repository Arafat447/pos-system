"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "../api";

export default function page() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = "Dashboard";
    fetchProducts().then((res) => setProducts(res?.data));
  }, []);
  return (
    <div className="bg-white min-h-[100vh]">
      <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
        <h1 className="mb-4 text-2xl font-semibold leading-tight">Products</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col className="w-24" />
            </colgroup>
            <thead className="dark:bg-gray-300">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Discount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr
                    key={product?.id}
                    className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                  >
                    <td className="p-3">
                      <p>{product?.name}</p>
                    </td>
                    <td className="p-3">
                      <p>{product?.price}</p>
                    </td>
                    <td className="p-3">
                      <p>{product?.stock}</p>
                    </td>
                    <td className="p-3 text-right">
                      <p>{product?.discount}</p>
                    </td>
                    <td className="p-3 text-right ">
                      <span className="px-3 py-1 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">
                        <span>Pending</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}