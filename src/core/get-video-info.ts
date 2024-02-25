import axios, { AxiosRequestConfig } from "axios"
import FormData from "../form-data"

import { parseStringFileSizeToBytes } from "../utils/parsers"
import RawVideoInfo, { Links } from "./../types"

export type GetVideoInfoOptions = {
    videoUrl: string
    origin?: string
    requestOptions?: AxiosRequestConfig<FormData>
    corsProxyUrl?: string
}

const defaultOptions: Partial<GetVideoInfoOptions> = {
    origin: "home",
    requestOptions: {}
}

async function getVideoInfo({
    videoUrl,
    origin = defaultOptions.origin,
    requestOptions = defaultOptions.requestOptions,
    corsProxyUrl
}: GetVideoInfoOptions): Promise<ParsedVideoInfo> {
    const url = `${corsProxyUrl ?? ""}https://x2download.app/api/ajaxSearch`

    const formData = new FormData()

    formData.append("q", videoUrl)
    formData.append("vt", origin)

    const response = await axios.post(url, formData, { ...requestOptions })

    const data = parseVideoInfo(response.data as RawVideoInfo)

    return data
}

type Extra = {
    a: string
    t: number
    p: string
}

export type Format = {
    fileExtension: string
    quality: string
    qualityKey: string
    size: number
}

export type ParsedVideoInfo = {
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