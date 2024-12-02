import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";

import { useAllOrdersQuery } from "../../redux/api/orderAPI";

import { customError } from "../../types/api-types";
import { UserReducerInitialState } from "../../types/reducer-types";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  // Accessing the current user from the Redux store
  const { user } = useSelector((state:{userReducer:UserReducerInitialState}) => state.userReducer);

  // Query for fetching all orders associated with the user
  const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);

  // State to manage rows for the table
  const [rows, setRows] = useState<DataType[]>([]);

  // Handling error display
  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  // Populating rows when data is successfully fetched
  useEffect(() => {
    if (data) {
     data.orders.map((i)=>{
       if(!i.user){
        console.log(i)
       }
     })
      
      setRows(
        data.orders.map((i) => ({
          user: i.user?.name,
          amount: Number((i.total).toFixed(2)),
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  // Rendering the table using the HOC
  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ?  "Loading": Table}</main>
    </div>
  );
};

export default Transaction;
