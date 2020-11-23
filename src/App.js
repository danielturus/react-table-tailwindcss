import React from "react";
import { useTable, useBlockLayout } from "react-table";
import { FixedSizeList } from "react-window";
import scrollbarWidth from "./scrollbarWidth";

import makeData from "./makeData";

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 150
    }),
    []
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useBlockLayout
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  // Render the UI for your table
  return (
    <table {...getTableProps()} className="table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} className="th">
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth + scrollBarSize}
        >
          {RenderRow}
        </FixedSizeList>
      </tbody>
    </table>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Row Index",
        accessor: (row, i) => i
      },
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName"
          },
          {
            Header: "Last Name",
            accessor: "lastName"
          }
        ]
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age",
            width: 50
          },
          {
            Header: "Visits",
            accessor: "visits",
            width: 60
          },
          {
            Header: "Status",
            accessor: "status"
          },
          {
            Header: "Profile Progress",
            accessor: "progress"
          }
        ]
      }
    ],
    []
  );

  const data = React.useMemo(() => makeData(100000), []);

  return <Table columns={columns} data={data} />;
}

export default App;
