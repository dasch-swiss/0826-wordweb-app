export interface IDisplayedClass {
    name: string;
    props: IDisplayedProperty[];
    iri?: string;
}

export interface IMainClass extends IDisplayedClass {
    mainClass: IMainClassObject;
}

export interface IMainClassObject {
    name: string;
    variable: string;
}

export interface IDisplayedProperty {
    name: string;
    valVar?: string;
    negation?: boolean;
    isNull?: boolean;
    searchVal1?: string;
    searchVal2?: string;
    orderPriority?: number;
    priority: number;
    mandatory?: boolean;
    res: IDisplayedClass;
}
