import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/ui/VirtualizedTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import type { Hexadecimal } from "types";
import { hex2int, int2hex } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
const columns: ColumnDef<{ address: string; value: string }>[] = [
  {
    accessorKey: "address",
    cell: (info) => info.getValue(),
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

function createMemoryArr(
  index: number,
  VIRT_LIMIT: number,
  memValues: Map<Hexadecimal, Hexadecimal>
) {
  const result: { address: Hexadecimal; value: Hexadecimal }[] = [];

  const low = Math.max(index - VIRT_LIMIT / 2, 0);
  const high = Math.min(index + VIRT_LIMIT / 2, Math.pow(2, 32));

  for (let i = low; i < high; i++) {
    // convert the i address into a hexadecimal value.
    const hexAddr = int2hex(i);

    // if the hexadecimalv value doesn't exist, set its value to 0x0000:0000 (since it's not inside our record, it means its empty)
    if (memValues.has(hexAddr)) {
      //@ts-expect-error we're checking that the value exists above, why would it be undefined?
      result.push({ address: hexAddr, value: memValues.get(hexAddr) });
    } else result.push({ address: hexAddr, value: "0x00000000" });
  }

  return result;
}
const knownMemValues = new Map<Hexadecimal, Hexadecimal>();
knownMemValues.set("0x00000000", "0x00000001");
knownMemValues.set("0x00000001", "0x00000002");

function MemoryInput(props) {
  const [value, setValue] = useState<string>("");

  /**
   * TODO: Set state value inside the datatable alone, we dont want to fucking re-render the ENTIRE component when we only need the table to re render(memory)
   * TODO: also, i'd like to add a way to edit the values directly in the table
   * TODO: adding a (onSubmit button) (for the input) so that I'd add a way to submit the input value into the memory table, that way we can update the table without re-rendering the entire component
   * @param keys
   * @returns
   */
  const handleChange = (keys: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = keys.currentTarget;
    const newChar = value.charAt(value.length - 1);
    // FIXME: can be optomized by if the regex is not fitting, simply do not call the setState function,
    // needs to be checked if its something that needs to be done, (meaning there's some performance issues)
    // if there are, we'll also need to allow special keys (up, down, left, right arrows, enter, space key,etc.)
    if (!newChar.match(/[a-fA-F0-9]/i)) {
      return value.substring(0, value.length - 1);
    }
    return value.toUpperCase();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Submit the value
      console.log("Submitting:", value);

      props.onSubmit(
        hex2int(("0x" + event.currentTarget.value) as Hexadecimal)
      );
    }
  };

  return (
    <div>
      <Label>Memory Address</Label>
      <Input
        maxLength={8}
        autoCapitalize="characters"
        placeholder="e.g 0x12345678"
        value={value}
        onChange={(e) => setValue(handleChange(e))}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function MemoryTable() {
  const [memoryArr, setMemoryArr] = useState<
    {
      address: string;
      value: string;
    }[]
  >(createMemoryArr(500, 2048 * 4, knownMemValues));
  console.log(memoryArr.slice(0, 2));
  if (memoryArr === undefined) return <></>;
  
    // Get Ref of Virtuoso


  const handleSubmit = (value: number) => {
    setMemoryArr(createMemoryArr(value, 2048 * 8, knownMemValues));
  };

  return (
    <div className="">
      <MemoryInput onSubmit={handleSubmit} />
      <DataTable
        columns={columns}
        data={memoryArr}
        height="calc(100vh - 113px)"
      />
    </div>
  );
}

type tableData = { titles: string[]; values: (string | number)[][] };

function RegMemViewer() {
  // Todo update SetMemory Arr after getting submitting the input location of the memory address
  // Todo: Make Virtualized Table Specific For Memory Table to make it less Memory Hungry
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
            titles={Object.keys(registerValues[0])}
            values={registerValues.map((e) => Object.values(e))}
            // rowStyle={}
          />
        </TabsContent>

        <TabsContent value="memory">
          <MemoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RegMemViewer;
