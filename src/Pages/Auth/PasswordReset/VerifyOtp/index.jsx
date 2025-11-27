import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { VarifyOtpSchema } from "../../../../utils/validation/varifyOtpSchema";
import api from "../../../../axios";

const VerifyOTP = () => {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    console.log(timer);
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema:VarifyOtpSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        await api.post("/user/verifyOTP", { email, otp: values.otp });
        toast.success("OTP verified successfully!");
        resetForm();
        navigate("/reset-password/new-password", { state: { email, otp: values.otp } });
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResend = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/user/resendOTP", { email });
      toast.success(data.message);
      setTimer(120);
      formik.resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Verify OTP</h2>
        <p className="text-gray-600 mb-4 text-center">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={formik.values.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border-b border-gray-300 pb-2 text-lg outline-none focus:border-red-500 transition"
          />
          {formik.touched.otp && formik.errors.otp && (
            <p className="text-red-500 text-sm">{formik.errors.otp}</p>
          )}

          <p className={`text-center ${timer === 0 ? "text-red-500" : "text-gray-500"}`}>
            Time remaining: {formatTime(timer)}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-md disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={loading || timer > 0}
            className="w-full border border-gray-400 text-gray-700 py-3 rounded-md disabled:opacity-50"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
