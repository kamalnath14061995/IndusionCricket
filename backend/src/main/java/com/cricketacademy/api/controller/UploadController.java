package com.cricketacademy.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLHandshakeException;
import javax.net.ssl.SSLParameters;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/admin/upload")
@PreAuthorize("hasRole('ADMIN')")
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.upload.max-size-bytes:20971520}") // default 20MB
    private long maxSizeBytes;

    // List of allowed domains for external uploads
    private static final List<String> ALLOWED_DOMAINS = Arrays.asList(
            "drive.google.com",
            "docs.google.com",
            "storage.googleapis.com",
            "localhost",
            "127.0.0.1",
            "ibb.co");

    private Path ensureUploadDir() throws IOException {
        Path dir = Paths.get(uploadDir).toAbsolutePath();
        Files.createDirectories(dir);
        return dir;
    }

    private static String getFileExtension(String filename) {
        if (filename == null)
            return "";
        int dot = filename.lastIndexOf('.');
        return (dot >= 0 && dot < filename.length() - 1) ? filename.substring(dot) : "";
    }

    private static String extFromContentType(String ct) {
        if (ct == null)
            return "";
        return switch (ct) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "video/mp4" -> ".mp4";
            case "video/webm" -> ".webm";
            case "application/pdf" -> ".pdf";
            case "text/plain" -> ".txt";
            default -> ""; // unknown, will fallback
        };
    }

    private static boolean isHttpUrl(String url) {
        return url != null && (url.startsWith("http://") || url.startsWith("https://"));
    }

    private boolean isSecureUrl(String url) {
        try {
            URI uri = URI.create(url);
            String host = uri.getHost();

            // Check if domain is in allowed list
            if (host != null) {
                for (String allowedDomain : ALLOWED_DOMAINS) {
                    if (host.equals(allowedDomain) || host.endsWith("." + allowedDomain)) {
                        return true;
                    }
                }
            }

            // Allow localhost and internal URLs
            if (host == null || host.equals("localhost") || host.equals("127.0.0.1")) {
                return true;
            }

            return false;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Empty file");
        }
        if (file.getSize() > maxSizeBytes) {
            return ResponseEntity.badRequest().body("File too large");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType != null && !contentType.startsWith("image/") && !contentType.startsWith("video/")) {
            return ResponseEntity.badRequest().body("Only image and video files are allowed");
        }

        Path dir = ensureUploadDir();

        String originalName = file.getOriginalFilename();
        String ext = getFileExtension(originalName);
        if (ext.isEmpty()) {
            ext = extFromContentType(file.getContentType());
        }
        if (ext.isEmpty()) {
            ext = ".bin"; // generic fallback
        }

        String filename = UUID.randomUUID() + ext;
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return ResponseEntity.ok("/uploads/" + filename);
    }

    @PostMapping(value = "/from-url", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> uploadFromUrl(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        String preferredName = body.get("filename");

        // Handle relative URLs for already uploaded files
        if (url != null && url.startsWith("/uploads/")) {
            return ResponseEntity.ok(url);
        }

        // Validate URL format
        if (!isHttpUrl(url)) {
            return ResponseEntity.badRequest().body("Invalid URL. Only http(s) URLs are allowed.");
        }

        try {
            SSLContext sslContext = SSLContext.getDefault(); // Use system default SSL context

            SSLParameters sslParams = new SSLParameters();
            sslParams.setProtocols(new String[] { "TLSv1.3", "TLSv1.2" });
            sslParams.setCipherSuites(new String[] {
                    "TLS_AES_256_GCM_SHA384",
                    "TLS_AES_128_GCM_SHA256",
                    "TLS_CHACHA20_POLY1305",
                    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
                    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
                    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
                    "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
                    "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
            });

            // Use default JVM-supported protocols and cipher suites for broad compatibility
            HttpClient client = HttpClient.newBuilder()
                    .sslContext(sslContext)
                    .connectTimeout(Duration.ofSeconds(15))
                    .followRedirects(HttpClient.Redirect.NORMAL)
                    .version(HttpClient.Version.HTTP_2)
                    .build();

            // Add headers to mimic browser behavior and reduce hotlink protection issues
            // Special handling for Google Drive links to obtain a direct-download URL
            String effectiveUrl = url;
            try {
                URI u = URI.create(url);
                String host = u.getHost() == null ? "" : u.getHost();
                if (host.equals("drive.google.com") || host.equals("docs.google.com")) {
                    String fileId = null;
                    String path = u.getPath();
                    if (path != null) {
                        java.util.regex.Matcher m = java.util.regex.Pattern.compile("/file/d/([^/]+)").matcher(path);
                        if (m.find()) {
                            fileId = m.group(1);
                        }
                    }
                    if (fileId == null) {
                        String query = u.getQuery();
                        if (query != null) {
                            for (String p : query.split("&")) {
                                int eq = p.indexOf('=');
                                String key = eq >= 0 ? p.substring(0, eq) : p;
                                String val = eq >= 0 ? p.substring(eq + 1) : "";
                                if ("id".equals(key)) {
                                    fileId = val;
                                    break;
                                }
                            }
                        }
                    }
                    if (fileId != null && !fileId.isEmpty()) {
                        // Direct download endpoint; HttpClient will follow redirects
                        effectiveUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
                    }
                }
            } catch (Exception ignored) {
            }

            URI targetUri = URI.create(effectiveUrl);
            String origin = targetUri.getScheme() + "://" + targetUri.getHost();
            int port = targetUri.getPort();
            if (port != -1 && port != 80 && port != 443) {
                origin += ":" + port;
            }
            HttpRequest req = HttpRequest.newBuilder(targetUri)
                    .timeout(Duration.ofSeconds(25))
                    .header("User-Agent",
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Accept", "image/*,video/*,*/*")
                    .header("Accept-Language", "en-US,en;q=0.9")
                    .header("Accept-Encoding", "gzip, deflate, br")
                    // Many hosts require Origin/Referer to allow resource access
                    .header("Origin", origin)
                    .header("Referer", origin + "/")
                    .GET()
                    .build();

            HttpResponse<byte[]> resp = client.send(req, HttpResponse.BodyHandlers.ofByteArray());

            if (resp.statusCode() >= 400) {
                // Enhanced error handling for Google Drive URLs
                if ((targetUri.getHost() != null && (targetUri.getHost().contains("drive.google.com")
                        || targetUri.getHost().contains("docs.google.com")))
                        && resp.statusCode() == 403) {
                    String message = "Access denied (403 Forbidden) when trying to fetch the Google Drive URL. " +
                            "This usually means the file or folder is not publicly shared. " +
                            "Please ensure the file or folder is shared publicly or accessible via a direct download link. "
                            +
                            "For folders, Google Drive does not allow direct downloads; you need to share individual files publicly. "
                            +
                            "Refer to Google Drive sharing settings to update permissions.";
                    return ResponseEntity.badRequest().body(message);
                }
                return ResponseEntity.badRequest().body("Failed to fetch URL: HTTP " + resp.statusCode() +
                        ". Server returned error status.");
            }

            byte[] data = resp.body();
            if (data == null || data.length == 0) {
                return ResponseEntity.badRequest().body("Empty content from URL");
            }

            if (data.length > maxSizeBytes) {
                return ResponseEntity.badRequest().body("File too large. Maximum size: " +
                        (maxSizeBytes / (1024 * 1024)) + "MB");
            }

            String ct = resp.headers().firstValue("content-type").orElse(null);

            // If Google Drive returned an HTML page, try confirm-token flow
            if (ct != null && ct.startsWith("text/html") && targetUri.getHost() != null &&
                    (targetUri.getHost().contains("drive.google.com")
                            || targetUri.getHost().contains("docs.google.com"))) {
                try {
                    String html = new String(resp.body(), java.nio.charset.StandardCharsets.UTF_8);
                    java.util.regex.Matcher m = java.util.regex.Pattern.compile("confirm=([0-9A-Za-z_\\-]+)")
                            .matcher(html);
                    String confirmToken = null;
                    if (m.find()) {
                        confirmToken = m.group(1);
                    }
                    // Extract fileId again from URL
                    String fileId2 = null;
                    try {
                        String path = targetUri.getPath();
                        if (path != null) {
                            java.util.regex.Matcher m2 = java.util.regex.Pattern.compile("/file/d/([^/]+)")
                                    .matcher(path);
                            if (m2.find())
                                fileId2 = m2.group(1);
                        }
                        if (fileId2 == null) {
                            String query = targetUri.getQuery();
                            if (query != null) {
                                for (String p : query.split("&")) {
                                    int eq = p.indexOf('=');
                                    String key = eq >= 0 ? p.substring(0, eq) : p;
                                    String val = eq >= 0 ? p.substring(eq + 1) : "";
                                    if ("id".equals(key)) {
                                        fileId2 = val;
                                        break;
                                    }
                                }
                            }
                        }
                    } catch (Exception ignored) {
                    }

                    if (confirmToken != null && fileId2 != null) {
                        String confirmUrl = "https://drive.google.com/uc?export=download&confirm=" + confirmToken
                                + "&id=" + fileId2;
                        // Collect cookies from first response
                        java.util.List<String> setCookies = resp.headers().allValues("set-cookie");
                        StringBuilder cookieSb = new StringBuilder();
                        for (String sc : setCookies) {
                            int semi = sc.indexOf(';');
                            String nv = semi >= 0 ? sc.substring(0, semi) : sc;
                            if (cookieSb.length() > 0)
                                cookieSb.append("; ");
                            cookieSb.append(nv);
                        }
                        String cookieHeader = cookieSb.toString();

                        HttpRequest confirmReq = HttpRequest.newBuilder(URI.create(confirmUrl))
                                .timeout(Duration.ofSeconds(25))
                                .header("User-Agent",
                                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                                .header("Accept", "image/*,video/*,*/*")
                                .header("Accept-Language", "en-US,en;q=0.9")
                                .header("Accept-Encoding", "gzip, deflate, br")
                                .header("Origin", origin)
                                .header("Referer", origin + "/")
                                .header("Cookie", cookieHeader)
                                .GET()
                                .build();

                        resp = client.send(confirmReq, HttpResponse.BodyHandlers.ofByteArray());
                        ct = resp.headers().firstValue("content-type").orElse(ct);
                    }
                } catch (Exception ignored) {
                }
            }

            // Validate content type
            if (ct != null && !ct.startsWith("image/") && !ct.startsWith("video/")) {
                return ResponseEntity.badRequest().body("Only image and video content types are allowed. " +
                        "Received content type: " + ct);
            }

            String nameFromUrl = null;
            try {
                String path = URI.create(url).getPath();
                if (path != null && !path.isEmpty()) {
                    int idx = path.lastIndexOf('/');
                    nameFromUrl = (idx >= 0 ? path.substring(idx + 1) : path);
                }
            } catch (IllegalArgumentException ignored) {
            }

            String ext = getFileExtension(preferredName);
            if (ext.isEmpty())
                ext = getFileExtension(nameFromUrl);
            if (ext.isEmpty())
                ext = extFromContentType(ct);
            if (ext.isEmpty())
                ext = ".bin";

            Path dir = ensureUploadDir();
            String filename = UUID.randomUUID() + ext;
            Files.write(dir.resolve(filename), data);
            return ResponseEntity.ok("/uploads/" + filename);

        } catch (SSLHandshakeException e) {
            // Log detailed SSL handshake error for debugging
            System.err.println("SSL Handshake failed: " + e.getMessage());
            System.err.println("SSL Protocol: " + e.getCause());

            return ResponseEntity.badRequest().body("SSL handshake failed: " + e.getMessage() +
                    ". The URL may have SSL/TLS issues, use an unsupported protocol version, " +
                    "or be blocked by the server. Please ensure the URL uses a valid SSL certificate.");

        } catch (NoSuchAlgorithmException e) {
            System.err.println("SSL Algorithm not available: " + e.getMessage());
            return ResponseEntity.badRequest().body("SSL configuration error: " + e.getMessage());

        } catch (IOException e) {
            System.err.println("Network/IO error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to fetch URL: " + e.getMessage() +
                    ". Network error or connection timeout occurred.");

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.badRequest().body("Upload interrupted: " + e.getMessage());

        } catch (Exception e) {
            System.err.println("Unexpected error during URL upload: " + e.getMessage());
            return ResponseEntity.badRequest().body("Unexpected error during URL upload: " +
                    e.getMessage());
        }
    }
}
