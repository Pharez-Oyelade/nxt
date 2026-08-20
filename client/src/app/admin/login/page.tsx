import { AdminLoginForm } from "@/components/admin/login-form";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      {/* Simple Navbar */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-10 flex items-center justify-start">
        <Link href="/" className="text-3xl font-fraunces font-bold text-foreground hover:opacity-80 transition-opacity">
          NXT.
        </Link>
      </header>

      <AdminLoginForm />
    </div>
  );
}
