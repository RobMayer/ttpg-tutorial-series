import { GameObject, MultistateObject, refObject } from "@tabletop-playground/api";
import { pdfBrowser, PdfBrowserOptions, TocEntry } from "ttpg-pdf-controls";

const toc: TocEntry[] = [
    {
        name: "Chapter I - General",
        page: 1,
        items: [
            { name: "Section I.1", page: 1 },
            { name: "Section I.2", page: 1, items: [{ name: "Subsection I.2.1", page: 1 }] },
        ],
    },
    { name: "Chapter II - Special Rules", page: 2 },
];

const options: Partial<PdfBrowserOptions> = {
    position: "top",
    toc,
    index: {
        "playing the game": 1,
        movement: [1, 2],
    },
};

((obj: GameObject) => {
    if (obj instanceof MultistateObject) {
        pdfBrowser(obj, 20, 29, options);
    } else {
        console.error("Not a PDF!");
    }
})(refObject);
