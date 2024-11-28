export interface ApiResponse {
   status: string;
   code: string;
   data: UserData;
 }
 export interface UserData {
    image: string;
    id: number;
    email: string;
    nik: string;
    fullname: string;
    mobile: string | null;
    PositionId: number | null;
    emailNotification: boolean;
    waNotification: boolean;
    isActive: boolean;
    createdBy: number | null;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
  }
 