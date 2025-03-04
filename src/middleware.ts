import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",  // Redirect users to sign-in if they aren't authenticated
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: ["/decks"], 
};