import {Injectable} from "@angular/core";
import {
    Author,
    Book,
    Contributor, FormalClass, FunctionVoice,
    Gender, Genre, Image,
    Language,
    Lexia, Marking,
    Organisation,
    Passage,
    ResearchField, Status,
    Subject,
    Venue,
    WordWebObject
} from "../model/model";

@Injectable({
    providedIn: "root"
})
export class BackendDataService {
    private gen1: Gender = {
        id: 1,
        name: "male",
        order: 0,
        references: 22,
        internalComment: ""
    };

    private gen2: Gender = {
        id: 2,
        name: "female",
        order: 0,
        references: 2,
        internalComment: ""
    };

    private sta1: Status = {
        id: 1,
        name: "unedited",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private sta2: Status = {
        id: 2,
        name: "check",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private sta3: Status = {
        id: 3,
        name: "weak",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private sta4: Status = {
        id: 4,
        name: "plausible",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma45: Marking = {
        id: 45,
        name: "Author pending",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma44: Marking = {
        id: 44,
        name: "Author wrong",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma43: Marking = {
        id: 43,
        name: "Author anonymous",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma42: Marking = {
        id: 42,
        name: "Author by context",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma41: Marking = {
        id: 41,
        name: "Author anonymous",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma40: Marking = {
        id: 40,
        name: "Author by context",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma39: Marking = {
        id: 39,
        name: "Author epithet",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma38: Marking = {
        id: 38,
        name: "Author name",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma37: Marking = {
        id: 37,
        name: "Author unmarked",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma36: Marking = {
        id: 36,
        name: "Work bibligraphical detail",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma35: Marking = {
        id: 35,
        name: "Work pending",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma34: Marking = {
        id: 34,
        name: "Work genre or epithet",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma33: Marking = {
        id: 33,
        name: "Work title wrong",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma32: Marking = {
        id: 32,
        name: "Work by context",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma31: Marking = {
        id: 31,
        name: "Work secondary character in Hamlet",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma30: Marking = {
        id: 30,
        name: "Work character by epithet",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma29: Marking = {
        id: 29,
        name: "Work by character",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma28: Marking = {
        id: 28,
        name: "Work title",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma27: Marking = {
        id: 27,
        name: "Work unmarked",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma26: Marking = {
        id: 26,
        name: "Prose-Poetry switch",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma25: Marking = {
        id: 25,
        name: "Anomaly other",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma24: Marking = {
        id: 24,
        name: "Grammar",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma23: Marking = {
        id: 23,
        name: "Nominalisation",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma22: Marking = {
        id: 22,
        name: "Language switch",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma21: Marking = {
        id: 21,
        name: "Archaism",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma20: Marking = {
        id: 20,
        name: "Italics",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma19: Marking = {
        id: 19,
        name: "Typography other",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma18: Marking = {
        id: 18,
        name: "Set off",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma17: Marking = {
        id: 17,
        name: "Quotation marks",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma16: Marking = {
        id: 16,
        name: "like or as",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma15: Marking = {
        id: 15,
        name: "Verbal pending",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma14: Marking = {
        id: 14,
        name: "Verbal other",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma13: Marking = {
        id: 13,
        name: "Metalinguistic noun",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma12: Marking = {
        id: 12,
        name: "Other verb",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma11: Marking = {
        id: 11,
        name: "Verb to say",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma10: Marking = {
        id: 10,
        name: "NAME",
        nodes: [
            this.ma27.id, this.ma28.id, this.ma29.id, this.ma30.id, this.ma31.id, this.ma32.id, this.ma33.id,
            this.ma34.id, this.ma35.id, this.ma36.id, this.ma37.id, this.ma38.id, this.ma39.id, this.ma40.id,
            this.ma41.id, this.ma42.id, this.ma43.id, this.ma44.id, this.ma45.id
        ],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma9: Marking = {
        id: 9,
        name: "MARKING PENDING",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma8: Marking = {
        id: 8,
        name: "MARKING BY CONTEXT",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma7: Marking = {
        id: 7,
        name: "MARKING BY GENRE",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma6: Marking = {
        id: 6,
        name: "MARKING BY NAME",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma5: Marking = {
        id: 5,
        name: "ANOMALY",
        nodes: [this.ma21.id, this.ma22.id, this.ma23.id, this.ma24.id, this.ma25.id, this.ma26.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma4: Marking = {
        id: 4,
        name: "TYPOGRAPHY",
        nodes: [this.ma17.id, this.ma18.id, this.ma19.id, this.ma20.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma3: Marking = {
        id: 3,
        name: "MARKING VERBAL",
        nodes: [this.ma11.id, this.ma12.id, this.ma13.id, this.ma14.id, this.ma15.id, this.ma16.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma2: Marking = {
        id: 2,
        name: "Marked",
        nodes: [this.ma3.id, this.ma4.id, this.ma5.id, this.ma6.id, this.ma7.id, this.ma8.id, this.ma8.id, this.ma9.id, this.ma10.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma1: Marking = {
        id: 1,
        name: "Unmarked",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private ma0: Marking = {
        id: 0,
        name: "root",
        nodes: [this.ma1.id, this.ma2.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu13: FunctionVoice = {
        id: 13,
        name: "Fictional letter or diary",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu12: FunctionVoice = {
        id: 12,
        name: "1st-person narrator",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu11: FunctionVoice = {
        id: 11,
        name: "Interior monologue",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu10: FunctionVoice = {
        id: 10,
        name: "Dialogue",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu9: FunctionVoice = {
        id: 9,
        name: "Narrator",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu8: FunctionVoice = {
        id: 8,
        name: "STAGE DIRECTION",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu7: FunctionVoice = {
        id: 7,
        name: "FOOTNOTE OR OTHER",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu6: FunctionVoice = {
        id: 6,
        name: "COMPLETE TEXT",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu5: FunctionVoice = {
        id: 5,
        name: "ANTHOLOGY ENTRY",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu4: FunctionVoice = {
        id: 4,
        name: "EPIGRAPH",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu3: FunctionVoice = {
        id: 3,
        name: "BODY OF TEXT",
        nodes: [
            this.fu9.id, this.fu10.id, this.fu11.id, this.fu12.id, this.fu13.id
        ],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu2: FunctionVoice = {
        id: 2,
        name: "TITLE",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu1: FunctionVoice = {
        id: 1,
        name: "CHARACTERNAME",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private fu0: FunctionVoice = {
        id: 0,
        name: "root",
        nodes: [this.fu1.id, this.fu2.id, this.fu3.id, this.fu4.id, this.fu5.id, this.fu6.id, this.fu7.id, this.fu8.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for25: FormalClass = {
        id: 25,
        name: "Blot cluster",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for24: FormalClass = {
        id: 24,
        name: "Pillow cluster",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for23: FormalClass = {
        id: 23,
        name: "Dog cluster",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for22: FormalClass = {
        id: 22,
        name: "Tiger cluster",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for21: FormalClass = {
        id: 21,
        name: "Scene",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for20: FormalClass = {
        id: 20,
        name: "Complete plot",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for19: FormalClass = {
        id: 19,
        name: "Visual motif",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for18: FormalClass = {
        id: 18,
        name: "Plot element",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for17: FormalClass = {
        id: 17,
        name: "Idea",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for16: FormalClass = {
        id: 16,
        name: "Booktitle",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for15: FormalClass = {
        id: 15,
        name: "Venue or place",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for14: FormalClass = {
        id: 14,
        name: "Charactername",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for13: FormalClass = {
        id: 13,
        name: "Real person",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for12: FormalClass = {
        id: 12,
        name: "Motif with name",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for11: FormalClass = {
        id: 11,
        name: "Setpiece (complete text)",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for10: FormalClass = {
        id: 10,
        name: "Snowclone",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for9: FormalClass = {
        id: 9,
        name: "Keywords",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for8: FormalClass = {
        id: 8,
        name: "Passage (longer)",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for7: FormalClass = {
        id: 7,
        name: "Phrase (two words to two lines)",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for6: FormalClass = {
        id: 6,
        name: "word",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for5: FormalClass = {
        id: 5,
        name: "Cluster",
        nodes: [this.for22.id, this.for23.id, this.for24.id, this.for25.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for4: FormalClass = {
        id: 4,
        name: "Summarised",
        nodes: [this.for17.id, this.for18.id, this.for19.id, this.for20.id, this.for21.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for3: FormalClass = {
        id: 3,
        name: "Name",
        nodes: [this.for12.id, this.for13.id, this.for14.id, this.for15.id, this.for16.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for2: FormalClass = {
        id: 2,
        name: "Verbal",
        nodes: [this.for9.id, this.for10.id, this.for11.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for1: FormalClass = {
        id: 1,
        name: "Wörtlich",
        nodes: [this.for6.id, this.for7.id, this.for8.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private for0: FormalClass = {
        id: 0,
        name: "root",
        nodes: [this.for1.id, this.for2.id, this.for3.id, this.for4.id, this.for5.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre3: Genre = {
        id: 3,
        name: "Prose unspecified",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre4: Genre = {
        id: 4,
        name: "Crime fiction",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre5: Genre = {
        id: 5,
        name: "Biographical or historicizing",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre6: Genre = {
        id: 6,
        name: "Gothic",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre7: Genre = {
        id: 7,
        name: "Science fiction or fantasy",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre8: Genre = {
        id: 8,
        name: "Romance",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre9: Genre = {
        id: 9,
        name: "Children's writing",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre10: Genre = {
        id: 10,
        name: "Joke or comic or other",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre12: Genre = {
        id: 12,
        name: "Poetry unspecified",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre13: Genre = {
        id: 13,
        name: "Song or ballad",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre14: Genre = {
        id: 14,
        name: "Epic and verse narrative",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre15: Genre = {
        id: 15,
        name: "Closet drama",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre16: Genre = {
        id: 16,
        name: "Verse satire",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre18: Genre = {
        id: 18,
        name: "Theatre",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre19: Genre = {
        id: 19,
        name: "Tragedy",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre20: Genre = {
        id: 20,
        name: "Comedy",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre21: Genre = {
        id: 21,
        name: "History",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre22: Genre = {
        id: 22,
        name: "Tragicomedy",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre23: Genre = {
        id: 23,
        name: "Romance (Drama)",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre24: Genre = {
        id: 24,
        name: "Tragedy or History",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre25: Genre = {
        id: 25,
        name: "Masque or other",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre26: Genre = {
        id: 26,
        name: "TV, film, radio, games",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre27: Genre = {
        id: 27,
        name: "Opera or musical theatre",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre29: Genre = {
        id: 29,
        name: "Journalism",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre30: Genre = {
        id: 30,
        name: "Academic",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre31: Genre = {
        id: 31,
        name: "Popular",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre32: Genre = {
        id: 32,
        name: "Anthology",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre33: Genre = {
        id: 33,
        name: "Diary",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre34: Genre = {
        id: 34,
        name: "Essay",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre35: Genre = {
        id: 35,
        name: "Letter",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre36: Genre = {
        id: 36,
        name: "Official document",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre37: Genre = {
        id: 37,
        name: "Preface or dedication",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre38: Genre = {
        id: 38,
        name: "Speech or lecture or sermon",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre39: Genre = {
        id: 39,
        name: "Bible or religious pamphlet",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre40: Genre = {
        id: 40,
        name: "Nonfiction unspecified",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre41: Genre = {
        id: 41,
        name: "Annotated edition",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre43: Genre = {
        id: 43,
        name: "Visual arts",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre44: Genre = {
        id: 44,
        name: "Instrumental music",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre45: Genre = {
        id: 45,
        name: "Dance and performance",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre46: Genre = {
        id: 46,
        name: "Cartoon",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre47: Genre = {
        id: 47,
        name: "Name or anagram or other",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre48: Genre = {
        id: 48,
        name: "Annotation",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre49: Genre = {
        id: 49,
        name: "Database",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre50: Genre = {
        id: 50,
        name: "Conversation",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre51: Genre = {
        id: 51,
        name: "Manuscript commonplace book",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre52: Genre = {
        id: 52,
        name: "Tweet or chat or post",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre53: Genre = {
        id: 53,
        name: "Advertisement",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre42: Genre = {
        id: 42,
        name: "Other genre",
        nodes: [
            this.genre43.id, this.genre44.id, this.genre45.id, this.genre46.id, this.genre47.id,
            this.genre48.id, this.genre49.id, this.genre50.id, this.genre51.id, this.genre52.id,
            this.genre53.id
        ],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre28: Genre = {
        id: 28,
        name: "Nonfiction",
        nodes: [
            this.genre29.id, this.genre30.id, this.genre31.id, this.genre32.id, this.genre33.id,
            this.genre34.id, this.genre35.id, this.genre36.id, this.genre37.id, this.genre38.id,
            this.genre39.id, this.genre40.id, this.genre41.id
        ],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre17: Genre = {
        id: 17,
        name: "Drama (Theatre)",
        nodes: [
            this.genre18.id, this.genre19.id, this.genre20.id, this.genre21.id, this.genre22.id,
            this.genre23.id, this.genre24.id, this.genre25.id
        ],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre11: Genre = {
        id: 11,
        name: "Poetry including songs",
        nodes: [this.genre12.id, this.genre13.id, this.genre14.id, this.genre15.id, this.genre16.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre2: Genre = {
        id: 2,
        name: "Prose",
        nodes: [
            this.genre3.id, this.genre4.id, this.genre5.id, this.genre6.id, this.genre7.id,
            this.genre8.id, this.genre9.id, this.genre10.id
        ],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre1: Genre = {
        id: 1,
        name: "Fiction",
        nodes: [this.genre2.id, this.genre11.id, this.genre17.id, this.genre26.id, this.genre27.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private genre0: Genre = {
        id: 0,
        name: "root",
        nodes: [this.genre1.id, this.genre28.id, this.genre42.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im57: Image = {
        id: 57,
        name: "varia",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im56: Image = {
        id: 56,
        name: "madness",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im55: Image = {
        id: 55,
        name: "jealousy",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im54: Image = {
        id: 54,
        name: "love",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im53: Image = {
        id: 53,
        name: "arm",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im52: Image = {
        id: 52,
        name: "back",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im51: Image = {
        id: 51,
        name: "blood",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im50: Image = {
        id: 50,
        name: "running",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im49: Image = {
        id: 49,
        name: "season",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im48: Image = {
        id: 48,
        name: "day",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im47: Image = {
        id: 47,
        name: "christian",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im46: Image = {
        id: 46,
        name: "pagan",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im45: Image = {
        id: 45,
        name: "Psychology",
        nodes: [this.im54.id, this.im55.id, this.im56.id, this.im57.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im44: Image = {
        id: 44,
        name: "Body",
        nodes: [this.im51.id, this.im52.id, this.im53.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im43: Image = {
        id: 43,
        name: "Time",
        nodes: [this.im48.id, this.im49.id, this.im50.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im42: Image = {
        id: 42,
        name: "Religion",
        nodes: [this.im46.id, this.im47.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im41: Image = {
        id: 41,
        name: "art",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im40: Image = {
        id: 40,
        name: "dance",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im39: Image = {
        id: 39,
        name: "music",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im38: Image = {
        id: 38,
        name: "theatre",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im37: Image = {
        id: 37,
        name: "debts",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im36: Image = {
        id: 36,
        name: "money",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im35: Image = {
        id: 35,
        name: "melancholy",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im34: Image = {
        id: 34,
        name: "plaster",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im33: Image = {
        id: 33,
        name: "bread",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im32: Image = {
        id: 32,
        name: "wine",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im31: Image = {
        id: 31,
        name: "furniture",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im30: Image = {
        id: 30,
        name: "tools",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im29: Image = {
        id: 29,
        name: "fashion",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im28: Image = {
        id: 28,
        name: "law",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im27: Image = {
        id: 27,
        name: "king",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im26: Image = {
        id: 26,
        name: "Leisure",
        nodes: [this.im38.id, this.im39.id, this.im40.id, this.im41.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im25: Image = {
        id: 25,
        name: "Economics",
        nodes: [this.im36.id, this.im37.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im24: Image = {
        id: 24,
        name: "Medicine",
        nodes: [this.im34.id, this.im35.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im23: Image = {
        id: 23,
        name: "Food",
        nodes: [this.im32.id, this.im33.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im22: Image = {
        id: 22,
        name: "Objects",
        nodes: [this.im29.id, this.im30.id, this.im31.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im21: Image = {
        id: 21,
        name: "Politics",
        nodes: [this.im27.id, this.im28.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im20: Image = {
        id: 20,
        name: "laurel",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im19: Image = {
        id: 19,
        name: "ivy",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im18: Image = {
        id: 18,
        name: "moon",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im17: Image = {
        id: 17,
        name: "sun",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im16: Image = {
        id: 16,
        name: "cloud",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im15: Image = {
        id: 15,
        name: "horse",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im14: Image = {
        id: 14,
        name: "lion",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im13: Image = {
        id: 13,
        name: "woodcock",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im12: Image = {
        id: 12,
        name: "crow",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im11: Image = {
        id: 11,
        name: "road",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im10: Image = {
        id: 10,
        name: "hill",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im9: Image = {
        id: 9,
        name: "mountain",
        nodes: [],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im8: Image = {
        id: 8,
        name: "Plants",
        nodes: [this.im19.id, this.im20.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im7: Image = {
        id: 7,
        name: "Weather",
        nodes: [this.im16.id, this.im17.id, this.im18.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im6: Image = {
        id: 6,
        name: "Mammals",
        nodes: [this.im14.id, this.im15.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im5: Image = {
        id: 5,
        name: "Birds",
        nodes: [this.im12.id, this.im13.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im4: Image = {
        id: 4,
        name: "Landscape",
        nodes: [this.im9.id, this.im10.id, this.im11.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im3: Image = {
        id: 3,
        name: "Other image",
        nodes: [this.im42.id, this.im43.id, this.im44.id, this.im45.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im2: Image = {
        id: 2,
        name: "Culture",
        nodes: [this.im21.id, this.im22.id, this.im23.id, this.im24.id, this.im25.id, this.im26.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im1: Image = {
        id: 1,
        name: "Nature",
        nodes: [this.im4.id, this.im5.id, this.im6.id, this.im7.id, this.im8.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private im0: Image = {
        id: 0,
        name: "root",
        nodes: [this.im1.id, this.im2.id, this.im3.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re1: ResearchField = {
        id: 1,
        name: "Reading",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re2: ResearchField = {
        id: 2,
        name: "Electronic search",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re3: ResearchField = {
        id: 3,
        name: "Secondary (Annotated edition)",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re4: ResearchField = {
        id: 4,
        name: "Secondary (Shakespeare Studies)",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re5: ResearchField = {
        id: 5,
        name: "Secondary (Literature)",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re6: ResearchField = {
        id: 6,
        name: "Secondary (Anthology)",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re7: ResearchField = {
        id: 7,
        name: "Secondary (Annotated Shakespeare edition)",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private re8: ResearchField = {
        id: 8,
        name: "Research pending",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private con1: Contributor = {
        id: 1,
        internalID: "&004001",
        firstName: "Regula",
        lastName: "Hohl",
        email: "r.hohl@unibas.ch",
        gender: "f",
        humanAsLexia: null,
        order: 0,
        references: 22,
        internalComment: ""
    };

    private con2: Contributor = {
        id: 2,
        internalID: "&004002",
        firstName: "Stefanie",
        lastName: "Heeg",
        email: "s.heeg@unibas.ch",
        gender: "f",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con3: Contributor = {
        id: 3,
        internalID: "&004003",
        firstName: "Elliot",
        lastName: "Reitzer",
        email: "elliot@yahoo.de",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con4: Contributor = {
        id: 4,
        internalID: "&004004",
        firstName: "Christian",
        lastName: "Gebhard",
        email: "christian.gebhard@stud.unibas.ch",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con5: Contributor = {
        id: 5,
        internalID: "&004005",
        firstName: "Christian",
        lastName: "Eichenberger",
        email: "christianmarkus.eichenberger@unifr.ch",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con6: Contributor = {
        id: 6,
        internalID: "&004006",
        firstName: "Ursula",
        lastName: "Caci",
        email: "ursula.caci@unibas.ch",
        gender: "f",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con7: Contributor = {
        id: 7,
        internalID: "&004007",
        firstName: "Mark",
        lastName: "Hunter",
        email: "hardguenni@gmx.de, hyperhamlet@boriskuehne.net",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con8: Contributor = {
        id: 8,
        internalID: "&004008",
        firstName: "Pauline",
        lastName: "Sallis",
        email: "pjsallis@yahoo.co.uk",
        gender: "f",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con9: Contributor = {
        id: 9,
        internalID: "&004009",
        firstName: "Sebastian",
        lastName: "Refardt",
        email: "sebastian.refardt@stud.unibas.ch",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 10,
        internalComment: ""
    };

    private con10: Contributor = {
        id: 10,
        internalID: "&004010",
        firstName: "Thierry",
        lastName: "Spampinato",
        email: "thierry.spampinato@unibas.ch",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private s1: Subject = {
        id: 1,
        name: "Art, architecture, music",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s2: Subject = {
        id: 2,
        name: "History, (auto-)biography",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s3: Subject = {
        id: 3,
        name: "Literature",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s4: Subject = {
        id: 4,
        name: "History, (auto-)biography",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s5: Subject = {
        id: 5,
        name: "Linguistics",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s6: Subject = {
        id: 6,
        name: "Politics, law, economics",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s7: Subject = {
        id: 7,
        name: "Linguistics",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s8: Subject = {
        id: 8,
        name: "Sciences, engineering, IT",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s9: Subject = {
        id: 9,
        name: "Philosophy, religion",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s10: Subject = {
        id: 10,
        name: "Sociology, society, lifestyle",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s11: Subject = {
        id: 11,
        name: "TO BE EDITED",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s12: Subject = {
        id: 12,
        name: "Psychology, medicine, health",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s13: Subject = {
        id: 13,
        name: "WOMAN WRITER",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s14: Subject = {
        id: 14,
        name: "Literature (Shakespeare)",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s15: Subject = {
        id: 15,
        name: "AFTER TRANSFER FIX BIBLIO OR GENRE",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s16: Subject = {
        id: 16,
        name: "EXHAUSTED",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s17: Subject = {
        id: 17,
        name: "RESEARCH PENDING",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s18: Subject = {
        id: 18,
        name: "MODERN PAGE",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s19: Subject = {
        id: 19,
        name: "HISTORICAL PAGE",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private s20: Subject = {
        id: 20,
        name: "ACHTUNG MARKING",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private lang1: Language = {
        id: 1,
        name: "Englisch",
        order: 0,
        references: 10,
        internalComment: ""
    };

    private lang2: Language = {
        id: 2,
        name: "Deutsch",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lang3: Language = {
        id: 3,
        name: "Französisch",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private lang4: Language = {
        id: 4,
        name: "Italienisch",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private lang5: Language = {
        id: 5,
        name: "Spanisch",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private v1: Venue = {
        id: 1,
        internalID: "#008001",
        name: "Blackfriars",
        place: "London",
        venueAsLexia: null,
        order: 0,
        references: 123,
        internalComment: ""
    };

    private v2: Venue = {
        id: 2,
        internalID: "#008002",
        name: "The Theatre",
        place: "London",
        venueAsLexia: null,
        order: 0,
        references: 21,
        internalComment: ""
    };

    private v3: Venue = {
        id: 3,
        internalID: "#008003",
        name: "Cockpit",
        place: "London",
        venueAsLexia: null,
        order: 0,
        references: 23,
        internalComment: ""
    };

    private v4: Venue = {
        id: 4,
        internalID: "#008004",
        name: "The Curtain",
        place: "London",
        venueAsLexia: null,
        order: 0,
        references: 7,
        internalComment: ""
    };

    private v5: Venue = {
        id: 5,
        internalID: "#008005",
        name: "Whitefriars",
        place: "London",
        venueAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private v6: Venue = {
        id: 6,
        internalID: "#008006",
        name: "Red Bull",
        place: "London",
        venueAsLexia: null,
        order: 0,
        references: 3,
        internalComment: ""
    };

    private v7: Venue = {
        id: 7,
        internalID: "#008007",
        name: "Then Rose",
        place: "London",
        venueAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private v8: Venue = {
        id: 8,
        internalID: "#008008",
        name: "Ludlow Castle",
        place: "Shropshire",
        venueAsLexia: null,
        order: 0,
        references: 3,
        internalComment: ""
    };

    private org1: Organisation = {
        id: 1,
        internalID: "#009001",
        name: "King's Men",
        organisationAsLexia: null,
        order: 0,
        references: 17,
        internalComment: ""
    };

    private org2: Organisation = {
        id: 2,
        internalID: "#009002",
        name: "Lord Chamberlain's (Lord Hunsdon's) Men",
        organisationAsLexia: null,
        order: 0,
        references: 4,
        internalComment: ""
    };

    private org3: Organisation = {
        id: 3,
        internalID: "#009003",
        name: "Children of the Chapel Royal",
        organisationAsLexia: null,
        order: 0,
        references: 9,
        internalComment: ""
    };

    private org4: Organisation = {
        id: 4,
        internalID: "#009004",
        name: "Worcester's Men",
        organisationAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private org5: Organisation = {
        id: 5,
        internalID: "#009005",
        name: "Derby's Men",
        organisationAsLexia: null,
        order: 0,
        references: 7,
        internalComment: ""
    };

    private org6: Organisation = {
        id: 6,
        internalID: "#009006",
        name: "Oxford's Men",
        organisationAsLexia: null,
        order: 0,
        references: 22,
        internalComment: ""
    };

    private org7: Organisation = {
        id: 7,
        internalID: "#009007",
        name: "Pembroke's Men",
        organisationAsLexia: null,
        order: 0,
        references: 18,
        internalComment: ""
    };

    private lex1: Lexia = {
        id: 1,
        internalID: "#002007",
        name: "moist hand indicating arousal",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex2: Lexia = {
        id: 2,
        internalID: "#002082",
        name: "I have lived too long",
        order: 0,
        references: 1,
        internalComment: ""

    };

    private lex3: Lexia = {
        id: 3,
        internalID: "#000787",
        name: "devil haunting in the likeness of sb",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex4: Lexia = {
        id: 4,
        internalID: "#001082",
        name: "IMAGE - music as perfect harmony",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex5: Lexia = {
        id: 5,
        internalID: "#000007",
        name: "pampered jades",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex6: Lexia = {
        id: 6,
        internalID: "#001000",
        name: "brain of a cat",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex7: Lexia = {
        id: 7,
        internalID: "#002084",
        name: "IMAGE - walled in with something beautiful",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex8: Lexia = {
        id: 8,
        internalID: "#002013",
        name: "IMAGE - woman is like a jewel hanging in (Ethiop's) ear",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex9: Lexia = {
        id: 9,
        internalID: "#002067",
        name: "great person's revenue on back",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex10: Lexia = {
        id: 10,
        internalID: "#000064",
        name: "IMAGE - sea can't wash bloody hands",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex11: Lexia = {
        id: 11,
        internalID: "#002077",
        name: "no other proof",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex12: Lexia = {
        id: 12,
        internalID: "#000792",
        name: "give out my Anne is sick",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex13: Lexia = {
        id: 13,
        internalID: "#002046",
        name: "cannot brook these",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex14: Lexia = {
        id: 14,
        internalID: "#001016",
        name: "cannot abide gaping pig",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex15: Lexia = {
        id: 15,
        internalID: "#000116",
        name: "prophetic soul",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex16: Lexia = {
        id: 16,
        internalID: "#000766",
        name: "adulterate beast",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex17: Lexia = {
        id: 17,
        internalID: "#000335",
        name: "Hic et ubique - here, there and everywhere",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex18: Lexia = {
        id: 18,
        internalID: "#005005",
        name: "SETPIECE - To be or not to be",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex19: Lexia = {
        id: 19,
        internalID: "#000292",
        name: "oh what a falling off",
        order: 0,
        references: 1,
        internalComment: ""
    };

    private lex20: Lexia = {
        id: 20,
        internalID: "#001124",
        name: "William Shakespeare",
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a1: Author = {
        id: 1,
        internalID: "&000001",
        firstName: "William",
        lastName: "Shakespeare",
        description: "English Dramatist",
        birthStartDate: "1564",
        birthEndDate: "1564",
        deathStartDate: "1616",
        deathEndDate: "1616",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: this.lex20.id,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a2: Author = {
        id: 2,
        internalID: "&000002",
        firstName: "Christopher",
        lastName: "Marlowe",
        description: "English playwright and poet",
        birthStartDate: "1564",
        birthEndDate: "1564",
        deathStartDate: "1593",
        deathEndDate: "1593",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private a3: Author = {
        id: 3,
        internalID: "&000003",
        firstName: "Rosina Doyle",
        lastName: "Bulwer-Lytton",
        description: "English novelist",
        birthStartDate: "1802",
        birthEndDate: "1802",
        deathStartDate: "1882",
        deathEndDate: "1882",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 3,
        internalComment: ""
    };

    private a4: Author = {
        id: 4,
        internalID: "&000004",
        firstName: "Samuel Taylor",
        lastName: "Coleridge",
        description: "English poet",
        birthStartDate: "1772",
        birthEndDate: "1772",
        deathStartDate: "1834",
        deathEndDate: "1834",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a5: Author = {
        id: 5,
        internalID: "&000005",
        firstName: "William",
        lastName: "Barksted",
        description: "English poet and dramatist",
        birthStartDate: "",
        birthEndDate: "",
        deathStartDate: "",
        deathEndDate: "",
        flStartDate: "1611",
        flEndDate: "1611",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a6: Author = {
        id: 6,
        internalID: "&000006",
        firstName: "George",
        lastName: "Chapman",
        description: "English poet, dramatist and Homer translator",
        birthStartDate: "1557",
        birthEndDate: "1561",
        deathStartDate: "1634",
        deathEndDate: "1634",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a7: Author = {
        id: 7,
        internalID: "&000007",
        firstName: "Marcus Tullius",
        lastName: "Cicero",
        description: "Roman politician, orator and philosopher",
        birthStartDate: "-106",
        birthEndDate: "-106",
        deathStartDate: "43",
        deathEndDate: "43",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a8: Author = {
        id: 8,
        internalID: "&000008",
        firstName: "John Byrne Leicester Warren, Baron de",
        lastName: "Cotgrave",
        description: "English anthologist",
        birthStartDate: "1610",
        birthEndDate: "1612",
        deathStartDate: "1654",
        deathEndDate: "1656",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 24,
        internalComment: ""
    };

    private a9: Author = {
        id: 9,
        internalID: "&000009",
        firstName: "Sir William",
        lastName: "D'Avenant",
        description: "English dramatist",
        birthStartDate: "1606",
        birthEndDate: "1606",
        deathStartDate: "1668",
        deathEndDate: "1668",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a10: Author = {
        id: 10,
        internalID: "&000010",
        firstName: "Charles",
        lastName: "Dickens",
        description: "English novelist",
        birthStartDate: "1812",
        birthEndDate: "1812",
        deathStartDate: "1870",
        deathEndDate: "1870",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private a11: Author = {
        id: 11,
        internalID: "&000011",
        firstName: "Maria",
        lastName: "Edgeworth",
        description: "Anglo-Irish dramatist and novelist",
        birthStartDate: "1767",
        birthEndDate: "1767",
        deathStartDate: "1849",
        deathEndDate: "1849",
        flStartDate: "",
        flEndDate: "",
        gender: "f",
        humanAsLexia: null,
        order: 0,
        references: 12,
        internalComment: ""
    };

    private a12: Author = {
        id: 12,
        internalID: "&000012",
        firstName: "David",
        lastName: "Garrick",
        description: "English actor",
        birthStartDate: "1717",
        birthEndDate: "1717",
        deathStartDate: "1779",
        deathEndDate: "1779",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 6,
        internalComment: ""
    };

    private a13: Author = {
        id: 13,
        internalID: "&000013",
        firstName: "Elizabeth",
        lastName: "George",
        description: "U.S. crime writer, pen-name for Susan Elizabeth George",
        birthStartDate: "1949",
        birthEndDate: "1949",
        deathStartDate: "",
        deathEndDate: "",
        flStartDate: "",
        flEndDate: "",
        gender: "f",
        humanAsLexia: null,
        order: 0,
        references: 35,
        internalComment: ""
    };

    private a14: Author = {
        id: 14,
        internalID: "&000014",
        firstName: "Johann Wolfgang von",
        lastName: "Goethe",
        description: "German poet and dramatist",
        birthStartDate: "1748",
        birthEndDate: "1748",
        deathStartDate: "1832",
        deathEndDate: "1832",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 21,
        internalComment: ""
    };

    private a15: Author = {
        id: 15,
        internalID: "&000015",
        firstName: "Robert",
        lastName: "Gott",
        description: "Australian cartoonist children's and crime writer",
        birthStartDate: "1957",
        birthEndDate: "1957",
        deathStartDate: "",
        deathEndDate: "",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 18,
        internalComment: ""
    };

    private a16: Author = {
        id: 16,
        internalID: "&000016",
        firstName: "Paul",
        lastName: "Green",
        description: "U.S. dramatist",
        birthStartDate: "1894",
        birthEndDate: "1894",
        deathStartDate: "1981",
        deathEndDate: "1981",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 11,
        internalComment: ""
    };

    private a17: Author = {
        id: 17,
        internalID: "&000017",
        firstName: "Martha",
        lastName: "Grimes",
        description: "U.S. crime writer",
        birthStartDate: "1931",
        birthEndDate: "1931",
        deathStartDate: "",
        deathEndDate: "",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 16,
        internalComment: ""
    };

    private a18: Author = {
        id: 18,
        internalID: "&000018",
        firstName: "Thomas",
        lastName: "Hardy",
        description: "English novelist and poet",
        birthStartDate: "1840",
        birthEndDate: "1840",
        deathStartDate: "1928",
        deathEndDate: "1928",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 38,
        internalComment: ""
    };

    private a19: Author = {
        id: 19,
        internalID: "&000019",
        firstName: "Gerhart",
        lastName: "Hauptmann",
        description: "German dramatist and novelist",
        birthStartDate: "1862",
        birthEndDate: "1862",
        deathStartDate: "1942",
        deathEndDate: "1942",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 9,
        internalComment: ""
    };

    private a20: Author = {
        id: 20,
        internalID: "&000020",
        firstName: "William",
        lastName: "Hazlitt",
        description: "English critic and essayist",
        birthStartDate: "1778",
        birthEndDate: "1778",
        deathStartDate: "1830",
        deathEndDate: "1830",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 340,
        internalComment: ""
    };

    private a21: Author = {
        id: 21,
        internalID: "&000021",
        firstName: "Lewis C.",
        lastName: "Henry",
        description: "U.S. (?) anthologist, real name Lewis Copeland",
        birthStartDate: "",
        birthEndDate: "",
        deathStartDate: "",
        deathEndDate: "",
        flStartDate: "1661",
        flEndDate: "1661",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 33,
        internalComment: ""
    };

    private a22: Author = {
        id: 22,
        internalID: "&000022",
        firstName: "Aaron",
        lastName: "Hill",
        description: "British novelist and poet",
        birthStartDate: "1685",
        birthEndDate: "1687",
        deathStartDate: "1750",
        deathEndDate: "1750",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 0,
        references: 15,
        internalComment: ""
    };

    private a23: Author = {
        id: 23,
        internalID: "&000023",
        firstName: "Vladimír",
        lastName: "Holan",
        description: "Czech poet",
        birthStartDate: "1905",
        birthEndDate: "1905",
        deathStartDate: "1980",
        deathEndDate: "1980",
        flStartDate: "",
        flEndDate: "",
        gender: "m",
        humanAsLexia: null,
        order: 9,
        references: 1,
        internalComment: ""
    };

    private a24: Author = {
        id: 24,
        internalID: "&000024",
        firstName: "Zora Neale",
        lastName: "Hurston",
        description: "U.S. novelist",
        birthStartDate: "1891",
        birthEndDate: "1891",
        deathStartDate: "1960",
        deathEndDate: "1960",
        flStartDate: "",
        flEndDate: "",
        gender: "f",
        humanAsLexia: null,
        order: 5,
        references: 2,
        internalComment: ""
    };

    private b1: Book = {
        id: 1,
        internalID: "@000100",
        title: "Romeo and Juliet",
        createdStartDate: "1900",
        createdEndDate: "1900",
        publishedStartDate: "1900",
        publishedEndDate: "1902",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a1.id, this.a8.id, this.a3.id],
        venues: [this.v1.id],
        organisations: [this.org3.id],
        edition: "Shakespeare, William.  Romeo and Juliet.",
        editionHist: "Shakespeare, William.  Romeo and Juliet.",
        language: this.lang1.id,
        subjects: [this.s2.id],
        bookAsLexia: null,
        order: 0,
        references: 0,
        internalComment: ""
    };

    private pas1: Passage = {
        id: 1,
        book: this.b1.id,
        text: "thus with a kiss I die",
        textHist: "[or] thus with a kiss I die",
        page: "2",
        pageHist: "2",
        mentionedIn: [],
        wasContributedBy: this.con1.id,
        lexias: [this.lex1.id, this.lex3.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private pas2: Passage = {
        id: 2,
        book: this.b1.id,
        text: "My bounty is as boundless as the sea,\n" +
            "My love as deep; the more I give to thee,\n" +
            "The more I have, for both are infinite.",
        textHist: "[or] My bounty is as boundless as the sea,\n" +
            "My love as deep; the more I give to thee,\n" +
            "The more I have, for both are infinite.",
        page: "101-102",
        pageHist: "101-102",
        mentionedIn: [],
        wasContributedBy: this.con8.id,
        lexias: [this.lex5.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private b2: Book = {
        id: 2,
        internalID: "@000200",
        title: "Hamlet",
        createdStartDate: "1805",
        createdEndDate: "1805",
        publishedStartDate: "1900",
        publishedEndDate: "1900",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a1.id, this.a10.id],
        venues: [this.v3.id],
        organisations: [this.v1.id],
        edition: "Shakespeare, William.  Hamlet.",
        editionHist: "Shakespeare, William.  Hamlet.",
        language: this.lang1.id,
        subjects: [this.s5.id],
        bookAsLexia: null,
        order: 0,
        references: 2,
        internalComment: ""
    };

    private pas3: Passage = {
        id: 3,
        book: this.b2.id,
        text: "What a piece of work is a man! How noble in reason! how infinite in faculty! " +
            "in form, in moving, how express and admirable! in action how like an angel! " +
            "in apprehension how like a god! the beauty of the world! the paragon of animals! " +
            "And yet, to me, what is this quintessence of dust?",
        textHist: "[or] What a piece of work is a man! How noble in reason! how infinite in faculty! " +
            "in form, in moving, how express and admirable! in action how like an angel! " +
            "in apprehension how like a god! the beauty of the world! the paragon of animals! " +
            "And yet, to me, what is this quintessence of dust?",
        page: "43-45",
        pageHist: "43-45",
        mentionedIn: [],
        wasContributedBy: this.con3.id,
        lexias: [this.lex7.id, this.lex2.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private pas4: Passage = {
        id: 4,
        book: this.b2.id,
        text: "Though this be madness, yet there is method in't.",
        page: "90",
        textHist: "[or] Though this be madness, yet there is method in't.",
        pageHist: "90",
        mentionedIn: [],
        wasContributedBy: this.con1.id,
        lexias: [this.lex1.id, this.lex3.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private pas5: Passage = {
        id: 5,
        book: this.b2.id,
        text: "Lord Polonius: What do you read, my lord? \n" +
            "Hamlet: Words, words, words. \n" +
            "Lord Polonius: What is the matter, my lord? \n" +
            "Hamlet: Between who? \n" +
            "Lord Polonius: I mean, the matter that you read, my lord.",
        textHist: "[or] Lord Polonius: What do you read, my lord? \n" +
            "Hamlet: Words, words, words. \n" +
            "Lord Polonius: What is the matter, my lord? \n" +
            "Hamlet: Between who? \n" +
            "Lord Polonius: I mean, the matter that you read, my lord.",
        page: "87-92",
        pageHist: "87-92",
        mentionedIn: [],
        wasContributedBy: this.con3.id,
        lexias: [this.lex7.id, this.lex8.id, this.lex4.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private b3: Book = {
        id: 3,
        internalID: "@000300",
        title: "The Comedy of Errors",
        createdStartDate: "1899",
        createdEndDate: "1899",
        publishedStartDate: "1900",
        publishedEndDate: "1900",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a1.id],
        venues: [this.v6.id],
        organisations: [this.org5.id],
        edition: "The Comedy of Errors, W. Shakespeare, [not_or]",
        editionHist: "The Comedy of Errors, W. Shakespeare, [or]",
        language: this.lang4.id,
        subjects: [this.s5.id, this.s1.id],
        bookAsLexia: null,
        order: 0,
        references: 6,
        internalComment: ""
    };

    private pas6: Passage = {
        id: 6,
        book: this.b3.id,
        text: "A heavier task could not have been imposed\n" +
            "Than I to speak my griefs unspeakable;\n" +
            "Yet, that the world may witness that my end\n" +
            "Was wrought by nature, not by vile offence,\n" +
            "I'll utter what my sorrow gives me leave.",
        page: "129",
        textHist: "[or] A heavier task could not have been imposed\n" +
            "Than I to speak my griefs unspeakable;\n" +
            "Yet, that the world may witness that my end\n" +
            "Was wrought by nature, not by vile offence,\n" +
            "I'll utter what my sorrow gives me leave.",
        pageHist: "129",
        mentionedIn: [],
        wasContributedBy: this.con5.id,
        lexias: [this.lex5.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private pas7: Passage = {
        id: 7,
        book: this.b3.id,
        text: "A doubtful warrant of immediate death,\n" +
            "Which though myself would gladly have embraced,\n" +
            "Yet the incessant weepings of my wife,\n" +
            "Weeping before for what she saw must come,\n" +
            "And piteous plainings of the pretty babes,\n" +
            "That mourned for fashion, ignorant what to fear,\n" +
            "Forced me to seek delays for them and me.",
        page: "205-207",
        textHist: "[or] A doubtful warrant of immediate death,\n" +
            "Which though myself would gladly have embraced,\n" +
            "Yet the incessant weepings of my wife,\n" +
            "Weeping before for what she saw must come,\n" +
            "And piteous plainings of the pretty babes,\n" +
            "That mourned for fashion, ignorant what to fear,\n" +
            "Forced me to seek delays for them and me.",
        pageHist: "205-207",
        mentionedIn: [],
        wasContributedBy: this.con10.id,
        lexias: [this.lex10.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private b4: Book = {
        id: 4,
        internalID: "@000400",
        title: "Tamburlaine",
        createdStartDate: "1989",
        createdEndDate: "1989",
        publishedStartDate: "1900",
        publishedEndDate: "1900",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a2.id],
        venues: [this.v4.id],
        organisations: [this.org1.id],
        edition: "Tamburlaine, C. Marlowe, [not_or]",
        editionHist: "Tamburlaine, C. Marlowe, [or]",
        language: this.lang3.id,
        subjects: [this.s5.id],
        bookAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private pas8: Passage = {
        id: 8,
        book: this.b4.id,
        text: "I hold the Fates bound fast in iron chains,\n" +
            "And with my hand turn Fortune's wheel about;",
        page: "14",
        textHist: "[or] I hold the Fates bound fast in iron chains,\n" +
            "And with my hand turn Fortune's wheel about;",
        pageHist: "14",
        mentionedIn: [],
        wasContributedBy: this.con4.id,
        lexias: [this.lex6.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private pas9: Passage = {
        id: 9,
        book: this.b4.id,
        text: "Well, bark, ye dogs; I'll bridle all your tongues",
        page: "4",
        textHist: "[or] Well, bark, ye dogs; I'll bridle all your tongues",
        pageHist: "4",
        mentionedIn: [],
        wasContributedBy: this.con8.id,
        lexias: [this.lex3.id],
        order: 0,
        references: 0,
        internalComment: ""
    };

    private b5: Book = {
        id: 5,
        internalID: "@000500",
        title: "Of Two Evils Choose the Least",
        createdStartDate: "1912",
        createdEndDate: "1912",
        publishedStartDate: "1900",
        publishedEndDate: "1900",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a12.id, this.a19.id],
        venues: [this.v2.id, this.v8.id],
        organisations: [this.org4.id],
        edition: "Of Two Evils Choose the Least, [not_or]",
        editionHist: "Of Two Evils Choose the Least, [or]",
        language: this.lang1.id,
        subjects: [this.s2.id],
        bookAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private b6: Book = {
        id: 6,
        internalID: "@000600",
        title: "The Cruel Brother",
        createdStartDate: "1567",
        createdEndDate: "1567",
        publishedStartDate: "1601",
        publishedEndDate: "1601",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a10.id],
        venues: [this.v2.id],
        organisations: [this.org3.id, this.org7.id],
        edition: "The Cruel Brother, [not_or]",
        editionHist: "The Cruel Brother, [or]",
        language: this.lang4.id,
        subjects: [this.s2.id],
        bookAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private b7: Book = {
        id: 7,
        internalID: "@000700",
        title: "The Art of Reason",
        createdStartDate: "1845",
        createdEndDate: "1845",
        publishedStartDate: "1846",
        publishedEndDate: "1846",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a22.id],
        venues: [],
        organisations: [],
        edition: "The Art of Reason, [not_or]",
        editionHist: "The Art of Reason, [or]",
        language: this.lang2.id,
        subjects: [this.s1.id],
        bookAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private b8: Book = {
        id: 8,
        internalID: "@000800",
        title: "Five Hundred Points of Good Husbandry",
        createdStartDate: "1715",
        createdEndDate: "1715",
        publishedStartDate: "1715",
        publishedEndDate: "1715",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a6.id, this.a9.id],
        venues: [this.v1.id],
        organisations: [this.org1.id],
        edition: "Five Hundred Points of Good Husbandry, [not_or]",
        editionHist: "Five Hundred Points of Good Husbandry, [or]",
        language: this.lang3.id,
        subjects: [this.s4.id],
        bookAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private b9: Book = {
        id: 9,
        internalID: "@000900",
        title: "Treatise of God's Effectual Calling",
        createdStartDate: "1668",
        createdEndDate: "1668",
        publishedStartDate: "1668",
        publishedEndDate: "1668",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a20.id],
        venues: [],
        organisations: [],
        edition: "Treatise of God's Effectual Calling, [not_or]",
        editionHist: "Treatise of God's Effectual Calling, [or]",
        language: this.lang3.id,
        subjects: [this.s3.id],
        bookAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    private b10: Book = {
        id: 10,
        internalID: "@001000",
        title: "The Jews' Tragedy",
        createdStartDate: "1690",
        createdEndDate: "1690",
        publishedStartDate: "1690",
        publishedEndDate: "1690",
        licenseStartDate: "",
        licenseEndDate: "",
        firstPerformanceStartDate: "",
        firstPerformanceEndDate: "",
        authors: [this.a22.id],
        venues: [this.v5.id],
        organisations: [this.org2.id],
        edition: "The Jews' Tragedy, [not_or]",
        editionHist: "The Jews' Tragedy, [or]",
        language: this.lang2.id,
        subjects: [this.s2.id],
        bookAsLexia: null,
        order: 0,
        references: 1,
        internalComment: ""
    };

    // List of resources
    private readonly bookList: Book[];
    private readonly authorList: Author[];
    private readonly passageList: Passage[];
    private readonly languageList: Language[];
    private readonly venueList: Venue[];
    private readonly organisationList: Organisation[];
    private readonly subjectList: Subject[];
    private readonly contributorList: Contributor[];
    private readonly lexiaList: Lexia[];
    private readonly genderList: Gender[];
    private readonly researchFieldList: ResearchField[];
    private readonly statusList: Status[];
    private readonly genreList: Genre[];
    private readonly imageList: Image[];
    private readonly markingList: Marking[];
    private readonly formalClassList: FormalClass[];
    private readonly functionVoiceList: FunctionVoice[];

    // Converts allAuthors to objects with id as keys
    private readonly objBooks: Map<string, Book>;
    private readonly objAuthors: Map<string, Author>;
    private readonly objPassages: Map<string, Passage>;
    private readonly objLanguages: Map<string, Language>;
    private readonly objVenues: Map<string, Venue>;
    private readonly objOrganisation: Map<string, Organisation>;
    private readonly objSubjects: Map<string, Subject>;
    private readonly objContributors: Map<string, Contributor>;
    private readonly objLexia: Map<string, Lexia>;
    private readonly objGender: Map<string, Gender>;
    private readonly objResearchField: Map<string, ResearchField>;
    private readonly objStatus: Map<string, Status>;
    private readonly objGenre: Map<string, Genre>;
    private readonly objImage: Map<string, Image>;
    private readonly objMarking: Map<string, Marking>;
    private readonly objFormalClass: Map<string, FormalClass>;
    private readonly objFunctionVoice: Map<string, FunctionVoice>;

    static createObject<T extends WordWebObject>(list: T[]) {
        return list.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, new Map<string, T>());
    }

    static getNodes<T extends WordWebObject>(ids: number[], collection: Map<string, T>): T[] {
        return ids.map(id => {
            const obj = JSON.parse(JSON.stringify((collection[id])));
            if (obj.nodes.length !== 0) {
                obj.nodes = this.getNodes(obj.nodes, collection);
            }
            return obj;
        });
    }

    constructor() {
        this.authorList = [
            this.a1, this.a2, this.a3, this.a4, this.a5, this.a6,
            this.a7, this.a8, this.a9, this.a10, this.a11, this.a12,
            this.a13, this.a14, this.a15, this.a16, this.a17, this.a18,
            this.a19, this.a20, this.a21, this.a22, this.a23, this.a24
        ];
        this.objAuthors = BackendDataService.createObject(this.authorList);

        this.bookList = [this.b1, this.b2, this.b3, this.b4, this.b5, this.b6, this.b7, this.b8, this.b9, this.b10];
        this.objBooks = BackendDataService.createObject(this.bookList);

        this.passageList = [this.pas1, this.pas2, this.pas3, this.pas4, this.pas5, this.pas6, this.pas7, this.pas8, this.pas9];
        this.objPassages = BackendDataService.createObject(this.passageList);

        this.languageList = [this.lang1, this.lang2, this.lang3, this.lang4, this.lang5];
        this.objLanguages = BackendDataService.createObject(this.languageList);

        this.venueList = [this.v1, this.v2, this.v3, this.v4, this.v5, this.v6, this.v7, this.v8];
        this.objVenues = BackendDataService.createObject(this.venueList);

        this.organisationList = [this.org1, this.org2, this.org3, this.org4, this.org5, this.org6, this.org7];
        this.objOrganisation = BackendDataService.createObject(this.organisationList);

        this.subjectList = [
            this.s1, this.s2, this.s3, this.s4, this.s5,
            this.s6, this.s7, this.s8, this.s9, this.s10,
            this.s11, this.s12, this.s13, this.s14, this.s15,
            this.s16, this.s17, this.s18, this.s19, this.s20
        ];
        this.objSubjects = BackendDataService.createObject(this.subjectList);

        this.contributorList = [
            this.con1, this.con2, this.con3, this.con4, this.con5,
            this.con6, this.con7, this.con8, this.con9, this.con10
        ];
        this.objContributors = BackendDataService.createObject(this.contributorList);

        this.lexiaList = [
            this.lex1, this.lex2, this.lex3, this.lex4, this.lex5,
            this.lex6, this.lex7, this.lex8, this.lex9, this.lex10,
            this.lex11, this.lex12, this.lex13, this.lex14, this.lex15,
            this.lex16, this.lex17, this.lex18, this.lex19, this.lex20
        ];
        this.objLexia = BackendDataService.createObject(this.lexiaList);

        this.genderList = [this.gen1, this.gen2];
        this.objGender = BackendDataService.createObject(this.genderList);

        this.researchFieldList = [
            this.re1, this.re2, this.re3, this.re4, this.re5,
            this.re6, this.re7, this.re8
        ];
        this.objResearchField = BackendDataService.createObject(this.researchFieldList);

        this.statusList = [this.sta1, this.sta2, this.sta3, this.sta4];
        this.objStatus = BackendDataService.createObject(this.statusList);

        this.genreList = [
            this.genre0, this.genre1, this.genre2, this.genre3, this.genre4,
            this.genre5, this.genre6, this.genre7, this.genre8, this.genre9,
            this.genre10, this.genre11, this.genre12, this.genre13, this.genre14,
            this.genre15, this.genre16, this.genre17, this.genre18, this.genre19,
            this.genre20, this.genre21, this.genre22, this.genre23, this.genre24,
            this.genre25, this.genre26, this.genre27, this.genre28, this.genre29,
            this.genre30, this.genre31, this.genre32, this.genre33, this.genre34,
            this.genre35, this.genre36, this.genre37, this.genre38, this.genre39,
            this.genre40, this.genre41, this.genre42, this.genre43, this.genre44,
            this.genre45, this.genre46, this.genre47, this.genre48, this.genre49,
            this.genre50, this.genre51, this.genre52, this.genre53
        ];
        this.objGenre = BackendDataService.createObject(this.genreList);

        this.imageList = [
            this.im0, this.im1, this.im2, this.im3, this.im4, this.im5, this.im6, this.im7, this.im8, this.im9,
            this.im10, this.im11, this.im12, this.im13, this.im14, this.im15, this.im16, this.im17, this.im18, this.im19,
            this.im20, this.im21, this.im22, this.im23, this.im24, this.im25, this.im26, this.im27, this.im28, this.im29,
            this.im30, this.im31, this.im32, this.im33, this.im34, this.im35, this.im36, this.im37, this.im38, this.im39,
            this.im40, this.im41, this.im42, this.im43, this.im44, this.im45, this.im46, this.im47, this.im48, this.im49,
            this.im50, this.im51, this.im52, this.im53, this.im54, this.im55, this.im56, this.im57
        ];
        this.objImage = BackendDataService.createObject(this.imageList);

        this.markingList = [
            this.ma0, this.ma1, this.ma2, this.ma3, this.ma4, this.ma5, this.ma6, this.ma7, this.ma8, this.ma9,
            this.ma10, this.ma11, this.ma12, this.ma13, this.ma14, this.ma15, this.ma16, this.ma17, this.ma18, this.ma19,
            this.ma20, this.ma21, this.ma22, this.ma23, this.ma24, this.ma25, this.ma26, this.ma27, this.ma28, this.ma29,
            this.ma30, this.ma31, this.ma32, this.ma33, this.ma34, this.ma35, this.ma36, this.ma37, this.ma38, this.ma39,
            this.ma40, this.ma41, this.ma42, this.ma43, this.ma44, this.ma45
        ];
        this.objMarking = BackendDataService.createObject(this.markingList);

        this.formalClassList = [
            this.for0, this.for1, this.for2, this.for3, this.for4, this.for5, this.for6, this.for7, this.for8,
            this.for9, this.for10, this.for11, this.for12, this.for13, this.for14, this.for15, this.for16,
            this.for17, this.for18, this.for19, this.for20, this.for21, this.for22, this.for23, this.for24, this.for25
        ];
        this.objFormalClass = BackendDataService.createObject(this.formalClassList);

        this.functionVoiceList = [
            this.fu0, this.fu1, this.fu2, this.fu3, this.fu4, this.fu5, this.fu6, this.fu6, this.fu7,
            this.fu8, this.fu9, this.fu10, this.fu11, this.fu12, this.fu13
        ];
        this.objFunctionVoice = BackendDataService.createObject(this.functionVoiceList);
        console.log(this.objFunctionVoice);
    }


    getAuthor(iri: number, references: boolean) {
        if (!this.objAuthors[iri]) {
            return {};
        }

        const copyAuthor = JSON.parse(JSON.stringify(this.objAuthors[iri]));

        if (references) {
            copyAuthor.humanAsLexia = this.getLexia(copyAuthor.humanAsLexia, false);
        }

        return copyAuthor;
    }

    getAuthors(references: boolean) {
        let copyAuthorList = JSON.parse(JSON.stringify(this.authorList));

        if (references) {
            copyAuthorList = copyAuthorList.map(author => {
                return this.getAuthor(author.id, true);
            });
        }

        // Sort after internalID
        // copyAuthorList.sort((a, b) => (a.internalID > b.internalID) ? 1 : ( (b.internalID > a.internalID) ? -1 : 0));

        return copyAuthorList;
    }

    getBook(iri: number, references: boolean) {
        if (!this.objBooks[iri]) {
            return {};
        }

        const copyBook = JSON.parse(JSON.stringify(this.objBooks[iri]));

        if (references) {
            const authors: Author[] = [];
            const venues = [];
            const organisations = [];
            const subjects = [];

            for (const author of copyBook.authors) {
                authors.push(this.getAuthor(author, false));
            }

            for (const venue of copyBook.venues) {
                venues.push(this.getVenue(venue, false));
            }

            for (const organisation of copyBook.organisations) {
                organisations.push(this.getOrganisation(organisation, false));
            }

            for (const subject of copyBook.subjects) {
                subjects.push(this.getSubject(subject, false));
            }

            copyBook.authors = authors;
            copyBook.venues = venues;
            copyBook.organisations = organisations;
            copyBook.subjects = subjects;
            copyBook.language = this.getLanguage(copyBook.language, false);
            copyBook.bookAsLexia = this.getLexia(copyBook.bookAsLexia, false);
        }

        return copyBook;
    }

    getBooks(references: boolean) {
        let copyBookList = JSON.parse(JSON.stringify(this.bookList));

        if (references) {
            copyBookList = copyBookList.map(book => {
                return this.getBook(book.id, true);
            });
        }

        return copyBookList;
    }

    getPassage(iri: number, references: boolean) {
        if (!this.objPassages[iri]) {
            return {};
        }

        const copyPassage = JSON.parse(JSON.stringify(this.objPassages[iri]));

        if (references) {
            const lexias = [];
            const mentionedIn = [];

            for (const lexia of copyPassage.lexias) {
                lexias.push(this.getLexia(lexia, false));
            }

            for (const passage of copyPassage.mentionedIn) {
                mentionedIn.push(this.getPassage(passage, false));
            }

            copyPassage.lexias = lexias;
            copyPassage.mentionedIn = mentionedIn;
            copyPassage.book = this.getBook(copyPassage.book, false);
            copyPassage.wasContributedBy = this.getContributor(copyPassage.wasContributedBy, false);
        }

        return copyPassage;
    }

    getPassages(references: boolean) {
        let copyPassageList = JSON.parse(JSON.stringify(this.passageList));

        if (references) {
            copyPassageList = copyPassageList.map(passage => {
                return this.getPassage(passage.id, true);
            });
        }

        return copyPassageList;
    }

    getLanguage(iri: number, references: boolean) {
        if (!this.objLanguages[iri]) {
            return {};
        }

        return JSON.parse(JSON.stringify(this.objLanguages[iri]));
    }

    getLanguages(references: boolean) {
        return JSON.parse(JSON.stringify(this.languageList));
    }

    getVenue(iri: number, references: boolean) {
        if (!this.objVenues[iri]) {
            return {};
        }

        const copyVenue = JSON.parse(JSON.stringify(this.objVenues[iri]));

        if (references) {
            copyVenue.venueAsLexia = this.getLexia(copyVenue.venueAsLexia, false);
        }

        return copyVenue;
    }

    getVenues(references: boolean) {
        let copyVenueList = JSON.parse(JSON.stringify(this.venueList));

        if (references) {
            copyVenueList = copyVenueList.map(venue => {
                return this.getVenue(venue.id, true);
            });
        }

        return copyVenueList;
    }

    getOrganisation(iri: number, references: boolean) {
        if (!this.objOrganisation[iri]) {
            return {};
        }

        const copyOrganisation = JSON.parse(JSON.stringify(this.objOrganisation[iri]));

        if (references) {
            copyOrganisation.organisationAsLexia = this.getLexia(copyOrganisation.organisationAsLexia, false);
        }

        return copyOrganisation;
    }

    getOrganisations(references: boolean) {
        let copyOrganisationList = JSON.parse(JSON.stringify(this.organisationList));

        if (references) {
            copyOrganisationList = copyOrganisationList.map(organisation => {
                return this.getOrganisation(organisation.id, true);
            });
        }

        return copyOrganisationList;
    }

    getSubject(iri: number, references: boolean) {
        if (!this.objSubjects[iri]) {
            return {};
        }

        return JSON.parse(JSON.stringify(this.objSubjects[iri]));
    }

    getSubjects(references: boolean) {
        return JSON.parse(JSON.stringify(this.subjectList));
    }

    getContributor(iri: number, references: boolean) {
        if (!this.objContributors[iri]) {
            return {};
        }

        const copyContributor = JSON.parse(JSON.stringify(this.objContributors[iri]));

        if (references) {
            copyContributor.humanAsLexia = this.getLexia(copyContributor.humanAsLexia, false);
        }

        return copyContributor;
    }

    getContributors(references: boolean) {
        let copyContributorList = JSON.parse(JSON.stringify(this.contributorList));

        if (references) {
            copyContributorList = copyContributorList.map(contributor => {
                return this.getContributor(contributor.id, true);
            });
        }

        return copyContributorList;
    }

    getLexia(iri: number, references: boolean) {
        if (!this.objLexia[iri]) {
            return {};
        }

        return JSON.parse(JSON.stringify(this.objLexia[iri]));
    }

    getLexias(references: boolean) {
        let copyLexiaList = JSON.parse(JSON.stringify(this.lexiaList));

        if (references) {
            copyLexiaList = copyLexiaList.map(lexia => {
                return this.getLexia(lexia.id, true);
            });
        }

        return copyLexiaList;
    }

    getGender(iri: number, references: boolean) {
        if (!this.objGender[iri]) {
            return {};
        }

        return JSON.parse(JSON.stringify(this.objGender[iri]));
    }

    getGenders(references: boolean) {
        return JSON.parse(JSON.stringify(this.genderList));
    }

    getResearchField(iri: number, references: boolean) {
        if (!this.objResearchField[iri]) {
            return {};
        }

        return JSON.parse(JSON.stringify(this.objResearchField[iri]));
    }

    getResearchFields(references: boolean) {
        return JSON.parse(JSON.stringify(this.researchFieldList));
    }

    getStatus(iri: number, references: boolean) {
        if (!this.objStatus[iri]) {
            return {};
        }

        return JSON.parse(JSON.stringify(this.objStatus[iri]));
    }

    getStatuses(references: boolean) {
        return JSON.parse(JSON.stringify(this.statusList));
    }

    getGenre(iri: number, references: boolean) {
        if (!this.objGenre[iri]) {
            return {};
        }

        const copyGenre = JSON.parse(JSON.stringify(this.objGenre[iri]));

        if (references) {
            copyGenre.nodes = BackendDataService.getNodes(copyGenre.nodes, this.objGenre);
        }

        return copyGenre;
    }

    getGenres(references: boolean) {
        return JSON.parse(JSON.stringify(this.genreList));
    }

    getImage(iri: number, references: boolean) {
        if (!this.objImage[iri]) {
            return {};
        }

        const copyImage = JSON.parse(JSON.stringify(this.objImage[iri]));

        if (references) {
            copyImage.nodes = BackendDataService.getNodes(copyImage.nodes, this.objImage);
        }

        return copyImage;
    }

    getImages(references: boolean) {
        return JSON.parse(JSON.stringify(this.imageList));
    }

    getMarking(iri: number, references: boolean) {
        console.log(this.objMarking, iri);
        if (!this.objMarking[iri]) {
            return {};
        }

        const copyMarking = JSON.parse(JSON.stringify(this.objMarking[iri]));

        if (references) {
            copyMarking.nodes = BackendDataService.getNodes(copyMarking.nodes, this.objMarking);
        }

        return copyMarking;
    }

    getMarkings(references: boolean) {
        return JSON.parse(JSON.stringify(this.markingList));
    }

    getFormalClass(iri: number, references: boolean) {
        if (!this.objFormalClass[iri]) {
            return {};
        }

        const copyFormalClass = JSON.parse(JSON.stringify(this.objFormalClass[iri]));

        if (references) {
            copyFormalClass.nodes = BackendDataService.getNodes(copyFormalClass.nodes, this.objFormalClass);
        }

        return copyFormalClass;
    }

    getFormalClasses(references: boolean) {
        return JSON.parse(JSON.stringify(this.formalClassList));
    }

    getFunctionVoice(iri: number, references: boolean) {
        if (!this.objFunctionVoice[iri]) {
            return {};
        }

        const copyFunction = JSON.parse(JSON.stringify(this.objFunctionVoice[iri]));

        if (references) {
            copyFunction.nodes = BackendDataService.getNodes(copyFunction.nodes, this.objFunctionVoice);
        }

        return copyFunction;
    }

    getFunctionVoices(references: boolean) {
        return JSON.parse(JSON.stringify(this.functionVoiceList));
    }

    updateAuthor(iri: number, newAuthor: Author) {
        const a = this.objAuthors[iri] as Author;

        // Checks if iri is valid
        if (!a) {
            return;
        }

        // Checks if humanAsLexia is valid
        if (!this.objLexia[newAuthor.humanAsLexia as number]) {
            console.error(`Invalid humanAsLexia id: ${newAuthor.humanAsLexia}`);
            return;
        }

        a.internalID = newAuthor.internalID;
        a.firstName = newAuthor.firstName;
        a.lastName = newAuthor.lastName;
        a.gender = newAuthor.gender;
        a.description = newAuthor.description;
        a.birthStartDate = newAuthor.birthStartDate;
        a.birthEndDate = newAuthor.birthEndDate;
        a.deathStartDate = newAuthor.deathStartDate;
        a.flStartDate = newAuthor.flStartDate;
        a.flEndDate = newAuthor.flEndDate;
        a.humanAsLexia = newAuthor.humanAsLexia;
        a.order = newAuthor.order;
        a.internalComment = newAuthor.internalComment;
    }

    updateBook(iri: number, newBook: Book) {
        const b = this.objBooks[iri] as Book;

        // Checks if iri is valid
        if (!b) {
            return;
        }

        // Checks if author id is valid
        for (const author of newBook.authors) {
            if (!this.objAuthors[author as number]) {
                console.error(`Invalid author id: ${author}`);
                return;
            }
        }

        // Checks if venue id is valid
        for (const venue of newBook.venues) {
            if (!this.objVenues[venue as number]) {
                console.error(`Invalid venue id: ${venue}`);
                return;
            }
        }

        // Checks if organisation id is valid
        for (const organisation of newBook.organisations) {
            if (!this.objOrganisation[organisation as number]) {
                console.error(`Invalid organisation id: ${organisation}`);
                return;
            }
        }

        // Checks if language id is valid
        if (!this.objLanguages[newBook.language as number]) {
            console.error(`Invalid language id: ${newBook.language}`);
            return;
        }

        // Checks if bookAsLexia is valid
        if (!this.objLexia[newBook.bookAsLexia as number]) {
            console.error(`Invalid bookAsLexia id: ${newBook.bookAsLexia}`);
            return;
        }

        b.internalID = newBook.internalID;
        b.title = newBook.title;
        b.createdStartDate = newBook.createdStartDate;
        b.createdEndDate = newBook.createdEndDate;
        b.publishedStartDate = newBook.publishedStartDate;
        b.publishedEndDate = newBook.publishedEndDate;
        b.licenseStartDate = newBook.licenseStartDate;
        b.licenseEndDate = newBook.licenseEndDate;
        b.firstPerformanceStartDate = newBook.firstPerformanceStartDate;
        b.firstPerformanceEndDate = newBook.firstPerformanceEndDate;
        b.edition = newBook.edition;
        b.editionHist = newBook.editionHist;
        b.order = newBook.order;

        b.authors = newBook.authors;
        b.venues = newBook.venues;
        b.organisations = newBook.organisations;
        b.language = newBook.language;
        b.bookAsLexia = newBook.bookAsLexia;
    }

    updatePassage(iri: number, newPassage: Passage) {
        const p = this.objPassages[iri];

        // Checks if iri is valid
        if (!p) {
            return;
        }

        // Checks if lexia id is valid
        for (const lexia of newPassage.lexias) {
            if (!this.objLexia[lexia as number]) {
                console.error(`Invalid lexia id: ${lexia}`);
                return;
            }
        }

        // Checks if passage id is valid
        for (const passage of (newPassage.mentionedIn)) {
            if (!this.objPassages[passage as number]) {
                console.error(`Invalid passage id: ${passage}`);
                return;
            }
        }

        // Checks if book is valid
        if (!this.objBooks[newPassage.book as number]) {
            console.error(`Invalid book id: ${newPassage.book}`);
            return;
        }

        // Checks if contributor is valid
        if (!this.objContributors[newPassage.wasContributedBy as number]) {
            console.error(`Invalid contributor id: ${newPassage.wasContributedBy}`);
            return;
        }

        p.text = newPassage.text;
        p.page = newPassage.page;
        p.textHist = newPassage.textHist;
        p.pagHiste = newPassage.pageHist;
        p.order = newPassage.order;
        p.book = newPassage.book;
        p.wasContributedBy = newPassage.wasContributedBy;
    }

    updateLexia(iri: number, newLexia: any) {
        const lexia = this.objLexia[iri];
        lexia.internalID = newLexia.internalID;
        lexia.lexia = newLexia.lexia;
        lexia.order = newLexia.order;
    }

    updateLanguage(iri: number, newLanguage: any) {
        const l = this.objLanguages[iri];

        if (!l) {
            return;
        }

        l.name = newLanguage.name;
        l.order = newLanguage.order;
    }

    updateOrganisation(iri: number, newOrganisation: Organisation) {
        const o = this.objOrganisation[iri];

        // Checks if iri is valid
        if (!o) {
            return;
        }

        // Checks if organisationAsLexia is valid
        if (!this.objLexia[newOrganisation.organisationAsLexia as number]) {
            console.error(`Invalid organisationAsLexia id: ${newOrganisation.organisationAsLexia}`);
            return;
        }

        o.internalID = newOrganisation.internalID;
        o.name = newOrganisation.name;
        o.order = newOrganisation.order;
        o.organisationAsLexia = newOrganisation.organisationAsLexia;
    }

    updateSubject(iri: number, newSbject: any) {
        const subject = this.objSubjects[iri];
        subject.name = newSbject.name;
        subject.order = newSbject.order;
    }

    updateGenre(iri: number, genre: any) {
    }

    updateContributor(iri: number, newContributor: Contributor) {
        const con = this.objOrganisation[iri];

        // Checks if iri is valid
        if (!con) {
            return;
        }

        // Checks if humanAsLexia is valid
        if (!this.objLexia[newContributor.humanAsLexia as number]) {
            console.error(`Invalid humanAsLexia id: ${newContributor.humanAsLexia}`);
            return;
        }

        con.internalID = newContributor.internalID;
        con.firstName = newContributor.firstName;
        con.lastName = newContributor.lastName;
        con.email = newContributor.email;
        con.gender = newContributor.gender;
        con.humanAsLexia = newContributor.humanAsLexia;
        con.order = newContributor.order;
        con.internalComment = newContributor.internalComment;
    }

    updateVenue(iri: number, newVenue: Venue) {
        const v = this.objVenues[iri];

        // Checks if iri is valid
        if (!v) {
            return;
        }

        // Checks if venueAsLexia is valid
        if (!this.objLexia[newVenue.venueAsLexia as number]) {
            console.error(`Invalid venueAsLexia id: ${newVenue.venueAsLexia}`);
            return;
        }

        v.name = newVenue.name;
        v.place = newVenue.place;
        v.order = newVenue.order;
        v.internalComment = newVenue.internalComment;
    }

    createAuthor(data: any) {
        // TODO if id of lexia is valid
        const newAuthor: Author = {
            id: this.getID(),
            internalID: data.internalID,
            firstName: data.firstName,
            lastName: data.lastName,
            description: data.description,
            birthStartDate: data.birthStartDate,
            birthEndDate: data.birthEndDate,
            deathStartDate: data.deathStartDate,
            deathEndDate: data.deathEndDate,
            flStartDate: data.flStartDate,
            flEndDate: data.flEndDate,
            gender: data.gender,
            humanAsLexia: data.humanAsLexia,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.authorList.push(newAuthor);
        this.objAuthors[newAuthor.id] = newAuthor;
    }

    createBook(data: any) {
        // TODO if id of authors, venues and organisations are valid
        const newBook: Book = {
            id: this.getID(),
            internalID: data.internalID,
            title: data.title,
            createdStartDate: data.createdStartDate,
            createdEndDate: data.createdEndDate,
            publishedStartDate: data.publishedStartDate,
            publishedEndDate: data.publishedEndDate,
            licenseStartDate: data.licenseStartDate,
            licenseEndDate: data.licenseEndDate,
            firstPerformanceStartDate: data.firstPerformanceStartDate,
            firstPerformanceEndDate: data.firstPerformanceEndDate,
            edition: data.edition,
            editionHist: data.editionHist,
            authors: data.authors,
            venues: data.venues,
            subjects: data.subjects,
            language: data.language,
            organisations: data.organisations,
            bookAsLexia: data.bookAsLexia,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.bookList.push(newBook);
        this.objBooks[newBook.id] = newBook;
    }

    createContributor(data: any) {
        // TODO if id of lexia is valid
        const newContributor: Contributor = {
            id: this.getID(),
            internalID: data.internalID,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            gender: data.gender,
            humanAsLexia: data.humanAsLexia,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.contributorList.push(newContributor);
        this.objContributors[newContributor.id] = newContributor;
    }

    createPassage(data: any) {
        // TODO if id of passages, lexias, contributor, book are valid
        const newPassage: Passage = {
            id: this.getID(),
            text: data.text,
            textHist: data.textHist,
            page: data.page,
            pageHist: data.pageHist,
            book: data.book,
            lexias: data.lexias,
            mentionedIn: data.mentionedIn,
            wasContributedBy: data.wasContributedBy,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.passageList.push(newPassage);
        this.objPassages[newPassage.id] = newPassage;
    }

    createVenue(data: any) {
        // TODO if id of lexia is valid
        const newVenue: Venue = {
            id: this.getID(),
            internalID: data.internalID,
            name: data.name,
            place: data.place,
            venueAsLexia: data.venueAsLexia,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.venueList.push(newVenue);
        this.objVenues[newVenue.id] = newVenue;
    }

    createOrganisation(data: any) {
        // TODO if id of lexia is valid
        const newOrganisation: Organisation = {
            id: this.getID(),
            internalID: data.internalID,
            name: data.name,
            organisationAsLexia: data.organisationAsLexia,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.organisationList.push(newOrganisation);
        this.objOrganisation[newOrganisation.id] = newOrganisation;
    }

    createLanguage(data: any) {
        const newLanguage: Language = {
            id: this.getID(),
            name: data.name,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.languageList.push(newLanguage);
        this.objLanguages[newLanguage.id] = newLanguage;
    }

    createSubject(data: any) {
        const newSubject: Subject = {
            id: this.getID(),
            name: data.name,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.subjectList.push(newSubject);
        this.objSubjects[newSubject.id] = newSubject;

    }

    createLexia(data: any) {
        const newLexia: Lexia = {
            id: this.getID(),
            internalID: data.internalID,
            name: data.name,
            internalComment: data.internalComment,
            order: 0,
            references: 0
        };
        this.lexiaList.push(newLexia);
        this.objLexia[newLexia.id] = newLexia;
    }

    createGenre(data: any) {
    }

    getID(): number {
        return (Math.random() * 10000) + 1;
    }
}
