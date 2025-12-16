import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";


import { ResetPasswordSchema } from "@/utils/validation/resetPasswordSchema";
import api from "@/axios";

const ResetPassword = () => {
  const { state } = useLocation();
  const { email, otp } = state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const { data } = await api.post("/user/resetPassword", {
          email,
          otp,
          password: values.password,
        });
        toast.success(data.message);
        resetForm();
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border-b border-gray-300 pb-2 text-lg outline-none focus:border-red-500 transition"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-md disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
