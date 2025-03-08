import { Link } from "react-router-dom";
import Productcard from "../components/product_card";
import { useLatestProductsQuery } from "../redux/api/productAPI";

import { SkeletonCard } from "../components/Loader";
import { cartItem } from "../types/types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { FaAnglesDown, FaHeadset } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Slider } from "6pp";
import { TbTruckDelivery } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";

const videoCover = "https://videos.pexels.com/video-files/4008542/4008542-uhd_1440_2732_25fps.mp4"

const clients = [
  {
    src: "https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg",
    alt: "react",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
    alt: "node",
  },
  {
    src: "https://www.vectorlogo.zone/logos/mongodb/mongodb-ar21.svg",
    alt: "mongodb",
  },
  {
    src: "https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg",
    alt: "express",
  },
  {
    src: "https://www.vectorlogo.zone/logos/js_redux/js_redux-ar21.svg",
    alt: "redux",
  },
  {
    src: "https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg",
    alt: "typescript",
  },
  {
    src: "https://www.vectorlogo.zone/logos/sass-lang/sass-lang-ar21.svg",
    alt: "sass",
  },
  {
    src: "https://www.vectorlogo.zone/logos/firebase/firebase-ar21.svg",
    alt: "firebase",
  },
  {
    src: "https://www.vectorlogo.zone/logos/figma/figma-ar21.svg",
    alt: "figma",
  },

  {
    src: "https://www.vectorlogo.zone/logos/github/github-ar21.svg",
    alt: "github",
  },

  {
    src: "https://www.vectorlogo.zone/logos/docker/docker-ar21.svg",
    alt: "Docker",
  },
  {
    src: "https://www.vectorlogo.zone/logos/kubernetes/kubernetes-ar21.svg",
    alt: "Kubernetes",
  },
  {
    src: "https://www.vectorlogo.zone/logos/nestjs/nestjs-ar21.svg",
    alt: "Nest.js",
  },

  {
    src: "https://www.vectorlogo.zone/logos/graphql/graphql-ar21.svg",
    alt: "GraphQL",
  },

  {
    src: "https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg",
    alt: "Jest",
  },

  {
    src: "https://www.vectorlogo.zone/logos/redis/redis-ar21.svg",
    alt: "Redis",
  },

  {
    src: "https://www.vectorlogo.zone/logos/postgresql/postgresql-ar21.svg",
    alt: "PostgreSQL",
  },
  {
    src: "https://www.vectorlogo.zone/logos/jenkins/jenkins-ar21.svg",
    alt: "Jenkins",
  },
];
const banners = [
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253445/rmbjpuzctjdbtt8hewaz.png",
  "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/ticeufjqvf6napjhdiee.png",
];
const categories = [
  "clothes",
  "Electronics",
  "Furniture",
  "Miscellaneous",
  "Shoes",
  "camera",
  "laptop"
]

const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

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

  const dispatch = useDispatch()

  const addToCartHandler = (cartItem:cartItem) => {
    if(cartItem.stock<1) return toast.error("out of Stock");
    dispatch(addToCart(cartItem));
  };

  const coverMessage =
  "love it or hate it but never regret it.".split(
    " "
  );

  return (
    <div className="home">
      <section></section>
      <div>
        <aside>
          <h1>Categories</h1>
          <ul>
            {categories.map((i) => (
              <li key={i}>
                <Link to={`/search?category=${i.toLowerCase()}`}>{i}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <Slider autoplay autoplayDuration={2000} showNav={false} images={banners} />
      </div>



      <h1>
        Latest products
        <Link to="/search" className="findmore"> More </Link>
      </h1>
      <main>
        {isLoading? (
       <div className="skeleton-container">
         {Array.from({ length: 4 }).map((_, index) => (
           <SkeletonCard  key={index} />
         ))}
       </div>
        ) : isError ? (
          <p style={{ color: "red" }}>
            {typedError?.data?.message || "An error occurred. Please try again."}
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
              photos={product.photos}
            />
          ))
        )}
      </main>
      <article className="cover-video-container">
        <div className="cover-video-overlay"></div>
        <video autoPlay loop muted src={videoCover} />
        <div className="cover-video-content">
          <motion.h2
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Fashion
          </motion.h2>
          {coverMessage.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{" "}
            </motion.span>
          ))}
        </div>
        <motion.span
          animate={{
            y: [0, 10, 0],
            transition: {
              duration: 1,
              repeat: Infinity,
            },
          }}
        >
          <FaAnglesDown />
        </motion.span>
      </article>

      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: -100 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                delay: clients.length / 20,
              },
            }}
          >
            Trusted By 100+ Companies in 30+ countries
          </motion.p>
        </div>
      </article>

      <hr
        style={{
          backgroundColor: "rgba(0,0,0,0.1)",
          border: "none",
          height: "1px",
        }}
      />

      <article className="our-services">
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}Y</h3>
                <p>{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>


    </div>
  );
};

export default Home;


