import { Time } from '@angular/common';
export class items {
  'added'?: true;
  'categoryId'?: number;
  'description'?: string;
  'id'?: number;
  'imageUrl'?: string;
  'name'?: string;
  'price'?: number;
  'quantity'?: number;
  'status'?: boolean;
  'availabilty'?: boolean;
}

export class orderInitiationTime {
  'date': string;
}

export class user {
  'contactNumber'?: string;
  'emailId'?: string;
  'employeeCode'?: number;
  'firstName'?: string;
  'id'?: number;
  'lastName'?: string;
  'role'?: string;
  'token'?: string;
  'bytes'?: number;
}

export class Order {
  'amountInBytes'?: number;
  'amountInCash'?: number;
  'amountInBorrow'?:number;
  'userComments'?: string;
  'comments'?: string;
  'id'?: number;
  'user'?: user;
  'orderInitiationTime'?: orderInitiationTime;
  'status'?: string;
  'totalAmount'?: number;
  'items'?: items[] = [];
}

