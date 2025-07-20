import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Email ve şifre gereklidir.");
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/Login`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: process.env.API_SECRET_TOKEN,
              },
            }
          );

          const apiResponse = response.data;

          if (apiResponse && apiResponse.status === 0 && apiResponse.data) {
            return {
              id: apiResponse.data.accessToken,
              email: credentials.username,
              accessToken: apiResponse.data.accessToken,
              refreshToken: apiResponse.data.refreshToken,
            };
          } else {
            throw new Error(apiResponse.message || "Giriş başarısız oldu.");
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            throw new Error(
              error.response?.data?.message || "Bir ağ hatası oluştu."
            );
          } else if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("Bilinmeyen bir hata oluştu.");
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
