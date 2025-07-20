"use client";

import { useState, FormEvent, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthError, setAuthLoading } from "@/lib/redux/slices/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("frontendtask@secilstore.com"); // Örnek kullanıcı
  const [password, setPassword] = useState("123456"); // Örnek şifre
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  // Eğer kullanıcı zaten giriş yapmışsa, onu koleksiyonlar sayfasına yönlendir
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/collections");
    }
  }, [status, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    dispatch(setAuthLoading());

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: email,
        password: password,
      });

      if (result?.error) {
        setError(result.error);
        dispatch(setAuthError(result.error));
      } else if (result?.ok) {
      }
    } catch (err) {
      let errorMessage = "Beklenmedik bir hata oluştu.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      dispatch(setAuthError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // Eğer oturum kontrolü yapılıyorsa veya zaten giriş yapılmışsa, formu gösterme
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center h-screen">
        Yönlendiriliyorsunuz...
      </div>
    );
  }

  return (
    <main className="flex justify-center items-center  min-h-screen bg-white">
      <div className=" flex justify-center items-center w-[792px] h-[867px] bg-white rounded-2xl  p-16 space-y-8 my-16 border border-[#9F9EA0] ">
        {/* Başlık */}
        <div className="w-[380px] h-[452px]   ">
          <div className="flex items-center justify-center pt-8 pb-24">
            <Image
              src="/images/logo2.png"
              alt="Logo"
              width={146}
              height={55}
              priority
              className="object-contain"
            />
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
      peer
      block w-full px-4 py-3 
      text-gray-900 bg-white 
      border border-[#BDBDBD] rounded-lg 
      focus:ring-[#000000] focus:border-[#000000]
      transition
      placeholder-transparent 
      focus:outline-none
    "
                placeholder="ornek@email.com"
              />
              <label
                htmlFor="email"
                className="
                
      absolute 
      left-4 
      top-3.5 
   bg-gray-50
      text-gray-500 
      transition-all 
      duration-200 
      ease-in-out
      pointer-events-none 
      peer-placeholder-shown:text-base 
      peer-placeholder-shown:bg-gray-50 
      peer-placeholder-shown:top-3.5
      peer-focus:text-[11.7px]
      peer-focus:-top-2.5 
      peer-focus:left-3
      peer-focus:text-[#000000]
      peer-focus:bg-gray-50
      peer-focus:px-1
      
   
      peer-[&:not(:placeholder-shown)]:text-sm
      peer-[&:not(:placeholder-shown)]:-top-2.5
      peer-[&:not(:placeholder-shown)]:left-3

      peer-[&:not(:placeholder-shown)]:px-1
    "
              >
                E-Posta
              </label>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                // 2. Input tipini state'e göre dinamik hale getir
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
          peer
          block w-full 
          
          px-4 py-3 pr-12 /* <-- 3. İkon için sağda boşluk bırak */
          text-gray-900 bg-white 
          border border-[#BDBDBD] rounded-lg 
          focus:ring-[#000000] focus:border-[#000000]
          transition
          placeholder-transparent 
          focus:outline-none
        "
                placeholder="••••••••"
              />
              <label
                htmlFor="password"
                className="
                
      absolute 
      left-4 
      top-3.5 
   bg-gray-50
      text-gray-500 
      transition-all 
      duration-200 
      ease-in-out
      pointer-events-none 
      peer-placeholder-shown:text-base 
      peer-placeholder-shown:bg-gray-50 
      peer-placeholder-shown:top-3.5
      peer-focus:text-[11.7px]
      peer-focus:-top-2.5 
      peer-focus:left-3
      peer-focus:text-[#000000]
      peer-focus:bg-gray-50
      peer-focus:px-1
      
   
      peer-[&:not(:placeholder-shown)]:text-sm
      peer-[&:not(:placeholder-shown)]:-top-2.5
      peer-[&:not(:placeholder-shown)]:left-3

      peer-[&:not(:placeholder-shown)]:px-1
    "
              >
                Şifre
              </label>

              <div
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-6 w-6 text-gray-500" />
                ) : (
                  <EyeIcon className="h-6 w-6 text-gray-500" />
                )}
              </div>
            </div>
            <div className="flex items-center mt-4">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="
  h-4 w-4 rounded cursor-pointer 
  border-gray-400 text-gray-700 
  focus:ring-gray-600
  checked:bg-gray-300 checked:text-black
"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-[12.8px] text-gray-900 cursor-pointer"
              >
                Beni hatırla
              </label>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-5 py-3 text-base  text-white bg-[#000000] font-bold text-[12.8px] rounded-lg hover:bg-[#000000] focus:outline-none focus:ring-4  transition-all w-[380px] h-[56px]"
              >
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
