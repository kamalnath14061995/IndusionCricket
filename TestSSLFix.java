import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLParameters;

public class TestSSLFix {
    public static void main(String[] args) {
        try {
            // Test the new SSL configuration
            SSLContext sslContext = SSLContext.getDefault();

            SSLParameters sslParams = new SSLParameters();
            sslParams.setProtocols(new String[] { "TLSv1.3", "TLSv1.2" });
            sslParams.setCipherSuites(new String[] {
                    "TLS_AES_256_GCM_SHA384",
                    "TLS_AES_128_GCM_SHA256",
                    "TLS_CHACHA20_POLY1305_SHA256",
                    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
                    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
                    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
                    "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
                    "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256"
            });

            HttpClient client = HttpClient.newBuilder()
                    .sslContext(sslContext)
                    .sslParameters(sslParams)
                    .connectTimeout(Duration.ofSeconds(15))
                    .version(HttpClient.Version.HTTP_2)
                    .build();

            // Test with a known good HTTPS URL
            String testUrl = "https://httpbin.org/get";

            HttpRequest req = HttpRequest.newBuilder(URI.create(testUrl))
                    .timeout(Duration.ofSeconds(25))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                    .GET()
                    .build();

            HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());

            System.out.println("SSL Test Successful!");
            System.out.println("Status Code: " + resp.statusCode());
            System.out.println("Response: " + resp.body().substring(0, 100) + "...");

        } catch (Exception e) {
            System.err.println("SSL Test Failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
