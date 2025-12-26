import React from "react";
import { Center, Box } from "@mantine/core";
import TablePicker from "../../components/TablePicker";
import Layout from "../../components/Layout";

const tables = [
  { name: "Tasks", rows: 58, href: "/tables/tasks" },
];

export default function Tables() {
  const handleCreate = () => {
    alert("Create new table clicked");
  };

  return (
    <Layout title="Tables">
      <Center p="xl">
        <TablePicker tables={tables} onCreate={handleCreate} />
      </Center>
    </Layout>
  );
}
