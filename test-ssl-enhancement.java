import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

public class TestSSLEnhancement {

    public static void main(String[] args) {
        String[] testUrls = {
            "https://picsum.photos/200/300", // Valid URL
            "https://invalid-url.com/image.jpg", // Invalid URL
            "https://drive.google.com/uc?id=YOUR_IMAGE_ID" // Example of a Google Drive URL
        };

        for (String url : testUrls) {
            try {
                // Create a trust manager that does not validate certificate chains
                TrustManager[] trustAllCerts = new TrustManager[] {
                    new X509TrustManager() {
                        public X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[0];
                        }
                        public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                        public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                    }
                };

                // Install the all-trusting trust manager
                SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
                sslContext.init(null, trustAllCerts, new java.security.SecureRandom());

                HttpClient client = HttpClient.newBuilder()
                        .sslContext(sslContext)
                        .connectTimeout(Duration.ofSeconds(10))
                        .followRedirects(HttpClient.Redirect.NORMAL)
                        .build();

                HttpRequest req = HttpRequest.newBuilder(URI.create(url))
                        .timeout(Duration.ofSeconds(20))
                        .GET()
                        .build();

                HttpResponse<byte[]> resp = client.send(req, HttpResponse.BodyHandlers.ofByteArray());

                System.out.println("Testing URL: " + url);
                System.out.println("Response Code: " + resp.statusCode());
                System.out.println("Content Length: " + (resp.body() != null ? resp.body().length : 0) + " bytes");
                System.out.println("-------------------------------------------------");

            } catch (Exception e) {
                System.out.println("Error fetching URL: " + url);
                System.out.println("Exception: " + e.getMessage());
                System.out.println("-------------------------------------------------");
            }
        }
    }
}
