export interface PushCourse {
   certificateId:   string;
   lmsCourseId:     string;
   lmsCourseName:   string;
   lmsCategoryName: string;
   lmsCategoryId:   string;
   publishDate:     null;
   startDate:       string;
   endDate:         string;
   expiredDate:     string;
   description:     string;
   status:          string;
   students:        Student[];
   skills:          Skill[];
   createdBy:       string;
}

export interface Skill {
   id: number;
}

export interface Student {
   lmsUserId:         number;
   programId:         string;
   certificateNumber: string;
   lmsFullname:       string;
   nameOnCertificate: string;
   lmsEmail:          string;
   deliveryEmail:     string;
   statusGraduation:  StatusGraduation;
   linkAchievement:   string;
   linkProfileBadge:  string;
   linkCertificate:   string;
   lmsProfilePicture: string;
   lmsDepartment:     string;
   lmsPhone1:         string;
   lmsPhone2:         string;
   lmsAddress:        string;
   lmsCompany:        string;
   lmsBioDecription:  string;
   lmsLinkedin:       string;
   createdBy:         string;
}

export enum StatusGraduation {
   Passed = "passed",
}
