export type User = {
    id: string;
    fullName: string;
    email: string;
    role: 'admin' | 'member';
    photoURL?: string;
    birthdate?: string;
    age?: number;
    gender?: 'male' | 'female';
    address?: string;
    contactNumber?: string;
    civilStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'live-in';
    workStatus?: 'employed' | 'unemployed' | 'self-employed' | 'looking-for-job';
    youthAgeGroup?: '16-17' | '18-24' | '25-30';
    youthClassification?: 'in-school' | 'out-of-school' | 'working' | 'youth with special needs';
    specialNeeds?: string;
    educationalBackground?: 'elementary' | 'highschool' | 'college' | 'vocational' | 'graduate';
    isSkVoter?: boolean;
    votedLastElection?: boolean;
    isNationalVoter?: boolean;
};

export type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string; // ISO 8601 date string
};
    
export type Faq = {
    id: string;
    question: string;
    answer: string;
};
