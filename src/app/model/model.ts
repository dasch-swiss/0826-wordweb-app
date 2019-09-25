export interface Human {
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
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
    venues: Venue[];
    organisations: Organisation[];
    edition: string;
    editionHist: string;
    order: number;
    references: number;
}

export interface Passage {
    id: number;
    book: Book;
    text: string;
    textHist: string;
    page: string;
    pageHist: string;
    order: number;
    references: number;
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
