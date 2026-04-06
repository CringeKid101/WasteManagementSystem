namespace WasteManagementSystem.API.Services
{
    public interface IImageService
    {
        Task<List<(string Url, string PublicId)>> UploadImagesAsync(
            List<IFormFile> files,
            string reportId,
            string folderName
        );

        Task<List<(string Url, string PublicId)>> UploadQrAsync(
            byte[] qrImageBytes,
            string eventId,
            string folderName
        );
    }
}
