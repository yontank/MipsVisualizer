import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type tableData } from "./columns"

const titles = ["Name", "Number", "Value"]

export const RegisterTable = ({ values, setRowStyle }: tableData) => {
  if (titles.length == 0 || values.length == 0) return <></>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {titles.map((e) => (
            <TableHead key={e} className="text-center">
              {e}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {values.map((e, i) => (
          <TableRow
            key={`row-${i}`}
            className={"odd:bg-gray-300 text-center"}
            style={setRowStyle(e)}
          >
            {e.map((t, j) => (
              <TableCell key={`cell-${j}`}>{t}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
