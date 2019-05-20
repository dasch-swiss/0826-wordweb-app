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
    internalID: string;
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
    references: number;
}

export interface Passage {
    id: number;
    edition: Edition;
    text: string;
    page: string;
}

export interface PassageOriginal {
    id: number;
    edition: EditionOriginal;
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

export interface Subject {
    id: number;
    name: string;
    references: number;
}

export interface Genre {
    id: number;
    name: string;
    references: number;
    genres: Genre[];
}

export interface TreeGenre extends Genre {
    isVisible: boolean;
    isExpanded: boolean;
}
