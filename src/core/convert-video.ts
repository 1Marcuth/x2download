import FormData from "form-data"
import axios from "axios"

type ConvertVideoRawData = {
    c_status: string
    c_server: string
}

type ConvertVideoOptions = {
    videoId: string
    fileType: string
    quality: string
    token: string
    tokenExpiresAt: number
    client?: string
}

type ConvertVideoParsedData = {
    conversionStatus: string
    conversionServerUrl: string
}

function parseConvertVideoData(rawData: ConvertVideoRawData): ConvertVideoParsedData {
    const data: ConvertVideoParsedData = {
        conversionStatus: rawData.c_status,
        conversionServerUrl: rawData.c_server
    }

    return data
}

const defaultOptions = {
    client: "X2Download.app"
}

async function convertVideo({
    videoId,
    fileType,
    quality,
    token,
    tokenExpiresAt,
    client = defaultOptions.client
}: ConvertVideoOptions): Promise<ConvertVideoParsedData> {
    const url = "https://backend.svcenter.xyz/api/convert-by-45fc4be8916916ba3b8d61dd6e0d6994"

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
 
    const response = await axios.post(url, formData, { headers: headers })
    const data = parseConvertVideoData(response.data as ConvertVideoRawData)

    return data
}

export default convertVideo