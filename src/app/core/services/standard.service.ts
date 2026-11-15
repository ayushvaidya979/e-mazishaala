import { Injectable, signal, computed } from '@angular/core';
import { StandardDetail, SubjectSyllabus, StandardRecordedLecture, StandardLiveLecture, StandardNote, StandardTest } from '../../models/standard.model';

@Injectable({
  providedIn: 'root'
})
export class StandardService {

  // Helper generator to provide comprehensive details for all 10 standards
  private generateStandardData(std: number): StandardDetail {
    const isPrimary = std <= 4;
    const isMiddle = std >= 5 && std <= 8;
    const category: 'Primary' | 'Middle' | 'High School' = isPrimary ? 'Primary' : isMiddle ? 'Middle' : 'High School';
    const themeColor = isPrimary ? '#10b981' : isMiddle ? '#f59e0b' : '#0284c7';
    const marathiNumbers = ['', '१ ली', '२ री', '३ री', '४ थी', '५ वी', '६ वी', '७ वी', '८ वी', '९ वी', '१० वी'];

    // Custom subjects based on standard level
    let subjects: SubjectSyllabus[] = [];
    if (std === 1) {
      subjects = [
        {
          id: 's1-marathi',
          name: 'Marathi (मराठी बालभारती)',
          marathiName: 'मराठी बालभारती',
          icon: 'book',
          color: '#0284c7',
          totalChapters: 8,
          totalHours: '32 Hours',
          chapters: [
            { id: 'c1', number: 1, title: 'स्वर आणि व्यंजने ओळख (Akshar Olakh)', description: 'अ, आ, इ, ई व क, ख, ग, घ अक्षरांची चित्रमय ओळख व उच्चार.', lessonsCount: 6, duration: '2h 15m', topics: ['स्वर परिचय', 'व्यंजन लेखन', 'अक्षर चित्र जोड्या'], weightage: '15%' },
            { id: 'c2', number: 2, title: 'बडबडगीते व गाणी (Action Rhymes)', description: 'नाच रे मोरा, चांदोबा चांदोबा भागलास का अशा लयबद्ध बालगीतांचा आनंद.', lessonsCount: 5, duration: '1h 50m', topics: ['लयबद्ध वाचन', 'अभिनय गीते', 'शब्दांची गंमत'], weightage: '15%' },
            { id: 'c3', number: 3, title: 'चित्रवाचन व सोपे शब्द (Picture Stories)', description: 'चित्रांवरून सोपे दोन अक्षरी व तीन अक्षरी शब्द तयार करणे.', lessonsCount: 8, duration: '3h 10m', topics: ['दोन अक्षरी शब्द', 'कान्हा व मात्रा परिचय', 'सोपी वाक्ये'], weightage: '20%' },
            { id: 'c4', number: 4, title: 'माझे घर आणि शाळा (My Home & School)', description: 'दैनंदिन वापरातील वस्तू, नातीगोती व शाळेतील सोबत्यांची नावे.', lessonsCount: 6, duration: '2h 30m', topics: ['नात्यांची ओळख', 'शाळेतील वस्तू', 'सुंदर हस्ताक्षर सराव'], weightage: '20%' }
          ]
        },
        {
          id: 's1-maths',
          name: 'Mathematics (गणित)',
          marathiName: 'गणित',
          icon: 'layers',
          color: '#10b981',
          totalChapters: 6,
          totalHours: '28 Hours',
          chapters: [
            { id: 'c5', number: 1, title: 'संख्या ज्ञान १ ते २० (Numbers 1 to 20)', description: 'चित्रे मोजणे, अंक ओळख, १ ते २० अंकांचे वाचन व लेखन सराव.', lessonsCount: 8, duration: '3h 30m', topics: ['अंक मोजणी', 'अंक लेखन', 'वस्तुनिष्ठ मोजणी'], weightage: '25%' },
            { id: 'c6', number: 2, title: 'लहान - मोठा व आकारांची ओळख (Shapes & Sizes)', description: 'गोल, चौकोन, त्रिकोण, उंच-बुटका, जड-हलका संकल्पनांचे खेळ.', lessonsCount: 5, duration: '2h 10m', topics: ['भूमिती आकार', 'तुलना (लहान-मोठा)', 'रंग ओळख'], weightage: '25%' },
            { id: 'c7', number: 3, title: 'सोपी बेरीज व वजाबाकी (Basic Addition & Subtraction)', description: 'चित्रांच्या साहाय्याने वस्तू एकत्र करणे व कमी करणे.', lessonsCount: 7, duration: '3h 00m', topics: ['१ अंकी बेरीज', '१ अंकी वजाबाकी', 'शब्द कोडी'], weightage: '30%' }
          ]
        },
        {
          id: 's1-english',
          name: 'English (My English Book One)',
          marathiName: 'इंग्रजी',
          icon: 'sparkles',
          color: '#8b5cf6',
          totalChapters: 6,
          totalHours: '24 Hours',
          chapters: [
            { id: 'c8', number: 1, title: 'Alphabet Fun & Phonics A to Z', description: 'Letter sounds, phonics songs, and tracing uppercase & lowercase letters.', lessonsCount: 8, duration: '3h 15m', topics: ['Phonic Sounds', 'Tracing A-Z', 'Letter Games'], weightage: '30%' },
            { id: 'c9', number: 2, title: 'Greeting Words & Action Song', description: 'Hello, Good Morning, Thank You, and fun physical action songs.', lessonsCount: 5, duration: '2h 00m', topics: ['Clap your hands', 'Daily Greetings', 'Polite Words'], weightage: '30%' }
          ]
        },
        {
          id: 's1-evs',
          name: 'Activity & EVS (खेळू, करू, शिकू व परिसर)',
          marathiName: 'परिसर अभ्यास',
          icon: 'shield',
          color: '#f59e0b',
          totalChapters: 5,
          totalHours: '20 Hours',
          chapters: [
            { id: 'c10', number: 1, title: 'आपले शरीर व आरोग्य (My Body & Habits)', description: 'शरीराचे अवयव, स्वच्छता आणि चांगल्या आरोग्यदायी सवयी.', lessonsCount: 5, duration: '2h 00m', topics: ['अवयवांची नावे', 'हात धुणे सवय', 'आरोग्य नियम'], weightage: '35%' },
            { id: 'c11', number: 2, title: 'आपल्या अवतीभोवतीचे प्राणी व झाडे (Nature & Animals)', description: 'पाळीव प्राणी, वन्य प्राणी, पक्षी आणि फुलझाडांची ओळख.', lessonsCount: 6, duration: '2h 30m', topics: ['प्राण्यांचे आवाज', 'पाळीव प्राणी', 'झाडांची पाने-फुले'], weightage: '35%' }
          ]
        }
      ];
    } else if (std === 10) {
      subjects = [
        {
          id: 's10-algebra',
          name: 'Mathematics Part 1 (Algebra / बीजगणित)',
          marathiName: 'गणित भाग १ (बीजगणित)',
          icon: 'layers',
          color: '#0284c7',
          totalChapters: 6,
          totalHours: '48 Hours',
          chapters: [
            { id: 'c10-1', number: 1, title: 'दोन चलांतील रेषीय समीकरणे (Linear Equations in Two Variables)', description: 'आलेख पद्धत, क्रेमर्स पद्धती (Cramer Rule), निश्चयक व निश्चयकाची किंमत, शाब्दिक उदाहरणे.', lessonsCount: 12, duration: '5h 30m', topics: ['आलेख पद्धत', 'क्रेमर्स पद्धती', 'समीकरणे रूपांतरण', 'वयाची व अंतराची शाब्दिक उदाहरणे'], weightage: '12 Marks' },
            { id: 'c10-2', number: 2, title: 'वर्गसमीकरणे (Quadratic Equations)', description: 'अवयव पद्धत, पूर्ण वर्ग पद्धत, सूत्र पद्धत, मुळांचे स्वरूप व विवेचक Δ.', lessonsCount: 10, duration: '4h 45m', topics: ['अवयव पद्धती', 'सूत्र पद्धती', 'मुळांचे स्वरूप', 'विवेचक डेल्टा'], weightage: '12 Marks' },
            { id: 'c10-3', number: 3, title: 'अंकगणिती श्रेढी (Arithmetic Progression - A.P.)', description: 'सामान्य फरक d, n वे पद (tn) सूत्र, पहिल्या n पदांची बेरीज (Sn) व उपयोजन.', lessonsCount: 8, duration: '4h 00m', topics: ['A.P. ओळख', 'tn चे सूत्र', 'Sn चे सूत्र', 'बचत व दैनिक समस्या'], weightage: '8 Marks' },
            { id: 'c10-4', number: 4, title: 'अर्थनियोजन (Financial Planning)', description: 'GST (वस्तू व सेवा कर), CGST, SGST, इनपुट टॅक्स क्रेडिट (ITC), शेअर्स व म्युच्युअल फंड.', lessonsCount: 8, duration: '3h 45m', topics: ['GST गणना', 'ITC क्रेडिट', 'शेअर्स, NAV, लाभांश'], weightage: '8 Marks' },
            { id: 'c10-5', number: 5, title: 'संभाव्यता (Probability)', description: 'यादृच्छिक प्रयोग, नमुना अवकाश S, घटना A, B व घटनेची संभाव्यता P(A).', lessonsCount: 7, duration: '3h 15m', topics: ['नाणे व फासा प्रयोग', 'नमुना अवकाश n(S)', 'संभाव्यता सूत्र'], weightage: '8 Marks' },
            { id: 'c10-6', number: 6, title: 'सांख्यिकी (Statistics)', description: 'मध्य (Mean) - सरळ पद्धत, गृहीत मध्य पद्धत, मध्यक (Median), बहुलक (Mode), वृत्तालेख.', lessonsCount: 11, duration: '5h 15m', topics: ['मध्य, मध्यक, बहुलक', 'वारंवारता बहुभुज', 'वृत्तालेख (Pie Chart)'], weightage: '12 Marks' }
          ]
        },
        {
          id: 's10-geometry',
          name: 'Mathematics Part 2 (Geometry / भूमिती)',
          marathiName: 'गणित भाग २ (भूमिती)',
          icon: 'layers',
          color: '#10b981',
          totalChapters: 7,
          totalHours: '46 Hours',
          chapters: [
            { id: 'g1', number: 1, title: 'समरूपता (Similarity)', description: 'दोन त्रिकोणांच्या क्षेत्रफळांचे गुणोत्तर, प्रमाणाचे मूलभूत प्रमेय (BPT), समरूपतेच्या कसोट्या.', lessonsCount: 9, duration: '4h 30m', topics: ['प्रमाणाचे मूलभूत प्रमेय', 'कोनदुभाजकाचे प्रमेय', 'समरूप त्रिकोणांचे गुणधर्म'], weightage: '10 Marks' },
            { id: 'g2', number: 2, title: 'पायथागोरसचे प्रमेय (Pythagoras Theorem)', description: 'काटकोन त्रिकोणाची समरूपता, भूमितीमध्याचे प्रमेय, अपोलोनियसचे प्रमेय.', lessonsCount: 8, duration: '3h 50m', topics: ['पायथागोरस सिद्धता', 'भूमितीमध्य प्रमेय', 'अपोलोनियस प्रमेय'], weightage: '7 Marks' },
            { id: 'g3', number: 3, title: 'वर्तुळ (Circle)', description: 'स्पर्शिका-त्रिज्या प्रमेय, आंतरलिखित कोन, चक्रीय चौकोनाचे प्रमेय, स्पर्शिका छेदिका प्रमेय.', lessonsCount: 11, duration: '5h 20m', topics: ['स्पर्शिका प्रमेय', 'चक्रीय चौकोन', 'आंतरखंडित कंस'], weightage: '12 Marks' },
            { id: 'g4', number: 4, title: 'त्रिकोणमिती (Trigonometry)', description: 'sin, cos, tan, cot, sec, cosec गुणोत्तरे, मूलभूत नित्यसमानता, उंची व अंतर समस्या.', lessonsCount: 9, duration: '4h 15m', topics: ['नित्यसमानता', 'उन्नत व अवनत कोन', 'उंची-अंतरावर आधारित उदाहरणे'], weightage: '7 Marks' }
          ]
        },
        {
          id: 's10-science1',
          name: 'Science & Technology 1 (विज्ञान आणि तंत्रज्ञान भाग १)',
          marathiName: 'विज्ञान भाग १',
          icon: 'sparkles',
          color: '#f59e0b',
          totalChapters: 10,
          totalHours: '50 Hours',
          chapters: [
            { id: 'sci1', number: 1, title: 'गुरुत्वाकर्षण (Gravitation)', description: "केप्लरचे नियम, न्यूटनचा वैश्विक गुरुत्वाकर्षणाचा सिद्धांत, 'g' चे मूल्य, मुक्ती वेग.", lessonsCount: 8, duration: '3h 45m', topics: ['केप्लरचे ३ नियम', 'मुक्त पतन', 'मुक्ती वेग व उदाहरणे'], weightage: '5 Marks' },
            { id: 'sci2', number: 2, title: 'मूलद्रव्यांचे आवर्ती वर्गीकरण (Periodic Classification)', description: 'डोबेरायनरची त्रिके, न्यूलँड्सची अष्टके, मेंडेलीव्हची आवर्तसारणी, आधुनिक आवर्तसारणी.', lessonsCount: 7, duration: '3h 30m', topics: ['मेंडेलीव्ह गुणदोष', 'आधुनिक आवर्तसारणी रचना', 'आवर्ती कल'], weightage: '6 Marks' },
            { id: 'sci3', number: 3, title: 'रासायनिक अभिक्रिया व समीकरणे (Chemical Reactions)', description: 'समीकरणे संतुलित करणे, संयोग, अपघटन, विस्थापन, दुहेरी विस्थापन, ऑक्सिडीकरण.', lessonsCount: 8, duration: '4h 00m', topics: ['अभिक्रियांचे प्रकार', 'समीकरण बॅलन्सिंग', 'गंजणे व प्रतिबंध'], weightage: '6 Marks' },
            { id: 'sci4', number: 4, title: 'विद्युतधारेचे परिणाम (Effects of Electric Current)', description: 'ज्यूलचा उष्णतेचा नियम, फ्लेमिंगचा डाव्या व उजव्या हाताचा नियम, विद्युत मोटर व जनरेटर.', lessonsCount: 9, duration: '4h 15m', topics: ['ज्यूलचा नियम', 'फ्लेमिंगचे नियम', 'विद्युत मोटर व जनरेटर'], weightage: '7 Marks' }
          ]
        },
        {
          id: 's10-science2',
          name: 'Science & Technology 2 (विज्ञान आणि तंत्रज्ञान भाग २)',
          marathiName: 'विज्ञान भाग २',
          icon: 'shield',
          color: '#10b981',
          totalChapters: 10,
          totalHours: '48 Hours',
          chapters: [
            { id: 'sci5', number: 1, title: 'आनुवंशिकता व उत्क्रांती (Heredity and Evolution)', description: 'प्रतिलेखन, भाषांतरण, उत्क्रांतीचे पुरावे, डार्विनचा नैसर्गिक निवडीचा सिद्धांत, मानवी उत्क्रांती.', lessonsCount: 8, duration: '3h 45m', topics: ['उत्क्रांती पुरावे', 'डार्विन सिद्धांत', 'मानवी उत्क्रांती टप्पे'], weightage: '5 Marks' },
            { id: 'sci6', number: 2, title: 'सजीवांतील जीवनप्रक्रिया भाग १ व २ (Life Processes)', description: 'श्वसन, पेशी पातळीवरील ऊर्जा निर्मिती, पेशी विभाजन (समसूत्री व अर्धसूत्री), प्रजनन.', lessonsCount: 11, duration: '5h 30m', topics: ['क्रेब्स चक्र', 'पेशी विभाजन', 'मानवी प्रजनन संस्था'], weightage: '10 Marks' },
            { id: 'sci7', number: 3, title: 'पर्यावरण व्यवस्थापन (Environmental Management)', description: 'परिसंस्था, अन्नसाखळी, कचरा व्यवस्थापन, आपत्ती व्यवस्थापन.', lessonsCount: 6, duration: '2h 45m', topics: ['जैवविविधता संवर्धन', 'प्रदूषण नियंत्रण', 'आपत्ती निवारण'], weightage: '6 Marks' }
          ]
        },
        {
          id: 's10-marathi',
          name: 'Marathi Kumarbharati (मराठी कुमारभारती)',
          marathiName: 'मराठी कुमारभारती',
          icon: 'book',
          color: '#e11d48',
          totalChapters: 8,
          totalHours: '36 Hours',
          chapters: [
            { id: 'm10-1', number: 1, title: 'संतवाणी व पद्य विभाग (Sant Vani & Poetry)', description: 'अंकिला मी दास तुझा (संत नामदेव), योगी सर्वकाळ सुखदाता (संत एकनाथ), रसग्रहण.', lessonsCount: 8, duration: '3h 30m', topics: ['संतवाणी भावार्थ', 'रसग्रहण मुद्दे', 'काव्य सौंदर्य'], weightage: '16 Marks' },
            { id: 'm10-2', number: 2, title: 'व्याकरण व उपयोजित लेखन (Grammar & Writing Skills)', description: 'समास, शब्दसिद्धी, वाक्प्रचार, पत्रलेखन, सारांश लेखन, जाहिरात व बातमी लेखन, निबंध.', lessonsCount: 12, duration: '5h 45m', topics: ['कर्मधारय व द्विगु समास', 'औपचारिक पत्रलेखन', 'प्रसंगलेखन व निबंध'], weightage: '24 Marks' }
          ]
        }
      ];
    } else {
      // Standards 2 to 9 default dynamic mapping
      subjects = [
        {
          id: `s${std}-maths`,
          name: `Mathematics (इयत्ता ${std} वी गणित)`,
          marathiName: 'गणित',
          icon: 'layers',
          color: '#0284c7',
          totalChapters: 7,
          totalHours: '38 Hours',
          chapters: [
            { id: `c${std}-m1`, number: 1, title: `मूलभूत संकल्पना व संख्या ज्ञान (Number System Std ${std})`, description: `इयत्ता ${std} च्या अभ्यासक्रमानुसार संख्यांचे प्रकार, क्रिया व गुणधर्म.`, lessonsCount: 7, duration: '3h 15m', topics: ['संख्या ज्ञान', 'दैनिक उपयोजन', 'सराव संच'], weightage: '25%' },
            { id: `c${std}-m2`, number: 2, title: `बीजगणितीय व भूमितीय आकार (Geometry & Shapes)`, description: `कोन, त्रिकोण, चौकोन व विविध भूमितीय रचनांचे नियम व सिद्धता.`, lessonsCount: 8, duration: '3h 40m', topics: ['कोनांचे प्रकार', 'भूमिती रचना', 'समीकरणे'], weightage: '30%' },
            { id: `c${std}-m3`, number: 3, title: `व्यावहारिक गणित व मापन (Commercial Math)`, description: `नफा-तोटा, सरळव्याज, परिमिती, क्षेत्रफळ व आलेख वाचन.`, lessonsCount: 6, duration: '2h 50m', topics: ['शेकडेवारी', 'गुणोत्तर प्रमाण', 'मापन सूत्रे'], weightage: '25%' }
          ]
        },
        {
          id: `s${std}-science`,
          name: isPrimary ? `Environmental Studies (परिसर अभ्यास)` : `General Science (सामान्य विज्ञान)`,
          marathiName: isPrimary ? 'परिसर अभ्यास' : 'सामान्य विज्ञान',
          icon: 'sparkles',
          color: '#10b981',
          totalChapters: 8,
          totalHours: '36 Hours',
          chapters: [
            { id: `c${std}-sc1`, number: 1, title: `सजीव सृष्टी व पर्यावरण (Living Organisms & Habitat)`, description: `वनस्पती, प्राणी, मानवी शरीररचना आणि नैसर्गिक संसाधनांचे संवर्धन.`, lessonsCount: 7, duration: '3h 20m', topics: ['सजीवांचे वर्गीकरण', 'अन्नसाखळी', 'पर्यावरण'], weightage: '30%' },
            { id: `c${std}-sc2`, number: 2, title: `भौतिक व रासायनिक बदल (Matter & Energy)`, description: `गती, बल, उष्णता, प्रकाश, ध्वनी व दैनंदिन रासायनिक प्रक्रिया.`, lessonsCount: 8, duration: '3h 45m', topics: ['बलाचे प्रकार', 'ऊर्जेची रूपे', 'प्रयोग व निरीक्षण'], weightage: '35%' }
          ]
        },
        {
          id: `s${std}-marathi`,
          name: `Marathi (मराठी सुलभभारती)`,
          marathiName: 'मराठी भाषा',
          icon: 'book',
          color: '#f59e0b',
          totalChapters: 6,
          totalHours: '28 Hours',
          chapters: [
            { id: `c${std}-mr1`, number: 1, title: `गद्य व पद्य विभाग (Lessons & Poems)`, description: `आदर्श कथा, कविता, पाठाखालील स्वाध्याय व भावार्थ विश्लेषण.`, lessonsCount: 8, duration: '3h 30m', topics: ['कविता गायन', 'पाठाचे वाचन', 'स्वाध्याय उत्तरे'], weightage: '35%' },
            { id: `c${std}-mr2`, number: 2, title: `भाषाभ्यास व व्याकरण (Grammar & Writing)`, description: `शब्दांच्या जाती, नाम, सर्वनाम, काळ, वाक्प्रचार व निबंध लेखन.`, lessonsCount: 6, duration: '2h 45m', topics: ['व्याकरण नियम', 'शुद्धलेखन', 'निबंध लेखन'], weightage: '35%' }
          ]
        },
        {
          id: `s${std}-english`,
          name: `English Reader & Grammar`,
          marathiName: 'इंग्रजी',
          icon: 'shield',
          color: '#8b5cf6',
          totalChapters: 6,
          totalHours: '26 Hours',
          chapters: [
            { id: `c${std}-en1`, number: 1, title: `Prose, Poetry & Comprehension`, description: `Engaging stories, poems, reading comprehension, and pronunciation skills.`, lessonsCount: 7, duration: '3h 10m', topics: ['Reading aloud', 'Question answers', 'Vocabulary builder'], weightage: '40%' },
            { id: `c${std}-en2`, number: 2, title: `Grammar & Communication`, description: `Tenses, parts of speech, active communication and daily spoken phrases.`, lessonsCount: 6, duration: '2h 40m', topics: ['Tenses', 'Sentences structure', 'Creative writing'], weightage: '35%' }
          ]
        }
      ];
    }

    // Recorded Lectures for this Standard
    const recordedLectures: StandardRecordedLecture[] = [
      {
        id: `rec-${std}-1`,
        title: std === 10 ? 'Class 10 Live Recording: Quadratic Equations Shortcut Tricks' : `Standard ${std}: Concept Booster Lecture & Problem Solving`,
        subject: subjects[0]?.name || 'Mathematics',
        chapter: subjects[0]?.chapters[0]?.title || 'Chapter 1',
        duration: '45 mins',
        teacherName: 'Prof. Rahul Deshmukh',
        teacherTitle: 'Senior Mathematics Educator',
        teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        viewsCount: 1420 + std * 210,
        isPopular: true
      },
      {
        id: `rec-${std}-2`,
        title: std === 10 ? 'Science: Gravitation Numerical & Laws of Motion Explained' : `Standard ${std} Science: Animated Diagrams & Experiment Lab`,
        subject: subjects[1]?.name || 'Science',
        chapter: subjects[1]?.chapters[0]?.title || 'Chapter 1',
        duration: '52 mins',
        teacherName: 'Dr. Snehal Patil',
        teacherTitle: 'M.Sc., Ph.D. in Physics',
        teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        viewsCount: 980 + std * 190
      },
      {
        id: `rec-${std}-3`,
        title: std === 10 ? 'मराठी व्याकरण: समास, वाक्प्रचार व निबंध लेखन नमुना' : `Standard ${std} Marathi: संपूर्ण कविता गायन व भावार्थ विश्लेषण`,
        subject: subjects[2]?.name || 'Marathi',
        chapter: subjects[2]?.chapters[0]?.title || 'Chapter 1',
        duration: '38 mins',
        teacherName: 'Mrs. Anjali Kulkarni',
        teacherTitle: 'State Awardee Marathi Littérateur',
        teacherAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        viewsCount: 1250 + std * 150
      },
      {
        id: `rec-${std}-4`,
        title: `Standard ${std} English: Grammar Mastery, Tenses & Story Comprehension`,
        subject: 'English',
        chapter: 'Unit 2: Creative Writing',
        duration: '42 mins',
        teacherName: 'Mr. Sachin Shinde',
        teacherTitle: 'Cambridge Certified ELT Trainer',
        teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        viewsCount: 890 + std * 120
      }
    ];

    // Live Lectures for this Standard
    const liveLectures: StandardLiveLecture[] = [
      {
        id: `live-${std}-1`,
        title: `Std ${std} Daily Masterclass: High-Yield Chapter Problem Solving`,
        subject: subjects[0]?.name || 'Mathematics',
        teacherName: 'Prof. Rahul Deshmukh',
        teacherTitle: 'Senior Mathematics Educator',
        teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        scheduledTime: '06:00 PM - 07:15 PM',
        scheduledDate: 'Today, Live Now',
        status: 'live',
        attendeesCount: 380 + std * 25,
        duration: '75 mins'
      },
      {
        id: `live-${std}-2`,
        title: `Std ${std} Interactive Doubt Clearance: Science & Experiments`,
        subject: subjects[1]?.name || 'Science',
        teacherName: 'Dr. Snehal Patil',
        teacherTitle: 'M.Sc., Ph.D. in Physics',
        teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        scheduledTime: '05:30 PM - 06:45 PM',
        scheduledDate: 'Tomorrow',
        status: 'upcoming',
        attendeesCount: 450 + std * 30,
        duration: '75 mins'
      },
      {
        id: `live-${std}-3`,
        title: `Std ${std} Language Special: Marathi & English Grammar Quiz Live`,
        subject: 'Languages',
        teacherName: 'Mrs. Anjali Kulkarni',
        teacherTitle: 'State Awardee Educator',
        teacherAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80',
        scheduledTime: '07:00 PM - 08:00 PM',
        scheduledDate: 'Friday',
        status: 'upcoming',
        attendeesCount: 320 + std * 20,
        duration: '60 mins'
      }
    ];

    // Notes for this Standard
    const notes: StandardNote[] = [
      {
        id: `note-${std}-1`,
        title: `Standard ${std} Mathematics: Complete Chapter Formula Sheet & Mind Maps`,
        subject: 'Mathematics',
        chapter: 'All Units',
        fileType: 'PDF',
        fileSize: '4.5 MB',
        pagesCount: 18,
        downloadCount: 4200 + std * 450,
        summary: `Handwritten formula sheet with step-by-step problem-solving shortcuts and sample solved examples tailored for Standard ${std}.`
      },
      {
        id: `note-${std}-2`,
        title: `Standard ${std} Science: Important Diagrams, Definitions & Q&A`,
        subject: 'Science',
        chapter: 'Science Part 1 & 2',
        fileType: 'PDF',
        fileSize: '6.8 MB',
        pagesCount: 26,
        downloadCount: 3800 + std * 320,
        summary: `Clear labeled diagrams, key chemical reactions, scientific definitions, and 3-mark conceptual questions.`
      },
      {
        id: `note-${std}-3`,
        title: `Standard ${std} Marathi: सर्व पाठांचा भावार्थ, व्याकरण तक्ता व स्वाध्याय उत्तरे`,
        subject: 'Marathi',
        chapter: 'सुलभभारती / कुमारभारती',
        fileType: 'PDF',
        fileSize: '5.2 MB',
        pagesCount: 22,
        downloadCount: 5100 + std * 280,
        summary: `कवितेचे रसग्रहण, शब्दांचे अर्थ, व्याकरण नियम व परीक्षेत येणारे महत्त्वाचे निबंध नमुने.`
      },
      {
        id: `note-${std}-4`,
        title: `Standard ${std} English: Grammar Rulebook, Vocabulary & Model Letters`,
        subject: 'English',
        chapter: 'Complete Syllabus',
        fileType: 'PDF',
        fileSize: '3.9 MB',
        pagesCount: 16,
        downloadCount: 2900 + std * 180,
        summary: `Tenses charts, modal auxiliaries, active-passive voice cheat sheet, and formal letter templates.`
      }
    ];

    // Tests & Quizzes for this Standard with interactive questions!
    const tests: StandardTest[] = [
      {
        id: `test-${std}-1`,
        title: `Standard ${std} Mathematics: Chapter 1 Speed Quiz & Practice Test`,
        subject: 'Mathematics',
        chapter: 'Chapter 1 & 2',
        durationMinutes: 15,
        totalQuestions: 5,
        maxMarks: 20,
        difficulty: 'Easy',
        attemptsCount: 1840 + std * 120,
        questions: std === 1 ? [
          { id: 1, question: 'खालीलपैकी ५ नंतर कोणता अंक येतो? (Which number comes after 5?)', options: ['४', '६', '७', '३'], correctOptionIndex: 1, explanation: '५ नंतर क्रमाने ६ हा अंक येतो (5 + 1 = 6).' },
          { id: 2, question: '३ + २ = किती? (What is 3 + 2?)', options: ['४', '५', '६', '७'], correctOptionIndex: 1, explanation: '३ मध्ये २ मिळवल्यास ५ होतात.' },
          { id: 3, question: 'या आकारांपैकी गोल कोणता आहे? (Which shape is round?)', options: ['चेंडू (Ball)', 'पुस्तक (Book)', 'पेटी (Box)', 'काडीपेटी'], correctOptionIndex: 0, explanation: 'चेंडूचा आकार गोल असतो.' },
          { id: 4, question: '१० मधून २ वजा केल्यास किती उरतात? (10 - 2 = ?)', options: ['७', '८', '९', '६'], correctOptionIndex: 1, explanation: '१० - २ = ८.' },
          { id: 5, question: 'त्रिकोणाला किती बाजू असतात? (How many sides does a triangle have?)', options: ['२', '३', '४', '५'], correctOptionIndex: 1, explanation: 'त्रिकोणाला ३ बाजू आणि ३ कोन असतात.' }
        ] : std === 10 ? [
          { id: 1, question: 'दोन चलांतील रेषीय समीकरणाचे सामान्य रूप कोणते आहे? (Standard form of Linear Equation in 2 variables)', options: ['ax² + bx + c = 0', 'ax + by + c = 0', 'ax³ + bx = 0', 'a/x + b/y = c'], correctOptionIndex: 1, explanation: 'ax + by + c = 0 हे दोन चलांतील रेषीय समीकरणाचे सामान्य रूप आहे, जेथे a आणि b एकाच वेळी शून्य नसतात.' },
          { id: 2, question: 'वर्गसमीकरण ax² + bx + c = 0 मध्ये विवेचक Δ ची किंमत काय असते?', options: ['b² - 4ac', 'b² + 4ac', '4ac - b²', '√b² - 4ac'], correctOptionIndex: 0, explanation: 'विवेचक (Discriminant) Δ = b² - 4ac असतो.' },
          { id: 3, question: 'एका अंकगणिती श्रेढीमध्ये a = 2, d = 3 असल्यास 10 वे पद (t10) किती येईल?', options: ['27', '29', '31', '33'], correctOptionIndex: 1, explanation: 'tn = a + (n - 1)d = 2 + (10 - 1) * 3 = 2 + 27 = 29.' },
          { id: 4, question: 'जर एका फासाची फेक केली, तर मूळ संख्या मिळण्याची संभाव्यता काय?', options: ['1/6', '1/3', '1/2', '2/3'], correctOptionIndex: 2, explanation: 'नमुना अवकाश S = {1, 2, 3, 4, 5, 6}, मूळ संख्या {2, 3, 5} आहेत (3 घटक). संभाव्यता = 3/6 = 1/2.' },
          { id: 5, question: 'काटकोन त्रिकोणात कर्णाची लांबी 13 सेमी व एका बाजूची लांबी 5 सेमी असल्यास दुसरी बाजू किती?', options: ['10 सेमी', '11 सेमी', '12 सेमी', '14 सेमी'], correctOptionIndex: 2, explanation: 'पायथागोरस त्रिकूट: 5, 12, 13 (13² - 5² = 169 - 25 = 144 = 12²).' }
        ] : [
          { id: 1, question: `इयत्ता ${std} वी गणितातील मूलभूत नियम: २ * (५ + ३) चे मूल्य काय?`, options: ['१६', '१३', '१०', '८'], correctOptionIndex: 0, explanation: 'कंस आधी सोडवा: ५ + ३ = ८. नंतर २ * ८ = १६.' },
          { id: 2, question: 'कोणत्याही त्रिकोणाच्या तिन्ही कोनांच्या मापांची बेरीज किती असते?', options: ['९०°', '१८०°', '२७०°', '३६०°'], correctOptionIndex: 1, explanation: 'त्रिकोणाच्या सर्व अंतःकोनांची बेरीज नेहमी १८० अंश असते.' },
          { id: 3, question: '५० च्या २०% म्हणजे किती?', options: ['५', '१०', '१५', '२०'], correctOptionIndex: 1, explanation: '५० * (२० / १००) = १०.' },
          { id: 4, question: 'खालीलपैकी सम संख्या कोणती आहे?', options: ['१७', '२१', '३४', '४५'], correctOptionIndex: 2, explanation: '३४ च्या एकक स्थानी ४ असल्याने ही सम संख्या आहे.' },
          { id: 5, question: 'चौरसाची परिमिती सूत्र काय?', options: ['बाजू * बाजू', '४ * बाजू', '२ * बाजू', 'बाजू + २'], correctOptionIndex: 1, explanation: 'चौरसाच्या चारही बाजू समान असल्याने परिमिती = ४ * बाजू.' }
        ]
      },
      {
        id: `test-${std}-2`,
        title: `Standard ${std} Science: Core Concepts Unit Evaluation`,
        subject: 'Science',
        chapter: 'Unit 1 & 2',
        durationMinutes: 20,
        totalQuestions: 5,
        maxMarks: 20,
        difficulty: 'Medium',
        attemptsCount: 1420 + std * 95,
        questions: std === 10 ? [
          { id: 1, question: 'पृथ्वीच्या केंद्रावर गुरुत्वीय प्रवेग (g) चे मूल्य किती असते?', options: ['9.8 m/s²', '9.77 m/s²', '0 m/s²', '9.83 m/s²'], correctOptionIndex: 2, explanation: 'पृथ्वीच्या केंद्रस्थानी g = 0 m/s² असते.' },
          { id: 2, question: 'आधुनिक आवर्तसारणीतील मूलद्रव्यांची मांडणी कोणत्या चढत्या क्रमाने केली आहे?', options: ['अणुवस्तुमानांकाच्या', 'अणुअंकाच्या', 'संयुजेच्या', 'घनतेच्या'], correctOptionIndex: 1, explanation: 'हेन्री मोसलेच्या आधुनिक आवर्तसारणीत मूलद्रव्ये त्यांच्या अणुअंकाच्या (Atomic Number) चढत्या क्रमाने मांडली आहेत.' },
          { id: 3, question: 'विद्युत रोधाचे SI एकक कोणते आहे?', options: ['व्होल्ट (Volt)', 'ओहम (Ohm)', 'अँपिअर (Ampere)', 'वॉट (Watt)'], correctOptionIndex: 1, explanation: 'विद्युत रोधाचे (Resistance) SI एकक ओहम (Ω) आहे.' },
          { id: 4, question: 'मानवी शरीरात पेशी पातळीवरील ऊर्जा निर्मिती कोणत्या प्रक्रियेत होते?', options: ['क्रेब्स चक्र', 'प्रकाशसंश्लेषण', 'उत्सर्जन', 'रक्ताभिसरण'], correctOptionIndex: 0, explanation: 'तंतुकणिकेत (Mitochondria) क्रेब्स चक्राद्वारे ATP च्या स्वरूपात ऊर्जा निर्माण होते.' },
          { id: 5, question: 'खालीलपैकी कोणता रासायनिक बदल आहे?', options: ['पाण्याचा बर्फ होणे', 'लोखंड गंजणे', 'कापूर हवेत उडणे', 'काच फुटणे'], correctOptionIndex: 1, explanation: 'लोखंड गंजणे हा कायमस्वरूपी रासायनिक बदल आहे कारण यामध्ये नवीन पदार्थ (Fe2O3) तयार होतो.' }
        ] : [
          { id: 1, question: 'सूर्यप्रकाशामुळे आपल्या शरीरात कोणते जीवनसत्व तयार होते?', options: ['जीवनसत्व अ', 'जीवनसत्व ब', 'जीवनसत्व क', 'जीवनसत्व ड'], correctOptionIndex: 3, explanation: 'सकाळच्या कोवळ्या सूर्यप्रकाशाने त्वचेमध्ये व्हिटॅमिन ड (Vitamin D) तयार होते.' },
          { id: 2, question: 'पाण्याचे रासायनिक सूत्र काय आहे?', options: ['CO2', 'H2O', 'O2', 'NaCl'], correctOptionIndex: 1, explanation: 'दोन हायड्रोजन व एक ऑक्सिजन अणू मिळून पाणी (H2O) बनते.' },
          { id: 3, question: 'झाडांची पाने हिरवी कशामुळे दिसतात?', options: ['हरितद्रव्य (Chlorophyll)', 'पाणी', 'सूर्यप्रकाश', 'माती'], correctOptionIndex: 0, explanation: 'पानांमधील क्लोरोफिल (हरितद्रव्य) मुळे पाने हिरवी दिसतात.' },
          { id: 4, question: 'हवेमध्ये सर्वात जास्त प्रमाणात कोणता वायू असतो?', options: ['ऑक्सिजन', 'नायट्रोजन', 'कार्बन डायऑक्साईड', 'हायड्रोजन'], correctOptionIndex: 1, explanation: 'हवेमध्ये सुमारे ७८% नायट्रोजन वायू असतो.' },
          { id: 5, question: 'सजीवांच्या शरीराचा सर्वात लहान रचनात्मक व कार्यात्मक घटक कोणता?', options: ['उती', 'अवयव', 'पेशी (Cell)', 'हाडे'], correctOptionIndex: 2, explanation: 'सर्व सजीवांचे शरीर पेशींनी (Cells) बनलेले असते.' }
        ]
      },
      {
        id: `test-${std}-3`,
        title: `Standard ${std} Scholarship & Board Mock Assessment`,
        subject: 'Comprehensive',
        chapter: 'Full Term Revision',
        durationMinutes: 30,
        totalQuestions: 5,
        maxMarks: 25,
        difficulty: 'Hard',
        attemptsCount: 2150 + std * 140,
        questions: [
          { id: 1, question: `इयत्ता ${std} वी समग्र ज्ञान चाचणी: भारताची राजधानी कोणती?`, options: ['मुंबई', 'नवी दिल्ली', 'पुणे', 'कोलकाता'], correctOptionIndex: 1, explanation: 'भारताची राजधानी नवी दिल्ली आहे.' },
          { id: 2, question: 'महाराष्ट्राची अधिकृत राज्यभाषा कोणती आहे?', options: ['हिंदी', 'मराठी', 'इंग्रजी', 'गुजराती'], correctOptionIndex: 1, explanation: 'महाराष्ट्राची राज्यभाषा मराठी आहे.' },
          { id: 3, question: 'शून्याचा शोध कोणत्या प्राचीन देशात लागला?', options: ['भारत', 'ग्रीस', 'इजिप्त', 'चीन'], correctOptionIndex: 0, explanation: 'शून्याचा (0) शोध महान भारतीय गणितज्ञ आर्यभट्ट यांनी लावला.' },
          { id: 4, question: 'दरवर्षी राष्ट्रीय विज्ञान दिन (National Science Day) कधी साजरा केला जातो?', options: ['२८ फेब्रुवारी', '१५ ऑगस्ट', '२६ जानेवारी', '५ सप्टेंबर'], correctOptionIndex: 0, explanation: 'सर सी. व्ही. रामन यांनी रामन परिणामाचा शोध लावल्यामुळे २८ फेब्रुवारी हा विज्ञान दिन म्हणून साजरा होतो.' },
          { id: 5, question: 'छत्रपती शिवाजी महाराजांचा राज्याभिषेक कोणत्या किल्ल्यावर झाला?', options: ['शिवनेरी', 'रायगड', 'राजगड', 'प्रतापगड'], correctOptionIndex: 1, explanation: '६ जून १६७४ रोजी छत्रपती शिवाजी महाराजांचा भव्य राज्याभिषेक किल्ले रायगडावर झाला.' }
        ]
      }
    ];

    return {
      standard: std,
      label: `Standard ${std}`,
      marathiLabel: `इयत्ता ${marathiNumbers[std] || std + ' वी'}`,
      category,
      themeColor,
      iconName: std === 1 ? 'sparkles' : std === 10 ? 'graduation-cap' : 'book-open',
      tagline: std === 1 ? 'पायाभूत शिक्षण व आनंददायी अध्ययन' : std === 10 ? 'एसएससी बोर्ड परीक्षा विशेष तयारी २०२६-२७' : `इयत्ता ${std} वी परिपूर्ण अभ्यासक्रम व सराव`,
      description: `Welcome to e-MaziShaala's dedicated learning portal for Standard ${std}. Complete state board syllabus, animated recorded lectures, daily live classes, downloadable PDF notes, and chapter-wise mock tests.`,
      quote: std <= 4 ? 'हसत-खेळत आनंददायी शिक्षण!' : std <= 8 ? 'संकल्पना स्पष्ट, प्रगती निश्चित!' : 'उत्तुंग यश आणि बोर्ड टॉपर बनण्याचा विश्वास!',
      subjects,
      recordedLectures,
      liveLectures,
      notes,
      tests
    };
  }

  getStandardDetail(standardNumber: number): StandardDetail {
    const std = Math.max(1, Math.min(10, Number(standardNumber) || 1));
    return this.generateStandardData(std);
  }
}

