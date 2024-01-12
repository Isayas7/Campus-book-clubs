export type FormData = {
  email: string;
  password: string;
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

export type clubProps = {
  about: string;
  clubName: string;
};

export type uploadbookType = {
  bookAuthor: string;
  bookTitle: string;
  photoURL: string;
  pdfURL: string;
};

export type bookType = {
  id: string;
  bookAuthor: string;
  bookTitle: string;
  creater: string;
  pdfURL: string;
  photoURL: string;
};

export type backendClubProps = {
  id: string;
  about: string;
  clubName: string;
  photoURL: string;
  creater: string;
  members?: string[];
  lastMessage: any;
};

export type ClubData = {
  id: string;
  about: string;
  clubName: string;
  creater: string;
  members: string[];
  photoURL: string;
  from: string;
};

export type userProps = {
  photoUrl: string[];
  userName: string;
};

export type discussionTypes = {
  id: string;
  bookAuther: string;
  bookTitle: string;
  // creater: string;
  photoURL: string;
  day: string;
  startTime: string;
};
