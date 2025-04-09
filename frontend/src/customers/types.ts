export type CustomerBase = {
  name: string;
  date_of_birth: string;
  gender: "male" | "female" | "OTHER";
  email: string | null;
  alternate_email: string | null;
  mobile_number: string;
  alternate_mobile_number: string | null;
  allergies: {};
  preferences: {};
};

export type Customer = CustomerBase & {
  id: string;
  created_at: string;
};

export type CustomerCreate = CustomerBase;
