export type Optional<T> = T | undefined | null

export default interface RawVideoInfo {
    vid: string
    title: string
    fn: string
    a: string
    t: number
    links: Links
    token: string
    timeExpires: string
    status: string
    p: string
    mess: string
}

export interface Links {
    [key: string]: Ogg | Mp3 | Mp4 | N3gp
    ogg: Ogg
    mp3: Mp3
    mp4: Mp4
    "3gp": N3gp
}

export interface Ogg {
    [key: string]: N1
    "1": N1
}

export interface N1 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: any
}

export interface Mp3 {
    [key: string]: N1
    "2": N2
}

export interface N2 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: any
}

export interface Mp4 {
    [key: string]: N1
    "3": N3
    "4": N4
    "5": N5
    "6": N6
    "7": N7
    "8": N8
}

export interface N3 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: string
}

export interface N4 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: string
}

export interface N5 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: string
}

export interface N6 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: string
}

export interface N7 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: string
}

export interface N8 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: string
}

export interface N3gp {
    [key: string]: N1
    "9": N9
}

export interface N9 {
    f: string
    k: string
    q: string
    size: string
    key: string
    selected: any
}  

export interface CreateConvertJobRawData {
    status: string
    jobId?: string
    statusCode: number
    result: string
}