'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { UserPlus, AlertCircle } from "lucide-react";
import { inviteOperator } from "../actions/operator-actions";

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role_id: z.string().min(1, 'Please select a role'),
});

type InviteInput = z.infer<typeof inviteSchema>;

interface InviteOperatorModalProps {
  roles: { id: string; name: string }[];
}

export function InviteOperatorModal({ roles }: InviteOperatorModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role_id: '',
    },
  });

  const onSubmit = (data: InviteInput) => {
    startTransition(async () => {
      const result = await inviteOperator(data);
      if (result.error) {
        form.setError('root', { message: result.error });
      } else {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-2xl shadow-primary/20 hover:shadow-primary/30 shadow-lg transition-all duration-300">
          <UserPlus className="h-4 w-4" />
          Invite Operator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl border-2 border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Invite Operator</DialogTitle>
          <DialogDescription>
            Send an invitation to a new administrative user. They will receive a magic link to sign in.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="operator@example.com" 
                      className="rounded-2xl h-12 border-2 focus:border-primary/50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl h-12 border-2 focus:border-primary/50">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl border-2">
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id} className="capitalize rounded-xl">
                          {role.name.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <Alert variant="destructive" className="rounded-2xl border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full rounded-2xl h-12 font-semibold text-base"
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
