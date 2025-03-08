import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton"; // Import a skeleton loading library
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton CSS
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product_card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { customError } from "../types/api-types";
import { cartItem } from "../types/types";


const Search = () => {

  const searchQuery = useSearchParams()[0];
  console.log(searchQuery)
  
  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
    isError,
    error,
    isSuccess,
  } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(capitalizeFirstLetter((searchQuery.get("category")) ||""));
  const [page, setPage] = useState(1);
  const [isNextPage, setIsNextPage] = useState<boolean>(false);
  const [isPrevPage, setIsPrevPage] = useState<boolean>(false);

  // Debouncing the search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState(search);
const dispatch = useDispatch()
  const addToCartHandler = (cartItem:cartItem) => {
    if(cartItem.stock<1) return toast.error("out of Stock");
    dispatch(addToCart(cartItem));
  };

  function capitalizeFirstLetter(val:string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: SearchError,
  } = useSearchProductsQuery({
    search: debouncedSearch,
    sort,
    category,
    minPrice,
    price: maxPrice,
    page,
  });

  // Debounce search query effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Debounce delay: 500ms

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (searchData) {
      setIsNextPage(!searchData.isLastPage);
      setIsPrevPage(!searchData.isFirstPage);
    }
  }, [searchData]);

  useEffect(() => {
    if (isSearchError) toast.error((SearchError as customError).data.message);
  }, [SearchError]);

  useEffect(() => {
    if (isSuccess)
      toast.success(categoriesResponse.message, { position: "bottom-center" });
    if (isError) toast.error((error as customError).data.message);
  }, [error, isSuccess]);

  // Reset the page to 1 whenever any filter changes (except when navigating pages)
  useEffect(() => {
    setPage(1);
  }, [search, sort, minPrice, maxPrice, category]);

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        {isCategoriesLoading ? (
          <Skeleton count={10} height={(80/5)+"%" } width={200} />
        ) : (
          <>
            <div>
              <h4>Sort</h4>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                }}
              >
                <option value="">None</option>
                <option value="asc">Price (low to high)</option>
                <option value="des">Price (high to low)</option>
              </select>
            </div>

            <div>
              <h4>Min Price: {minPrice}</h4>
              <input
                type="range"
                min={0} // Start of the range is 0
                max={100000}
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(Number(e.target.value));
                }}
              />
            </div>

            <div>
              <h4>Max Price: {maxPrice}</h4>
              <input
                type="range"
                min={0} // Start of the range is 0
                max={100000}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                }}
              />
            </div>

            <div>
              <h4>Category</h4>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="">ALL</option>
                {!isCategoriesLoading &&
                  categoriesResponse?.categories.map((i) => (
                    <option key={i} value={i}>
                      {i.toUpperCase()}
                    </option>
                  ))}
              </select>
            </div>
          </>
        )}
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search By Name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="search-product-list">
          {isSearchLoading ? (
            // Skeleton for loading product cards
            Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} height={200} width={300} className="product-skeleton" />
            ))
          ) : (
            searchData?.products.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photos={product.photos}
                
              />
            ))
          )}
        </div>

        <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>{page}</span>
          <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;
