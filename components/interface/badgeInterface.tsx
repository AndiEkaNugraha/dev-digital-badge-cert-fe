export interface Badge {
   id:           number;
   label:        string;
   badgeFile:    string;
   createdBy:    string;
   updatedBy:    string;
   createdAt:    Date;
   updatedAt:    Date;
   certificates: Certificate[];
}

export interface Certificate {
   id:                    number;
   badgeId:               number;
   certificateTemplateId: number;
   label:                 string;
   companyName:           null;
   picName:               null;
   picPosition:           null;
   file:                  string;
   createdBy:             string;
   updatedBy:             string;
   createdAt:             Date;
   updatedAt:             Date;
}
