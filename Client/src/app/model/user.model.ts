export enum Gender {
    Male = "male",
    Female = "female"
  }
  
  export interface User {
    fullName: string;
    userName: string;
    password: string;
    confirmPassword: string;
    gender: Gender;
  }
  