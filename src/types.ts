export type AssignmentType =
  | 'Assignment'
  | 'Presentation'
  | 'Term Paper'
  | 'Lab Report'
  | 'Project Report'
  | 'Internship Report'
  | 'Thesis'
  | 'Case Study';

export type SubmissionStyleMode = 'underline' | 'typed' | 'cards';

export interface StudentInfo {
  id: string;
  name: string;
  studentId: string;
  department?: string;
  program?: string;
  semester?: string;
  batch?: string;
  section?: string;
  roll?: string;
  phone?: string;
}

export interface TeacherInfo {
  name: string;
  designation: string;
  department: string;
  faculty?: string;
}

export type ThemeId =
  | 'fcub-ribbon'
  | 'royal-crest'
  | 'modern-minimal'
  | 'tech-engineer'
  | 'national-emerald'
  | 'executive-report'
  | 'creative-portfolio'
  | 'medical-science';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  nameBn: string;
  description: string;
  defaultPrimary: string;
  defaultAccent: string;
  previewBg: string;
  badge: string;
}

export interface CoverData {
  universityName: string;
  departmentName: string;
  facultyName?: string;
  assignmentType: AssignmentType | string;
  courseCode: string;
  subjectName: string;
  topicSubtitle?: string;
  themeId: ThemeId;
  fontFamily: string;
  
  // Logo
  logoUrl: string;
  logoScale: number; // 60 to 180 (%)
  logoShape: 'original' | 'circle' | 'shield' | 'square';
  logoPosition: 'center' | 'left' | 'right';
  showLogo: boolean;

  // Colors & Styling
  primaryColor: string;
  accentColor: string;
  textColor: string;
  paperBgColor: string;
  borderWidth: number; // 1 to 6
  hasCornerRibbons: boolean;
  showWatermark: boolean;
  watermarkOpacity: number; // 0.02 to 0.15

  // Submission format
  submissionMode: SubmissionStyleMode;
  isGroupSubmission: boolean;
  submittedBy: StudentInfo[];
  submittedTo: TeacherInfo;
  submissionDate: string;
  session?: string;
  academicYear?: string;
}

export interface PresetUniversity {
  id: string;
  name: string;
  department: string;
  courseCode: string;
  subjectName: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  themeId: ThemeId;
  assignmentType: string;
}
