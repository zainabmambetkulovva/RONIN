import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Определяем base URL для разных окружений
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

const baseUrl = getBaseUrl();
console.log('NextAuth base URL:', baseUrl);

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
          response_type: "code",
          redirect_uri: `${baseUrl}/api/auth/callback/google`
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
          console.log('Google signIn attempt:', user.email);
          
          // Проверяем существует ли пользователь
          const existingUser = await prisma.users.findFirst({
            where: { email: user.email! },
          });

          console.log('Existing user found:', !!existingUser);

          // Если пользователь новый - создаем без имени (заполнит в setup-profile)
          if (!existingUser) {
            console.log('Creating new user for:', user.email);
            await prisma.users.create({
              data: {
                id: crypto.randomUUID(),
                email: user.email!,
                name: null, // Будет заполнено в setup-profile
                avatar: null, // Будет выбрано в setup-profile
                role: "client",
                status: "active",
                email_verified: new Date(),
                image: user.image,
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
            console.log('User created successfully');
          } else {
            console.log('Updating existing user:', existingUser.id);
            // Обновляем последнюю активность
            await prisma.users.update({
              where: { id: existingUser.id },
              data: {
                updated_at: new Date(),
              },
            });
          }

          console.log('Google signIn successful');
          return true;
        } catch (error: any) {
          console.error("Error in signIn callback:", error);
          console.error("Error details:", error.message, error.stack);
          // НЕ возвращаем false - пропускаем дальше даже при ошибке
          return true;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session, account }) {
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
          token.name = dbUser.name;
          token.needsSetup = !dbUser.name || !dbUser.avatar; // флаг нужен ли setup
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
        session.user.needsSetup = token.needsSetup as boolean;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect:', { url, baseUrl });
      
      // Если это callback после Google OAuth
      if (url.includes('/api/auth/callback/google')) {
        console.log('Google callback detected, redirecting to home');
        return baseUrl;
      }
      
      // Если это относительный путь
      if (url.startsWith('/')) {
        console.log('Relative path redirect:', url);
        return `${baseUrl}${url}`;
      }
      
      // Если это наш домен
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        
        if (urlObj.origin === baseUrlObj.origin) {
          console.log('Same origin redirect:', url);
          return url;
        }
      } catch (e) {
        console.error('URL parsing error:', e);
      }
      
      console.log('Default redirect to baseUrl:', baseUrl);
      return baseUrl;
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
  debug: true, // Always enable debug to see logs
};
