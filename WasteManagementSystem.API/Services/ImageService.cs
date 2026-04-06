using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MailKit;

namespace WasteManagementSystem.API.Services
{
    public class ImageService : IImageService
    {
        private readonly Cloudinary _cloudinary;

        public ImageService(IConfiguration config)
        {
            var cloudName = config["Cloudinary:CloudName"];
            var apiKey = config["Cloudinary:ApiKey"];
            var apiSecret = config["Cloudinary:ApiSecret"];
            _cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
        }

        public async Task<List<(string Url, string PublicId)>> UploadImagesAsync(
            List<IFormFile> files,
            string reportId,
            string FolderName
        )
        {
            var results = new List<(string, string)>();

            foreach (var file in files)
            {
                await using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    PublicId = $"{FolderName}/{reportId}/{Guid.NewGuid()}",
                    Folder = FolderName,
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                results.Add((uploadResult.SecureUrl.ToString(), uploadResult.PublicId));
            }

            return results;
        }

        public async Task<List<(string Url, string PublicId)>> UploadQrAsync(
            byte[] qrImageBytes,
            string eventId,
            string FolderName
        )
        {
            var results = new List<(string, string)>();

            var uploadResult = await _cloudinary.UploadAsync(
                new ImageUploadParams
                {
                    File = new FileDescription("qr.png", new MemoryStream(qrImageBytes)),
                    PublicId = $"{FolderName}/{eventId}/qr",
                    Folder = FolderName,
                }
            );

            results.Add((uploadResult.SecureUrl.ToString(), uploadResult.PublicId));

            return results;
        }

        public async Task DeleteImageAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deleteParams);

            if (result.Result != "ok")
                throw new Exception("Failed to delete image");
        }

        public string GetImageUrl(string publicId)
        {
            return _cloudinary.Api.UrlImgUp.Secure(true).BuildUrl(publicId);
        }
    }
}
