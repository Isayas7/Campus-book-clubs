export type userType = {
  email: string;
  password: string;
  repeatNewPassword: string;
  userName: string;
  photoUrl?: string;
};

export type usenameChangeProps = {
  password: string;
  userName: string;
};

export type passwordChangeProps = {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export type bookType = {
  id: string;
  bookAuthor: string;
  bookTitle: string;
  creater: string;
  aboutBook: string;
  pdfURL: string;
  photoURL: string;
  length: number;
};

export type ClubType = {
  id: string;
  about: string;
  clubName: string;
  photoURL: string;
  creater: string;
  members?: string[];
  lastMessage: any;
  from: string;
};

export type discussionTypes = {
  id: string;
  bookAuther: string;
  bookTitle: string;
  photoURL: string;
  day: string;
  startTime: string;
};
