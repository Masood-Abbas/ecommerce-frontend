import { useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginSchema } from "@/utils/validation/loginValidation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/Redux/authSlice/authSlice";
import { Eye, EyeOff } from "lucide-react";
import loginImg from "@/assets/image3.jpg";
import toast from "react-hot-toast";
import api from "@/axios";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const res = await api.post("/user/login", values);
        dispatch(
          loginSuccess({
            user: {
              id: res?.data?.data?.id,
              name: res?.data?.data?.name,
              email: res?.data?.data?.email,
              role:res?.data?.data?.role
            },
            accessToken: res?.data?.data?.accessToken,
            refreshToken: res?.data?.data?.refreshToken,
          })
        );
        toast.success(
          res?.data?.message || "Signup successful! Please log in."
        );
        resetForm();
        setLoading(false);
        navigate("/");
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(
          error.res?.data?.message || "Signup failed. Please try again."
        );
      }
    },
  });

  return (
    <div className="w-full lg:min-h-screen py-10 px-5 flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:flex-1">
        <img
          src={loginImg}
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md flex flex-col">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Log in to your account</p>

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
            <div className="flex flex-col sm:flex-row justify-between items-center my-3 gap-2">
              <p className="text-gray-600 text-center sm:text-left">
                Don't have an account?{" "}
                <NavLink
                  to="/signup"
                  className="text-black font-semibold underline hover:text-red-500 transition-colors"
                >
                  Sign Up
                </NavLink>
              </p>

              <NavLink
                to="/reset-password/forget-Password"
                className="text-sm text-red-500 hover:underline hover:text-red-600 transition-colors"
              >
                Forgot Password?
              </NavLink>
            </div>

            <Button
              type="submit"
              className="w-full  text-white py-5 rounded-md font-semibold bg-(--primary-color) hover:bg-(--hover-primary-color) transition cursor-pointer text-md"
              disabled={loading}
            >
              {loading ? "Logging in...." : "Log In"}
            </Button>

            {/* Google login */}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
