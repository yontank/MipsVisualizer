import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function RegMemViewer() {
  // Static Data,
  const registerValues = [
    { name: "$zero", number: 0, value: "0x00000000",  },
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
    { name: "pc", value: "" },
    { name: "hi", value: "" },
    { name: "lo", value: "" },
  ];
  //
  const memValues = [
    {
      address: "0x00ff0000",
      value: "00FFDABB",
    },
  ];

  type tableData = { titles: string[]; values: string[][] };
  //   TODO: Make values writable, and updating Simulation.

  const MyTable = ({ titles, values }: tableData) => {
    if (titles.length == 0 || values.length == 0) return <></>;

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {titles.map((e) => (
              <>
                <TableHead>{e}</TableHead>
              </>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {values.map((e, i) => (
            <TableRow key={`row-${i}`} className={"odd:bg-gray-200"}>
              {e.map((t, j) => (
                <TableCell key={`cell-${j}`}>{t}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        <TableBody></TableBody>
      </Table>
    );
  };

  return (
    <div className="w-fit max-w-xl border-solid  border-2 h-fit">
      <Tabs defaultValue="register" className="w-[400px]">
        <div className="flex justify-center w-full h-fit my-3 ">
          <TabsList>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="register">
          <div className="">
            <MyTable
              titles={Object.keys(registerValues[0])}
              values={registerValues.map((e) => Object.values(e))}
            />
          </div>
        </TabsContent>

        <TabsContent value="memory">
          <MyTable
            titles={Object.keys(memValues[0])}
            values={memValues.map((e) => Object.values(e))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RegMemViewer;
