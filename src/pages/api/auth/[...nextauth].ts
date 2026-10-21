import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Pages Router NextAuth handler
export default NextAuth(authOptions);
