// components/ConfirmationModal.jsx

import { CheckBox } from '@mui/icons-material';
import React, { useRef} from 'react';

const ConfirmationModal = ({ patientId, patientName, onClose, submittingFromNoSession, setSubmittingFromNoSession, submit, language }) => {
    const patientSubmitting = useRef(submittingFromNoSession);
    const values = {
        newPatientRequest: {
            English: "New Patient Request",
            Arabic: "طلب مريض جديد",
            Farsi: "درخواست بیمار جدید",
            Pashto: "د نوي ناروغ غوښتنه"
        },
        name: {
            English: "Name",
            Arabic: "اسم",
            Farsi: "نام",
            Pashto: "نوم",
        },
        declareTrue: {
            English: "I declare that the information provided in this form is true.",
            Arabic: "أصرح بأن المعلومات في هذا النموذج صحيحة",
            Farsi: "من اعلام می کنم که اطلاعات ارائه شده در این فرم درست است",
            Pashto: "زه اعلان کوم چې په دې فورمه کې چمتو شوي معلومات ریښتیا دي"
        },
        requestServices: {
            English: "I declare that I am requesting MENA Health's services for a remote health consultation.",
            Arabic: "لاستشارة صحية عن بعد MENA Health أصرح أنني أطلب خدمة",
            Farsi: "من اعلام می کنم که از خدمات MENA Health برای یک مشاوره بهداشتی از راه دور درخواست می کنم",
            Pashto: "زه اعلان کوم چې زه د لیرې روغتیا مشورې لپاره د MENA روغتیا خدمت غوښتنه کوم"
        },
        agree: {
            English: "I declare that I have read the registration conditions provided below, and agree to its terms.",
            Arabic: "أقر بأنني قرأت شروط التسجيل والتي تنص على:",
            Farsi: "من اعلام می کنم که شرایط ثبت نام ارائه شده در زیر را مطالعه کرده و با شرایط آن موافقت می کنم",
            Pashto: "زه اعلان کوم چې ما لاندې چمتو شوي د راجسټریشن شرایط لوستلي ، او د دې شرایطو سره موافق یم"
        },
        registrationConditions: {
            English: "Patient Registration Terms & Conditions:",
            Arabic: "شروط وأحكام تسجيل المريض",
            Farsi: "شرایط و ضوابط ثبت نام بیمار",
            Pashto: "د ناروغ د ثبت شرایط او شرایط"
        },
        shareData: {
            English: 'Share my data with members of the non-profit organization "MENA Health" and members of the licensed medical staff',
            Arabic: 'مشاركة بياناتي مع أعضاء منظمة "MENA Health" غير الحكومية وأعضاء الطاقم الطبي المرخص',
            Farsi: `من داده های خود را با اعضای سازمان غیرانتفاعی "MENA Health" و اعضای کادر پزشکی دارای مجوز به
اشتراک می گذارم`,
            Pashto: 'زه خپل معلومات د غیر انتفاعي سازمان "MENA Health" غړو او د جواز لرونکي طبي کارمندانو غړو سره شریکوم'
        },
        transferData: {
            English: "The possibility of transferring my data to other associations/non-governmental organization that can assist with my request or provide medicine when needed",
            Arabic: `إمكانية مشاركة معلوماتي مع جمعيات و منظمات غير حكومية أخرى التي يمكن أن تساعد في طلبي أو توفر الدواء عند
الحاجة`,
            Farsi: `امکان انتقال داده‌های من به سایر انجمن‌ها/سازمان‌های غیردولتی که می‌توانند به درخواست من کمک کنند یا در
صورت نیاز دارو تهیه کنند.`,
            Pashto: `نورو انجمنونو / غیر دولتي سازمانونو ته زما د معلوماتو لیږدولو امکان چې کولی شي زما غوښتنې سره مرسته وکړي ، یا د اړتیا
په وخت کې درمل چمتو کړي`
        },
        checkBox: {
            English: "Please check this box confirming you have read and understand the patient registration terms and agree.",
            Arabic: "يرجى تحديد هذا المربع للتأكد أنك قرأت و أوافق على شروط التسجيل",
            Farsi: "لطفاً این کادر را علامت بزنید و تأیید کنید که شرایط ثبت نام بیمار را خوانده و درک کرده اید و موافقت می کنید",
            Pashto: "مهرباني وکړئ دا بکس چیک کړئ دا تاییدوي چې تاسو د ناروغ د راجسټریشن شرایط لوستلي او پوهیږئ او موافق یاست"
        },
        agreeSMS: {
            English: "Check box if you consent to the following: \nI hereby consent and state my preference to have my physician and other staff at MENA Health communicate with me by standard SMS messaging or through a third party communications application (including but not limited to Telegram); regarding various aspects of my medical care, which may include, but shall not be limited to, test results, prescriptions, appointments, and billing.",
            Arabic: `خانة الاختيار إذا كنت توافق على ما يلي:
أوافق بموجب هذا وأصرح بتفضيلي أن يتواصل معي طبيبي وغيره من الموظفين في شركة مينا هيلث عبر الرسائل النصية القصيرة القياسية أو من خلال تطبيق اتصالات تابع لجهة خارجية (بما في ذلك على سبيل المثال لا الحصر Viber وTelegram)؛ فيما يتعلق بالجوانب المختلفة لرعايتي الطبية، والتي قد تشمل، على سبيل المثال لا الحصر، نتائج الاختبارات والوصفات الطبية والمواعيد والفواتير. 
`,
            Farsi: `اگر به موارد زیر رضایت دارید، کادر را علامت بزنید:
بدینوسیله موافقت می‌کنم و ترجیح می‌دهم که پزشک و سایر کارکنان من در MENA Health با پیام‌های SMS استاندارد یا از طریق یک برنامه ارتباطی شخص ثالث (از جمله Viber، Telegram) با من در ارتباط باشند. در رابطه با جنبه‌های مختلف مراقبت‌های پزشکی من، که ممکن است شامل نتایج آزمایش، نسخه‌ها، قرار ملاقات‌ها و صورت‌حساب باشد، اما محدود به آن نیست.
`,
            Pashto: `بکس چیک کړئ که تاسو لاندې سره موافق یاست:
زه په دې توګه موافق یم او خپل غوره توب بیانوم چې د MENA روغتیا کې زما ډاکټر او نور کارمندان له ما سره د معیاري SMS پیغام یا د دریمې ډلې ارتباطي غوښتنلیک له لارې اړیکه ونیسي (په شمول مګر په وایبر، ټیلیګرام پورې محدود ندي)؛ زما د طبي پاملرنې د مختلفو اړخونو په اړه، چې کېدای شي شامل وي، مګر د ازموینې پایلې، نسخې، ملاقاتونه، او بل کول باید محدود نه وي.
`
        },
        submit: {
            English: "Submit",
            Arabic: "يُقدِّم",
            Farsi: "ارسال کنید",
            Pashto: "سپارل"
        },
        agreeToTerms: {
            English: "Please agree to the terms and conditions.",
            Arabic: "الرجاء الموافقة على الشروط والأحكام",
            Farsi: "لطفا با شرایط و ضوابط موافقت کنید",
            Pashto: "مهرباني وکړئ د شرایطو او شرایطو سره موافق یاست"
        },
        close: {
            English: "Close",
            Arabic: "يغلق",
            Farsi: "بستن",
            Pashto: "تړل"
        },
        successful: {
            English: "Patient Created Successfully",
            Arabic: "تم إنشاء المريض بنجاح",
            Farsi: "بیمار با موفقیت ایجاد شد",
            Pashto: "ناروغ په بریالیتوب سره جوړ شو"
        },
        patientId: {
            English: "Patient ID",
            Arabic: "معرف المريض",
            Farsi: "شناسه بیمار",
            Pashto: "د ناروغ پیژندنه"
        },
        confirmationMessage: {
            English: "Your form has been successfully submitted. A member of the MENA Health team will be in touch with you shortly. You can now close this window.",
            Arabic: `لقد تم إرسال النموذج الخاص بك بنجاح. سيتواصل معك أحد أعضاء فريق الصحة في منطقة الشرق الأوسط وشمال أفريقيا قريبًا.
يمكنك الآن إغلاق هذه النافذة.`,
            Farsi: `فرم شما با موفقیت ارسال شد. یکی از اعضای تیم MENA Health به زودی با شما در تماس خواهد بود. اکنون می
توانید این پنجره را ببندید.`,
            Pashto: `ستاسو فورمه په بریالیتوب سره وسپارل شوه. د MENA روغتیایی ټیم غړی به ډیر ژر له تاسو سره اړیکه ونیسي. تاسو
اوس دا کړکۍ بندولی شئ.`
        }
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ overflowY: 'auto' }}>
            <div className="bg-white p-6 rounded shadow-lg max-w-xl">
            {submittingFromNoSession ? (
                <>
                    <h2 className="text-2xl font-bold mb-4 text-center">{values.newPatientRequest[language]}</h2>
                    <br />
                    {/*<p>{values.name[language]}: {patientName.firstName} {patientName.lastName}</p>*/}
                    <br />
                    <p>{values.declareTrue[language]}</p>
                    <br />
                    <p>{values.requestServices[language]}</p>
                    <br />
                    <p>{values.agree[language]}</p>
                    <br />
                    <h2 className="text-xl font-bold mb-4">{values.registrationConditions[language]}</h2>
                    <p>&bull;&nbsp;{values.shareData[language]}</p>
                    <br />
                    <p>&bull;&nbsp;{values.transferData[language]}</p>
                    <br />
                    <input type="checkbox" id="agree" name="agree" value="agree" />
                    <label for="agree" className='text-gray-500'>&nbsp;{values.agree[language]}</label>
                    <br />
                    <input type="checkbox" id="agreeSMS" name="agreeSMS" value="agreeSMS" />
                    <label for="agreeSMS" className='text-gray-500'>&nbsp;{values.agreeSMS[language]}</label>

                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                                if (document.getElementById('agree').checked && document.getElementById('agreeSMS').checked) {
                                    setSubmittingFromNoSession(false);
                                    submit();
                                } else {
                                    alert(values.agreeToTerms[language]);
                                }
                            }}
                        >
                            {values.submit[language]}
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            {values.close[language]}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">{values.successful[language]}</h2>
                    <p>{values.patientId[language]}: {patientId}</p>
                    <p>{values.name[language]}: {patientName.firstName} {patientName.lastName}</p>
                    {patientSubmitting.current && <p>{values.confirmationMessage[language]}</p>}
                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={onClose}
                        >
                            {values.close[language]}
                        </button>
                    </div>
                </>
            )}
            </div>
        </div>
    );
};

export default ConfirmationModal;