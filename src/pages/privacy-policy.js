import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap';
import Footer from '../components/customer/footer';
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';
import Toolbar from '../components/customer/toolbar'
import constants from '../constants';
import { checkTokenExpAuth } from '../utils/services/auth';
import urls from '../utils/urls';

export default function PrivacyPolicy(props) {
    const [user, setUser] = useState({
        _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '',
        email: '', status: '', role: '', wishList: '', cart: '', entry_date: ''
    });

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getData() {
            const _decoded_token = await checkTokenExpAuth()
            if (_decoded_token != null) {
                setUser(_decoded_token);
                await getUser(_decoded_token._id);
            }
        }
        getData()
        return () => {
            source.cancel();
            getData;
        };
    }, []);

    async function getUser(id) {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
        }).catch((err) => {
            console.log('Get user error in TermsAndConditions', err);
        })
    }
    return (
        <div className='main_privacy_policy'>
            <Toolbar user={user} />
            <div className='_privacy_policy'>
                <p>
                    Terms and Conditions
                    <br />
                    Following are the terms and condition required to further proceed the order;
                    <br />
                    <br />
                    <br />
                    <h5>NATURE AND APPLICABILITY OF TERMS:</h5>
                    Please carefully go through these terms and conditions (“Terms”) and the privacy policy available at https://www.afghandarmaltoon.com/company/privacy (“Privacy Policy”) before you decide to access the Website or avail the services made available on the Website by medical store. These Terms and the Privacy Policy together constitute a legal agreement (“Agreement”) between you and afghandarmaltoon.com in connection with your visit to the Website and your use of the Services.
                    <br />
                    <br />
                    <br />
                    <h5>CONDITIONS OF USE:</h5>
                    You must be 18 years of age or older to register, use the Services, or visit or use the Website in any manner. By registering, visiting and using the Website or accepting this Agreement, you represent and warrant to afghandarmaltoon.com  that you are 18 years of age or older, and that you have the right, authority and capacity to use the Website and the Services available through the Website, and agree to and abide by this Agreement.
                    <br />
                    For the purposes of availing the Services and/or transacting with the Third Party Service Providers through the Website, You are required to obtain registration, in accordance with the procedure established by afghandarmaltoon.com in this regard. As part of the registration process, afghandarmaltoon.com may collect the following personal information from you:
                    <br />
                    Name;
                    <br />
                    User ID;
                    <br />
                    Email address;
                    <br />
                    Address (including country and ZIP/ postal code);
                    <br />
                    Phone number;
                    <br />
                    Password chosen by the User;
                    Valid financial account information; and
                    <br />
                    Other details as you may volunteer.
                    <br />
                    <br />
                    <br />
                    <h5>INFORMATION OF USE & CONFIDENTIAL:</h5>
                    All the information shared by customers will keep it in our secured database and will allow us to use the data in any mean.
                    <br />
                    <br />
                    <br />
                    <h5>CANCELLATION AND REFUND POLICY:</h5>
                    4.1 Customer will able to cancel the order within 3 hours after the placing the order through website or in any other mean which is Whatsapp, sms and phone call.
                    <br />
                    4.2 In case customer placed the specific medicine and will get the different medicine in the parcel, Medical store.com.pk is liable to resend the correct medicine which was committed to pay at the time of order placement or will refund the money through online transfer only.
                    <br />
                    <br />
                    <br />
                    <h5>AUTHORIZATION POLICY:</h5>
                    Medicalstore.com.pk authorizes the User to view and access the content available on or from the Website solely for ordering, receiving, delivering and communicating only as per this Agreement. The contents of the Website, information, text, graphics, images, logos, button icons, software code, design, and the collection, arrangement and assembly of content on the Website are the property of “Medicalstore.com.pk” and are protected under copyright, trademark and other laws. User shall not modify the afghandarmaltoon.com Content or reproduce, display, publicly perform, distribute, or otherwise use the afghandarmaltoon.com Content in any way for any public or commercial purpose or for personal gain.
                    <br />
                    <br />
                    RECORD:
                    <br />
                    Medicalstore.com.pk provide End-Users with a free facility known as ‘Records’ on its mobile application. Information available in your Records is of two types:
                    <br />
                    <br />
                    User-created:
                    <br />
                     Information uploaded by you or information generated during your interaction with afghandarmaltoon.com.
                    <br />
                    Your Records is only created after you have signed up and explicitly accepted the Terms.
                    <br />
                    <br />
                    <br />
                    <h5>TERMS FOR USER:</h5>
                    User are also prohibited from violating or attempting to violate the integrity or security of the Website or any afghandarmaltoon.com Content.
                    Intentionally submitting on the Website any incomplete, false or inaccurate information the user will be removed and blocked from the website.
                    Using any engine, software, tool, agent or other device or mechanism (such as spiders, robots, avatars or intelligent agents) to navigate or search the Website;
                    Attempting to decipher, decompile, disassemble or reverse engineer any part of the Website. The admin of website will file case against the component.
                    Copying or duplicating in any manner of com.pk Content or other information available from the Website;
                    Circumventing or disabling any digital rights management, usage rules, or other security features of the Software.
                    <br />
                    <br />
                    <br />
                    <h5>ACCESS TERM:</h5>
                    8.1 Your access or use of the Website, transaction on the Website and use of Services (as defined herein below) hosted or managed remotely through the Website, are governed by the following terms and conditions (hereinafter referred to as the Terms of Use”), including the applicable policies which are incorporated herein by way of reference. These Terms of Use constitutes a legal and binding contract between you (hereinafter referred to as “You” or “Your” or the “User”) on one part and afghandarmaltoon.com on the other Part.
                    <br />
                    8.2 The Website is a platform that facilitates
                    <br />
                     (i) online purchase of pharmaceutical products sold by various third party pharmacies and manufactures (Third Party Pharmacies)
                    <br />
                      (iii) online advertisements of various sponsors advertising and marketing their own good and services (“Third Party Advertisers”). The Third Party Pharmacies, Third Party Labs, Medical Experts and the Third Party Advertisers are collectively referred to as the “Third Party Service Providers”. Further the Website also serves as an information platform providing health and wellness related information to the Users accessing the Website (The services of Third Party Services Provider and the information services is collectively referred to as the “Services”).
                    <br />
                    <br />
                    8.4 The arrangement between the Third Party Service Providers, You and Us shall be governed in accordance with these Terms of Use. The Services would be made available to such natural persons who have agreed to use the Website after obtaining due registration, in accordance with the procedure as determined by Us, from time to time, (referred to as “You” or “Your” or “Yourself” or “User”, which terms shall also include natural persons who are accessing the Website merely as visitors). The Services are offered to you through various modes which shall include issue of discount coupons and vouchers that can be redeemed for various goods/ services offered for sale by relevant Third Party Service Providers. To facilitate the relation between you and the Third Party Service Providers through the Website, afghandarmaltoon.com shall send to you (promotional content including but not limited to emailers, notifications and messages).
                    <br />
                    8.5 You agree and acknowledge that the Website is a platform that you and Third Party Service Providers utilize to meet and interact with another for their transactions. Medicalstore.com.pk is not and cannot be a party to or any direct link or save as except as may be provided in these Terms of Use, control in any manner, any transaction between you and the Third Party Service Providers. Furthermore afghandarmaltoon.com is the marketplace where people used to come and buy medicines (afghandarmaltoon.com is not taking ownership of any medicine whether is legal or illegal medicines.
                    <br />
                    8.6 afghandarmaltoon.com reserves the right to change or modify these Terms of Use or any policy or guideline of the Website including the Privacy Policy, at any time and in its sole discretion. Any changes or modifications will be effective immediately upon posting the revisions on the Website and you waive any right you may have to receive specific notice of such changes or modifications. Your continued use of the Website will confirm your acceptance of such changes or modifications; therefore, you should frequently review these Terms of Use and applicable policies to understand the terms and conditions that apply to your use of the Website.
                    <br />
                    8.7 As a condition to your use of the Website, You must be 18 (eighteen) years of age or older to use or visit the Website in any manner. By visiting the Website or accepting these Terms of Use, You represent and warrant to afghandarmaltoon.com that you are 18 (eighteen) years of age or older, and that you have the right, authority and capacity to use the Website and agree to and abide by these Terms of Use.
                    <br />
                    8.8 Medicalstore.com.pk authorizes You to view and access the content available on the Website solely for the purposes of availing the Services, such as visiting, using, ordering, receiving, delivering and communicating only as per these Terms of Use. The contents on the Website including information, text, graphics, images, logos, button icons, software code, design, and the collection, arrangement and assembly of content, contains Third Party Service Providers’ content (“Third Party Content”) as well as in-house content provided by afghandarmaltoon.com including without limitation, text, copy, audio, video, photographs, illustrations, graphics and other visuals (“medicalstore.com.pk Content”) (collectively, “Content”). The afghandarmaltoon.com Content is the property of afghandarmaltoon.com and is protected under copyright, trademark and other applicable law(s). You shall not modify the afghandarmaltoon.com Content or reproduce, display, publicly perform, distribute, or otherwise use the afghandarmaltoon.com Content in any way for any public or commercial purpose or for personal gain.
                    <br />
                    8.9 Compliance with these Terms of Use would entitle you to a personal, non-exclusive, non-transferable, limited privilege to access and transact on the Website.
                    <br />
                    8.10 A registered id can only be utilized by the person whose details have been provided and afghandarmaltoon.com does not permit multiple persons to share a single log in/ registration id. However, a registered user, being also a parent or legal guardian of a person ‘incompetent to contract’ such as minors or persons with unsound mind, would be permitted to access and use the Website for the purposes of procuring the Services, on behalf of such persons.
                    <br />
                    8.11 Organizations, companies, and businesses may not become registered members on the Website or use the Website through individual members.
                    <br />
                    8.12 You agree and acknowledge that You would
                    <br />
                    (i) create only 1 (one) account;
                    <br />
                     (ii) provide accurate, truthful, current and complete information when creating Your account and in all Your dealings through the Website;
                    <br />
                     (iii) maintain and promptly update Your account information;
                    <br />
                     (iv) maintain the security of Your account by not sharing Your password with others and restricting access to Your account and Your computer;
                    <br />
                      (v) promptly notify afghandarmaltoon.com if You discover or otherwise suspect any security breaches relating to the Website; and
                    <br />
                      (vi) take responsibility for all the activities that occur under Your account and accept all risk of unauthorized access.
                    <br />
                    <br />
                    8.13 The Website uses temporary cookies to store certain data (that is not sensitive personal data or information) that is used by afghandarmaltoon.com for the technical administration of the Website, research and development, and for User administration. In the course of serving advertisements or optimizing services to You, afghandarmaltoon.com may allow authorized third parties to place or recognize a unique cookie on the Your browser. Medicalstore.com.pk does not store personally identifiable information in the cookies.
                </p>
                <br />
                <br />
                <br />
                <h5>  USE OF SERVICE AND THE WEBSITE:</h5>
                <p>
                    9.1 E-Commerce Platform for Pharmaceutical Products
                    <br />
                    Through the Website, afghandarmaltoon.com facilitates the purchase of drugs and other pharmaceutical products, and services offered for sale by Third Party Pharmacies (“Pharmaceutical Goods and Services”). You understand and agree that afghandarmaltoon.com and the Website merely provide hosting services to you and persons browsing / visiting the Website. All items offered for sale on the Website, and the content made available by the Third Party Pharmacies, are third party user generated contents and third party products. Medicalstore.com.pk has no control over such third party user generated contents and/ Pharmaceutical Goods and Services and does not – originate or initiate the transmission, or select the sender/recipient of the transmission, or the information contained in such transmission. The authenticity and genuineness of the Pharmaceutical Goods and Services made available by the Third Party Pharmacies through the Website shall be the sole responsibility of the Third Party Pharmacies. You understand and agree that afghandarmaltoon.com shall have no liability with respect to the authenticity of the Pharmaceutical Goods and Services being facilitated through the Website.
                    <br />
                    9.2 You understand and agree that all commercial / contractual terms, with respect to the sale/ purchase/ delivery and consumption of the Pharmaceutical Goods and Services are offered by and agreed to between You and the Third Party Pharmacies and the contract for purchase of any of the Pharmaceutical Goods and Services, offered for sale on the Website by the Third Party Pharmacies shall strictly be a bipartite contract between the Third Party Pharmacies and You.
                    <br />
                    9.3 The commercial / contractual terms include without limitation – price, shipping costs, payment methods, payment terms, date, period and mode of delivery, warranties related to Pharmaceutical Goods and Services offered for sale by the Third Party Pharmacies, and after sales services related to such Pharmaceutical Goods and Services. Medicalstore.com.pk does not have any control over, and does not determine or advise or in any way involve itself in the offering or acceptance of, such commercial / contractual terms offered by and agreed to, between you and the Third Party Pharmacies.
                    <br />
                    9.4 Medicalstore.com.pk does not make any representation or warranty as to legal title of the Pharmaceutical Goods and Services offered for sale by the Third Party Pharmacies on the Website. At no time shall any right, title, claim or interest in the products sold through or displayed on the Website vest with afghandarmaltoon.com nor shall afghandarmaltoon.com have any obligations or liabilities in respect of any transactions on the Website. You agree and acknowledge that the ownership of the inventory of such Pharmaceutical Goods and Services shall always vest with the Third Party Pharmacies, who are advertising or offering them for sale on the Website and are the ultimate sellers.
                    <br />
                    9.5 You agree and acknowledge that the Third Party Pharmacies shall be solely responsible for any claim/ liability/ damages that may arise in the event it is discovered that such Third Party Pharmacies do not have the sole and exclusive legal ownership over the Pharmaceutical Goods and Services that have been offered for sale on the Website by such Third Party Pharmacies, or did not have the absolute right, title and authority to deal in and offer for sale such Pharmaceutical Goods and Services on the Website.
                    <br />
                    Non-Performance of Contact:
                    <br />
                    <br />
                    <br />
                    You accept and acknowledge the following:
                    <br />
                    10.1 afghandarmaltoon.com is not responsible for any unsatisfactory, delayed, non-performance or breach of the contract entered into between You and the Third Party Pharmacies for purchase and sale of goods or services offered by such Third Party Pharmacies on the Website;
                    <br />
                    10.2 afghandarmaltoon.com cannot and does not guarantee that the concerned Third Party Pharmacies will perform any transaction concluded on the Website;
                    <br />
                    10.3 The Third Party Pharmacy(s) are solely responsible for ensuring that the Pharmaceutical Goods and Services offered for sale on the Website are kept in stock for successful fulfillment of orders received. Consequently, afghandarmaltoon.com is not responsible if the Third Party Pharmacy(s) does not satisfy the contract for sale of Pharmaceutical Goods and Services which are out of stock, back ordered or otherwise unavailable, but were shown as available on the Website at the time of placement of order by You.
                    <br />
                    10.4 afghandarmaltoon.com shall not and is not required to mediate or resolve any dispute or disagreement between you and Third Party Pharmacies. In particular, afghandarmaltoon.com does not implicitly or explicitly support or endorse the sale or purchase of any items or services on the Website.
                    <br />
                    <br />
                    <br />
                    Exhibition of drugs and publication of Third Party Pharmacies content on the Website:
                    <br />
                    11.1 You agree and acknowledge that the respective Third Party Pharmacies are exhibiting Third Party Content which includes catalogue of drugs/ pharmaceutical products or services, and information in relation to such drugs/ pharmaceutical products or services, on the Website.
                    <br />
                    11.2 he Third Party Content available on the Website, including without limitation, text, copy, audio, video, photographs, illustrations, graphics and other visuals, is for general information purposes only and does not constitute either an advertisement/ promotion of any drug being offered for sale by the Third Party Pharmacies on the Website or any professional medical advice, diagnosis, treatment or recommendations of any kind.
                    <br />
                    11.3. You acknowledge and agree that such Third Party Pharmacies shall be solely responsible for ensuring that such Third Party Content made available regarding the Pharmaceutical Goods and Services offered for sale on the Website, are not misleading and describe the actual condition of the Pharmaceutical Goods and Services. In this connection, it is solely the responsibility of the concerned Third Party Pharmacy(s) to ensure that all such information is accurate in all respects and there is no exaggeration or over emphasis on the specifics of such Pharmaceutical Goods and Services so as to mislead the Users in any manner. You acknowledge and understand that afghandarmaltoon.com provides no warranty or representation with respect to the authenticity/ veracity of the information provided on the Website and you must run your own independent check. You agree and acknowledge that afghandarmaltoon.com has not played any role in the ascertainment of the actual impact/ effect of any Pharmaceutical Goods and Services being offered for sale by the Third Party Pharmacies on the Website.
                    <br />
                    <br />
                    <br />
                    Prescription Drugs:
                    <br />
                    The Website is a platform that can be used by the Users to purchase various drugs and pharmaceutical products that requires a valid medical prescription issued by a medical expert/ doctor to be provided to a registered pharmacist for the purpose of dispensing such medicine (“Prescription Drugs”), offered for sale on the Website by Third Party Pharmacies. In order to purchase Prescription Drugs from Third Party Pharmacies through the Website, You are required to upload a scanned copy of the valid prescription on the Website or email the same to afghandarmaltoon.com. The order would not be processed and forwarded to the concerned Third Party Pharmacy(s) by afghandarmaltoon.com until it receives a copy of a valid prescription. Third Party Pharmacies will verify the prescription forwarded by you and in case of Third Party Pharmacy(s) observe any discrepancy in the prescription uploaded by you, the Third Party Pharmacy(s) will cancel the order immediately. You are also required to make the original prescription available at the time of receipt of delivery of Prescription Drugs. You shall allow the delivery agent to stamp the original prescription at the time of medicine delivery. Medicalstore.com.pk shall maintain a record of all the prescriptions uploaded by the Users.
                    <br />
                    <br />
                    <br />
                    Substitution of Prescribed Drugs:
                    <br />
                    13.1. You acknowledge and accept that the order for a substitute of a Prescription Drug would only be processed if the medical expert/ doctor has himself/ herself permitted for any other equivalent generic drug to be dispensed in place of the Prescription Drug in the prescription or if the prescription solely lists the salt names instead of a specific brand name.
                    <br />
                    13.2. You further acknowledge and accept that, in the absence of the above, the concerned Third Party Pharmacy would not dispense a substitute drug in place of the Prescription Drug.
                    <br />
                    <br />
                    <br />
                    Invitation to offer for sale:
                    <br />
                    14.1 Notwithstanding anything else contained in any other part of these Terms of Use, the listing of drugs and other pharmaceutical products on the Website by the Third Party Pharmacies is merely an ‘invitation to an offer for sale’ and not an ‘offer for sale’. The placement of an order by you shall constitute an offer by you to enter into an agreement with the Third Party Pharmacies (“Offer”). Post the Offer from the Third Party Pharmacies, afghandarmaltoon.com shall send an email to you with the information on the Offer along with the details of the concerned Third Party Pharmacy(s) who may undertake the sale, and such an email shall not be considered as an acceptance of the Offer. The acceptance of the Offer would only be undertaken by the Third Party Pharmacy(s) after the validation/ verification of the prescription by such Third Party Pharmacy (in case of Prescription Drugs) and the ascertainment of the available stock in the relevant Third Party Pharmacy(s) (in the case of prescription as well as other drugs/ pharmaceutical products), by way of a confirmatory email to be sent to You.
                    <br />
                    14.2 For the avoidance of any doubt, it is hereby clarified that any reference of the term ‘offer/ offered for sale by the Third Party Pharmacy’, as appearing in these Terms of Use, shall be construed solely as an ‘invitation to offer for sale’ by any such Third Party Pharmacy.
                    <br />
                    <br />
                    <br />
                    Transfer of Property and Completion of Sale:
                    <br />
                    15.1 Upon acceptance of the Offer by the concerned Third Party Pharmacy (being the brick and mortar pharmacy, the Pharmaceutical Drugs and Services would be dispensed at the pharmacy, in accordance with the terms of the order placed by you. Such dispensation shall also take place under the direct/ personal supervision of the pharmacist of the Third Party Pharmacy, wherever required under the applicable law(s).
                    <br />
                    15.2 You agree and acknowledge that the property and title in the Pharmaceutical Drugs and Services ordered by You shall stand immediately transferred to You upon the dispensation of Pharmaceutical Drugs and Services and the raising of the invoice at the concerned Third Party Pharmacy. Accordingly, the sale of Pharmaceutical Drugs and Services is concluded at the concerned Third Party Pharmacy itself.
                    <br />
                    15.3 The invoice in relation to the Pharmaceutical Drugs and Services that are required to be delivered to you shall be issued by the concerned Third Party Pharmacy (being the brick and mortar pharmacy) which is to process and satisfy the order for such Pharmaceutical Drugs and Services.
                    <br />
                    <br />
                    <br />
                    Delivery of Drugs:
                    <br />
                    16.1 The Pharmaceutical Drugs and Services shall be delivered by the Third Party Pharmacy or independent contractors. You accept and acknowledges that the Third Party Pharmacy or such other transporter/ courier/ delivery personnel, engaged by the Third Party Pharmacy or afghandarmaltoon.com, shall be independent contractors in-charge of the delivery of the Pharmaceutical Drugs and Services from the concerned Third Party Pharmacy to the address notified by You, with no control over the Pharmaceutical Drugs and Services and no additional obligation apart from standard delivery obligations and duty of care.
                    <br />
                    16.2 You further accept and acknowledge that afghandarmaltoon.com does not engage in the distribution of the Pharmaceutical Drugs and Services, and may provide the services of a third party transporter/ courier delivery personnel for the purposes of delivery of Pharmaceutical Drugs and Services from the concerned Third Party Pharmacy to the address notified by you.
                    <br />
                    <br />
                    <br />
                    Advertising Guidelines for the Website
                    <br />
                    17.1 As part of the Services provided by us; we facilitate and allow Third Party Advertisers to place advertisements on the Website. Accordingly, there are guidelines (as listed herein below) which the Third Party Advertisers have to follow for placing such advertisements (the “Advertising Policy”).
                    <br />
                    17.2 For the Users:
                    <br />
                    afghandarmaltoon.com clearly distinguishes between the editorial content and content that is created or provided by one of Our Third Party Advertisers. The advertisements will be labeled as “sponsored”, “from our Advertisers” or “advertisement”. This content will not be reviewed by our in-house editorial staff and shall not be subject to our editorial policy (as set out herein below) but shall be subject to the Advertising Policy, these Terms of Use (except the editorial policy) and the Privacy Policy.
                    <br />
                    17.3 For the Third Party Advertisers:
                    <br />
                     The Third Party Advertisers must be honest about the products or services their advertisements promote; the advertisement shall not create unrealistic expectation and must not be misleading or offending; must be responsible and of the highest standards and without compromising the consumer protection. The Advertising Policy applies to all the advertisements, listed or sought to be listed, on the Website.
                    17.4 For the Third Party Advertisers:
                    <br />
                    The Third Party Advertisers must be honest about the products or services their advertisements promote; the advertisement shall not create unrealistic expectation and must not be misleading or offending; must be responsible and of the highest standards and without compromising the consumer protection. The Advertising Policy applies to all the advertisements, listed or sought to be listed, on the Website.
                    <br />
                    17.5 General Rules:
                    <br />
                     All the advertisements must comply with the Advertising Policy, the terms of these Terms of Use (except the editorial policy) and the Privacy Policy. afghandarmaltoon.com may, at any time and without having to serve any prior notice to the Third Party Advertisers,
                    <br />
                      (i) upgrade, update, change, modify, or improve the Website or a part thereof in a manner it may deem fit, and
                    <br />
                      (ii) change the content of the Advertising Policy and/ or these Terms of Use and/ or the Privacy Policy. It is the responsibility of the Third Party Advertisers, in such cases, to review the terms of the Advertising Policy and/ or these Terms of Use and/ or the Privacy Policy, from time to time. Such change shall be made applicable when they are posted. Medicalstore.com.pk may also alter or remove any content from the Website without notice and without liability.
                    <br />
                    <br />
                    17.6 Review:
                    <br />
                     All the advertisements are subject to the review and approval of afghandarmaltoon.com. Medicalstore.com.pk reserves the right to reject or remove any advertisement in its sole discretion for any reason. Further, afghandarmaltoon.com also reserves the right to request modifications to any advertisement, and to require factual substantiation for any claim made in an advertisement.
                    <br />
                    17.7 Prohibited Content:
                    <br />
                    The advertisements must not infringe the intellectual property, privacy, publicity, copyright, or other legal rights of any person or entity. The advertisements must not be false, misleading, fraudulent, defamatory, or deceptive. The following advertisement content is prohibited:
                    content that demeans, degrades, or shows hate toward a particular race, gender, culture, country, belief, or toward any member of a protected class;
                    content depicting nudity, sexual behavior, or obscene gestures;
                    content depicting drug use;
                    content depicting excessive violence, including the harming of animals;
                    shocking, sensational, or disrespectful content;
                    deceptive, false or misleading content, including deceptive claims, offers, or business practices;
                    content that directs users to phishing links, malware, or similarly harmful codes or sites; and
                    Content that deceives the Users into providing personal information without their knowledge, under false pretenses, or to companies that resell, trade, or otherwise misuse that personal information.
                    <br />
                    17.8 Prohibited Advertisements:
                    <br />
                    <br />
                    <br />
                    Advertisements for the following products and services are prohibited:
                    <br />
                    a. Adult products and services (other than contraceptives; see below);
                    Cigarettes (including e-cigarettes), cigars, smokeless tobacco, and other tobacco products;
                    Products or services that bypass copyright protection, such as software or cable signal descramblers;
                    Products or services principally dedicated to selling counterfeit goods or engaging in copyright piracy;
                    get-rich-quick or pyramid schemes or offers or any other deceptive or fraudulent offers;
                    Illegal or recreational drugs or drug paraphernalia;
                    Counterfeit, fake or bootleg products, or replicas or imitations of designer products;
                    Firearms, weapons, ammunition, or accessories;
                    Advertisements that promote particular securities or that provide or allege to provide insider tips;
                    Any illegal conduct, product, or enterprise;
                    Unapproved pharmaceuticals and supplements;
                    Prescription drugs;
                    Products that have been subject to any government or regulatory action or warning;
                    Products with names that are confusingly similar to an unapproved pharmaceutical or supplement or controlled substance; and
                    Material that directly advertises products to or is intended to attract children under the age of 13.
                    Restricted Advertisement:
                    advertisements that promote or reference alcohol;
                    advertisements for online dating services;
                    advertisements for gambling and games of skill;
                    advertisements for lotteries;
                    advertisements for financial services;
                    advertisements for contraceptives;
                    advertisements for online pharmacies or pharmaceuticals; and
                    political advertisements.
                    <br />
                    <br />
                    <br />
                    19 Testimonial & Endorsement:
                    <br />
                    Any testimonials and endorsements contained in advertisements must comply with all applicable law(s), industry codes, rules, and regulations. For example, a clear and conspicuous disclaimer is required if an endorser’s results were atypical or if the endorser was paid
                    <br />
                    19.1 Medicalstore.com.pk recognizes and maintains a distinct separation between advertising and sponsored content and editorial content. All advertising or sponsored content on the Website of the Company will be clearly and unambiguously identified
                    <br />
                    19.2 A click on an advertisement may only link the User to the website of the Third Party Advertiser(s).
                    <br />
                    <br />
                    <br />
                    20 Editorial Policy for the Website:
                    <br />
                    20.1 As part of the Services, afghandarmaltoon.com provides afghandarmaltoon.com Content on the Website targeted at general public for informational purposes only and does not constitute professional medical advice, diagnosis, treatment or recommendations of any kind. Medicalstore.com.pk Content is subject to the following rules/ information:
                    <br />
                    20.2 Medicalstore.com.pk Content is original and is relevant to the general public;
                    <br />
                    20.3 Topics for afghandarmaltoon.com Content are selected by our board of qualified experts consisting of certified medical experts, pharmacist and medical professionals;
                    <br />
                    20.4 editorial board (as mentioned below) takes into account the latest trending health and wellness topics like dengue, swine flu, seasonal allergies, new vaccines, public awareness trends like breast cancer awareness month,” and ‘Healthy Heart Month’; as well as emerging health and nutrition trends like health benefits quinoa, use of BGR 34 for managing diabetes, alternative medicine like Ayurveda, homeopathy and much more;
                    <br />
                    20.5 Medicalstore.com.pk maintains principles of fairness, accuracy, objectivity, and responsible, independent reporting;
                    <br />
                    20.7 The member of afghandarmaltoon.com has to fully disclose any potential conflict of interest with any of the Third Party Service Providers;
                    <br />
                    20.8 Medicalstore.com.pk editorial staff holds the responsibility of providing objective, accurate, and balanced accounts of events and issues.
                    <br />
                    <br />
                    <br />
                    21. Your Profile, Collection, Use, Storage and Transfer of Personal Information:
                    <br />
                    your afghandarmaltoon.com profile is created to store record of Your Consultations and your personal health information online, including history, health conditions, allergies and medications.
                    Any information provided as part of a web Consultation or obtained from use of the Services by you becomes part of your afghandarmaltoon.com record. You agree to provide accurate information to help us serve you best to our knowledge, to periodically review such information and to update such information as and when necessary. Medicalstore.com.pk reserves the right to maintain, delete or destroy all communications and materials posted or uploaded to the Website according to its internal record retention and/or destruction policies. You might be contacted via email to review the information provided by you for afghandarmaltoon.com record or for the Services. Please make sure you provide a valid email-id and you update it as and when needed.
                    For additional information regarding use of information about you, please refer to the Privacy Policy.
                    Payment, Fees and Taxes:
                    Registration on the Website and the access to the information provided on the Website is free. Medicalstore.com.pk does not charge any fee for accessing, browsing and buying through the Website. You agree to make all payments directly to the respective Third Party Pharmacies for purchase of Pharmaceutical Goods and Services from such Third Party Pharmacies. The Third Party Pharmacies may choose to either personally collect such payment from you or may use the services of collection agents duly appointed in this regard. You agree and acknowledge that you shall not hold afghandarmaltoon.com responsible for any loss or damage caused to you during the process, due to any acts or omission on the part of third parties viz. the Third Party Pharmacies or the collection agents or for any actions/ omissions which are beyond the control of afghandarmaltoon.com
                    In relation to the diagnostic services being availed from the Website, Third Party Labs agree to pay all package fees, consulting fees and other fees applicable to the Third Party Labs use of such Services and the Third Party Labs shall not circumvent the fee structure. The fee is dependent on the package that the Third Party Labs purchase and not on actual usage of the Services. In relation to the Users using the diagnostic Services, the Users agree to make all payments directly to the respective Third Party Labs for use of the diagnostic Services from the Website. You agree and acknowledge that You shall not hold afghandarmaltoon.com responsible for any loss or damage caused to You during the process, due to any acts or omission on the part of the Third Party Labs’ any actions/ omissions which are beyond the control of afghandarmaltoon.com.
                    Each User / Third Party Service Providers are solely responsible for payment of all taxes, legal compliances, and statutory registrations and reporting. Medicalstore.com.pk is in no way responsible for any of the taxes except for its own income tax.
                    The subscription fees for the Services, if any charged by afghandarmaltoon.com, could be paid online through the facility made on the Website. Third parties support and services are required to process online fee payment. Which is specific to online payment in to bank account given by the administration of afghandarmaltoon.com. Medicalstore.com.pk is not responsible for any loss or damage caused to User/ Third Party Service Providers during this process as these third parties are beyond the control of afghandarmaltoon.com. The fees could also be paid offline and be either collected personally from the User/ Third Party Service Providers or required to be mailed to afghandarmaltoon.com at the following address: Al fiza glass tower gulshan e Iqbal block 10 near lizania restaurant.. All fees are exclusive of applicable taxes.
                    Medicalstore.com.pk reserves the right to modify the fee structure by providing on the Website which shall be considered as valid and agreed communication.
                    In order to process the payments, afghandarmaltoon.com might require details of User’s/ Third Party Service Providers’ bank account, credit card number etc. Please check Our Privacy Policy on how afghandarmaltoon.com uses the confidential information provided by Users.
                    <br />
                    <br />
                    <br />
                    Liability:
                    <br />
                    a.Medicalstore.com.pk shall not be responsible or liable in any manner to the Users or any Third Party Service Providers (collectively referred to as the “Other Parties”) for any losses, damage, injuries or expenses incurred by Other Parties as a result of any disclosures made by afghandarmaltoon.com, where Other Parties have consented to the making of such disclosures by afghandarmaltoon.com. If the Other Parties had revoked such consent under the terms of the Privacy Policy, then afghandarmaltoon.com shall not be responsible or liable in any manner to the Other Parties for any losses, damage, injuries or expenses incurred by the Other Parties as a result of any disclosures made by afghandarmaltoon.com prior to its actual receipt of such revocation.
                    The Services provided by afghandarmaltoon.com or any of its licensors or providers or Third Party Service Providers are provided ‘as is’, as available, and without any warranties or conditions (express or implied, including the implied warranties of merchantability, accuracy, fitness for a particular purpose, title and non-infringement, arising by statute or otherwise in law or from a course of dealing or usage or trade). Medicalstore.com.pk does not provide or make any representations, warranties or guarantees, express or implied about the Website or the Services. afghandarmaltoon.com does not verify any content or information provided by the Other Parties on the Website and to the fullest extent permitted by applicable law(s), disclaims all liability arising out of the Other Parties’ use or reliance upon the Website, the Services, the afghandarmaltoon.com Content, Third Party Contents, representations and warranties made by the Other Parties on the Website or any loss arising out of the manner in which the Services have been rendered.
                    The Website may be linked to the website of third parties, affiliates and business partners. Medicalstore.com.pk has no control over, and not liable or responsible for content, accuracy, validity, reliability, quality of such websites or made available by/through the Website. Inclusion of any link on the Website does not imply that afghandarmaltoon.com endorses the linked website. Other Parties may use the links and these services at their own risk.
                    Medicalstore.com.pk shall not be responsible for the mishaps/missed services due to no service/no show from the Other Parties; afghandarmaltoon.com shall not be responsible for any error in any of the services being provided by the Third Party Service Providers.
                    Users accept and acknowledge that afghandarmaltoon.com does not provide any representation or give any guarantee or warranty (whether express or implied, or whether arising by virtue of a statue or otherwise in law or from a course of dealing or usage or trade) in relation to the goods/ products and services made available on its Website by Third Party Service Providers, including any guarantee or warrantee that such goods/ products
                    <br />
                     (i) are merchantable;
                    <br />
                      (ii) fit for the purpose of which they are to be (or have been) purchased;
                    <br />
                      (iii) have accurate description;
                    <br />
                       (iv) do not cause any infringement; and
                    <br />
                       (v) that the Third Party Service Providers have legal title over the goods/products being offered for sale by them on the Website. Medicalstore.com.pk also does not provide any representation or give any guarantee or warranty (whether express or implied) about the Website or any of the Services offered or services offered or provided by the Third Party Service Providers.
                    The Other Parties further accept and acknowledge that afghandarmaltoon.com does not verify any content or information provided by either the Users or the Third Party Services/ or obtained from the Users or the Third Party Service Providers, and to fullest extent permitted by applicable law(s), disclaims all liability arising out of the Other Parties’ use or reliance upon the Website, the Services, the afghandarmaltoon.com Content, Third Party Content, representations and warranties made by the Other Parties on the Website or any opinion or suggestion given or expressed by afghandarmaltoon.com or any Third Party Service Providers in relation to any Services provided by afghandarmaltoon.com.
                    afghandarmaltoon.com assumes no responsibility, and shall not be liable for, any damages to, or viruses that may infect Other Parties’ equipment on account of the Other Parties’ access to, use of, or browsing the Website or the downloading of any material, data, text, images, video content, or audio content from the Website. If any of the Other Party is dissatisfied with the Website, the sole remedy of such Other Party(s) is to discontinue using the Website.
                    he listing of Third Party Service Providers on the Website is based on numerous factors including Users comments and feedbacks. In no event shall the Protected Entities (as defined herein below) be liable or responsible for the listing order of Third Party Service Providers on the Website.
                    To the maximum extent permitted by applicable law(s), afghandarmaltoon.com, its affiliates, independent contractors, service providers, consultants, licensors, agents, and representatives, and each of their respective directors, officers or employees (“Protected Entities”), shall not be liable for any direct, indirect, special, incidental, punitive, exemplary or consequential damages, or any other damages of any kind, arising from, or directly or indirectly related to,
                    <br />
                    <br />
                     (i) the use of, or the inability to use, the Website or the content, materials and functions related thereto;
                    <br />
                     (ii) User’s provision of information via the Website; even if such Protected Entity has been advised of the possibility of such damages.
                    <br />
                    <br />
                    In no event shall the Protected Entities be liable for, or in connection with,
                    <br />
                     (i) the provision of, or failure to provide, all or any products or service by a Third Party Service Provider to any User; or
                    <br />
                      (ii) any comments or feedback given by any of the Users in relation to the goods or services provided by any Third Party Service Providers; or
                    <br />
                      (ii) any content posted, transmitted, exchanged or received by or on behalf of any User, Third Party Service Providers or other person on or through the Website.
                    disclaims any liability in relation to the validity of the medical advice provided by the Medical Experts and the validity and legality of the e-prescription for dispensation of medicines and conduct of diagnostic tests. All liabilities arising out of any wrong diagnosis of medical condition by the Medical Experts and/ or arising from the e-prescription will be of the concerned Medical Expert. Further, all liabilities arising out of any wrong diagnosis report by the Third Party Labs and/ or arising from the wrong dispensation of the Pharmaceutical Goods and Services will be of the concerned Third Party Labs or the Third Party Pharmacies as the case may be.
                    The Users may share their previous medical history during interaction with the Medical Experts. The Users undertake to share such information at their own risk. Medicalstore.com.pk reserves the right to retain such information for the purpose of providing Services to the Users.
                    With respect to the Consultation Services, after selection of the type of treatment viz. Homeopathy, Allopathic or Ayurveda along with the specification of the disease by the patient, afghandarmaltoon.com will decide the Medical Expert to whom the query should be directed based on the information shared by the User. However, in no event the Protected Entities shall be held liable for the losses attributable to such decision making and in no event shall the Protected Entities be liable for any Consultation provided and/or e-prescription issued by the Medical Expert by using the interface of online medical consultancy.
                    The Users acknowledge that the Protected Entities merely act in the capacity of facilitators between the Other Parties by providing a platform for them to interact and transact. In no event shall the Protected Entities be held liable for any of the losses attributable to Services offered through the Website.
                    In no event shall the Protected Entities be liable for failure on the part of the Users or Third Party Service Providers to provide agreed services or to make himself/herself available at the appointed time, cancellation or rescheduling of appointments. In no event shall the Protected Entities be liable for any comments or feedback given by any of the Users in relation to the services provided by a Third Party Service Providers.
                    Indemnity:
                    The Covenanters agree to defend, indemnify and hold harmless afghandarmaltoon.com, the Protected Entities, independent contractors, service providers, consultants, licensors, agents, and representatives, and each of their respective directors, officers and employees, from and against any and all claims, losses, liability, damages, and/or costs (including, but not limited to, reasonable attorney fees and costs) arising from or related to (a) Covenanters access to or use of Website; (b) Covenanters violation of these Terms of Use or any applicable law(s); (c) Covenanters violation of any rights of another person/ entity, including infringement of their intellectual property rights; or (d) Covenanters conduct in connection with the Website.
                    <br />
                    <br />
                    <br />
                    Modification of Website:
                    <br />
                    <br />
                    Medicalstore.com.pk reserves the right to modify or discontinue, temporarily or permanently, the Website or any features or portions thereof without prior notice. Other Parties agree that afghandarmaltoon.com will not be liable for any modification, suspension or discontinuance of the Website or any other part thereof.
                    <br />
                    <br />
                    <br />
                    Intellectual property rights:
                    <br />
                    <br />
                    All the intellectual property used on the Website except those which have been identified as the intellectual properties of the Other Parties shall remain the exclusive property of the Company. The Other Parties agree not to circumvent, disable or otherwise interfere with security related features of the Website or features that prevent or restrict use or copying of any materials or enforce limitations on use of the Website or the materials therein. The materials on the Website or otherwise may not be modified, copied, reproduced, distributed, republished, downloaded, displayed, sold, compiled, posted or transmitted in any form or by any means, including but not limited to, electronic, mechanical, photocopying, recording or other means.
                    <br />
                    <br />
                    Force Majeure:
                    <br />
                    Other Parties accept and acknowledge that afghandarmaltoon.com shall not be liable for any loss or damage caused to the User as a result of delay or default or deficiency or failure in the Services as a result of any natural disasters, fire, riots, civil disturbances, actions or decrees of governmental bodies, communication line failures (which are not caused due to the fault of afghandarmaltoon.com or the Third Party Service Providers), or any other delay or default or deficiency or failure which arises from causes beyond afghandarmaltoon.com reasonable control (“Force Majeure Event”). In the event of any Force Majeure Event arising, afghandarmaltoon.com, depending on whose performance has been impacted under the Terms of Use, shall immediately give notice to the Other Party(s) of the facts which constitute the Force Majeure Event.
                    <br />
                    <br />
                    Survival:
                    <br />
                    Even after termination, certain obligations mentioned under Covenants, Liability, Indemnity, Intellectual Property, Dispute Resolution will continue and survive termination.
                    <br />
                    <br />
                    Severability:
                    <br />
                    If any provision of these Terms of Use is deemed invalid, unlawful, void or for any other reason unenforceable, then that provision shall be deemed severable from these Terms of Use and shall not affect the validity and enforceability of any of the remaining provisions.
                    <br />
                    <br />
                    Waiver:
                    <br />
                    No provision of these Terms of Use shall be deemed to be waived and no breach excused, unless such waiver or consent shall be in writing and signed by afghandarmaltoon.com. Any consent by afghandarmaltoon.com to, or a waiver by afghandarmaltoon.com of any breach by Other Parties, whether expressed or implied, shall not constitute consent to, waiver of, or excuse for any other different or subsequent breach.
                    <br />
                    <br />
                    Headings:
                    <br />
                    The headings and subheadings herein are included for convenience and identification only and are not intended to describe, interpret, define or limit the scope, extent or intent of these Terms of Use.
                    <br />
                    <br />
                    Contact Information:
                    <br />
                    If any Other Party(s) has any grievance, comment, question or suggestion regarding any of our Services, please contact our customer service at order@afghandarmaltoon.com.com. If any Other Party(s) has any questions concerning afghandarmaltoon.com, the Website, these Terms of Use, or anything related to any of the foregoing, afghandarmaltoon.com can be reached at the following email address – info@afghandarmaltoon.com.
                    <br />
                    <br />
                    Pricing :
                    <br />
                    All prices on this website are subject to change without notice. While we make every effort to provide you the most accurate, up-to-date information, occasionally, one or more items on our website may be mis-priced. We reserve the right to refuse to honor any incorrect prices. For items that are overly priced due to shortages represents the invitation to offer for sale, you may accept or decline the invitation.
                    </p>
            </div>
            <Footer />
            <StickyBottomNavbar user={user} />
            <style type='text/css'>{`
                ._privacy_policy{
                    padding: 2% 15%;
                    min-height: 90vh;
                }
                ._privacy_policy p {
                    color: ${constants.COLORS.TEXT};
                    font-size: 14px;
                    text-align:justify;
                    line-height: 1.8rem;
                }
                ._privacy_policy h5 {
                    color: ${constants.COLORS.TEXT};
                    font-weight: bolder;
                }
                @media (max-width: 1199px){
                    ._privacy_policy{
                        padding: 2% 12%;
                    }
                }
                @media (max-width: 991px){
                    ._privacy_policy{
                        padding: 2% 9%;
                    }
                }
                 @media (max-width: 767px){
                    ._privacy_policy{
                        padding: 2% 7%;
                    }
                }
                 @media (max-width: 575px){
                    ._privacy_policy{
                        padding: 2% 5%;
                    }
                }
            `}</style>
            <style jsx>{`
                .main_privacy_policy {
                    min-height: 100vh;
                    background: ${constants.COLORS.WHITE};
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div >
    )
}

