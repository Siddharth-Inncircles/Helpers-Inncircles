// export interface IHelper {
//   id:string,
//   employeeCode: string;
//   name: string;
//   type: 'Nurse' | 'Driver' | 'Newspaper' | 'Laundry' | 'Maid' | 'Plumber' | 'Cook';
//   organization: string;
//   gender: 'Male' | 'Female' | 'Other';
//   language: string[];
//   mobileNo: string;
//   emailId?: string;
//   joinedOn: Date;
//   households: number;
//   vechileType: 'Bike' | 'Car' | 'Cycle' | 'Bus' | 'Other';
//   vechileNumber?: string;
//   kycDocument?: string;
//   additionalPdfs?: string[];
//   identificationCard?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   profileImage?: {
//     data: any;
//     filename: string;
//     mimetype: string;
//   };
// }




export interface IHelper {
  id: string;
  employeeCode: string;
  name: string;
  type: 'Nurse' | 'Driver' | 'Newspaper' | 'Laundry' | 'Maid' | 'Plumber' | 'Cook';
  organization: string;
  gender: 'Male' | 'Female' | 'Other';
  language: string[];
  mobileNo: string;
  emailId?: string;
  joinedOn: Date;
  households: number;
  vechileType: 'Bike' | 'Car' | 'Cycle' | 'Bus' | 'Other' | 'None';
  vechileNumber?: string;

  kycDocument?: { data : {
    filename: string;
    mimetype: string;
    url: string; 
  }};

  additionalPdfs?: {
    filename: string;
    mimetype: string;
    url: string;
  }[];

  profileImage?: {data : {
    filename: string;
    url: string;
  }, mimetype: string;};

  identificationCard?: string; 

  createdAt: Date;
  updatedAt: Date;
}
