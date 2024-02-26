import axios, { AxiosRequestConfig } from "axios"
import FormData from "../form-data"

export type ConvertVideoRawData = {
    c_status: string
    c_server?: string
    d_url?: string
}

export type ConvertVideoOptions = {
    videoId: string
    fileType: string
    quality: string
    token: string
    tokenExpiresAt: number
    client?: string
    requestOptions?: AxiosRequestConfig<FormData>
    corsProxyUrl?: string
}

export type ConvertVideoParsedData = {
    conversionStatus: string
    conversionServerUrl: string
}

function parseConvertVideoData(rawData: ConvertVideoRawData): ConvertVideoParsedData {
    const data: ConvertVideoParsedData = {
        conversionStatus: rawData.c_status,
        conversionServerUrl: rawData.c_server ?? rawData.d_url!
    }

    if (!data.conversionServerUrl) {
        throw new Error(`Unable to get media conversion server url! Server response: ${rawData}`)
    }

    return data
}

const defaultOptions: Partial<ConvertVideoOptions> = {
    client: "X2Download.app",
    requestOptions: {}
}

async function convertVideo({
    videoId,
    fileType,
    quality,
    token,
    tokenExpiresAt,
    client = defaultOptions.client,
    requestOptions = defaultOptions.requestOptions,
    corsProxyUrl
}: ConvertVideoOptions): Promise<ConvertVideoParsedData> {
    const url = `${corsProxyUrl ?? ""}https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994`

    const formData = new FormData()

    formData.append("v_id", videoId)
    formData.append("ftype", fileType)
    formData.append("fquality", quality)
    formData.append("token", token)
    formData.append("timeExpire", String(tokenExpiresAt))
    formData.append("client", client)

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0",
        "X-Requested-Key": "de0cfuirtgf67a",
        "Sec-Fetch-Site": "cross-site",
        ...formData.getHeaders()
    }
 
    const response = await axios.post(url, formData, { headers: headers, ...requestOptions })
    const data = parseConvertVideoData(response.data as ConvertVideoRawData)

    return data
}

export default convertVideo