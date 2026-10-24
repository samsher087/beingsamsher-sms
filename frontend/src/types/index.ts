export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'STUDENT'
  | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  avatar?: string;
  phone?: string;
  linkedStudentId?: any;
  linkedChildrenIds?: any[];
  linkedTeacherId?: any;
}

export interface Tenant {
  _id: string;
  name: string;
  code: string;
  subdomain: string;
  tagline: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    website?: string;
  };
  subscription: {
    plan: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE';
    status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'EXPIRED';
    studentLimit: number;
    staffLimit: number;
    expiresAt: string;
  };
  themeConfig: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    heroBanner?: string;
    schoolMotto?: string;
  };
  settings: {
    currencySymbol: string;
    receiptPrefix: string;
    admissionPrefix: string;
  };
  stats?: {
    students: number;
    staff: number;
  };
}

export interface Student {
  _id: string;
  admissionNumber: string;
  rollNumber: string;
  name: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  email?: string;
  phone?: string;
  classId: any;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  parents?: {
    fatherName: string;
    fatherPhone: string;
    fatherOccupation?: string;
    motherName: string;
    motherPhone: string;
    emergencyContact: string;
  };
  concessionPercent?: number;
  status: 'ACTIVE' | 'TRANSFERRED' | 'GRADUATED' | 'INACTIVE';
  admissionDate: string;
}

export interface Teacher {
  _id: string;
  employeeId: string;
  name: string;
  gender: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  qualification: string;
  assignedClasses: {
    classId: any;
    subject: string;
  }[];
  salaryPaise: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED';
}

export interface ClassSection {
  _id: string;
  className: string;
  section: string;
  roomNumber: string;
  capacity: number;
  classTeacherId?: any;
  subjects: {
    _id?: string;
    name: string;
    code: string;
    teacherId?: any;
    maxMarks: number;
    passingMarks: number;
  }[];
  studentCount?: number;
}
