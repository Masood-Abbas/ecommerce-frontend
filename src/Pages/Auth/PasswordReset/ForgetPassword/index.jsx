
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../axios";
import { ForgetPasswordSchema } from "../../../../utils/validation/forgetPasswordSchema";
import { useFormik } from "formik";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgetPasswordSchema,
    onSubmit: async (value, { resetForm }) => {
      console.log("Form data:", value);
      try {
        setLoading(true);
        const res = await api.post("/user/forgetPassword", value);
        toast.success(res?.data?.message || "OTP sent to your email.");
        resetForm();
        setLoading(false);
        navigate("/reset-password/verify-otp", { state: { email: value.email } });
      } catch (error) {
        setLoading(false);
        toast.error(
          error.res?.data?.message || "Failed to send OTP. Please try again."
        );
      }finally{
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forget Password</h2>
        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col">
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full border-b border-gray-300 pb-2 text-lg outline-none focus:border-red-500 transition"
              />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 text-white py-3 rounded-md font-semibold"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
