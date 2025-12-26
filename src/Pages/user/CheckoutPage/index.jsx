import { Formik, Form } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useApiResponse } from "@/hooks/ResponseApiHook";
import { clearCart } from "@/Redux/cartSlice/cartSlice";
import { CheckoutSchema } from "@/utils/validation/checkoutSchema";
import SuccessPopup from "@/components/user/popup/ContactPopup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalPrice);

  const { data: orderData, fetchApi: apiResponse } = useApiResponse({
    method: "post",
    reduxAction: clearCart,
  });

  const [successOpen, setSuccessOpen] = useState(false);
  // const [orderData, setOrderData] = useState(null);

  const handleCheckout = async (values, { setSubmitting, resetForm }) => {
    if (!cartItems.length) {
      alert("Cart is empty!");
      setSubmitting(false);
      return;
    }

    const payload = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      country: values.country,
      postalCode: values.postalCode,
      totalPrice: cartTotal,
      orderItems: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    try {
      await apiResponse({}, "/order/create", payload);
      setSuccessOpen(true);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SuccessPopup
        open={successOpen}
        setOpen={setSuccessOpen}
        title="Order Placed!"
        message={`Your order has been placed successfully.`}
      />

      <Formik
        initialValues={{
          fullName: "",
          company: "",
          address: "",
          apartment: "",
          city: "",
          country: "",
          phone: "",
          email: "",
          postalCode: "",
        }}
        validationSchema={CheckoutSchema}
        onSubmit={handleCheckout}
      >
        {({ values, errors, touched, handleChange, isSubmitting }) => (
          <Form>
            <div className="main-container flex flex-col md:flex-row gap-10 py-5">
              {/* LEFT — BILLING */}
              <div className="md:w-3/5  p-2 py-4 rounded-xl">
                <h2 className="text-xl font-semibold mb-6">Billing Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "fullName", label: "Full Name *" },
                    { name: "company", label: "Company" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label>{field.label}</label>
                      <Input
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChange}
                      />
                      {touched[field.name] && errors[field.name] && (
                        <p className="text-red-500 text-sm">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label>Phone</label>
                    <Input
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label>Address *</label>
                    <Input
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                    />
                    {touched.address && errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>

                  {["city", "country", "email", "postalCode"].map((name) => (
                    <div key={name}>
                      <label>{name} *</label>
                      <Input
                        name={name}
                        value={values[name]}
                        onChange={handleChange}
                      />
                      {touched[name] && errors[name] && (
                        <p className="text-red-500 text-sm">{errors[name]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — ORDER SUMMARY */}
              <div className="md:w-2/5">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Your Order
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {cartItems.length ? (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center border-b pb-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                item.product.images?.[0]?.url ||
                                "/placeholder.png"
                              }
                              alt={item.product.name}
                              className="w-14 h-14 object-cover rounded-md border"
                            />

                            <div>
                              <p className="line-clamp-1">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <span className="font-medium">
                            {item.product.price * item.quantity}$
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        No items in cart
                      </p>
                    )}

                    <div className="flex justify-between text-lg font-medium pt-2">
                      <span>Total</span>
                      <span> {cartTotal}$</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-(--primary-color) hover:bg-(--hover-primary-color)"
                      disabled={isSubmitting || !cartItems.length}
                    >
                      {isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
