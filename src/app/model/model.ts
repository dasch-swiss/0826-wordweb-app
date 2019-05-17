export interface Author {
    id: number;
    internalID: string;
    firstName: string;
    lastName: string;
    description: string;
    references: number;
}

export interface Book {
    id: number;
    title: string;
    authors: Author[];
    references: number;
}

export interface EditionOriginal {
    id: number;
    book: Book;
    language: Language;
    publicationInfo: string;
}

export interface Edition {
    id: number;
    book: Book;
    language: Language;
    publicationInfo: string;
}

export interface Passage {
    id: number;
    edition: Edition;
    text: string;
    page: string;
}

export interface PassageOriginal {
    id: number;
    edition: Edition;
    text: string;
    page: string;
}

export interface Language {
    id: number;
    name: string;
    references: number;
}

export interface Venue {
    id: number;
    name: string;
    city: string;
    references: number;
}

export interface Organisation {
    id: number;
    name: string;
    references: number;
}
