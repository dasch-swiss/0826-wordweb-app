export interface IDisplayedClass {
    name: string;
    props: IDisplayedProperty[];
}

export interface IDisplayedProperty {
    name: string;
    valVar?: string;
    searchVal1?: string;
    searchVal2?: string;
    priority: number;
    mandatory?: boolean;
    res: IDisplayedClass;
}
