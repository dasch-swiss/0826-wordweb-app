export interface Human {
    id: number;
    firstName: string;
    lastName: string;
    order: number;
}

export interface Author extends Human {
    internalID: string;
    description: string;
    birthDate: number;
    deathDate: number;
    // flStartDate: number;
    // flEndDate: number;
    references: number;
}

export interface Contributor extends Human {
    email: string;
    references: number;
}

export interface Book {
    id: number;
    internalID: string;
    title: string;
    authors: Author[];
    order: number;
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
    order: number;
    references: number;
}

export interface Passage {
    id: number;
    edition: Edition;
    text: string;
    page: string;
    order: number;
    references: number;
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
    order: number;
    references: number;
}

export interface Venue {
    id: number;
    name: string;
    city: string;
    order: number;
    references: number;
}

export interface Organisation {
    id: number;
    name: string;
    order: number;
    references: number;
}

export interface Subject {
    id: number;
    name: string;
    order: number;
    references: number;
}

export interface Lexia {
    id: number;
    internalID: string;
    lexia: string;
    order: number;
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
