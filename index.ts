import createConvertJob from "./src/core/create-convert-job"
import convertVideo from "./src/core/convert-video"
import geVideoInfo from "./src/core/get-video-info"

;(async () => {
    const videoInfo = await geVideoInfo({ videoUrl: "https://www.youtube.com/watch?v=-uhMgPmSS_U" })

    console.log(videoInfo)

    const selectedFormat = videoInfo.formats[0]

    console.log(selectedFormat)

    const conversionResult = await convertVideo({
        videoId: videoInfo.id,
        fileType: selectedFormat.fileExtension,
        quality: selectedFormat.quality,
        token: videoInfo.token,
        tokenExpiresAt: videoInfo.tokenExpiresAt
    })

    console.log(conversionResult)

    const conversionJobResult = await createConvertJob({
        serverUrl: conversionResult.conversionServerUrl,
        videoId: videoInfo.id,
        fileName: videoInfo.fileName,
        fileType: selectedFormat.fileExtension,
        quality: selectedFormat.quality,
        token: videoInfo.token,
        tokenExpiresAt: videoInfo.tokenExpiresAt
    })

    console.log(conversionJobResult)
})();