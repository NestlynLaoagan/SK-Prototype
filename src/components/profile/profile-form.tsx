"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader } from "lucide-react";
import { useFirebase, useUser, setDocumentNonBlocking } from "@/firebase";
import { doc, updateProfile } from "firebase/firestore";

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
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("A valid email is required."),
  address: z.string().min(1, "Address is required."),
  contactNumber: z.string().min(1, "Contact number is required.").regex(/^[0-9]+$/, "Contact number must contain only digits."),
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
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [showSpecialNeeds, setShowSpecialNeeds] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fullName: user?.displayName || "",
        email: user?.email || "",
        specialNeeds: "",
    }
  });

  // Pre-fill form with user data from auth
  useEffect(() => {
    if (user) {
        form.setValue('fullName', user.displayName || "");
        form.setValue('email', user.email || "");
    }
  }, [user, form]);

  const birthdate = form.watch("birthdate");
  const { setValue } = form;

  useEffect(() => {
    if (birthdate) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthdate.getFullYear();
        const m = today.getMonth() - birthdate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
            calculatedAge--;
        }
        setAge(calculatedAge);

        if (calculatedAge >= 16 && calculatedAge <= 17) {
            setValue('youthAgeGroup', '16-17', { shouldValidate: true });
        } else if (calculatedAge >= 18 && calculatedAge <= 24) {
            setValue('youthAgeGroup', '18-24', { shouldValidate: true });
        } else if (calculatedAge >= 25 && calculatedAge <= 30) {
            setValue('youthAgeGroup', '25-30', { shouldValidate: true });
        } else {
            setValue('youthAgeGroup', '', { shouldValidate: true });
        }
    } else {
        setAge(null);
        setValue('youthAgeGroup', '', { shouldValidate: true });
    }
  }, [birthdate, setValue]);
  
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    
    // Update auth profile
    if (auth.currentUser && (auth.currentUser.displayName !== values.fullName)) {
        await updateProfile(auth.currentUser, { displayName: values.fullName });
    }

    const profileData = {
        ...values,
        id: user.uid,
        role: 'member',
        birthdate: format(values.birthdate, "yyyy-MM-dd"),
        isSkVoter: values.isSkVoter === 'yes',
        votedLastElection: values.votedLastElection === 'yes',
        isNationalVoter: values.isNationalVoter === 'yes',
        age: age,
    };
    
    const userDocRef = doc(firestore, "users", user.uid);
    setDocumentNonBlocking(userDocRef, profileData, { merge: true });

    setShowSuccessModal(true);

    setTimeout(() => {
        setShowSuccessModal(false);
        router.push("/home");
    }, 2500);
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <>
    <Card className="relative w-full max-w-4xl mx-auto my-8 p-6 shadow-sm border">
        <h1 className="mb-6 text-3xl font-bold border-b pb-2">PROFILING FORM</h1>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter full name" {...field} />
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
                            <Input type="email" placeholder="Enter email" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Enter Current Address" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-end">
                <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contact No.</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="09123456789" {...field}
                                onChange={(e) => {
                                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                                    field.onChange(onlyNums);
                                }}
                             />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Birthday</FormLabel>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                                onSelect={(date) => {
                                  if (date) field.onChange(date);
                                  setIsCalendarOpen(false);
                                }}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="w-24">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input value={age === null ? '' : age} readOnly className="bg-muted font-bold" />
                    </FormControl>
                </div>
            </div>

            <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                        >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="male" /></FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="female" /></FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <h2 className="mt-6 mb-2 text-2xl font-semibold text-gray-700 uppercase tracking-wide">Demographic Characteristics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="civilStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Civil Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger></FormControl>
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
                <FormField
                    control={form.control}
                    name="workStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Work Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose status" /></SelectTrigger></FormControl>
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
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="youthAgeGroup"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Youth Age Group</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger></FormControl>
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
                <FormField
                    control={form.control}
                    name="youthClassification"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Youth Classification</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger></FormControl>
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
            </div>
            {showSpecialNeeds && (
                 <FormField
                    control={form.control}
                    name="specialNeeds"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Please Specify Special Needs</FormLabel>
                        <FormControl><Input placeholder="e.g., PWD, etc." {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
            )}
             <FormField
                control={form.control}
                name="educationalBackground"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Educational Background</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Choose attainment" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="elementary">Elementary</SelectItem>
                            <SelectItem value="highschool">High School</SelectItem>
                            <SelectItem value="college">College</SelectItem>
                            <SelectItem value="vocational">Vocational</SelectItem>
                            <SelectItem value="graduate">Graduate</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 px-4 rounded text-sm border bg-muted">
                 <FormField
                    control={form.control}
                    name="isSkVoter"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                        <FormLabel>Registered SK Voter?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
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
                        <FormItem className="space-y-2">
                        <FormLabel>Voted Last Election?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
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
                        <FormItem className="space-y-2">
                        <FormLabel>National Voter?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="yes" /></FormControl><FormLabel className="font-normal">Yes</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="no" /></FormControl><FormLabel className="font-normal">No</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
             <div className="flex flex-col items-center mt-6">
                <Button type="submit" size="lg" className="w-full px-20 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all shadow-md" disabled={isLoading}>
                    {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : "SUBMIT FORM"}
                </Button>
                <p className="text-center mt-4 text-[10px] italic text-muted-foreground uppercase tracking-widest">
                    Rest assured that all information gathered from this will<br />
                    be treated with utmost confidentiality.
                </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>

    <AlertDialog open={showSuccessModal}>
        <AlertDialogContent className="p-12 w-full md:w-1/2 max-w-2xl border-t-8 border-primary">
            <div className="w-24 h-24 bg-green-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-14 w-14" strokeWidth={4} />
            </div>
            <h3 className="text-3xl font-bold text-center text-foreground mb-2">Submit Successful</h3>
            <p className="text-muted-foreground text-lg text-center">Your profiling information has been recorded.</p>
            <div className="mt-6 flex justify-center">
               <div className="animate-pulse text-primary font-semibold">Processing...</div>
            </div>
        </AlertDialogContent>
    </AlertDialog>

    </>
  );
}
