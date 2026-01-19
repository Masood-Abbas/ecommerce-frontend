import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSuccess } from "@/Redux/authSlice/authSlice";
import { Button } from "@/components/ui/button";
import { useApiResponse } from "@/hooks/ResponseApiHook";

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fetchApi } = useApiResponse({
    method: "get",
  });

  const responseGoogle = async (authResult) => {
    try {
      if (!authResult?.code) return;

      const res = await fetchApi(
        { code: authResult.code },
        "/user/googlelogin"
      );

      const data = res.data.data;

      dispatch(
        loginSuccess({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );

      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Google login error", error);
      toast.error("Google login failed");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 border border-gray-500 py-5 rounded-md  hover:-translate-y-1 transition text-black bg-white hover:bg-white"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
        className="w-5"
      />
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
