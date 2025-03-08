import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  Column,
  usePagination,
  useSortBy,
  useTable
} from "react-table";

function TableHOC<T extends Object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const options: any = {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      pageCount,
      state: { pageIndex },
      previousPage,
      canNextPage,
      canPreviousPage,
    }:any = useTable(options, useSortBy, usePagination);

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        <table className="table" {...getTableProps()}>
        <thead>
        {headerGroups.map((headerGroup:any) => (
  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || headerGroup.headers.map((col:any) => col.id).join('-')}>
    {headerGroup.headers.map((column:any) => (
      <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
        {column.render("Header")}
        {column.isSorted && (
          <span>
            {column.isSortedDesc ? <AiOutlineSortDescending /> : <AiOutlineSortAscending />}
          </span>
        )}
      </th>
    ))}
  </tr>
))}

</thead>
<tbody {...getTableBodyProps()}>
  {page.map((row:any, rowIndex:any) => {
    prepareRow(row);

    return (
      <tr {...row.getRowProps()} key={row.id || rowIndex}>
  {row.cells.map((cell:any) => (
    <td {...cell.getCellProps()} key={cell.column.id}>
      {cell.render("Cell")}
    </td>
  ))}
</tr>

    );
  })}
</tbody>

        </table>

        {showPagination && (
          <div className="table-pagination">
            <button disabled={!canPreviousPage} onClick={previousPage}>
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button disabled={!canNextPage} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
