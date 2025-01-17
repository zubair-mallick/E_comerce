import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { cartItem } from "../types/types";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { isLoading, isError, data } = useProductDetailsQuery(params.id!);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const decrement = () => setQuantity((prev) => prev - 1);
  const increment = () => {
    if (data?.product?.stock === quantity)
      return toast.error(`${data?.product?.stock} available only`);
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: cartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) return <Navigate to="/404" />;

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main>
            <section>
              <Slider
                showThumbnails
                showNav={false}
                onClick={() => setCarouselOpen(true)}
                images={data?.product?.photos|| []}
              />
              {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={data?.product?.photos|| []}
                />
              )}
            </section>
            <section>
              <code>{data?.product?.category}</code>
              <h1>{data?.product?.name}</h1>
              <h3>₹{data?.product?.price}</h3>
              <article>
                <div>
                  <button  onClick={decrement}>-</button>
                  <span>{quantity}</span>
                  <button onClick={increment}>+</button>
                </div>
                <button
                  onClick={() =>
                    addToCartHandler({
                      productId: data?.product?._id!,
                      name: data?.product?.name!,
                      price: data?.product?.price!,
                      stock: data?.product?.stock!,
                      quantity,
                      photos: data?.product?.photos || [],
                    })
                  }
                >
                  Add To Cart
                </button>
              </article>

              {/* <p>{data?.product?.description}</p> */}
            </section>
          </main>
        </>
      )}
    </div>
  );
};

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <Skeleton
          width="100%"
          containerHeight="100%"
          height="100%"
          length={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <Skeleton width="40%" length={3} />
        <Skeleton width="50%" length={4} />
        <Skeleton width="100%" length={2} />
        <Skeleton width="100%" length={10} />
      </section>
    </div>
  );
};

const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRightLong />
  </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);

export default ProductDetails;
