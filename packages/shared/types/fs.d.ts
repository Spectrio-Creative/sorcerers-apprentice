type SorcererFile = "csv" | "image" | "video" | "audio" | "visual" | "other";

type FileResponseOK = {
    status: "OK";
    file: File | string;
    filePath: string;
    fileName: string;
    error?: string;
}

type FileResponseCANCELLED = {
    status: "CANCELLED";
    file?: File | string;
    filePath?: string;
    fileName?: string;
    error?: string;
}

type FileResponseERROR = {
    status: "ERROR";
    file?: File | string;
    filePath?: string;
    fileName?: string;
    error: string;
}

type FileResponse = FileResponseOK | FileResponseCANCELLED | FileResponseERROR;

type CompResponseOK = {
    status: "OK";
    compIds: ({id: string, guid: string} | null)[];
    error?: string;
}

type CompResponseERROR = {
    status: "ERROR";
    compIds?: ({id: string, guid: string} | null)[];
    error: string;
}

type CompResponse = CompResponseOK | CompResponseERROR;

type AMEComp = {
    guid: string;
    filePath: string;
    format: string;
    preset: string;
}

type AMEResponseOK = {
    status: "OK";
    error?: string;
}

type AMEResponseERROR = {
    status: "ERROR";
    error: string;
}

type AMEResponse = AMEResponseOK | AMEResponseERROR;