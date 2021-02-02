import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class StringService {
    private readonly _STRINGS = {
        default_title: "Please note",
        text_not_filled: "Fill in at least one text field to start the search.",
        text_help: "<p>All texts are given in normalized spelling, taken from modern-spelling editions or normalized by " +
            "hand from scholarly or historical editions.</p>" +
            "Shakespeare's works are quoted from <a href='http://shakespeare.folger.edu' target=\"_blank\">" +
            "<i>The Folger Shakespeare</i></a> in British spelling. Past tense forms such as \"whipp'd\" are " +
            "silently normalized in all texts.<br>" +
            "\"Show historical spelling\" in your search results indicates that a passage is also available in " +
            "original spelling.",
        title_help: "The titles of Shakespeare's works are given as in <a href='http://shakespeare.folger.edu' " +
            "target=\"_blank\"><i>The Folger Shakespeare</i></a><br>" +
            "Play titles are given as in Martin Wiggins' <i>British Drama 1533-1642: A Catalogue</i>, where " +
            "applicable.<br>" +
            "Multi-part plays are given as <i>Tamburlaine Part 1</i> rather than <i>The First Part " +
            "of Tamburlaine.</i>",
        author_help: "Authors are given as in Martin Wiggins' <i>British Drama 1533-1642: A Catalogue</i>, " +
            "where applicable. We include \"assigned\" authors and, in a few cases, authors which Wiggins does " +
            "not recognize.",
        lexia_help: "<b>\"Lexia\"</b> is our term for \"quoted phrase or name\". These small items constitute " +
            "the early modern \"web of words\". Type in a word or a name to find passages that reference each other " +
            "or use the same phrase.",
        date_help: "Years or timespans are given as in Martin Wiggins' <i>British Drama 1533-1642: A Catalogue</i>, " +
            "where applicable. Wiggins' \"Best guess\" is used where there is no precise information.<br>" +
            "For technical reasons, all Classical texts (Latin and Greek) are currently coded for the year 1000 " +
            "rather than for the correct date.",
        plays_help: "We focus on plays but include some passages from nondramatic works that were written or " +
            "referenced by Renaissance dramatists.<br>" +
            "Use this switch to include or exclude poems, treatises, letters, the Bible etc. from your searches.",
        marking_help: "This is our term for the way in which authors signal the use of somebody else's " +
            "words. Marking includes" +
            "<ul>" +
            "<li>verbal signals: \"as the play says\"</li>" +
            "<li>typographical features: italics, quotation marks</li>" +
            "<li>names: \"Ovid says\" or \"Hamlet, revenge!\"</li>" +
            "</ul>",
        function_help: "<p><b>\"Function\"</b> is our term for the part of a text which contains a quotation. A " +
            "quotation may occur in the title of a play, in a chapter epigraph or in a stage direction. It may also " +
            "be simply the name of a character. A character called Romeo after 1595 is probably a reference to " +
            "<i>Romeo and Juliet</i>, and Shakespeare's most famous stage direction \"Exit pursued by a bear\" " +
            "has become a quotation in its own right.<br></p>" +
            "<p><b>\"Voice\"</b>: Most quotations occur in the body of a play, novel or poem. Find out if they are spoken by " +
            "a character on stage or in a novel, by a narrator or if they occur in.</p>",
        per_company_help: "Find plays that were premiered by a certain troupe like The King's Men or " +
            "The Children of Paul's.",
        per_venue_help: "Find plays that were premiered in a certain venue like Blackfriars or The Globe " +
            "Theatre.",
        per_actor_help: "Limit your searches to plays whose premiere involved a certain actor.",
        language_help: "<p>Limit your search to English material or explore a selection of passages from European " +
            "literature and the Classics.</p>" +
            "Latin and Classical Greek texts are given according to <a href='https://www.loebclassics.com' " +
            "target=\"_blank\">loebclassics.com.</a>",
        genre_help: "This information is given as in Martin Wiggins' <i>British Drama 1533-1642: A " +
            "Catalogue</i>, where applicable.<br>" +
            "Some plays are assigned more than one genre; Shakespeare's <i>Richard III</i>, for\n" +
            "example, can be found both under \"Tragedy\" and \"History play\"."
    };

    constructor() {
    }

    getString(key: string): string {
        if (this._STRINGS[key] == undefined) {
            throw new Error(`key ${key} does not exist`);
        }

        return this._STRINGS[key];
    }
}
