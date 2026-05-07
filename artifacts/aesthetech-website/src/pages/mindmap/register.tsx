import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { clearGuestSession } from "@/hooks/use-guest";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function MindMapRegister() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const registerMutation = useRegister();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        clearGuestSession();
        login(data.token, data.user);
        toast({ title: "Account created!", description: `Welcome to MindMap, ${data.user.name}!` });
        setLocation("/mindmap/dashboard");
      },
      onError: (err: any) => {
        const message = err?.data?.error || err?.message || "Could not create account. Please try again.";
        toast({ title: "Registration failed", description: message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 -z-10 bg-[url('/src/assets/images/hero-mindmap.png')] bg-cover bg-center opacity-20 mix-blend-screen blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl border-t-2 border-t-accent"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join MindMap Career Compass — free forever</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" autoComplete="name" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" autoComplete="email" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 rounded-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : "Create Free Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          No credit card required · Free forever plan available
        </p>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/mindmap/login" className="text-accent font-medium hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
