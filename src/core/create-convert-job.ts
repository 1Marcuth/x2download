import FormData from "form-data"
import isUrl from "is-url"
import axios from "axios"

import { CreateConvertJobRawData } from "../types"
import sleep from "../utils/sleep"

type CreateConvertJobParsedData = {
    status: string
    jobId: string | null
    statusCode: number
    fileUrl: string | null
}

export type CreateConvertJobOptions = {
    serverUrl: string
    videoId: string
    fileType: string
    quality: string
    fileName: string
    token: string
    tokenExpiresAt: number
    waitUntilGetUrl?: boolean
}

function parseConvertVideoData(rawData: CreateConvertJobRawData): CreateConvertJobParsedData {
    const parsedData = {
        status: rawData.status,
        jobId: rawData.jobId ?? null,
        statusCode: rawData.statusCode,
        fileUrl: isUrl(rawData.result) ? rawData.result : null
    }

    return parsedData
}

const defaultOptions: Partial<CreateConvertJobOptions> = {
    waitUntilGetUrl: true
}

async function createConvertJob({
    serverUrl,
    videoId,
    fileType,
    quality,
    fileName,
    token,
    tokenExpiresAt,
    waitUntilGetUrl = defaultOptions.waitUntilGetUrl
}: CreateConvertJobOptions): Promise<CreateConvertJobParsedData> {
    function createFormData(): FormData {
        const formData = new FormData()

        formData.append("v_id", videoId)
        formData.append("ftype", fileType)
        formData.append("fquality", quality)
        formData.append("fname", fileName)
        formData.append("token", token)
        formData.append("timeExpire", String(tokenExpiresAt))

        return formData
    }

    const url = `${serverUrl}/api/json/convert`

    const formData = createFormData()

    const response = await axios.post(url, formData)
    const data = parseConvertVideoData(response.data as CreateConvertJobRawData)

    while (!data.fileUrl && waitUntilGetUrl) {
        await sleep(500)
        
        try {
            const formData = createFormData()

            const currentResponse = await axios.post(url, formData, { timeout: 3000 })
            const currentData = parseConvertVideoData(currentResponse.data as CreateConvertJobRawData)
            
            if (currentData.fileUrl) {
                data.fileUrl = currentData.fileUrl
            }
        } catch (error) {
            console.log(error)
        }
    }

    return data as CreateConvertJobParsedData
}

export default createConvertJob