package mk.finki.calorietracker.exception;

/** Се фрла кога USDA или Claude API повикот не успее */
public class ExternalApiException extends RuntimeException {
    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
