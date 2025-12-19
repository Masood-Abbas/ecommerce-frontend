import { useState } from "react";
import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { signupSchema } from "@/utils/validation/signupValidation";
import { Eye, EyeOff } from "lucide-react";
import signupImg from "@/assets/image3.jpg";
import api from "@/axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const res = await api.post("/user/signup", values);
        toast.success(
          res?.data?.message || "Signup successful! Please log in."
        );
        resetForm();
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        toast.error(
          error.res?.data?.message || "Signup failed. Please try again."
        );
      }
    },
  });

  return (
    <div className="w-full lg:min-h-screen py-10 px-5 flex flex-col lg:flex-row">
      {/* Image section */}
      <div className="hidden lg:flex lg:flex-1">
        <img
          src={signupImg}
          alt="Signup Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form section */}
      <div className="flex flex-1 items-center justify-center ">
        <div className="w-full max-w-md flex flex-col">
          <h2 className="text-3xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-600 mb-6">Enter your details below</p>

          <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col">
              <input
                type="text"
                name="name"
                placeholder="Enter Your Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="w-full border-b border-gray-300 pb-2 mb-3  text-lg outline-none focus:border-red-500 transition"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email "
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full border-b border-gray-300 pb-2 mb-3 text-lg outline-none focus:border-red-500 transition"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="relative flex flex-col">
              <input
                type={showPassword ? "text" : "password"} // toggle type
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full border-b border-gray-300 pb-2 pr-10 text-lg outline-none focus:border-red-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full  bg-(--primary-color) hover:bg-(--hover-primary-color) text-white py-5 rounded-md font-semibold"
              disabled={loading}
            >
              {loading ? "Sign Up...." : "Sign Up"}
            </Button>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 border border-gray-500 py-5 rounded-md   cursor-pointer text-black text-md  bg-white hover:bg-white hover:text-black transition-transform duration-200 hover:-translate-y-1"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5"
              />
              Continue with Google
            </Button>
          </form>

          <p className="text-center mt-5 text-gray-600">
            Already have account?
            <NavLink
              to="/login"
              className="text-black font-semibold underline hover:text-red-600 transition pl-1"
            >
              Log in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
