import FormData from "form-data"
import axios from "axios"

import { parseStringFileSizeToBytes } from "../utils/parsers"
import RawVideoInfo, { Links } from "./../types"

type GetVideoInfoOptions = {
    videoUrl: string
    origin?: string
}

const defaultOptions = {
    origin: "home"
}

async function getVideoInfo({
    videoUrl,
    origin = defaultOptions.origin
}: GetVideoInfoOptions): Promise<ParsedVideoInfo> {
    const url = "https://x2download.app/api/ajaxSearch"

    const formData = new FormData()

    formData.append("q", videoUrl)
    formData.append("vt", origin)

    const response = await axios.post(url, formData)

    const data = parseVideoInfo(response.data as RawVideoInfo)

    return data
}

type Extra = {
    a: string
    t: number
    p: string
}

type Format = {
    fileExtension: string
    quality: string
    qualityKey: string
    size: number
}

type ParsedVideoInfo = {
    id: string
    title: string
    fileName: string
    token: string
    tokenExpiresAt: number
    message: string
    formats: Format[]
    extra: Extra
}



function parseFormats(formats: Links): Format[] {
    const parsedFormats: Format[] = []

    for (const fileType in formats) {
        const formatSet = formats[fileType]

        for (const formatIndex in formatSet) {
            const format = formatSet[formatIndex] 

            parsedFormats.push({
                fileExtension: format.f,
                quality: format.k,
                qualityKey: format.key,
                size: parseStringFileSizeToBytes(format.size)
            })
        }
    }

    return parsedFormats
}

function parseVideoInfo(rawVideoInfo: RawVideoInfo): ParsedVideoInfo {
    const videoInfo: ParsedVideoInfo = {
        id: rawVideoInfo.vid,
        title: rawVideoInfo.title,
        fileName: rawVideoInfo.fn,
        token: rawVideoInfo.token,
        tokenExpiresAt: Number(rawVideoInfo.timeExpires),
        message: rawVideoInfo.mess,
        formats: parseFormats(rawVideoInfo.links),
        extra: {
            a: rawVideoInfo.a,
            p: rawVideoInfo.p,
            t: rawVideoInfo.t
        }
    }

    return videoInfo
}

export default getVideoInfo