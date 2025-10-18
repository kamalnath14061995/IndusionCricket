import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class TestUploadVerification {
    public static void main(String[] args) {
        try {
            // Test with a known working image URL
            String testUrl = "https://picsum.photos/200/300";
            
            HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(testUrl))
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .GET()
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            System.out.println("URL: " + testUrl);
            System.out.println("Status Code: " + response.statusCode());
            System.out.println("Content Type: " + response.headers().firstValue("content-type").orElse("Unknown"));
            System.out.println("Content Length: " + response.headers().firstValue("content-length").orElse("Unknown"));
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
