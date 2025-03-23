import React from "react";
import "./Cart.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
    const navigate = useNavigate();

    // Check if the cart is empty
    const isCartEmpty = getTotalCartAmount() === 0;

    // Handle the "Proceed to Checkout" button click
    const handleCheckout = () => {
        if (isCartEmpty) {
            alert("Your cart is empty. Please add items to proceed to checkout.");
        } else {
            navigate('/order');
        }
    };

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />

                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className="cart-items-title cart-items-items">
                                    <img src={url + "/images/" + item.image} alt="" />
                                    <p>{item.name}</p>
                                    <p>{item.price}</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>{item.price * cartItems[item._id]}</p>
                                    <p onClick={() => removeFromCart(item._id)} className="cross">x</p>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                    return null; // Return null if the item is not in the cart
                })}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Sub Total</p>
                            <p>Rs.{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>National Tax</p>
                            <p>Rs.{getTotalCartAmount() === 0 ? 0 : 50}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>Rs.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}</b>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isCartEmpty} // Disable the button if the cart is empty
                        style={{ opacity: isCartEmpty ? 0.5 : 1, cursor: isCartEmpty ? "not-allowed" : "pointer" }}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>If you have a promocode, Enter it here</p>
                        <div className="cart-promocode-input">
                            <input type="text" placeholder="Promo code" />
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;