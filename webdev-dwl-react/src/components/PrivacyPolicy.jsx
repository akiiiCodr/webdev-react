import React from "react";

const PrivacyPolicy = () => {
  const styles = {
    container: {
      fontFamily: "'Arial', sans-serif",
      lineHeight: "1.6",
      color: "#333",
      margin: "0 auto",
      padding: "20px",
      maxWidth: "800px",
    },
    header: {
      marginBottom: "20px",
      textAlign: "center",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
    },
    lastUpdated: {
      fontSize: "16px",
      color: "#666",
    },
    section: {
      marginBottom: "20px",
    },
    h2: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#000",
      margin: "20px 0 10px",
    },
    p: {
      margin: "10px 0",
      fontSize: "16px",
      textAlign: "justify",
    },
    link: {
      color: "#007BFF",
      textDecoration: "none",
    },
    list: {
      marginLeft: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dwell-o's Privacy Notice</h1>
        <p style={styles.lastUpdated}>Last Updated: January 2025</p>
      </header>
      <main>
        <section style={styles.section}>
          <p style={styles.p}>
            This Privacy Notice is valid for all websites, or other services and
            offerings (collectively "the Services") operated by Dwell-o and its
            subsidiaries ("we", "us", or "Dwell-o").
          </p>
          <p style={styles.p}>
            In this Privacy Notice, we provide information about how Dwell-o
            processes personal data in relation to your use of the Services.
            Personal data is any data that can be used to identify you, either
            directly or indirectly.
          </p>
          <p style={styles.p}>
            As a metasearch company, Dwell-o may redirect you to the websites
            or apps of third parties. Please note that we have no control over
            these third-party services, and that your use of these third-party
            services is subject to the privacy policies posted on the
            corresponding websites or apps, and not to this Privacy Notice.
          </p>
        </section>
        <section style={styles.section}>
          <h2 style={styles.h2}>
            1. Who is responsible for the processing of personal data?
          </h2>
          <p style={styles.p}>
            Dwell-o controls the processing operations described in this Privacy
            Notice. Dwell-o is a company incorporated under the laws of the
            Philippines, and has its offices at PSU Village, San Vicente,
            Urdaneta City, Pangasinan, Philippines.
          </p>
          <p style={styles.p}>
            To exercise your data protection rights, or to ask a general
            question about the processing of your personal data by Dwell-o or
            about this Privacy Notice, you can contact our team by sending an
            email to{" "}
            <a href="mailto:dwello.panzio@gmail.com" style={styles.link}>
              dwello.panzio@gmail.com
            </a>
            .
          </p>
        </section>
        <section style={styles.section}>
          <h2 style={styles.h2}>2. Your rights</h2>
          <p style={styles.p}>
            You have the following rights with respect to your personal data.
            Please refer to Section 1 to get information about how to contact us
            and to exercise such rights.
          </p>
        </section>
        <section style={styles.section}>
          <h2 style={styles.h2}>2.1 General Rights</h2>
          <p style={styles.p}>
            You have the following legal data protection rights under the
            relevant legal conditions: the right to information (Section 16(a)
            & Section 11 of the Data Privacy Act), the right of access (Section
            16(c) of the DPA), the right to deletion (Section 16(f) of the DPA),
            the right to correction (Section 16(e) of the DPA), the right to
            restriction of processing (Section 16(b and f) of the DPA), and the
            right to data portability (Section 18(b) of the DPA).
          </p>
        </section>
        <section style={styles.section}>
          <h2 style={styles.h2}>2.2 Right to Revoke Consent</h2>
          <p style={styles.p}>
            You have the right to revoke consent previously provided to us at
            any time. The consequence of this will be that we will no longer
            process your personal data in relation to that consent in the
            future.
          </p>
        </section>
        <section style={styles.section}>
          <h2 style={styles.h2}>
            2.3 Right to object to processing of data based on legitimate
            interests
          </h2>
          <p style={styles.p}>
            If we process your personal data on the basis of legitimate
            interests, you have the right to object at any time for reasons
            arising out of your particular situation against such processing. If
            you object, we will no longer process your personal data unless we
            can establish compelling and legitimate grounds for processing that
            outweigh your interests, rights and freedoms, or if the processing
            aids the enforcing, exercising or defending of legal claims.
          </p>
        </section>
        <section style={styles.section}>
          <h2 style={styles.h2}>3. What data we collect from you?</h2>
          <p style={styles.p}>
            When you use our Services, we may process these types of personal
            data:
          </p>
          <ul style={styles.list}>
            <li style={styles.p}>
              <strong>User data:</strong> Personal data collected for the
              creation of a member account, such as: your name, email address,
              password. Contact details and other information you may share with
              us, such as your postal address, age, gender, country of
              residence, social network profiles, messages you sent to our team,
              feedback, comments, replies to surveys or interviews,
              participation to any of our promotional activities.
            </li>
            <li style={styles.p}>
              <strong>Usage data:</strong> Information about how you use our
              Services, including the details inputted by you when you conduct a
              search using our Services (including destination, date, number of
              guests, currency), deals viewed, and links clicked. Interaction
              with our marketing communication: we may collect information
              about your engagement with our direct marketing messages,
              including our newsletter and push notifications (for instance,
              analytics on the number of times you open our newsletter or click
              on hyperlinks in it).
            </li>
            <li style={styles.p}>
              <strong>Booking data:</strong> When you use our Services and click
              a link to an accommodation offer that is listed on our Services,
              the online booking site making that offer may send us personal
              data relating to any subsequent booking or reservation that you
              make on the online booking site.
            </li>
            <li style={styles.p}>
              <strong>Location data:</strong> We may process approximate
              location information based on your IP address (country or city
              level). Furthermore, with your prior consent, we may use GPS data
              to provide you with customized search results on your mobile.
            </li>
            <li style={styles.p}>
              <strong>Bank data:</strong> Even though we are not directly
              involved in the accommodation booking and payment process, we may
              ask you to share, from time to time, your bank details, for
              example to issue compensation to users.
            </li>
            <li style={styles.p}>
              <strong>Technical data:</strong> Examples include IP address,
              cookies, identification data (session ID, member ID, device ID),
              access status/HTTP status code, browser software and version,
              operating system and its interface, internet service provider,
              language and other configuration settings.
            </li>
          </ul>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>4. Why and how we use your personal data?</h2>
            <p style={styles.p}>
               Below you will find information about (i.) the reasons why we collect 
               and use your personal data, as well as, for each purpose, (ii.) the corresponding 
               legal basis and (iii.) the categories of personal data involved. Your personal data 
               may be used in the following ways:
            </p>
            <ul style={styles.list}>
                <li style={styles.p}>
                   Provide our Services, including help you compare accommodation prices and offers, 
                   and find your ideal accommodation.
                   <p style={styles.p}></p>
                  <p>
                     Legal basis: performance of a contract, consent.
                  </p>
                  <p>
                     Categories of personal data used: user data, usage data, booking data, location data, technical data.
                  </p>
                </li>
                <li style={styles.p}>
                   Create and maintain a safe and reliable environment for our Services, including for your Dwell-O user account.
                   <p style={styles.p}></p>
                   <p>
                      Legal basis: compliance with legal obligation, legitimate interest.
                   </p>
                   <p>
                      Categories of personal data used: usage data, technical data.
                   </p>
                </li>
                <li style={styles.p}>
                   Understand how you use our Services and use the feedback you may send us to improve our Services, identify 
                   trends in the industry, and develop new products and features to improve your experience.
                   <p style={styles.p}></p>
                   <p>
                      Legal basis: consent, legitimate interest.
                   </p>
                   <p>
                      Categories of personal data used: user data, usage data, booking data, technical data.
                   </p>
                </li>
                <li style={styles.p}>
                   Send you direct marketing communication about our Services or related services, provide you with advertisement 
                   on our Services as well as on third party websites (whether personalized or not), and otherwise administer 
                   promotional activities (such as sweepstakes and similar giveaways).
                </li>
                <p style={styles.p}></p>
                <p>
                   Legal basis: consent, legitimate interest.
                </p>
                <p>
                   Categories of personal data used: user data, usage data, technical data.
                </p>
                <li style={styles.p}>
                   Communicate with you, respond to your questions and comments, and provide customer service.
                </li>
                <p style={styles.p}></p>
                <p>
                   Legal basis: performance of a contract, legitimate interest.
                </p>
                <p>
                   Categories of personal data used: user data, usage data, booking data, bank data.
                </p>
                <li style={styles.p}>
                   Comply with legal obligations, requests from law enforcement, prevent fraud and establish, 
                   exercise or defend legal claims.
                </li>
                <p style={styles}></p>
                <p>
                   Legal basis: compliance with legal obligation, legitimate interest, performance of a contract.
                </p>
                <p>
                   Categories of personal data used: user data, usage data, booking data, technical data.
                </p>
            </ul>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>5.  With whom we share your data?</h2>
            <p style={styles.p}>
               We may share your personal data with the following categories of recipients, provided there is an appropriate legal basis:
            </p>
            <ul style={styles.list}>
                <li style={styles.p}>
                   Our wholly owned subsidiaries.
                </li>
                <li style={styles.p}>
                   Authentication partners: for instance, when you sign in or log into our Services using third-party services such as 
                   Google. For details on how Google handles your data, check out{" "}
                   <a href="https://business.safety.google/privacy/" style={styles.link}>
                     Google's privacy policy and terms
                   </a>. 
                </li>
                <li style={styles.p}>
                   Third party service providers who provide data processing services to us, such as: hosting and storage providers,customer 
                   service providers, communications providers, security and fraud prevention providers, debt collectors, analytics, advertising, 
                   and marketing providers.
                </li>
                <li style={styles.p}>
                   Third party service providers who provide services to us that are independent data controllers, such as security and fraud prevention 
                   services, social media networks and advertising and marketing providers.
                </li>
                <li style={styles.p}>
                   Business partners that we may jointly offer products or services with. These are services offered through our Services in 
                   conjunction with other third parties.
                </li>
                <li style={styles.p}>
                   Third party travel suppliers such as hotels, airlines, car rental, insurance, property owners, travel guide or activity providers.
                </li>
                <li style={styles.p}>
                   Law Enforcement Authorities. To prevent, detect and prosecute illegal activities, threats to state or public security and to 
                   prevent threats to people’s lives.
                </li>
                <li style={styles.p}>
                   As part of a corporate transaction such as a merger, divesture, consolidation, or asset sale.
                </li>
            </ul>
            <p style={styles.p}></p>
            <p style={styles.p}>
               If we transfer data to our service providers, they may only use the data to perform their tasks. The service providers have been carefully 
               selected and commissioned by us. They are contractually bound to our instructions, have suitable technical and organizational measures and 
               are regularly monitored by us.
            </p>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>6. Information on cookies</h2>
            <p style={styles.p}>
               Whenever you use our Services, we use cookies and other online tracking technologies. In this paragraph, you will find information about what 
               ‘cookies’ are, how they are used by Dwell-o, and how to manage your preferences.
            </p>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>6.1 What are cookies?</h2>
            <p style={styles.p}>
               Cookies are small text files which are downloaded on your device when you visit a website or an app. Alongside cookies, we may use other tracking 
               technologies such as web beacons, tags or pixels (tiny graphic images placed on a web page, which indicate that such page has been viewed), 
               or Software Development Kits (SDKs – tracking technology stored in an app). In this paragraph, cookies and other tracking technologies will be 
               generally referred to as “cookies”.
            </p>
            <p style={styles.p}>
               Cookies allow websites to recognize users’ devices and to store information about the content users view and interact with, and therefore provide 
               them with a customized experience (for instance, remember preferences and settings).
            </p>
            <p style={styles.p}>
               Cookies can be divided into different categories:
            </p>
            <ul style={styles.list}>
                <li style={styles.p}>
                   Depending on their operator:
                </li>
                <ul style={styles.list}>
                    <li style={styles.p}>
                       First-party cookies are placed by trivago on our websites and apps;
                    </li>
                    <li>
                       Third-party cookies are operated on our websites or apps by external providers, such as advertising partners, security providers and social media partners.
                    </li>
                </ul>
            </ul>
            <ul style={styles.list}>
                <li style={styles.p}>
                   Depending on their duration:
                </li>
                <ul style={styles.list}>
                    <li style={styles.p}>
                       Session cookies: cookies that are automatically deleted when you close your browser.
                    </li>
                    <li>
                       Persistent cookies: cookies that are automatically deleted after a set duration that can vary depending on the cookie. 
                       You can delete cookies in your browser security settings at any time.
                    </li>
                </ul>
            </ul>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>6.2 How does Dwell-o use cookies?</h2>
            <p style={styles.p}>
               Dwell-o, or external providers operating third-party cookies on our websites or app, 
               use cookies described in the section above in the following ways:
            </p>
            <ul style={styles.list}>
                <li style={styles.p}>
                   Strictly necessary: these cookies are necessary to enable you to use our Services. 
                   Without these cookies, our Services cannot be properly provided.
                </li>
                <li style={styles.p}>
                   Functional cookies: these cookies allow us to remember choices you have made on our websites or apps 
                   (for instance, the language or currency you have selected) and provide you with enhanced and personalized features. 
                   If you do not allow these cookies, then some or all of these functionalities may not perform properly.
                </li>
                <li style={styles.p}>
                   Performance cookies: these cookies, either placed by us or in some cases by our business partners, 
                   allow us to collect information about the performance of our Services (i.e. which pages are accessed/used the most or the least). 
                   We use this information to maintain, develop and improve our Services. If you do not allow these cookies we will not know when you 
                   have visited our websites and apps and will not be able to monitor their performance.
                </li>
                <li style={styles.p}>
                   Marketing cookies: These cookies are set through our websites and apps by our advertising partners. They may be used by these 
                   companies to build a profile of your interests and show you relevant ads on third-party websites. If you do not allow these cookies, 
                   you will experience less personalized advertising.
                </li>
            </ul>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>6.3  How to manage your cookie preferences?</h2>
            <p style={styles.p}>
               You can withdraw or modify your consent to our use of non-essential cookies at any time by using the corresponding link in the footer 
               of our websites, or by configuring your web browser settings to decline cookies by visiting the “Help” section of your browser’s toolbar.
            </p>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>7. How does Dwell-o protect your data?</h2>
            <p style={styles.p}>
               As part of our commitment to safeguard your personal data, we have taken appropriate technical and organizational measures to protect your personal 
               data from being accidentally or intentionally manipulated, lost, destroyed, or accessed by unauthorized persons.
            </p>
        </section>
        <section style={styles.section}>
            <h2 style={styles.h2}>8. When will your data be deleted?</h2>
            <p style={styles.p}>
               We keep your personal data only for as long as needed or permitted in light of the purposes for which it was collected and consistent with applicable law. 
               Thereafter, we delete the data immediately, unless we still need the data until the expiry of statutory limitation periods (e.g. for evidence purposes for 
               civil law claims or accounting and tax law reasons), or if there is another legal basis under data protection law for the continued processing of your data 
               in the specific individual case. We will anonymize your data if we intend to use it for analytical statistical purposes over longer periods.
            </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
