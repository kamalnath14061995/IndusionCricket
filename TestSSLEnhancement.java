import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLParameters;

public class TestSSLEnhancement {
    public static void main(String[] args) {
        System.out.println("Testing SSL Enhancement for UploadController...");

        // Test with various HTTPS URLs to validate SSL handshake
        String[] testUrls = {
                "https://httpbin.org/get", // Known good HTTPS site
                "https://jsonplaceholder.typicode.com/posts/1", // Another good HTTPS site
                "https://api.github.com", // GitHub API
                "https://www.google.com" // Google
        };

        for (String testUrl : testUrls) {
            System.out.println("\nTesting URL: " + testUrl);
            testSSLConnection(testUrl);
        }

        System.out.println("\nSSL Enhancement Test Completed!");
    }

    private static void testSSLConnection(String url) {
        try {
            SSLContext sslContext = SSLContext.getDefault();

            SSLParameters sslParams = new SSLParameters();
            sslParams.setProtocols(new String[] { "TLSv1.3", "TLSv1.2" });
            sslParams.setCipherSuites(new String[] {
                    "TLS_AES_256_GCM_SHA384",
                    "TLS_AES_128_GCM_SHA256",
                    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
                    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
                    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
            });

            HttpClient client = HttpClient.newBuilder()
                    .sslContext(sslContext)
                    .sslParameters(sslParams)
                    .connectTimeout(Duration.ofSeconds(15))
                    .version(HttpClient.Version.HTTP_2)
                    .build();

            HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                    .timeout(Duration.ofSeconds(25))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .GET()
                    .build();

            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());

            System.out.println("✓ SUCCESS: Status Code: " + resp.statusCode());
            System.out.println("  Response Length: " + resp.body().length() + " characters");

        } catch (Exception e) {
            System.err.println("✗ FAILED: " + e.getClass().getSimpleName() + ": " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("  Cause: " + e.getCause().getMessage());
            }
        }
    }
}
