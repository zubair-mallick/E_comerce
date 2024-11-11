import { Link } from "react-router-dom";
import Productcard from "../components/product_card";
import { useLatestProductsQuery } from "../redux/api/productAPI";

import { SkeletonCard } from "../components/Loader";

  
// Import Swiper styles
const Home = () => {

  type CustomErrorType = {
    success: boolean;
    data:{
      message: string;
      statusCode: number;
    }
  };

  const { data, isLoading, isError, error } = useLatestProductsQuery("");

// Safely typecast the error to `CustomErrorType`
  const typedError = error as CustomErrorType | undefined;

  console.log(data)

  const addToCartHandler = () => {};

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest products
        <Link to="/search" className="findmore"> More </Link>
      </h1>
      <main>
        {isLoading? (
       <div className="skeleton-container">
         {Array.from({ length: 4 }).map((_, index) => (
           <SkeletonCard length={length} key={index} />
         ))}
       </div>
        ) : isError ? (
          <p style={{ color: "red" }}>
            {typedError?.data.message || "An error occurred. Please try again."}
          </p>
        ) : (
          data?.products.map(product => (
            <Productcard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              handler={addToCartHandler}
              picture={product.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;


