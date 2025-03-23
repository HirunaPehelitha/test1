import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";

    try {
        // Create a new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the user's cart after placing the order
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare line items for Stripe checkout
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "lkr", // Currency in Sri Lankan Rupees
                product_data: {
                    name: item.name, // Product name
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity, // Quantity of the item
        }));

        // Add national tax as a line item
        line_items.push({
            price_data: {
                currency: "lkr",
                product_data: {
                    name: "National Tax",
                },
                unit_amount: Math.round(50 * 100), // 50 LKR in cents
            },
            quantity: 1,
        });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Send the session URL back to the frontend
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req,res)=>{
    const {orderId,success} = req.body
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message:"Paid"})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
            console.log(error)
            res.json({success:false,message:"Error"})
    }
}

// user orders for frontend

const userOrders = async(req,res)=>{
    try {
        const orders= await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// listing orders for admion panel

const listOrders =async (req,res) =>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//api for updating status

const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
 
export { placeOrder ,verifyOrder ,userOrders, listOrders, updateStatus}