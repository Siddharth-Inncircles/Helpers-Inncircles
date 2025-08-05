export interface IHelper {
  id:string,
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
  vechileType: 'Bike' | 'Car' | 'Cycle' | 'Bus' | 'Other';
  vechileNumber?: string;
  kycDocument?: string;
  additionalPdfs?: string[];
  identificationCard?: string;
  createdAt: Date;
  updatedAt: Date;
}
