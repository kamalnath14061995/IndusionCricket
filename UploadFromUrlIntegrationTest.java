import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class UploadFromUrlIntegrationTest {
    public static void main(String[] args) {
        System.out.println("Testing Upload from URL Integration...");

        // Test with a valid image URL
        testValidImageUrl();

        // Test with an invalid URL
        testInvalidUrl();

        // Test with a URL that might have SSL issues
        testSslUrl();
    }

    private static void testValidImageUrl() {
        try {
            String jsonPayload = "{\"url\": \"https://httpbin.org/image/jpeg\", \"filename\": \"test-image.jpg\"}";

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(15))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/admin/upload/from-url"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Valid URL Test:");
            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response: " + response.body());

        } catch (Exception e) {
            System.err.println("Valid URL Test Failed: " + e.getMessage());
        }
    }

    private static void testInvalidUrl() {
        try {
            String jsonPayload = "{\"url\": \"invalid-url\", \"filename\": \"test-image.jpg\"}";

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(15))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/admin/upload/from-url"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("\nInvalid URL Test:");
            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response: " + response.body());

        } catch (Exception e) {
            System.err.println("Invalid URL Test Failed: " + e.getMessage());
        }
    }

    private static void testSslUrl() {
        try {
            String jsonPayload = "{\"url\": \"https://httpbin.org/image/png\", \"filename\": \"test-image.png\"}";

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(15))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8080/api/admin/upload/from-url"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("\nSSL URL Test:");
            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Response: " + response.body());

        } catch (Exception e) {
            System.err.println("SSL URL Test Failed: " + e.getMessage());
        }
    }
}
