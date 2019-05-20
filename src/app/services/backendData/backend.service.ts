import {Injectable} from "@angular/core";
import {Book, Language, Author, Edition, Organisation, Venue, PassageOriginal, EditionOriginal, Passage, Subject} from "../../model/model";

@Injectable({
    providedIn: "root"
})
export class BackendService {

    private lang1: Language = {
        id: 1,
        name: "Englisch",
        references: 10
    };

    private lang2: Language = {
        id: 2,
        name: "Deutsch",
        references: 1
    };

    private lang3: Language = {
        id: 3,
        name: "Französisch",
        references: 0
    };

    private lang4: Language = {
        id: 4,
        name: "Italienisch",
        references: 0
    };

    private lang5: Language = {
        id: 5,
        name: "Spanisch",
        references: 0
    };

    private a1: Author = {
        id: 1,
        internalID: "&000001",
        firstName: "William",
        lastName: "Shakespeare",
        description: "English Dramatist",
        references: 0
    };

    private a2: Author = {
        id: 2,
        internalID: "&000002",
        firstName: "Christopher",
        lastName: "Marlowe",
        description: "English playwright and poet",
        references: 1
    };

    private a3: Author = {
        id: 3,
        internalID: "&000003",
        firstName: "Rosina Doyle",
        lastName: "Bulwer-Lytton",
        description: "English novelist",
        references: 3
    };

    private a4: Author = {
        id: 4,
        internalID: "&000004",
        firstName: "Samuel Taylor",
        lastName: "Coleridge",
        description: "English poet",
        references: 0
    };

    private a5: Author = {
        id: 5,
        internalID: "&000005",
        firstName: "William",
        lastName: "Barksted",
        description: "English poet and dramatist fl. 1611",
        references: 0
    };

    private a6: Author = {
        id: 6,
        internalID: "&000006",
        firstName: "George",
        lastName: "Chapman",
        description: "English poet, dramatist and Homer translator 1559?-1634",
        references: 0
    };

    private a7: Author = {
        id: 7,
        internalID: "&000007",
        firstName: "Marcus Tullius",
        lastName: "Cicero",
        description: "Roman politician, orator and philosopher 106-43",
        references: 0
    };

    private a8: Author = {
        id: 8,
        internalID: "&000008",
        // firstName: "John",
        firstName: "John Byrne Leicester Warren, Baron de",
        lastName: "Cotgrave",
        description: "English anthologist 1611?-1655?",
        references: 24
    };

    private a9: Author = {
        id: 9,
        internalID: "&000009",
        firstName: "Sir William",
        lastName: "D'Avenant",
        description: "English dramatist 1606-1668",
        references: 0
    };

    private a10: Author = {
        id: 10,
        internalID: "&000010",
        firstName: "Charles",
        lastName: "Dickens",
        description: "English novelist 1812-1870",
        references: 0
    };

    private a11: Author = {
        id: 11,
        internalID: "&000011",
        firstName: "Maria",
        lastName: "Edgeworth",
        description: "Anglo-Irish dramatist and novelist 1767-1849",
        references: 12
    };

    private a12: Author = {
        id: 12,
        internalID: "&000012",
        firstName: "David",
        lastName: "Garrick",
        description: "English actor 1717-1779",
        references: 6
    };

    private a13: Author = {
        id: 13,
        internalID: "&000013",
        firstName: "Elizabeth",
        lastName: "George",
        description: "U.S. crime writer b. 1949, pen-name for Susan Elizabeth George",
        references: 35
    };

    private a14: Author = {
        id: 14,
        internalID: "&000014",
        firstName: "Johann Wolfgang von",
        lastName: "Goethe",
        description: "German poet and dramatist 1748-1832",
        references: 21
    };

    private a15: Author = {
        id: 15,
        internalID: "&000015",
        firstName: "Robert",
        lastName: "Gott",
        description: "Australian cartoonist children's and crime writer b. 1957",
        references: 18
    };

    private a16: Author = {
        id: 16,
        internalID: "&000016",
        firstName: "Paul",
        lastName: "Green",
        description: "U.S. dramatist 1894-1981",
        references: 11
    };

    private a17: Author = {
        id: 17,
        internalID: "&000017",
        firstName: "Martha",
        lastName: "Grimes",
        description: "U.S. crime writer b. 1931",
        references: 16
    };

    private a18: Author = {
        id: 18,
        internalID: "&000018",
        firstName: "Thomas",
        lastName: "Hardy",
        description: "English novelist and poet 1840-1928",
        references: 38
    };

    private a19: Author = {
        id: 19,
        internalID: "&000019",
        firstName: "Gerhart",
        lastName: "Hauptmann",
        description: "German dramatist and novelist 1862-1942",
        references: 9
    };

    private a20: Author = {
        id: 20,
        internalID: "&000020",
        firstName: "William",
        lastName: "Hazlitt",
        description: "English critic and essayist 1778-1830",
        references: 340
    };

    private a21: Author = {
        id: 21,
        internalID: "&000021",
        firstName: "Lewis C.",
        lastName: "Henry",
        description: "U.S. (?) anthologist fl. 1961, real name Lewis Copeland",
        references: 33
    };

    private a22: Author = {
        id: 22,
        internalID: "&000022",
        firstName: "Aaron",
        lastName: "Hill",
        description: "British novelist and poet 1685-1750",
        references: 15
    };

    private a23: Author = {
        id: 23,
        internalID: "&000023",
        firstName: "Vladimír",
        lastName: "Holan",
        description: "Czech poet 1905-1980",
        references: 1
    };

    private a24: Author = {
        id: 24,
        internalID: "&000024",
        firstName: "Zora Neale",
        lastName: "Hurston",
        description: "U.S. novelist 1891-1960",
        references: 2
    };

    private b1: Book = {
        id: 1,
        internalID: "@000100",
        title: "Romeo and Juliet",
        authors: [this.a1, this.a8, this.a3],
        references: 0
    };

    private e1: Edition = {
        id: 1,
        book: this.b1,
        language: this.lang1,
        publicationInfo: "Romeo and Juliet, W. Shakespeare, [not_original]",
        references: 0
    };

    private pas1: Passage = {
        id: 1,
        edition: this.e1,
        text: "thus with a kiss I die",
        page: "2"
    };

    private pas2: Passage = {
        id: 2,
        edition: this.e1,
        text: "My bounty is as boundless as the sea,\n" +
            "My love as deep; the more I give to thee,\n" +
            "The more I have, for both are infinite.",
        page: "101-102"
    };

    private e1_original: EditionOriginal = {
        id: 1,
        book: this.b1,
        language: this.lang1,
        publicationInfo: "Romeo and Juliet, W. Shakespeare, [original]"
    };

    private pas1_original: PassageOriginal = {
        id: 1,
        edition: this.e1_original,
        text: "[original] thus with a kiss I die",
        page: "2"
    };

    private pas2_original: PassageOriginal = {
        id: 2,
        edition: this.e1_original,
        text: "[original] My bounty is as boundless as the sea,\n" +
            "My love as deep; the more I give to thee,\n" +
            "The more I have, for both are infinite.",
        page: "101-102"
    };

    private b2: Book = {
        id: 2,
        internalID: "@000200",
        title: "Hamlet",
        authors: [this.a1, this.a10],
        references: 2
    };

    private e2: Edition = {
        id: 2,
        book: this.b2,
        language: this.lang1,
        publicationInfo: "Hamlet, W. Shakespeare, [not_original]",
        references: 0
    };

    private pas3: Passage = {
        id: 3,
        edition: this.e2,
        text: "What a piece of work is a man! How noble in reason! how infinite in faculty! in form, in moving, how express and admirable! in action how like an angel! in apprehension how like a god! the beauty of the world! the paragon of animals! And yet, to me, what is this quintessence of dust?",
        page: "43-45"
    };

    private pas4: Passage = {
        id: 4,
        edition: this.e2,
        text: "Though this be madness, yet there is method in't.",
        page: "90"
    };

    private pas5: Passage = {
        id: 5,
        edition: this.e2,
        text: "Lord Polonius: What do you read, my lord? \n" +
            "Hamlet: Words, words, words. \n" +
            "Lord Polonius: What is the matter, my lord? \n" +
            "Hamlet: Between who? \n" +
            "Lord Polonius: I mean, the matter that you read, my lord.",
        page: "87-92"
    };

    private e2_original: EditionOriginal = {
        id: 1,
        book: this.b2,
        language: this.lang1,
        publicationInfo: "The Tragedy of Hamlet, W. Shakespeare, [original]"
    };

    private pas3_original: PassageOriginal = {
        id: 3,
        edition: this.e2_original,
        text: "[original] What a piece of work is a man! How noble in reason! how infinite in faculty! in form, in moving, how express and admirable! in action how like an angel! in apprehension how like a god! the beauty of the world! the paragon of animals! And yet, to me, what is this quintessence of dust?",
        page: "43-45"
    };

    private pas4_original: PassageOriginal = {
        id: 4,
        edition: this.e2_original,
        text: "[original] Though this be madness, yet there is method in't.",
        page: "90"
    };

    private pas5_original: PassageOriginal = {
        id: 5,
        edition: this.e2_original,
        text: "[original] Lord Polonius: What do you read, my lord? \n" +
            "Hamlet: Words, words, words. \n" +
            "Lord Polonius: What is the matter, my lord? \n" +
            "Hamlet: Between who? \n" +
            "Lord Polonius: I mean, the matter that you read, my lord.",
        page: "87-92"
    };

    private b3: Book = {
        id: 3,
        internalID: "@000300",
        title: "The Comedy of Errors",
        authors: [this.a1],
        references: 6
    };

    private e3: Edition = {
        id: 3,
        book: this.b3,
        language: this.lang1,
        publicationInfo: "The Comedy of Errors, W. Shakespeare, [not_original]",
        references: 0
    };

    private pas6: Passage = {
        id: 6,
        edition: this.e3,
        text: "A heavier task could not have been imposed\n" +
            "Than I to speak my griefs unspeakable;\n" +
            "Yet, that the world may witness that my end\n" +
            "Was wrought by nature, not by vile offence,\n" +
            "I'll utter what my sorrow gives me leave.",
        page: "129"
    };

    private pas7: Passage = {
        id: 7,
        edition: this.e3,
        text: "A doubtful warrant of immediate death,\n" +
            "Which though myself would gladly have embraced,\n" +
            "Yet the incessant weepings of my wife,\n" +
            "Weeping before for what she saw must come,\n" +
            "And piteous plainings of the pretty babes,\n" +
            "That mourned for fashion, ignorant what to fear,\n" +
            "Forced me to seek delays for them and me.",
        page: "205-207"
    };

    private e3_original: EditionOriginal = {
        id: 3,
        book: this.b3,
        language: this.lang1,
        publicationInfo: "The Comedy of Errors, W. Shakespeare, [original]"
    };

    private pas6_original: PassageOriginal = {
        id: 6,
        edition: this.e3_original,
        text: "[original] A heavier task could not have been imposed\n" +
            "Than I to speak my griefs unspeakable;\n" +
            "Yet, that the world may witness that my end\n" +
            "Was wrought by nature, not by vile offence,\n" +
            "I'll utter what my sorrow gives me leave.",
        page: "129"
    };

    private pas7_original: PassageOriginal = {
        id: 7,
        edition: this.e3_original,
        text: "[original] A doubtful warrant of immediate death,\n" +
            "Which though myself would gladly have embraced,\n" +
            "Yet the incessant weepings of my wife,\n" +
            "Weeping before for what she saw must come,\n" +
            "And piteous plainings of the pretty babes,\n" +
            "That mourned for fashion, ignorant what to fear,\n" +
            "Forced me to seek delays for them and me.",
        page: "205-207"
    };

    private b4: Book = {
        id: 4,
        internalID: "@000400",
        title: "Tamburlaine",
        authors: [this.a2],
        references: 1
    };

    private e4: Edition = {
        id: 4,
        book: this.b4,
        language: this.lang2,
        publicationInfo: "Tamburlaine, C. Marlowe, [not_original]",
        references: 0
    };

    private pas8: Passage = {
        id: 8,
        edition: this.e4,
        text: "I hold the Fates bound fast in iron chains,\n" +
            "And with my hand turn Fortune's wheel about;",
        page: "14"
    };

    private pas9: Passage = {
        id: 9,
        edition: this.e4,
        text: "Well, bark, ye dogs; I'll bridle all your tongues",
        page: "4"
    };

    private e4_original: EditionOriginal = {
        id: 4,
        book: this.b4,
        language: this.lang3,
        publicationInfo: "Tamburlaine, C. Marlowe, [original]"
    };

    private pas8_original: PassageOriginal = {
        id: 8,
        edition: this.e4_original,
        text: "[original] I hold the Fates bound fast in iron chains,\n" +
            "And with my hand turn Fortune's wheel about;",
        page: "14"
    };

    private pas9_original: PassageOriginal = {
        id: 9,
        edition: this.e4_original,
        text: "[original] Well, bark, ye dogs; I'll bridle all your tongues",
        page: "4"
    };

    private b5: Book = {
        id: 5,
        internalID: "@000500",
        title: "Of Two Evils Choose the Least",
        authors: [this.a12, this.a19],
        references: 1
    };

    private b6: Book = {
        id: 6,
        internalID: "@000600",
        title: "The Cruel Brother",
        authors: [this.a10],
        references: 1
    };

    private b7: Book = {
        id: 7,
        internalID: "@000700",
        title: " The Art of Reason",
        authors: [this.a22],
        references: 1
    };

    private b8: Book = {
        id: 8,
        internalID: "@000800",
        title: "Five Hundred Points of Good Husbandry",
        authors: [this.a6, this.a9],
        references: 1
    };

    private b9: Book = {
        id: 9,
        internalID: "@000900",
        title: "Treatise of God's Effectual Calling",
        authors: [this.a20],
        references: 1
    };

    private b10: Book = {
        id: 10,
        internalID: "@001000",
        title: "The Jews' Tragedy",
        authors: [this.a22],
        references: 1
    };

    private v1: Venue = {
        id: 1,
        name: "Blackfriars",
        city: "London",
        references: 123
    };

    private v2: Venue = {
        id: 2,
        name: "The Theatre",
        city: "London",
        references: 21
    };

    private v3: Venue = {
        id: 3,
        name: "Cockpit",
        city: "London",
        references: 23
    };

    private v4: Venue = {
        id: 4,
        name: "The Curtain",
        city: "London",
        references: 7
    };

    private v5: Venue = {
        id: 5,
        name: "Whitefriars",
        city: "London",
        references: 0
    };

    private v6: Venue = {
        id: 6,
        name: "Red Bull",
        city: "London",
        references: 3
    };

    private v7: Venue = {
        id: 7,
        name: "Then Rose",
        city: "London",
        references: 0
    };

    private o1: Organisation = {
        id: 1,
        name: "King's Men",
        references: 17
    };

    private o2: Organisation = {
        id: 2,
        name: "Lord Chamberlain's (Lord Hunsdon's) Men",
        references: 4
    };

    private o3: Organisation = {
        id: 3,
        name: "Children of the Chapel Royal",
        references: 9
    };

    private o4: Organisation = {
        id: 4,
        name: "Worcester's Men",
        references: 0
    };

    private o5: Organisation = {
        id: 5,
        name: "Derby's Men",
        references: 7
    };

    private o6: Organisation = {
        id: 6,
        name: "Oxford's Men",
        references: 22
    };

    private o7: Organisation = {
        id: 7,
        name: "Pembroke's Men",
        references: 18
    };

    private s1: Subject = {
        id: 1,
        name: "Art, architecture, music",
        references: 0
    };

    private s2: Subject = {
        id: 2,
        name: "History, (auto-)biography",
        references: 0
    };

    private s3: Subject = {
        id: 3,
        name: "Literary and Cultural Studies",
        references: 0
    };

    private s4: Subject = {
        id: 4,
        name: "Linguistics",
        references: 0
    };

    private s5: Subject = {
        id: 5,
        name: "Politics, law, economics",
        references: 0
    };

    // List of resources
    private readonly bookList: Book[];
    private readonly authorList: Author[];
    private readonly editionList: Edition[];
    private readonly editionOriginalList: EditionOriginal[];
    private readonly passageList: Passage[];
    private readonly passageOriginalList: PassageOriginal[];
    private readonly languageList: Language[];
    private readonly venueList: Venue[];
    private readonly organisationList: Organisation[];
    private readonly subjectList: Subject[];

    // Converts list to objects with id as keys
    private readonly objBooks: any = {};
    private readonly objAuthors: any = {};
    private readonly objEditions: any = {};
    private readonly objEditionOriginals: any = {};
    private readonly objPassages: any = {};
    private readonly objPassagesOriginal: any = {};
    private readonly objLanguages: any = {};
    private readonly objVenues: any = {};
    private readonly objOrganisation: any = {};
    private readonly objSubjects: any = {};

    constructor() {
        this.bookList = [this.b1, this.b2, this.b3, this.b4, this.b5, this.b6, this.b7, this.b8, this.b9, this.b10];
        this.objBooks = this.bookList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        this.authorList = [
            this.a1, this.a2, this.a3, this.a4, this.a5, this.a6,
            this.a7, this.a8, this.a9, this.a10, this.a11, this.a12,
            this.a13, this.a14, this.a15, this.a16, this.a17, this.a18,
            this.a19, this.a20, this.a21, this.a22, this.a23, this.a24
        ];
        this.objAuthors = this.authorList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        this.editionList = [this.e1, this.e2, this.e3, this.e4];
        this.objEditions = this.editionList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        this.passageList = [this.pas1, this.pas2, this.pas3, this.pas4, this.pas5, this.pas6, this.pas7, this.pas8, this.pas9];
        this.objPassages = this.passageList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        this.editionOriginalList = [this.e1_original, this.e2_original, this.e3_original, this.e4_original];
        this.objEditionOriginals = this.editionOriginalList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        this.passageOriginalList = [this.pas1_original, this.pas2_original, this.pas3_original, this.pas4_original, this.pas5_original, this.pas6_original, this.pas7_original, this.pas8_original, this.pas9_original];
        this.objPassagesOriginal = this.passageOriginalList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});

        this.languageList = [this.lang1, this.lang2, this.lang3, this.lang4, this.lang5];
        this.objLanguages = this.languageList.reduce((acc, cur) =>  {
            acc[cur.id] = cur;
            return acc;
        }, {});

        this.venueList = [this.v1, this.v2, this.v3, this.v4, this.v5, this.v6, this.v7];
        this.objVenues = this.venueList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        });

        this.organisationList = [this.o1, this.o2, this.o3, this.o4, this.o5, this.o6, this.o7];
        this.objOrganisation = this.venueList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        });

        this.subjectList = [this.s1, this.s2, this.s3, this.s4, this.s5];
        this.objSubjects = this.subjectList.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        });
    }

    getBook(iri: number) {
        return this.objBooks[iri] ? this.objBooks[iri] : {};
    }

    getBooks() {
        return this.bookList;
    }

    getAuthor(iri: number) {
        return this.objAuthors[iri] ? this.objAuthors[iri] : {};
    }

    getAuthors() {
        return this.authorList;
    }

    getEdition(iri: number) {
        return this.objEditions[iri] ? this.objEditions[iri] : {};
    }

    getEditions() {
        return this.editionList;
    }

    getPassage(iri: number) {
        return this.objPassages[iri] ? this.objPassages[iri] : {};
    }

    getPassages() {
        return this.passageList;
    }

    getEditionOriginal(iri: number) {
        return this.objEditionOriginals[iri] ? this.objEditionOriginals[iri] : {};
    }

    getEditionsOriginal() {
        return this.editionOriginalList;
    }

    getPassageOriginal(iri: number) {
        return this.objPassagesOriginal[iri] ? this.objPassagesOriginal[iri] : {};
    }

    getPassagesOriginal() {
        return this.passageOriginalList;
    }

    getLanguage(iri: number) {
        return this.objLanguages[iri] ? this.objLanguages[iri] : {};
    }

    getLanguages() {
        return this.languageList;
    }

    getVenue(iri: number) {
        return this.objVenues[iri] ? this.objVenues[iri] : {};
    }

    getVenues() {
        return this.venueList;
    }

    getOrganisation(iri: number) {
        return this.objOrganisation[iri] ? this.objOrganisation[iri] : {};
    }

    getOrganisations() {
        return this.organisationList;
    }

    getSubject(iri: number) {
        return this.objSubjects[iri] ? this.objSubjects[iri] : {};
    }

    getSubjects() {
        return this.subjectList;
    }

    getGenres() {
        const genres = [{
            id: 1,
            name: "Fiction",
            references: 0,
            lists: [{
                id: 1,
                name: "Prose",
                references: 0,
                lists: [
                    {
                        id: 9,
                        name: "Crime Fiction",
                        references: 0,
                        lists: []
                    }, {
                        id: 4,
                        name: "Gothic",
                        references: 2,
                        lists: []
                    }
                ]
            }]
        }, {
            id: 2,
            name: "Non-Fiction",
            references: 0,
            lists: [
                {
                    id: 3,
                    name: "Journalism",
                    references: 0,
                    lists: []
                }, {
                    id: 4,
                    name: "Academic",
                    references: 0,
                    lists: []
                }
            ]
        }
        ];

        return genres;
    }
}
