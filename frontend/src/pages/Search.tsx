import { useState } from "react";
import ProductCard from "../components/product_card"

const Search = () => {

      const [search, setSearch] = useState("");
      const [sort, setSort] = useState("");
      const [maxPrice, setMaxPrice] = useState(100000);
          const [category, setCategory] = useState("");
      const [page, setPage] = useState(1);
      const addToCartHandler = ()=>{}
      const isNextPage = page!=4;
      const isPrevPage = page!=1;

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price(low to high)</option>
            <option value="des">Price(high to low)</option>
          </select>
        </div>


        <div>
          <h4>Max Price:{maxPrice || ""}</h4>
          <input type="range" 
          min={100}
          max={100000}
          value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} />
        </div>


        <div>
          <h4>Categary</h4>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="">sample1</option>
            <option value="">sample2</option>
          </select>
        </div>
      </aside>
      <main>
        <h1>products</h1>
        <input type="text" placeholder="Search By Name" value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="search-product-list">

        <ProductCard productId="assdas" name="Macbook" price={23213} stock={12} handler={addToCartHandler} picture="https://images-eu.ssl-images-amazon.com/images/G/31/Img23/Budget3/REC-PC_CC_379x304._SY304_CB564096366_.jpg" />

        </div>

        <article>
          <button 
          disabled ={!isPrevPage}
          onClick={()=>{setPage(prev=>prev-1)}}>prev</button>
          <span>{page} of {4}</span>
          <button 
          disabled={!isNextPage}
          onClick={()=>{setPage(prev=>prev+1)}}>next</button>

        </article>
      </main>
    </div>
  )
}

export default Search
