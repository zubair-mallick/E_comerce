import { Link } from "react-router-dom"
import Productcard from "../components/product_card"
const Home = () => {

  const addToCartHandler =()=>{}
  return (
    <div className="home">
      <section></section>
          <h1>Latest products 
            <Link to="/seacrh" className="findmore" > More </Link>
          </h1>
      <main>
        <Productcard productId="assdas" name="Macbook" price={23213} stock={12} handler={addToCartHandler} picture="https://images-eu.ssl-images-amazon.com/images/G/31/Img23/Budget3/REC-PC_CC_379x304._SY304_CB564096366_.jpg" />

      </main>
    </div>
  )
}

export default Home
