"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const { login, isLoggingIn } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // The hook handles toast notifications for errors
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-950 text-foreground border border-border/60 rounded-[24px] shadow-xl shadow-black/5 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-500 ease-out">
      <div className="flex flex-col items-center space-y-3 text-center mb-10">
        <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          <span className="font-bold text-xl">N</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-sm text-muted-foreground/80">
          Sign in to manage your agency operations
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none text-foreground/90"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            {...register("email")}
            className={`transition-all bg-background hover:border-accent/40 focus-visible:ring-accent/20 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none text-foreground/90"
            >
              Password
            </label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={`transition-all bg-background hover:border-accent/40 focus-visible:ring-accent/20 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          {errors.password && (
            <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 mt-4 text-base font-medium transition-all active:scale-[0.98]" 
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}
