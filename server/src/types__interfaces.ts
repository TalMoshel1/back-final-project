import { Types } from "mongoose";
// export interface AuthenticatedRequest extends Request {
//   id: Types.ObjectId | undefined;
//   username: string | undefined;
//   email?: string;
//   files: object[] | [];
//   media?: string;
//   file: { path: '' };
//   body: { email: '', username: '', password: '', fullname: '' },
//   user: {} | null;
//   following: string[]
// }

interface User {
  fullname: string;
  created: Date;
  following: string[];
  username: string;
  password: string;
  email?: string | undefined;
  tokenCreatedAt: number;
  media: string;
}

export interface RequestBody {
  email: string;
  username: string;
  password: string;
  fullname: string;
}

interface RequestParams {
  userId: string;
  username: string;
}

interface RequestFile {
  path: string;
}


export interface Request {
  id?: Types.ObjectId | undefined;
  media?: string;
  username?: string;
  user?: User | null | undefined;
  path: string;
  cookies: string[];
  body: RequestBody;
  params: RequestParams;
  file: RequestFile;
  files: object[] | [];

}

export interface Application {
  req: Request;
  res: Response;
}




