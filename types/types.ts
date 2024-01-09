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

export type backendClubProps = {
  id: string;
  about: string;
  clubName: string;
  photoURl: string;
  members?: string[];
};

export type ClubData = {
  id: string;
  about: string;
  clubName: string;
  creater: string;
  members: string[];
  photoURL: string;
  // Add other properties if needed
};

export type userProps = {
  photoUrl: string[];
  userName: string;
};
