import axios, { AxiosRequestConfig } from "axios"
import FormData from "../form-data"
import isUrl from "is-url"

import { CreateConvertJobRawData, Optional } from "../types"
import sleep from "../utils/sleep"

export type CreateConvertJobParsedData = {
    status: string
    jobId: Optional<string>
    statusCode: number
    fileUrl: Optional<string>
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
    requestOptions?: AxiosRequestConfig<FormData>
    corsProxyUrl?: string
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
    waitUntilGetUrl: true,
    requestOptions: {}
}

async function createConversionJob({
    serverUrl,
    videoId,
    fileType,
    quality,
    fileName,
    token,
    tokenExpiresAt,
    waitUntilGetUrl = defaultOptions.waitUntilGetUrl,
    requestOptions = defaultOptions.requestOptions,
    corsProxyUrl
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

    const url = `${corsProxyUrl ?? ""}${serverUrl}/api/json/convert`

    const formData = createFormData()

    const response = await axios.post(url, formData, { ...requestOptions })
    const data = parseConvertVideoData(response.data as CreateConvertJobRawData)

    while (!data.fileUrl && waitUntilGetUrl) {
        await sleep(500)
        
        try {
            const formData = createFormData()

            const currentResponse = await axios.post(url, formData, { timeout: 3000, ...requestOptions })
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

export default createConversionJob