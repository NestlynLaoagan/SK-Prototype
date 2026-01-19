"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender.",
  }),
  civilStatus: z.string({ required_error: "Please select a civil status." }),
  workStatus: z.string({ required_error: "Please select a work status." }),
  youthAgeGroup: z.string({ required_error: "Please select an age group." }),
  youthClassification: z.string({ required_error: "Please select a classification." }),
  specialNeeds: z.string().optional(),
}).refine(data => {
    if (data.youthClassification === 'youth with special needs' && !data.specialNeeds) {
        return false;
    }
    return true;
}, {
    message: "Please specify the special needs.",
    path: ["specialNeeds"],
});

export function ProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showSpecialNeeds, setShowSpecialNeeds] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        specialNeeds: "",
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Profile Updated!",
      description: "Your information has been saved successfully.",
    });
    router.push("/home");
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline">Complete Your Profile</CardTitle>
        <CardDescription>
          Please provide the following information to complete your registration. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">Female</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="civilStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Civil Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your civil status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                                <SelectItem value="separated">Separated</SelectItem>
                                <SelectItem value="live-in">Live-in</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="workStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Work Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your work status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="employed">Employed</SelectItem>
                                <SelectItem value="unemployed">Unemployed</SelectItem>
                                <SelectItem value="self-employed">Self-Employed</SelectItem>
                                <SelectItem value="looking-for-job">Looking for a job</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="youthAgeGroup"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Youth Age Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your age group" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="16-17">16-17 yrs old</SelectItem>
                                <SelectItem value="18-24">18-24 yrs old</SelectItem>
                                <SelectItem value="25-30">25-30 yrs old</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="youthClassification"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Youth Classification</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        setShowSpecialNeeds(value === 'youth with special needs');
                    }} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your classification" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="in-school">In school youth</SelectItem>
                            <SelectItem value="out-of-school">Out of school youth</SelectItem>
                            <SelectItem value="working">Working youth</SelectItem>
                            <SelectItem value="youth with special needs">Youth with special needs</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {showSpecialNeeds && (
                 <FormField
                    control={form.control}
                    name="specialNeeds"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Please Specify Special Needs</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., PWD, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <Button type="submit" size="lg" className="text-lg">Sign In</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
