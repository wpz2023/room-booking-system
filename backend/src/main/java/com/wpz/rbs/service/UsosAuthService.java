package com.wpz.rbs.service;

import com.gargoylesoftware.htmlunit.*;
import com.gargoylesoftware.htmlunit.html.HtmlForm;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.google.api.client.auth.oauth.*;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.wpz.rbs.model.UsosAuth;
import com.wpz.rbs.repository.UsosAuthRepository;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@PropertySource({"classpath:application.properties", "classpath:security.properties"})
public class UsosAuthService {
    @Value("${security.consumerKey}")
    private String consumerKey;
    @Value("${security.consumerSecret}")
    private String consumerSecret;
    @Value("${security.usosApiEmail}")
    private String usosApiEmail;
    @Value("${security.usosApiPassword}")
    private String usosApiPassword;

    @Autowired
    private UsosAuthRepository usosAuthRepository;

    public HttpResponse usosApiRequest(GenericUrl genericUrl) throws IOException {
        Optional<UsosAuth> usosAuthOptional = usosAuthRepository.findById(1);
        if (usosAuthOptional.isEmpty()) throw new IOException("Problem podczas autoryzacji w USOS API");

        UsosAuth usosAuth = usosAuthOptional.get();
        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = consumerSecret;

        // Build OAuthParameters in order to use them while accessing the resource
        OAuthParameters oauthParameters = new OAuthParameters();
        signer.tokenSharedSecret = usosAuth.getTokenSecret();
        oauthParameters.signer = signer;
        oauthParameters.consumerKey = consumerKey;
        oauthParameters.token = usosAuth.getToken();
        oauthParameters.verifier = usosAuth.getUsosPin();
        return new NetHttpTransport().createRequestFactory(oauthParameters).buildGetRequest(genericUrl).execute();
    }

    public void checkRefreshUsosConnection() throws IOException {
        try {
            Optional<UsosAuth> usosAuth = usosAuthRepository.findById(1);
            if (usosAuth.isEmpty() && !logInToUsosApi()) throw new Exception();
            else {
                // re-download from db in case of empty/old usosAuth
                usosAuth = usosAuthRepository.findById(1);
                if (usosAuth.isEmpty()) throw new Exception();
                if (usosAuth.get().getExpDate().compareTo(new Date()) <= 0) logInToUsosApi();// TODO: refresh
            }
        } catch (Exception ignored) {
            throw new IOException("Problem podczas autoryzacji w USOS API");
        }
    }

    // made along with https://stackoverflow.com/questions/15194182/examples-for-oauth1-using-google-api-java-oauth
    private boolean logInToUsosApi() throws IOException {
        try {
            OAuthHmacSigner signer = new OAuthHmacSigner();
            signer.clientSharedSecret = consumerSecret;

            // Get Temporary Token
            OAuthGetTemporaryToken getTemporaryToken = new OAuthGetTemporaryToken("https://apps.usos.uj.edu.pl/services/oauth/request_token");
            getTemporaryToken.signer = signer;
            getTemporaryToken.consumerKey = consumerKey;
            getTemporaryToken.transport = new NetHttpTransport();
            getTemporaryToken.callback = "oob";
            OAuthCredentialsResponse temporaryTokenResponse = getTemporaryToken.execute();

            // Build Authenticate URL
            OAuthAuthorizeTemporaryTokenUrl accessTempToken = new OAuthAuthorizeTemporaryTokenUrl("https://apps.usos.uj.edu.pl/services/oauth/authorize");
            accessTempToken.temporaryToken = temporaryTokenResponse.token;
            signer.tokenSharedSecret = temporaryTokenResponse.tokenSecret;

            URL responseUrl;
            // open GUI-less url used to get PIN code
            try (final WebClient webClient = new WebClient(BrowserVersion.FIREFOX)) {
                webClient.getOptions().setJavaScriptEnabled(true);
                webClient.setAjaxController(new NicelyResynchronizingAjaxController());
                webClient.getOptions().setRedirectEnabled(true);
                webClient.getCache().setMaxSize(0);
                webClient.getOptions().setCssEnabled(false);

                HtmlPage loginPage = webClient.getPage(accessTempToken.build());
                HtmlForm form = loginPage.getHtmlElementById("fm1");
                form.getInputByName("username").type(usosApiEmail);
                form.getInputByName("password").type(usosApiPassword);

                HtmlPage resultPage = form.getInputByName("submit").click();
                responseUrl = resultPage.getUrl();
                if (checkUsosPinNotGiven(responseUrl)) try {
                    // sometimes api asks if it is really you
                    resultPage = resultPage.getHtmlElementById("local-continue").click();
                    responseUrl = resultPage.getUrl();
                } catch (ElementNotFoundException ignored) {
                }

                if (checkUsosPinNotGiven(responseUrl)) {
                    // giving permission to our app - asks only for first time
                    resultPage = resultPage.getHtmlElementById("local-allow").click();
                    responseUrl = resultPage.getUrl();
                }
            } catch (Exception e) {
                return false;
            }

            if (checkUsosPinNotGiven(responseUrl)) return false;
            String usosPinString = getPinOptional(responseUrl).get().getValue();

            // Get Access Token using Temporary token and Verifier Code
            OAuthGetAccessToken getAccessToken = new OAuthGetAccessToken("https://apps.usos.uj.edu.pl/services/oauth/access_token");
            getAccessToken.signer = signer;
            getAccessToken.temporaryToken = temporaryTokenResponse.token;
            getAccessToken.transport = new NetHttpTransport();
            getAccessToken.verifier = usosPinString;
            getAccessToken.consumerKey = consumerKey;
            OAuthCredentialsResponse accessTokenResponse = getAccessToken.execute();
            // save to database
            usosAuthRepository.save(new UsosAuth(usosPinString, accessTokenResponse.token, accessTokenResponse.tokenSecret));
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    private boolean checkUsosPinNotGiven(URL responseUrl) {
        try {
            Optional<NameValuePair> usosPin = getPinOptional(responseUrl);
            return usosPin.isEmpty();
        } catch (Exception e) {
            return true;
        }
    }

    private Optional<NameValuePair> getPinOptional(URL responseUrl) throws URISyntaxException {
        List<NameValuePair> params = URLEncodedUtils.parse(responseUrl.toURI(), StandardCharsets.UTF_8);
        return params.stream().filter(p -> Objects.equals(p.getName(), "oauth_verifier")).findFirst();
    }
}

