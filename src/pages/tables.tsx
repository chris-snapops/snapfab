import React from "react";
import TablePicker from "../components/TablePicker";
import Layout from "../components/Layout";

const tables = [
  { name: "Users", rows: 120, href: "/tables/users" },
  { name: "Orders", rows: 58, href: "/tables/orders" },
  { name: "Products", rows: 34, href: "/tables/products" },
  { name: "Invoices", rows: 12, href: "/tables/invoices" },
  { name: "Customers", rows: 85, href: "/tables/customers" },
];

export default function Tables() {
  const handleCreate = () => {
    alert("Create new table clicked");
  };

  return (
    <Layout>
      <div className="p-8 flex justify-center bg-gray-50 min-h-screen">
        <TablePicker tables={tables} onCreate={handleCreate} />
      </div>
    </Layout>
  );
}
