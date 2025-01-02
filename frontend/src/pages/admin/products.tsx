import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import toast from "react-hot-toast";
import { customError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import ProductTableSkeleton from "../../components/productTableSkeleton";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];




const Products = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const {user}= useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)

  const {data,isLoading,isError,error,isSuccess}=useAllProductsQuery(user?._id!)


  useEffect(()=>{
    // console.log({message:data?.message})
    if(isSuccess) toast.success(data.message,{position:'bottom-center'})
    if(isError) toast.error((error as customError).data.message)
  },[error,isSuccess])

  

  useEffect(() => {
    if (data) {
      setRows(
        [...data.products] // Create a shallow copy of the products array
          .reverse() // Now you can safely reverse the copy
          .map((i) => ({
            photo: <img src={i.photos[0]} alt="Product" />,
            name: i.name,
            price: i.price,
            stock: i.stock,
            action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
          }))
      );
    }
  }, [data]);
  

 

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading?<ProductTableSkeleton/>:Table }</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
