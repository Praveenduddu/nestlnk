package com.interiorcolab.service;

import com.interiorcolab.model.PropertyBrief;
import com.interiorcolab.model.Quotation;
import com.interiorcolab.repository.PropertyBriefRepository;
import com.interiorcolab.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIComparisonService {

    private final AuthService authService;
    private final PropertyBriefRepository propertyBriefRepository;
    private final QuotationRepository quotationRepository;

    @Transactional(readOnly = true)
    public String getComparisonContext(UUID propertyId, String userQuestion) {
        PropertyBrief property = propertyBriefRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        List<Quotation> quotes = quotationRepository.findByPropertyIdOrderByEstimatedCostAsc(propertyId);

        return String.format(
            "You are an expert interior design consultant. \n" +
            "Property Scope: %s\n" +
            "Property Type: %s in %s\n" +
            "Budget Range: ₹%s - ₹%s\n\n" +
            "Quotations Received:\n%s\n\n" +
            "User Question: %s\n\n" +
            "Provide a concise, professional comparison analysis. Use markdown for bolding firm names. Focus on value, material quality, and timeline realism.",
            property.getScope(),
            property.getPropertyType(),
            property.getCity(),
            property.getBudgetMin(),
            property.getBudgetMax(),
            formatQuotesForAI(quotes),
            userQuestion
        );
    }

    public String compareQuotations(UUID propertyId, String userEmail, String userQuestion) {
        String apiKey = authService.getGeminiApiKey(userEmail);
        if (apiKey == null) {
            throw new RuntimeException("Gemini API Key not configured. Please add it in your profile.");
        }
        
        String contextPrompt = getComparisonContext(propertyId, userQuestion);
        return callGemini(apiKey, contextPrompt);
    }

    public void streamCompareQuotations(UUID propertyId, String userEmail, String userQuestion, Consumer<String> onChunk) {
        String apiKey = authService.getGeminiApiKey(userEmail);
        if (apiKey == null) {
            throw new RuntimeException("Gemini API Key not configured.");
        }

        log.info("Building context for property {}...", propertyId);
        String contextPrompt = getComparisonContext(propertyId, userQuestion);
        
        log.info("Starting Gemini Stream...");
        callGeminiStream(apiKey, contextPrompt, onChunk);
    }

    private String formatQuotesForAI(List<Quotation> quotes) {
        StringBuilder sb = new StringBuilder();
        for (Quotation q : quotes) {
            sb.append(String.format("- %s: Total ₹%s, Design ₹%s, Materials ₹%s, Timeline: %s\n",
                q.getFirm().getCompanyName() != null ? q.getFirm().getCompanyName() : q.getFirm().getName(),
                q.getEstimatedCost(), q.getDesignCost(), q.getMaterialCost(), q.getTimeline()));
        }
        return sb.toString();
    }

    private String callGemini(String apiKey, String prompt) {
        try (Client client = Client.builder().apiKey(apiKey).build()) {
            log.info("Calling Google GenAI SDK (gemini-1.5-flash)...");
            GenerateContentResponse response = client.models.generateContent("gemini-1.5-flash", prompt, null);
            return response.text();
        } catch (Exception e) {
            log.error("Google GenAI SDK failure: {}", e.getMessage());
            throw new RuntimeException("AI Service is currently unavailable. Please verify your API key.");
        }
    }

    private void callGeminiStream(String apiKey, String prompt, Consumer<String> onChunk) {
        try (Client client = Client.builder().apiKey(apiKey).build()) {
            log.info("Calling Google GenAI Stream SDK (gemini-flash-latest)...");
            
            Iterable<GenerateContentResponse> stream = client.models.generateContentStream("gemini-flash-latest", prompt, null);
            
            for (GenerateContentResponse response : stream) {
                String text = response.text();
                if (text != null && !text.isEmpty()) {
                    onChunk.accept(text);
                }
            }
            log.info("Google GenAI SDK Stream completed.");
        } catch (com.google.genai.errors.ClientException e) {
            String msg = e.getMessage();
            log.error("Google GenAI SDK Stream Client Failure: {}", msg);
            if (msg.contains("429") || msg.contains("quota")) {
                onChunk.accept("Error: Gemini API Quota exceeded. Please try again in 1 minute or check your Google AI Studio plan.");
            } else {
                onChunk.accept("I encountered a technical glitch while streaming (Code: " + (msg != null ? msg.substring(0, Math.min(msg.length(), 20)) : "Unknown") + "). Please try again.");
            }
        } catch (Exception e) {
            log.error("Google GenAI SDK Stream failure", e);
            onChunk.accept("I encountered a technical glitch while streaming. Please try again.");
        }
    }
}
