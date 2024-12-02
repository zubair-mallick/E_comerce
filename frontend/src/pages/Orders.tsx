import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { RootState } from "../redux/store";
import { customError } from "../types/api-types";

type DataType={
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action:ReactElement;
}

const columns: Column<DataType>[]=[{
    Header: "ID",
    accessor: "_id",
  },{
    Header: "Quantity",
    accessor: "quantity",
  },{
  Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
      accessor: "amount",
 },
 {
    Header: "Status",
    accessor: "status",
  
 },
 {
    Header: "Action",
    accessor: "action",
  },



]

const Orders = () => {
    // Accessing the current user from the Redux store
    const { user } = useSelector((state:RootState) => state.userReducer);

    // Query for fetching all orders associated with the user
    const { isLoading, data, isError, error } = useMyOrdersQuery(user?._id!);


        const [rows,setRows] = useState<DataType[]>([
         
        ]);

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
           console.log(data)
            
            setRows(
              data.orders.map((i) => ({
                _id: i._id,
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
    const table = TableHOC<DataType>(columns,rows,"dashboard-product-box","Orders",!(rows.length<6))()
  return (
    <div className="container">
      <h1>My Orders</h1> 
      <main>{isLoading ?  "Loading": table}</main>
    </div>
  )
}

export default Orders
