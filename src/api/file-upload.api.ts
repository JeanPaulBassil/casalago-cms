import { FileUpload, MultipleFileUpload } from './models/FileUpload'
import { ApiResponse } from './utils'
import { AbstractApi } from './utils/AbstractApi'

export class FileUploadApi extends AbstractApi<FileUpload> {
  readonly path = 'file-upload'

  constructor(secure = true) {
    super('file-upload', secure)
  }

  async uploadSingle(file: File): Promise<ApiResponse<FileUpload | MultipleFileUpload>> {
    const formData = new FormData()
    formData.append('image', file)
    // get boundary from form data
    // const boundary = formData.getBoundary()
    // Property getBoundary does not exist on type

    const response: ApiResponse<FileUpload> = (await this.doFetch({
      file: true,
      requestOptions: {
        method: 'POST',
        body: formData,
      },

      pathExtension: 'single',
    })) as ApiResponse<FileUpload>

    return {
      ...response,
      payload: {
        ...response.payload,
        image_url: response.payload.image_url,
        message: response.payload.message,
      },
    }
  }

  async uploadMultiple(files: File[]): Promise<ApiResponse<FileUpload | MultipleFileUpload>> {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    const response: ApiResponse<FileUpload | MultipleFileUpload> = (await this.doFetch({
      file: true,
      requestOptions: {
        method: 'POST',
        body: formData,
      },
      pathExtension: 'multiple',
    })) as ApiResponse<FileUpload | MultipleFileUpload>

    return response
  }
}
