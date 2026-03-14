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
    date: string; // ISO 8601 date string - This is the creation/posted date.
    eventDate?: string; // ISO 8601 date string - This is the date of the event itself.
    location?: string;
    status: 'Upcoming' | 'Completed' | 'Canceled' | 'Ongoing';
    type?: 'general' | 'assembly';
};
    
export type Faq = {
    id: string;
    question: string;
    answer: string;
};

export type Event = {
    id: string;
    title: string;
    description: string;
    start: string; // ISO 8601
    end: string; // ISO 8601
    status: 'Planning' | 'Upcoming' | 'Ongoing' | 'Finished';
};

export type Project = {
    id: string;
    name: string;
    description: string;
    budget: string;
    startDate: string; // ISO String
    endDate: string; // ISO String
    status: 'Planning' | 'Pending Approval' | 'In Progress' | 'Completed';
    imageUrls?: string[];
    reportUrls?: string[];
};

export type Feedback = {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    comment: string;
    rating: 'good' | 'average' | 'bad';
    submissionDate: string; // ISO 8601 date string
};

export type AuditLog = {
    id: string;
    userName: string;
    userRole: 'admin' | 'member';
    action: string;
    module: string;
    description: string;
    timestamp: string;
    status: 'Success' | 'Failed';
    ipAddress?: string;
};

export type ArchivedRecord = {
    id: string;
    recordId: string;
    recordType: 'project' | 'event' | 'announcement' | 'feedback' | 'user';
    title: string;
    data: Record<string, any>;
    archivedAt: string;
    archivedBy: string;
    archivedByName: string;
};

export type BackupRecord = {
    id: string;
    fileName: string;
    backupType: 'manual' | 'automatic';
    fileSize: number;
    createdAt: string;
    createdBy: string;
    createdByName: string;
    status: 'completed' | 'failed' | 'in-progress';
    downloadUrl?: string;
};
