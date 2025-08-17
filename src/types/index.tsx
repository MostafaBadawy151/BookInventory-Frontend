export type BookDto = {
  id: number;
  title: string;
  author: string;
  publicationDate?: string | null;
  quantity: number;
};

export type BookCreateDto = {
  title: string;
  author: string;
  publicationDate?: string | null;
  quantity: number;
};

export type BookUpdateDto = Partial<BookCreateDto>;

export type AuthResponse = {
  token: string;
  expiresAtUtc: string;
  userName: string;
  fullName?: string | null;
  roles: string[];
};
