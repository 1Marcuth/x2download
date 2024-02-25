import axios from "axios"

import getVideoInfo, { Format, ParsedVideoInfo } from "./core/get-video-info"
import createConversionJob from "./core/create-conversion-job"
import convertVideo from "./core/convert-video"

export type X2downloadOptions = {
    corsProxyUrl?: string
}

export type GetFromFormatOptions = {
    info?: ParsedVideoInfo
    format: Format
}

export type DownloadOptions = {
    fileName: string
    fileUrl: string
}

class X2download {
    public corsProxyUrl?: string
    private info?: ParsedVideoInfo

    public constructor({
        corsProxyUrl
    }: X2downloadOptions = {}) {
        this.corsProxyUrl = corsProxyUrl
    }

    public async getInfo(url: string): Promise<ParsedVideoInfo> {
        const info = await getVideoInfo({
            videoUrl: url,
            corsProxyUrl: this.corsProxyUrl
        })

        this.info = info

        return info
    }

    public async getFileUrl({ format, info }: GetFromFormatOptions): Promise<string> {
        if (info) {
            this.info = info
        }

        if (!this.info) {
            throw new Error("No video information provided. Do a `.getInfo` or pass the information in the method call!")
        }

        const conversionResult = await convertVideo({
            videoId: this.info.id,
            fileType: format.fileExtension,
            quality: format.quality,
            token: this.info.token,
            tokenExpiresAt: this.info.tokenExpiresAt,
            corsProxyUrl: this.corsProxyUrl
        })

        const conversionJobResult = await createConversionJob({
            serverUrl: conversionResult.conversionServerUrl,
            videoId: this.info.id,
            fileType: format.fileExtension,
            fileName: this.info.fileName,
            quality: format.quality,
            token: this.info.token,
            tokenExpiresAt: this.info.tokenExpiresAt,
            corsProxyUrl: this.corsProxyUrl
        })

        if (!conversionJobResult.fileUrl) {
            throw new Error("Unable to get the video file url for an unknown reason!")
        }

        return conversionJobResult.fileUrl
    }

    public async download({ fileName, fileUrl }: DownloadOptions): Promise<void> {
        const url = `${this.corsProxyUrl ?? ""}${fileUrl}`
        const response = await axios.get(url, { responseType: "stream" })

        if (typeof window === "undefined") {
            const fs = require("fs")
            
            const data = await response.data
            const writer = fs.createWriteStream(fileName)
            data.pipe(writer)

            return new Promise((resolve, reject) => {
                writer.on("finish", resolve)
                writer.on("error", reject)
            })
        } else {
            const blob = new Blob([ response.data ])
            const $link = document.createElement("a")
            const dataUrl = URL.createObjectURL(blob)

            $link.href = dataUrl
            $link.download = fileName
            $link.click()
            $link.remove()

            URL.revokeObjectURL(dataUrl)
        }
    }
}

export default X2download