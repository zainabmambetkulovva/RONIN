import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Credentials Provider (email/password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.users.findFirst({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (user.status === "blocked") {
          throw new Error("Account is blocked");
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Если вход через Google
      if (account?.provider === "google") {
        try {
          // Проверяем существует ли пользователь
          const existingUser = await prisma.users.findFirst({
            where: { email: user.email! },
          });

          // Если пользователь новый - создаем
          if (!existingUser) {
            await prisma.users.create({
              data: {
                id: crypto.randomUUID(),
                email: user.email!,
                name: user.name || "Пользователь",
                avatar: "default",
                role: "client",
                status: "active",
                email_verified: new Date(),
                image: user.image,
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
          } else {
            // Обновляем последнюю активность
            await prisma.users.update({
              where: { id: existingUser.id },
              data: {
                updated_at: new Date(),
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // При первом входе добавляем данные пользователя в токен
      if (user) {
        const dbUser = await prisma.users.findFirst({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.avatar = dbUser.avatar;
          token.status = dbUser.status;
        }
      }

      // Если обновление сессии
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      // Добавляем данные из токена в сессию
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
        session.user.status = token.status as string;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // После успешного входа редирект на профиль
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/profile`;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
