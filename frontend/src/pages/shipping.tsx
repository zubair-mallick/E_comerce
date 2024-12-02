import { ChangeEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import countryList from 'react-select-country-list';
import { cartReducerInitialState } from "../types/reducer-types";

const Shipping = () => {
    const { cartItems, total } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );

    const navigate = useNavigate()
    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    type Country = {
        label: string; // The display name of the country
        value: string; // The value or code associated with the country
      };
    const countries:Country[] = countryList().getData(); // Get the list of countries

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setShippingInfo((prev)=>({...prev,[e.target.name]: e.target.value}))
    };

    useEffect(()=>{
        if(cartItems.length<=0 || total<=0){
            navigate('/cart')
        }
    },[cartItems])


    return (
        <div className="shipping">
            <button className="back-btn" onClick={()=>{
                navigate(-1) 
            }}><BiArrowBack /></button>
            <form action="">
                <h1>Shipping Address</h1>
                <input
                    required
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={changeHandler}
                />

                <input
                    required
                    type="text"
                    placeholder="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={changeHandler}
                />

                <input
                    required
                    type="text"
                    placeholder="State"
                    name="state"
                    value={shippingInfo.state}
                    onChange={changeHandler}
                />

                <select
                    name="country"
                    required
                    value={shippingInfo.country}
                    onChange={changeHandler}
                >
                    <option value="">Choose Country</option>
                    {countries.map((country) => (
                        <option key={country.value} value={country.label}>
                            {country.label}
                        </option>
                    ))}
                </select>

                <input
                    required
                    type="number"
                    placeholder="Pincode"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={changeHandler}
                />

                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default Shipping;
