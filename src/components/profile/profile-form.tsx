"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useFirebase, useUser, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  birthdate: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "You need to select a gender.",
  }),
  civilStatus: z.string({ required_error: "Please select a civil status." }),
  workStatus: z.string({ required_error: "Please select a work status." }),
  youthAgeGroup: z.string({ required_error: "Please select an age group." }),
  youthClassification: z.string({ required_error: "Please select a classification." }),
  specialNeeds: z.string().optional(),
  educationalBackground: z.string({ required_error: "Please select an educational background." }),
  isSkVoter: z.enum(["yes", "no"], { required_error: "This field is required." }),
  votedLastElection: z.enum(["yes", "no"], { required_error: "This field is required." }),
  isNationalVoter: z.enum(["yes", "no"], { required_error: "This field is required." }),
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
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [showSpecialNeeds, setShowSpecialNeeds] = useState(false);
  const [age, setAge] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        specialNeeds: "",
        educationalBackground: "",
    }
  });

  const birthdate = form.watch("birthdate");

  useEffect(() => {
    if (birthdate) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthdate.getFullYear();
        const m = today.getMonth() - birthdate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
            calculatedAge--;
        }
        setAge(calculatedAge);
    }
  }, [birthdate]);
  
   const youthClassification = form.watch("youthClassification");
   useEffect(() => {
    setShowSpecialNeeds(youthClassification === 'youth with special needs');
   }, [youthClassification]);


  if (isUserLoading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><Loader className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: "destructive", title: "Not authenticated", description: "You must be logged in to create a profile." });
        return;
    }

    const profileData = {
        ...values,
        birthdate: format(values.birthdate, "yyyy-MM-dd"),
        isSkVoter: values.isSkVoter === 'yes',
        votedLastElection: values.votedLastElection === 'yes',
        isNationalVoter: values.isNationalVoter === 'yes',
        age: age,
    };
    
    const userDocRef = doc(firestore, "users", user.uid);

    // Use the non-blocking update function
    setDocumentNonBlocking(userDocRef, profileData, { merge: true });

    toast({
      title: "Profile Updated!",
      description: "Your information has been saved successfully.",
    });

    router.push("/home");
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-3xl my-8">
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
                    name="birthdate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                captionLayout="dropdown-buttons"
                                fromYear={1930}
                                toYear={new Date().getFullYear()}
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input placeholder="Your age" value={age === null ? '' : age} disabled />
                    </FormControl>
                </FormItem>
            </div>
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="youthClassification"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Youth Classification</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                 <FormField
                    control={form.control}
                    name="educationalBackground"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Educational Background</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your attainment" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="elementary">Elementary</SelectItem>
                                <SelectItem value="highschool">High School</SelectItem>
                                <SelectItem value="college">College</SelectItem>
                                <SelectItem value="vocational">Vocational</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
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

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Voter Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="isSkVoter"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Registered SK Voter?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                                >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="votedLastElection"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Voted Last Election?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                                >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isNationalVoter"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>National Voter?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                                >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            
            <Button type="submit" size="lg" className="text-lg" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Create Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    