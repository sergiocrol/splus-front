import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Community } from './community.model';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class CommunityService {
  private urlCommunity = `${environment.apiUrl}communities`;
  private urlDiscussions = `${environment.apiUrl}discussions`;
  private urlBlog = `${environment.apiUrl}blog`;
  private urlActivity = `${environment.apiUrl}activity`;
  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response',
  };

  constructor(private store: Store<fromRoot.State>, private http: HttpClient) {}

  parseElement(element: string) {
    const html = element;
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text;
  }

  fetchCommunities(): Observable<any> {
    this.store.dispatch(new UI.StartLoading());
    return this.http.get<any>(this.urlCommunity, this.httpOptions);
  }

  fetchDiscussions({
    communityId,
    discussionsCount,
  }: {
    communityId: string;
    discussionsCount: string;
  }): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlDiscussions}?communityId=${communityId}&discussionsCount=${discussionsCount}`,
        this.httpOptions
      )
      .pipe(
        map((data: any) =>
          data.body.data.discussions.map((dis: any) => {
            return {
              id: dis.id,
              title: dis.title,
              description: this.parseElement(dis.description),
              author: {
                id: dis.author.id,
                fullName: dis.author.fullName,
              },
              createdDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(dis.createdDate))
              ),
              displayDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(dis.displayDate))
              ),
            };
          })
        )
      );
  }

  fetchBlog({
    communityId,
    blogCount,
  }: {
    communityId: string;
    blogCount: string;
  }): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlBlog}?communityId=${communityId}&blogCount=${blogCount}`,
        this.httpOptions
      )
      .pipe(
        map((data: any) =>
          data.body.data.blogs.map((blg: any) => {
            return {
              id: blg.id,
              title: blg.title,
              description: this.parseElement(blg.description),
              author: {
                id: blg.author.id,
                fullName: blg.author.fullName,
              },
              createdDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(blg.createdDate))
              ),
              displayDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(blg.displayDate))
              ),
            };
          })
        )
      );
  }

  fetchActivity({
    communityId
  }: {
    communityId: string;
  }): Observable<any> {
    return this.http
      .get<any>(
        `${this.urlActivity}?communityId=${communityId}`,
        this.httpOptions
      )
      .pipe(
        map((data: any) =>
          data.body.data.files.map((file: any) => {
            return {
              id: file.id,
              title: file.title,
              description: this.parseElement(file.description),
              author: {
                id: file.author.id,
                fullName: file.author.fullName,
              },
              fileIdentifier: `https://samsung.sumtotal.host/Core/${file.fileIdentifier}.sumtfile?type=2`,
              createdDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(file.createdDate))
              ),
              displayDate: new Intl.DateTimeFormat('es-ES').format(
                new Date(Date.parse(file.displayDate))
              ),
            };
          })
        )
      );
  }

  fetchMedia({ url }: { url: string}): Observable<any> {
    const httpOptionsMedia = {
      withCredentials: true,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response'
    };
    return this.http.post<any>(url, httpOptionsMedia);
  }
}


// fetch("https://samsung.sumtotal.host/Core/4d5ce68cb03442cfbb1371fb843198a9.mp3.sumtfile?type=2", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "es-ES,es;q=0.9,en;q=0.8,eu;q=0.7,fr;q=0.6,ca;q=0.5",
//     "cache-control": "max-age=0",
//     "content-type": "application/x-www-form-urlencoded",
//     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "upgrade-insecure-requests": "1"
//   },
//   "referrer": "https://samsung.sumtotal.host/Broker/Token/Saml11.ashx?wa=wsignin1.0&wtrealm=https://samsung.sumtotal.host/core/&wreply=http://samsung.sumtotal.host/Core/4d5ce68cb03442cfbb1371fb843198a9.mp3.sumtfile?type=2",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "wa=wsignin1.0&wresult=%3Ctrust%3ARequestSecurityTokenResponseCollection+xmlns%3Atrust%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fws-sx%2Fws-trust%2F200512%22%3E%3Ctrust%3ARequestSecurityTokenResponse%3E%3Ctrust%3ALifetime%3E%3Cwsu%3ACreated+xmlns%3Awsu%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2F2004%2F01%2Foasis-200401-wss-wssecurity-utility-1.0.xsd%22%3E2021-05-23T06%3A43%3A33.014Z%3C%2Fwsu%3ACreated%3E%3Cwsu%3AExpires+xmlns%3Awsu%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2F2004%2F01%2Foasis-200401-wss-wssecurity-utility-1.0.xsd%22%3E2021-05-23T12%3A44%3A48.505Z%3C%2Fwsu%3AExpires%3E%3C%2Ftrust%3ALifetime%3E%3Cwsp%3AAppliesTo+xmlns%3Awsp%3D%22http%3A%2F%2Fschemas.xmlsoap.org%2Fws%2F2004%2F09%2Fpolicy%22%3E%3CEndpointReference+xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2005%2F08%2Faddressing%22%3E%3CAddress%3Ehttps%3A%2F%2Fsamsung.sumtotal.host%2Fcore%2F%3C%2FAddress%3E%3C%2FEndpointReference%3E%3C%2Fwsp%3AAppliesTo%3E%3Ctrust%3ARequestedSecurityToken%3E%3Csaml%3AAssertion+MajorVersion%3D%221%22+MinorVersion%3D%221%22+AssertionID%3D%22_8b8bdb9b-0e1e-4c1a-8968-7f34e6f0ac40%22+Issuer%3D%22SumTotalSTS%22+IssueInstant%3D%222021-05-23T10%3A49%3A48.536Z%22+xmlns%3Asaml%3D%22urn%3Aoasis%3Anames%3Atc%3ASAML%3A1.0%3Aassertion%22%3E%3Csaml%3AConditions+NotBefore%3D%222021-05-23T10%3A43%3A33.014Z%22+NotOnOrAfter%3D%222021-05-23T16%3A44%3A48.505Z%22%3E%3Csaml%3AAudienceRestrictionCondition%3E%3Csaml%3AAudience%3Ehttps%3A%2F%2Fsamsung.sumtotal.host%2Fcore%2F%3C%2Fsaml%3AAudience%3E%3C%2Fsaml%3AAudienceRestrictionCondition%3E%3C%2Fsaml%3AConditions%3E%3Csaml%3AAttributeStatement%3E%3Csaml%3ASubject%3E%3Csaml%3ASubjectConfirmation%3E%3Csaml%3AConfirmationMethod%3Eurn%3Aoasis%3Anames%3Atc%3ASAML%3A1.0%3Acm%3Abearer%3C%2Fsaml%3AConfirmationMethod%3E%3C%2Fsaml%3ASubjectConfirmation%3E%3C%2Fsaml%3ASubject%3E%3Csaml%3AAttribute+AttributeName%3D%22name%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.xmlsoap.org%2Fws%2F2005%2F05%2Fidentity%2Fclaims%22%3E%3Csaml%3AAttributeValue%3EAritzmSancho1%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22username%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fclaims%22%3E%3Csaml%3AAttributeValue%3EAritzmSancho1%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22role%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.microsoft.com%2Fws%2F2008%2F06%2Fidentity%2Fclaims%22%3E%3Csaml%3AAttributeValue%3EPortal+User%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22tenant%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fclaims%22%3E%3Csaml%3AAttributeValue%3ESAMSUNGELECTRONICS_PROD%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22brokersession%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fclaims%22%3E%3Csaml%3AAttributeValue%3E80b4ace8d6d5485293781b3317bee52a%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22culture%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fclaims%22%3E%3Csaml%3AAttributeValue%3Ees%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22language%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fclaims%22%3E%3Csaml%3AAttributeValue%3Ees%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22dateformat%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fdynamicclaims%22%3E%3Csaml%3AAttributeValue%3Ed%2FM%2Fyyyy%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22timeformat%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fdynamicclaims%22%3E%3Csaml%3AAttributeValue%3EHH%3Amm%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22userid%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fclaims%22%3E%3Csaml%3AAttributeValue%3E13712%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22personpk%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fdynamicclaims%22%3E%3Csaml%3AAttributeValue%3E255095%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22guestaccount%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fdynamicclaims%22%3E%3Csaml%3AAttributeValue%3E0%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22usertimezoneid%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fdynamicclaims%22%3E%3Csaml%3AAttributeValue%3EEurope%2FMadrid%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22propername%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fdynamicclaims%22%3E%3Csaml%3AAttributeValue%3EAritz%2BMendez%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3Csaml%3AAttribute+AttributeName%3D%22photourl%22+AttributeNamespace%3D%22http%3A%2F%2Fschemas.sumtotalsystems.com%2Fdynamicclaims%22%3E%3Csaml%3AAttributeValue%3E603c9d69eab84518a336a52f6c1c05ea.jpg%3C%2Fsaml%3AAttributeValue%3E%3C%2Fsaml%3AAttribute%3E%3C%2Fsaml%3AAttributeStatement%3E%3Cds%3ASignature+xmlns%3Ads%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2F09%2Fxmldsig%23%22%3E%3Cds%3ASignedInfo%3E%3Cds%3ACanonicalizationMethod+Algorithm%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2F10%2Fxml-exc-c14n%23%22+%2F%3E%3Cds%3ASignatureMethod+Algorithm%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmldsig-more%23rsa-sha256%22+%2F%3E%3Cds%3AReference+URI%3D%22%23_8b8bdb9b-0e1e-4c1a-8968-7f34e6f0ac40%22%3E%3Cds%3ATransforms%3E%3Cds%3ATransform+Algorithm%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2F09%2Fxmldsig%23enveloped-signature%22+%2F%3E%3Cds%3ATransform+Algorithm%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2F10%2Fxml-exc-c14n%23%22+%2F%3E%3C%2Fds%3ATransforms%3E%3Cds%3ADigestMethod+Algorithm%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2F04%2Fxmlenc%23sha256%22+%2F%3E%3Cds%3ADigestValue%3EGPP83%2FV6Woh6hemNf9IfG4yowAPaSh29HawbrQ%2FMZtw%3D%3C%2Fds%3ADigestValue%3E%3C%2Fds%3AReference%3E%3C%2Fds%3ASignedInfo%3E%3Cds%3ASignatureValue%3ETnef3zwXWwMw5ErKv%2BmPmPZXS%2B4NYTP6FClGA9bmUml5iF0QxPHlxvN8X8AssCtJXwKkn24mlBf34KTt2KkFTAQHV%2FTx6wy5Amu0q6ljbBKX84of0wimxgla2nF5Fd%2FL0iJxZPKIAtjXenMuHJ8GUWT46fBajQ1pAPSqZbug3wFDcnNX0KqOMcjV9AoKd4qWJuqpkPrP94HQzSTCk7PS4IfPkoLyH0kdvKURvm%2BeRs%2BeR9XIO97kUmHeYchddXb9XtPlZaU07%2B3RX5G3GxHfPmYsiKiuJByoH3lH%2F94NkZBG1%2BZqHCoJ96jJIKF9N0GMwzDNkfmtY3jxIDvt%2FI%2FLPg%3D%3D%3C%2Fds%3ASignatureValue%3E%3CKeyInfo+xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2F09%2Fxmldsig%23%22%3E%3CX509Data%3E%3CX509Certificate%3EMIIEHjCCAwagAwIBAgIQRqoIniy%2Fo7tKuivPA4F%2F5TANBgkqhkiG9w0BAQsFADAgMR4wHAYDVQQDDBUqLnN1bXRvdGFsc3lzdGVtcy5jb20wIBcNMTgwODMxMTQzMTA1WhgPMjA2ODA4MzExNDQxMDZaMCAxHjAcBgNVBAMMFSouc3VtdG90YWxzeXN0ZW1zLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAO6hxfElsXf55erjZBsZzeBXED2F4dwUKkM1ncMCoi0Hf2P7PzkXqpWhNU7AdCX%2FUs2Rv1ZVKFzPPscAXWuIcTyUS3s7lco6UKkvu3WnwjQZea5%2Fc9YfGHeba1KZrGmxv%2F1t91DrP%2BYG7SVcDFP4q6Px%2Bw%2F8SYkZjVEq5%2BbnwLXTyORTyCNzP6LEcxvr%2FeEFH2%2FvzjshbsGfy%2BJocklrBr6v8nRAuSG1pyvYq8oXbDckLXvqJheqP9F6lwu3aKN4jWbVFbJmG5WIpRj%2FYW7iA3up6JZs72xn4bgcyoRONVBS%2BI5wrsaGJEAjhz8kimGe1jOVi5RBQI06iw92L4zSgcECAwEAAaOCAVAwggFMMA8GA1UdDwEB%2FwQFAwMH%2F4AwgeMGA1UdJQSB2zCB2AYIKwYBBQUHAwEGCCsGAQUFBwMCBggrBgEFBQcDAwYIKwYBBQUHAwQGCCsGAQUFBwMIBgorBgEEAYI3AgEVBgorBgEEAYI3AgEWBgorBgEEAYI3CgMBBgorBgEEAYI3CgMDBgorBgEEAYI3CgMEBglghkgBhvhCBAEGCysGAQQBgjcKAwQBBggrBgEFBQcDBQYIKwYBBQUHAwYGCCsGAQUFBwMHBggrBgEFBQgCAgYKKwYBBAGCNxQCAgYIKwYBBQUHAwkGCCsGAQUFBwMNBggrBgEFBQcDDjA0BgNVHREELTAroCkGCisGAQQBgjcUAgOgGwwZYWRtaW5Ac3VtdG90YWxzeXN0ZW1zLmNvbTAdBgNVHQ4EFgQU9OyD81Dyqf%2B37adh6%2BwPFbDxKcgwDQYJKoZIhvcNAQELBQADggEBAGbMJwpCZC6v7lbCUw6vUb2U%2FVU6H%2BK3WO8u%2FfC9mKzF%2BlE%2BcKxFU0q8ZtrI5nihU9tG292B1xaoooUJPt39USinGNnCfjGOgsp9R07Z97FX5GjOVKNtmGhQLHPnbTHuqwPi9DZ2S6qICjbGNGNDeGen6qriYAtvqWjzPogRkkfhd3HjP0TtzBWYtTcYgUOBioa8gqsg4GCfDkA7TDkGfm7%2FnNJGzAgASA0R%2BVMfu4lfWCuJWi3RhFEEYfmCdeThc4miOcbvvRpI4VoXV13arS%2FeUnSIKWLfcDprydzTNraD62L0JbyMhBUphgfNyZMS0UjddqDDHNh%2BjrUT%2BROQlHY%3D%3C%2FX509Certificate%3E%3C%2FX509Data%3E%3C%2FKeyInfo%3E%3C%2Fds%3ASignature%3E%3C%2Fsaml%3AAssertion%3E%3C%2Ftrust%3ARequestedSecurityToken%3E%3Ctrust%3ARequestedAttachedReference%3E%3Co%3ASecurityTokenReference+k%3ATokenType%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2Foasis-wss-saml-token-profile-1.1%23SAMLV1.1%22+xmlns%3Ak%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2Foasis-wss-wssecurity-secext-1.1.xsd%22+xmlns%3Ao%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2F2004%2F01%2Foasis-200401-wss-wssecurity-secext-1.0.xsd%22%3E%3Co%3AKeyIdentifier+ValueType%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2Foasis-wss-saml-token-profile-1.0%23SAMLAssertionID%22%3E_8b8bdb9b-0e1e-4c1a-8968-7f34e6f0ac40%3C%2Fo%3AKeyIdentifier%3E%3C%2Fo%3ASecurityTokenReference%3E%3C%2Ftrust%3ARequestedAttachedReference%3E%3Ctrust%3ARequestedUnattachedReference%3E%3Co%3ASecurityTokenReference+k%3ATokenType%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2Foasis-wss-saml-token-profile-1.1%23SAMLV1.1%22+xmlns%3Ak%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2Foasis-wss-wssecurity-secext-1.1.xsd%22+xmlns%3Ao%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2F2004%2F01%2Foasis-200401-wss-wssecurity-secext-1.0.xsd%22%3E%3Co%3AKeyIdentifier+ValueType%3D%22http%3A%2F%2Fdocs.oasis-open.org%2Fwss%2Foasis-wss-saml-token-profile-1.0%23SAMLAssertionID%22%3E_8b8bdb9b-0e1e-4c1a-8968-7f34e6f0ac40%3C%2Fo%3AKeyIdentifier%3E%3C%2Fo%3ASecurityTokenReference%3E%3C%2Ftrust%3ARequestedUnattachedReference%3E%3Ctrust%3ATokenType%3Eurn%3Aoasis%3Anames%3Atc%3ASAML%3A1.0%3Aassertion%3C%2Ftrust%3ATokenType%3E%3Ctrust%3ARequestType%3Ehttp%3A%2F%2Fdocs.oasis-open.org%2Fws-sx%2Fws-trust%2F200512%2FIssue%3C%2Ftrust%3ARequestType%3E%3Ctrust%3AKeyType%3Ehttp%3A%2F%2Fdocs.oasis-open.org%2Fws-sx%2Fws-trust%2F200512%2FBearer%3C%2Ftrust%3AKeyType%3E%3C%2Ftrust%3ARequestSecurityTokenResponse%3E%3C%2Ftrust%3ARequestSecurityTokenResponseCollection%3E&wreply=https%3A%2F%2Fsamsung.sumtotal.host%2FCore%2F4d5ce68cb03442cfbb1371fb843198a9.mp3.sumtfile%3Ftype%3D2",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });