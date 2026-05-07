import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSubmitContact, useSubscribeNewsletter } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message is required"),
});

const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export default function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();
  const subscribeNewsletter = useSubscribeNewsletter();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" }
  });

  const newsForm = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    submitContact.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Message sent", description: "We'll get back to you soon." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
      }
    });
  };

  const onNewsSubmit = (values: z.infer<typeof newsletterSchema>) => {
    subscribeNewsletter.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Subscribed", description: "Thanks for subscribing!" });
        newsForm.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to subscribe.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="py-24 container mx-auto px-4 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Interested in our apps, the MindMap platform, or discussing a custom solution? Reach out to our team.
          </p>

          <div className="glass-card p-8 rounded-2xl mb-8">
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with our latest releases and insights.</p>
            <Form {...newsForm}>
              <form onSubmit={newsForm.handleSubmit(onNewsSubmit)} className="flex gap-2">
                <FormField
                  control={newsForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1 mb-0">
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={subscribeNewsletter.isPending}>Subscribe</Button>
              </form>
            </Form>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 rounded-3xl border-t-2 border-t-primary/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="Your name" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="your@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl><Input placeholder="How can we help?" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Textarea placeholder="Write your message here..." className="min-h-[120px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={submitContact.isPending}>
                {submitContact.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}