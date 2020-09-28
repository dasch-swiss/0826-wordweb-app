import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class StringService {
    readonly strings = {
        default_title: "Please note",
        text_not_filled: "Fill in at least one text field to start the search.",
        text_help: "All texts are given in normalized spelling, taken from modern-spelling editions or normalized by hand from scholarly " +
            "or historical editions. The button \"Show historical spelling\" in your search results indicates that a passage is also " +
            "available in original spelling. <br>Shakespeare's works are quoted from <a href='http://shakespeare.folger.edu'><i>The Folger Shakespeare</i></a> in British spelling. Past tense " +
            "forms such as \"whipp'd\" are silently normalized in all texts.",
        author_help: "Authors are given as in <i>Martin Wiggins' British Drama 1533-1642: A Catalogue</i>, where applicable. We include \"assigned\" " +
            "authors and, in a few cases, authors which Wiggins does not recognize.",
        title_help: "Titles of Shakespeare plays are given as in <a href='http://shakespeare.folger.edu'><i>The Folger Shakespeare</i></a> Other play titles are given as in <i>Martin Wiggins' British Drama 1533-1642: A Catalogue</i>, where applicable.<br>" +
            "Multi-part plays are listed as <i>Tamburlaine Part 1</i> rather than <i>The First Part of Tamburlaine</i>.",
        lexia_help: "Type in any word or name to find passages that reference each other or use the same phrase.",
        date_help: "Date are given as in <i>Martin Wiggins' British Drama 1533-1642: A Catalogue</i>, where applicable. Wiggins' " +
            "\"Best guess\" is used where there is no certain information. <br>For technical reasons, all Classical texts (Latin and Greek) are " +
            "currently coded for the year 1000 rather than for the correct date.",
        plays_help: "We focus on plays but include some passages from nondramatic works that were written or referenced by Renaissance " +
            "dramatists. Use this switch to include or exclude poems, treatises, letters, the Bible etc. from your searches.",
        marking_help: "How did Renaissance authors signal that they used somebody else's words? Marking for quotation can include " +
            "names, typographical features and expressions like \"as the play says\".",
        function_help: "The \"Function\" helps you to find out in which part of the text quotation is located. Is it a title, an epigraph or a name?<br>Use \"Body of text\" and its subcategories to limit your search to passages in dialogue or a particular " +
            "narrative voice, or explore references in stage directions, play titles etc.",
        per_company_help: "Limit your searches to plays that were premiered by a certain troupe like The King's Men or The " +
            "Children of Paul's.",
        per_actor_help: "Limit your searches to plays whose premiere involved a certain actor.",
        language_help: "Limit your search to English material or explore a selection of passages from European " +
            "literature and the Classics.",
        genre_help: "Genres are given as in <i>Martin Wiggins' British Drama 1533-1642: A Catalogue</i>, where applicable. Some plays are assigned more than one genre; Shakespeare's " +
            "<i>Richard III</i>, for example, can be found both under \"Tragedy\" and \"History play\"."
    };

    constructor() {
    }

    getString(key: string): string {
        return this.strings[key];
    }
}
