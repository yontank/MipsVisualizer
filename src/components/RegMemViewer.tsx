import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "./VirtualizedTable";
import type { ColumnDef } from "@tanstack/react-table";

function RegMemViewer() {
  // Static Data,

  const registerValues = [
    { name: "$zero", number: 0, value: "0x00000000" },
    { name: "$at", number: 1, value: "0x00000001" },
    { name: "$v0", number: 2, value: "" },
    { name: "$v1", number: 3, value: "" },
    { name: "$a0", number: 4, value: "" },
    { name: "$a1", number: 5, value: "" },
    { name: "$a2", number: 6, value: "" },
    { name: "$a3", number: 7, value: "" },
    { name: "$t0", number: 8, value: "" },
    { name: "$t1", number: 9, value: "" },
    { name: "$t2", number: 10, value: "" },
    { name: "$t3", number: 11, value: "" },
    { name: "$t4", number: 12, value: "" },
    { name: "$t5", number: 13, value: "" },
    { name: "$t6", number: 14, value: "" },
    { name: "$t7", number: 15, value: "" },
    { name: "$s0", number: 16, value: "" },
    { name: "$s1", number: 17, value: "" },
    { name: "$s2", number: 18, value: "" },
    { name: "$s3", number: 19, value: "" },
    { name: "$s4", number: 20, value: "" },
    { name: "$s5", number: 21, value: "" },
    { name: "$s6", number: 22, value: "" },
    { name: "$s7", number: 23, value: "" },
    { name: "$t8", number: 24, value: "" },
    { name: "$t9", number: 25, value: "" },
    { name: "$k0", number: 26, value: "" },
    { name: "$k1", number: 27, value: "" },
    { name: "$gp", number: 28, value: "" },
    { name: "$sp", number: 29, value: "" },
    { name: "$fp", number: 30, value: "" },
    { name: "$ra", number: 31, value: "" },
    { name: "pc", number: "", value: "" },
    { name: "hi", number: "", value: "" },
    { name: "lo", number: "", value: "" },
  ];
  //
  const memValues = [
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },

    {
      address: "0x00FF001C",
      value: "00F2C1BA",
    },
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },

    {
      address: "0x00FF001C",
      value: "00F2C1BA",
    },
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },

    {
      address: "0x00FF001C",
      value: "00F2C1BA",
    },
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },

    {
      address: "0x00FF001C",
      value: "00F2C1BA",
    },
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },

    {
      address: "0x00FF001C",
      value: "00F2C1BA",
    },
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },

    {
      address: "0x00FF001C",
      value: "00F2C1BA",
    },
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },

    {
      address: "0x00FF001C",
      value: "00F2C1BA",
    },
  ];

  const columns: ColumnDef<{ address: string; value: string }>[] = [
    {
      accessorKey: "address",
      cell: (info) => info.getValue() + "hi",
      header: "Address",
      size: 50,
    },
    {
      accessorKey: "value",
      cell: (info) => info.getValue(),
      header: "Value",
      size: 50,
    },
  ];
  return (
    <div>
      <DataTable columns={columns} data={memValues} height="50vh" />
    </div>
  );

  type tableData = { titles: string[]; values: (string | number)[][] };

  const RegisterTable = ({ titles, values }: tableData) => {
    if (titles.length == 0 || values.length == 0) return <></>;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {titles.map((e) => (
              <>
                <TableHead className="text-center">{e}</TableHead>
              </>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.map((e, i) => (
            <TableRow
              key={`row-${i}`}
              className={"odd:bg-gray-300 text-center"}
            >
              {e.map((t, j) => (
                <TableCell key={`cell-${j}`}>{t}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const MemoryTable = ({ titles, values }: tableData) => {
    if (titles.length == 0 || values.length == 0) return <></>;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {titles.map((e) => (
              <>
                <TableHead className="text-center">{e}</TableHead>
              </>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody></TableBody>
      </Table>
    );
  };

  return (
    <div className="w-fit max-w-xl h-screen overflow-y-auto border rounded-md ">
      <Tabs defaultValue="register" className="w-[325px] ">
        <div className="flex justify-center w-full sticky top-2 z-50 h-fit my-2 ">
          <TabsList className="w-full">
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="register">
          <RegisterTable
            titles={Object.keys(memValues[0])}
            values={registerValues.map((e) => Object.values(e))}
            // rowStyle={}
          />
        </TabsContent>

        <TabsContent value="memory">
          <MemoryTable
            titles={Object.keys(memValues[0])}
            values={memValues.map((e) => Object.values(e))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RegMemViewer;
