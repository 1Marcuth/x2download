# Usage

```ts
import X2download from "x2download"

(async () => {
    const x2download = new X2download()

    const videoInfo = await x2download.getInfo("https://www.youtube.com/watch?v=Suj5RCyMP2Q&pp=ygULcm9iaW5ob3BsYXk%3D")
    const selectedVideoFormat = videoInfo.formats[0]
    const fileUrl = await x2download.getFileUrl({ format: selectedFormat })
    const fileName = `${videoInfo.fileName}.${selectedFormat.fileExtension}`
    
    await x2download.download({
        fileName: fileName,
        fileUrl: fileUrl
    })
})()
```

> ⚠️ **Note:** This library will only work in the browser using a cors proxy server. You must pass it in the constructor of `Xdownload({ corsProxyUrl: "<your-proxy-url>" })`