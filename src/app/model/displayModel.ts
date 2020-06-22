export interface IDisplayedClass {
    name: string;
    props: IDisplayedProperty[];
    iri?: string;
}

export interface IDisplayedProperty {
    name: string;
    valVar?: string;
    negation?: boolean;
    searchVal1?: string;
    searchVal2?: string;
    priority: number;
    mandatory?: boolean;
    res: IDisplayedClass;
}
