import { getRedirectResult, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loginError, setLoginError] = React.useState("");
  const [loginBusy, setLoginBusy] = React.useState(false);

  // Browsers that block popups make Firebase fall back to a full-page redirect.
  // Finish that flow here, otherwise the token is never exchanged for a session.
  React.useEffect(() => {
    let cancelled = false;
    getRedirectResult(auth)
      .then(async (result) => {
        if (cancelled || !result?.user) return;
        const token = await result.user.getIdToken();
        await handleLogin(token);
      })
      .catch((error) => {
        setLoginError(error?.response?.data?.message || error?.message || "Google sign-in failed.");
        console.error("Google redirect login error:", error);
      });
    return () => { cancelled = true; };
  });

  const handleLogin = async (token) => {
    const { data } = await api.post("/api/auth/login", { token });
    dispatch(setUserdata(data));
  };

  const googleLogin = async () => {
    setLoginError("");
    setLoginBusy(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      const code = error?.code || "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setLoginError("Sign-in was cancelled.");
      } else if (code === "auth/popup-blocked") {
        setLoginError("Popup was blocked. Allow popups for this site and try again.");
      } else if (code === "auth/missing-initial-state" || /missing initial state/i.test(error?.message || "")) {
        setLoginError("Google sign-in could not keep session state. Use the popup login (not redirect) and avoid storage-partitioned browsers.");
      } else {
        setLoginError(error?.response?.data?.message || error?.message || "Google sign-in failed.");
      }
      console.error("Google login error:", error);
    } finally {
      setLoginBusy(false);
    }
  };

  return (
    <div className="h-screen  flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar />
      <ChatArea />
      <Artifact />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">Welcome to CortexAI</h2>
              <p className="text-[13px] text-slate-500">Please login to continue using the app.</p>
            </div>

            <button
              className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200  transition-all duration-150 cursor-pointer disabled:opacity-60"
              onClick={googleLogin}
              disabled={loginBusy}
            >
              <FcGoogle size={15} />
              {loginBusy ? "Signing in..." : "Continue With Google"}
            </button>
            {loginError && <p className="text-[12px] text-red-400 leading-relaxed">{loginError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
