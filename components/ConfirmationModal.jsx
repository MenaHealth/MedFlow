// components/ConfirmationModal.jsx

import { CheckBox } from '@mui/icons-material';
import React, { useRef} from 'react';

const ConfirmationModal = ({ patientId, patientName, onClose, submittingFromNoSession, setSubmittingFromNoSession, submit, language }) => {
    const patientSubmitting = useRef(submittingFromNoSession);
    const values = {
        newPatientRequest: {
            english: "New Patient Request",
            arabic: "طلب مريض جديد",
            farsi: "درخواست بیمار جدید",
            pashto: "د نوي ناروغ غوښتنه"
        },
        name: {
            english: "Name",
            arabic: "اسم",
            farsi: "نام",
            pashto: "نوم",
        },
        declareTrue: {
            english: "I declare that the information provided in this form is true.",
            arabic: "أصرح بأن المعلومات في هذا النموذج صحيحة",
            farsi: "من اعلام می کنم که اطلاعات ارائه شده در این فرم درست است",
            pashto: "زه اعلان کوم چې په دې فورمه کې چمتو شوي معلومات ریښتیا دي"
        },
        requestServices: {
            english: "I declare that I am requesting MENA Health's services for a remote health consultation.",
            arabic: "لاستشارة صحية عن بعد MENA Health أصرح أنني أطلب خدمة",
            farsi: "من اعلام می کنم که از خدمات MENA Health برای یک مشاوره بهداشتی از راه دور درخواست می کنم",
            pashto: "زه اعلان کوم چې زه د لیرې روغتیا مشورې لپاره د MENA روغتیا خدمت غوښتنه کوم"
        },
        agree: {
            english: "I declare that I have read the registration conditions provided below, and agree to its terms.",
            arabic: "أقر بأنني قرأت شروط التسجيل والتي تنص على:",
            farsi: "من اعلام می کنم که شرایط ثبت نام ارائه شده در زیر را مطالعه کرده و با شرایط آن موافقت می کنم",
            pashto: "زه اعلان کوم چې ما لاندې چمتو شوي د راجسټریشن شرایط لوستلي ، او د دې شرایطو سره موافق یم"
        },
        registrationConditions: {
            english: "Patient Registration Terms & Conditions:",
            arabic: "شروط وأحكام تسجيل المريض",
            farsi: "شرایط و ضوابط ثبت نام بیمار",
            pashto: "د ناروغ د ثبت شرایط او شرایط"
        },
        shareData: {
            english: 'Share my data with members of the non-profit organization "MENA Health" and members of the licensed medical staff',
            arabic: 'مشاركة بياناتي مع أعضاء منظمة "MENA Health" غير الحكومية وأعضاء الطاقم الطبي المرخص',
            farsi: `من داده های خود را با اعضای سازمان غیرانتفاعی "MENA Health" و اعضای کادر پزشکی دارای مجوز به
اشتراک می گذارم`,
            pashto: 'زه خپل معلومات د غیر انتفاعي سازمان "MENA Health" غړو او د جواز لرونکي طبي کارمندانو غړو سره شریکوم'
        },
        transferData: {
            english: "The possibility of transferring my data to other associations/non-governmental organization that can assist with my request or provide medicine when needed",
            arabic: `إمكانية مشاركة معلوماتي مع جمعيات و منظمات غير حكومية أخرى التي يمكن أن تساعد في طلبي أو توفر الدواء عند
الحاجة`,
            farsi: `امکان انتقال داده‌های من به سایر انجمن‌ها/سازمان‌های غیردولتی که می‌توانند به درخواست من کمک کنند یا در
صورت نیاز دارو تهیه کنند.`,
            pashto: `نورو انجمنونو / غیر دولتي سازمانونو ته زما د معلوماتو لیږدولو امکان چې کولی شي زما غوښتنې سره مرسته وکړي ، یا د اړتیا
په وخت کې درمل چمتو کړي`
        },
        checkBox: {
            english: "Please check this box confirming you have read and understand the patient registration terms and agree.",
            arabic: "يرجى تحديد هذا المربع للتأكد أنك قرأت و أوافق على شروط التسجيل",
            farsi: "لطفاً این کادر را علامت بزنید و تأیید کنید که شرایط ثبت نام بیمار را خوانده و درک کرده اید و موافقت می کنید",
            pashto: "مهرباني وکړئ دا بکس چیک کړئ دا تاییدوي چې تاسو د ناروغ د راجسټریشن شرایط لوستلي او پوهیږئ او موافق یاست"
        },
        submit: {
            english: "Submit",
            arabic: "يُقدِّم",
            farsi: "ارسال کنید",
            pashto: "سپارل"
        },
        agreeToTerms: {
            english: "Please agree to the terms and conditions.",
            arabic: "الرجاء الموافقة على الشروط والأحكام",
            farsi: "لطفا با شرایط و ضوابط موافقت کنید",
            pashto: "مهرباني وکړئ د شرایطو او شرایطو سره موافق یاست"
        },
        close: {
            english: "Close",
            arabic: "يغلق",
            farsi: "بستن",
            pashto: "تړل"
        },
        successful: {
            english: "Patient Created Successfully",
            arabic: "تم إنشاء المريض بنجاح",
            farsi: "بیمار با موفقیت ایجاد شد",
            pashto: "ناروغ په بریالیتوب سره جوړ شو"
        },
        patientId: {
            english: "Patient ID",
            arabic: "معرف المريض",
            farsi: "شناسه بیمار",
            pashto: "د ناروغ پیژندنه"
        },
        confirmationMessage: {
            english: "Your form has been successfully submitted. A member of the MENA Health team will be in touch with you shortly. You can now close this window.",
            arabic: `لقد تم إرسال النموذج الخاص بك بنجاح. سيتواصل معك أحد أعضاء فريق الصحة في منطقة الشرق الأوسط وشمال أفريقيا قريبًا.
يمكنك الآن إغلاق هذه النافذة.`,
            farsi: `فرم شما با موفقیت ارسال شد. یکی از اعضای تیم MENA Health به زودی با شما در تماس خواهد بود. اکنون می
توانید این پنجره را ببندید.`,
            pashto: `ستاسو فورمه په بریالیتوب سره وسپارل شوه. د MENA روغتیایی ټیم غړی به ډیر ژر له تاسو سره اړیکه ونیسي. تاسو
اوس دا کړکۍ بندولی شئ.`
        }
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-xl">
            {submittingFromNoSession ? (
                <>
                    <h2 className="text-2xl font-bold mb-4 text-center">{values.newPatientRequest[language]}</h2>
                    <br />
                    <p>{values.name[language]}: {patientName.firstName} {patientName.lastName}</p>
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
                    <label for="agree" className='text-gray-500'>&nbsp;{values.checkBox[language]}</label>

                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                                if (document.getElementById('agree').checked) {
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