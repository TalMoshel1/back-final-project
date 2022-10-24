import { Request } from "express";
import { Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
    id: Types.ObjectId;
    username: string;
    email?: string;
    files: object[] | [];
    media?: string;
}

/*

[
  {
    fieldname: 'media',
    originalname: 'DoReMi.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'uploads/',
    filename: '1665155145512-DoReMi.jpg',
    path: 'uploads\\1665155145512-DoReMi.jpg',
    size: 957616
  }
]

*/