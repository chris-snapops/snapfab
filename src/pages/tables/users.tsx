import React from "react";
import Layout from "../../components/Layout";
import TableEditor from "../../components/TableEditor";

export default function TableUsers() {
  return (
    <Layout>
      <div className="p-8 flex justify-center bg-gray-50 min-h-screen">
        <TableEditor />
      </div>
    </Layout>
  );
}
