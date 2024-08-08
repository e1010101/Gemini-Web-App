'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation';

const translations = {
    en: {
      title: "Questionnaire",
      imageUpload: "Image Upload",
      additionalInfo: "Additional Information",
      uploadImage: "Upload an image:",
      imagePreview: "Image Preview:",
      otherAilments: "Do you have any other ailments?",
      describeAilments: "Please describe your other ailments:",
      enterAilments: "Enter your ailments here...",
      generateQuestions: "Generate Follow-up Questions",
      followUpQuestions: "Follow-up Questions:",
      yourAnswer: "Your answer...",
      submitReport: "Submit Report",
      returnHome: "Return to Home",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    },
    zh: {
      title: "问卷调查",
      imageUpload: "图片上传",
      additionalInfo: "附加信息",
      uploadImage: "上传图片：",
      imagePreview: "图片预览：",
      otherAilments: "您还有其他疾病吗？",
      describeAilments: "请描述您的其他疾病：",
      enterAilments: "在此输入您的疾病...",
      generateQuestions: "生成后续问题",
      followUpQuestions: "后续问题：",
      yourAnswer: "您的回答...",
      submitReport: "提交报告",
      returnHome: "返回主页",
      options: ["从不", "很少", "有时", "经常", "总是"],
    }
};

const questionnaireData = [
    {
        sectionName: "Qi Deficiency",
        sectionNameZh: "气虚",
        questions: [
            "How easily do you get tired?",
            "How often do you experience shortness of breath?",
            "How weak is your voice?"
        ],
        questionsZh: [
            "您容易疲劳吗？",
            "您经常感到呼吸短促吗？",
            "您的声音有多虚弱？"
        ]
    },
    {
        sectionName: "Yang Deficiency",
        sectionNameZh: "阳虚",
        questions: [
            "How often do your feet/hands feel cold?",
            "How easily do you feel cold in your abdomen, back, lower back or knees?",
            "How sensitive are you to cold?"
        ],
        questionsZh: [
            "您的手脚经常感到冷吗？",
            "您的腹部、背部、腰部或膝盖容易感到冷吗？",
            "您对寒冷有多敏感？"
        ]
    },
    {
        sectionName: "Yin Deficiency",
        sectionNameZh: "阴虚",
        questions: [
            "How often do the palms of your hands or soles of your feet feel hot?",
            "How hot does your body and face feel?",
            "How often do you feel parched and need to drink water?"
        ],
        questionsZh: [
            "您的手掌或脚掌经常感到发热吗？",
            "您的身体和脸部感觉有多热？",
            "您经常感到口干需要喝水吗？"
        ]
    },
    {
        sectionName: "Phlegm Dampness",
        sectionNameZh: "痰湿",
        questions: [
            "How often does your body feel heavy or lethargic?",
            "How flabby is your abdomen?",
            "How often do you have abundance of phlegm in your throat?"
        ],
        questionsZh: [
            "您的身体经常感到沉重或无力吗？",
            "您的腹部有多松弛？",
            "您经常感到喉咙有痰吗？"
        ]
    },
    {
        sectionName: "Damp Heat",
        sectionNameZh: "湿热",
        questions: [
            "How easily do you get acne or sores?",
            "How often do you have a bitter taste in your mouth?",
            "How often do you pass sticky stools and/or feel that your bowel movement is incomplete?"
        ],
        questionsZh: [
            "您容易长痘痘或溃疡吗？",
            "您经常感到口中有苦味吗？",
            "您经常排粘便和/或感觉排便不完全吗？"
        ]
    },
    {
        sectionName: "Blood Stasis",
        sectionNameZh: "血瘀",
        questions: [
            "How often do you find bruises on your skin without reason?",
            "How easily do you have a dark face or get brown spots?",
            "How often do you find that your lips are darker, more blue or purple than usual?"
        ],
        questionsZh: [
            "您经常无缘无故发现皮肤有淤青吗？",
            "您的脸容易变暗或长褐斑吗？",
            "您经常发现嘴唇比平常更深、更蓝或更紫吗？"
        ]
    },
    {
        sectionName: "Qi Stagnation",
        sectionNameZh: "气滞",
        questions: [
            "How often do you feel depressed?",
            "How easily do you get anxious?",
            "How often do you feel emotional?"
        ],
        questionsZh: [
            "您经常感到抑郁吗？",
            "您容易感到焦虑吗？",
            "您经常感到情绪化吗？"
        ]
    }
];

const database = {
    "balanced": {
        "General Description": "Strong body build, good skin, healthy appetite/bowel movements/sleep cycle, stable psycho-emotional state, energetic, adaptable to the environment",
        "Diet": "Moderate and balanced, free of oily and spicy food",
        "Lifestyle Tips": "Exercise according to age, have an optimistic life outlook and positive attitude",
        "General Description_zh": "体格强壮，皮肤好，食欲/排便/睡眠周期健康，心理情绪状态稳定，精力充沛，适应环境能力强",
        "Diet_zh": "饮食适度平衡，避免油腻和辛辣食物",
        "Lifestyle Tips_zh": "根据年龄进行适当运动，保持乐观积极的生活态度"
    },
    "Qi Deficiency": {
        "General Description": "Easily tired, breathlessness, spontaneous sweating, easily catches colds/flu, weak immune function, tooth marks on tongue sides, sensitive to the environment, timid/introverted, poor diet, stress",
        "Diet": "More Qi-boosting food and nutrition that invigorates the spleen (sweet, warm, cooked), avoid garlic, radishes, and cilantro",
        "Lifestyle Tips": "Mild exercise, avoid windy areas, keep warm, get enough sleep",
        "General Description_zh": "容易疲劳，呼吸短促，自汗，容易感冒/流感，免疫功能弱，舌边有齿痕，对环境敏感，胆小/内向，饮食不佳，压力大",
        "Diet_zh": "多吃补气和健脾的食物（甜、温、熟食），避免食用大蒜、萝卜和香菜",
        "Lifestyle Tips_zh": "进行温和运动，避免待在通风处，保暖，保证充足睡眠"
    },
    "Yang Deficiency": {
        "General Description": "Cold limbs (especially hands and feet), catches cold easily, poor sleep, white coating on tongue, excess clear urine, puffy face, pale puffy tongue, diarrhea, throat mucus problems, sensitive to cold and dampness, sensitive to temperature and noise changes",
        "Diet": "More food that benefits Qi (pungent, warm, cooked), cook food and eat it hot, less raw, cold food (e.g., salads and fresh fruits)",
        "Lifestyle Tips": "Do mild exercise, use saunas, lift spirit, Keep warm, Avoid living in cold weather and prolonged air conditioning",
        "General Description_zh": "四肢冰冷（尤其是手脚），容易感冒，睡眠质量差，舌苔白，小便清长，面色浮肿，舌质淡胖，腹泻，喉咙有痰，对寒冷和潮湿敏感，对温度和噪音变化敏感",
        "Diet_zh": "多吃有益气的食物（辛、温、熟食），煮熟食物并趁热食用，减少生冷食物（如沙拉和新鲜水果）",
        "Lifestyle Tips_zh": "进行温和运动，使用桑拿，保持积极心态，保暖，避免长期处于寒冷环境和长时间使用空调"
    },
    "Yin Deficiency": {
        "General Description": "Thin body build, hot flushes, hot palms and soles, dry mouth, dry stool, constipation, irritability, sore throat and fever, preference for cold drinks, sensitive to hot weather, red tongue with little/no coating",
        "Diet": "More cooling foods (bitter, sour, salty), no heating foods (onion, garlic, chilli peppers, heavy animal proteins)",
        "Lifestyle Tips": "Moderate exercise, avoid late nights, avoid caffeine, build inner peace",
        "General Description_zh": "体型偏瘦，潮热，手足心发热，口干，大便干结，便秘，易怒，喉咙痛和发烧，偏爱冷饮，对热天气敏感，舌红少苔或无苔",
        "Diet_zh": "多吃凉性食物（苦、酸、咸），避免吃温热性食物（洋葱、大蒜、辣椒、重口动物蛋白）",
        "Lifestyle Tips_zh": "适度运动，避免熬夜，避免咖啡因，培养内心平静"
    },
    "Blood Stasis": {
        "General Description": "Skin is painful, dry, coarse, and easily bruised. Dark circles under eyes, unexplained bruises, abnormal growths. Sensitive to windy and cold environments. Impatient, short-tempered personality.",
        "Diet": "More food that promotes blood circulation (sweet, salty), no fatty meat or dairy products",
        "Lifestyle Tips": "Exercise and activities that promote blood circulation, participate in calming activities",
        "General Description_zh": "皮肤疼痛、干燥、粗糙，容易瘀青。眼下有黑眼圈，不明原因的瘀青，异常增生。对风寒环境敏感。性格急躁，脾气暴躁。",
        "Diet_zh": "多吃促进血液循环的食物（甜、咸），避免食用肥肉和乳制品",
        "Lifestyle Tips_zh": "进行促进血液循环的运动和活动，参与能让人平静的活动"
    },
    "Phlegm Dampness": {
        "General Description": "Overweight body type, profuse sweating, limb heaviness, oily face, preference for oily and sweet foods, excessive phlegm, thick tongue coating, sensitive to rainy and damp environments",
        "Diet": "Eat a bland diet, reduce or avoid sweet food and drinks, include more seaweed",
        "Lifestyle Tips": "Avoid outdoor activities during cold/humid weather, build calmness via meditation, avoid extreme emotions, avoid a sedentary lifestyle",
        "General Description_zh": "体型偏胖，多汗，四肢沉重，面部油腻，偏爱油腻和甜食，痰多，舌苔厚腻，对雨天和潮湿环境敏感",
        "Diet_zh": "食用清淡饮食，减少或避免甜食和饮料，多吃海藻类食物",
        "Lifestyle Tips_zh": "避免在寒冷/潮湿天气进行户外活动，通过冥想培养平静心态，避免情绪极端，避免久坐不动的生活方式"
    },
    "Damp Heat": {
        "General Description": "Normal or thin body type, oily, acne-prone skin, bitter taste in mouth and bad breath, fatigue or body heaviness, painful urination (excessive or scant), excessive vaginal discharge, damp scrotum, sensitive to damp and hot environments",
        "Diet": "Eat less greasy, sweet foods, include more seaweed",
        "Lifestyle Tips": "Avoid hot and damp environments, maintain a dry and ventilated home, intense exercise recommended, find relaxing activities to alleviate irritability",
        "General Description_zh": "体型正常或偏瘦，皮肤油腻易生痘，口中苦味和口臭，疲劳或身体沉重感，排尿疼痛（过多或过少），阴道分泌物过多，阴囊潮湿，对潮湿和炎热环境敏感",
        "Diet_zh": "少吃油腻、甜食，多吃海藻类食物",
        "Lifestyle Tips_zh": "避免处于炎热潮湿的环境，保持家居干燥通风，建议进行高强度运动，寻找放松活动以缓解易怒情绪"
    },
    "Qi Stagnation": {
        "General Description": "Thin body build, depressed mood, timid, easily stressed and anxious, prone to insomnia and psycho-emotional disorders, frequent sighing, chest palpitations, sensitive to seasonal depression and overcast, rainy days",
        "Diet": "Eat more Qi-nourishing foods (sweet, salty, pungent), eat seaweed to dissolve stagnation, avoid caffeine",
        "Lifestyle Tips": "Find relaxing activities to alleviate irritability, live in a quiet, clean, and bright environment, engage in fulfilling social activities, sleep with a regular schedule, intense exercise recommended",
        "General Description_zh": "体型偏瘦，情绪抑郁，胆小，容易紧张和焦虑，易患失眠和心理情绪障碍，经常叹气，胸口心悸，对季节性抑郁和阴雨天气敏感",
        "Diet_zh": "多吃养气食物（甜、咸、辛），吃海藻类食物以化解气滞，避免咖啡因",
        "Lifestyle Tips_zh": "寻找放松活动以缓解易怒情绪，生活在安静、干净、明亮的环境中，参与令人满足的社交活动，保持规律的睡眠时间，建议进行高强度运动"
    }
};

const generateFollowUpQuestions = (ailment: string, language: string) => {
    if (language === 'en') {
        return [
            `Can you describe the pain in your ${ailment}? (For example, is it stabbing, dull, throbbing, or something else?)`,
            `In addition to ${ailment}, have you noticed other symptoms? (For example, fever, chills, fatigue, or something else?)`,
            `When did your ${ailment} start?`,
            `Have you tried anything to relieve your ${ailment}, and if so, what was it?`,
            `On a scale of 1 to 10, how severe is the pain in your ${ailment}?`
        ];
    } else {
        return [
            `您能描述一下${ailment}的疼痛吗？（例如，是刺痛、钝痛、悸动还是其他什么感觉？）`,
            `除了${ailment}，您还注意到其他症状吗？（例如，发烧、发冷、疲劳还是其他什么？）`,
            `您的${ailment}是什么时候开始的？`,
            `您尝试过什么方法来缓解${ailment}，如果有的话，是什么？`,
            `请问您的${ailment}疼痛程度是1到10中的几级？`
        ];
    }
};

const translateQuestionnaireData = (data, language) => {
    return data.map(section => ({
      ...section,
      sectionName: language === 'en' ? section.sectionName : section.sectionNameZh,
      questions: section.questions.map((question, index) => language === 'en' ? question : section.questionsZh[index])
    }));
};

const MultiSectionForm = () => {
    const [language, setLanguage] = useState('en')
    const [activeTab, setActiveTab] = useState("questionnaire");
    const [answers, setAnswers] = useState<{ [key: string]: { [key: string]: string } }>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasOtherAilments, setHasOtherAilments] = useState(false);
    const [otherAilments, setOtherAilments] = useState("");
    const [followUpQuestions, setFollowUpQuestions] = useState([]);
    const [followUpAnswers, setFollowUpAnswers] = useState<{ [key: string]: string }>({});
    const [apiResponse, setApiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(false);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const [apiContext, setApiContext] = useState('');
  
    const router = useRouter();
    const t = translations[language];

    const translatedQuestionnaireData = translateQuestionnaireData(questionnaireData, language);
    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'zh' : 'en');
    };

    const calculateScores = () => {
        const scores = {};
        questionnaireData.forEach(section => {
            const sectionScores = section.questions.map(question => {
            const answer = answers[section.sectionName]?.[question];
            return t.options.indexOf(answer) + 1; // +1 because index starts at 0
            });
            const sectionAverage = sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length;
            scores[section.sectionName] = parseFloat(sectionAverage.toFixed(2));
        });
        return scores;
    };

    const getHighestScoringSection = (scores: { [s: string]: unknown; } | ArrayLike<unknown>) => {
        let highestSection = '';
        let highestScore = -Infinity;
        Object.entries(scores).forEach(([section, score]) => {
            if (score > highestScore) {
            highestScore = score;
            highestSection = section;
            }
        });
        return { section: highestSection, score: highestScore };
    };

    const compileResponses = () => {
        const scores = calculateScores();
        const highestScoringSection = getHighestScoringSection(scores);
        const constitutionInfo = database[highestScoringSection.section];
        console.log('Constitution Info:', constitutionInfo);
    
        return {
            questionnaire: {
                answers: answers,
                scores: scores
            },
            imageUpload: {
                image: imagePreview
            },
            additionalInfo: {
                hasOtherAilments,
                otherAilments,
                followUpAnswers
            },
            highestScoringSection: highestScoringSection,
            constitutionInfo: {
                generalDescription: constitutionInfo["General Description"],
                diet: constitutionInfo["Diet"],
                lifestyleTips: constitutionInfo["Lifestyle Tips"]
            },
        };
    };

    const sendUserDataToAPI = async (data: { questionnaire?: { answers: { [key: string]: { [key: string]: string; }; }; scores: {}; }; imageUpload: any; additionalInfo?: { hasOtherAilments: boolean; otherAilments: string; followUpAnswers: { [key: string]: string; }; }; highestScoringSection?: { section: string; score: number; }; }) => {
        let imagePreview = data.imageUpload.image;
        const base64Image = imagePreview.split(',')[1];
    
        try {
            // REPLACE WITH YOUR API KEY at "key="
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=YOUR KEY HERE', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                contents: [{
                    parts: [
                    {
                        text: `
                        ## TCM Expert Diagnosis Tips

                        You are an experienced TCM expert, proficient in TCM theory and practice, and are particularly good at using the diagnostic methods of "differentiation of syndromes" and "differentiation of diseases". You will conduct a detailed analysis based on the symptom description provided by the patient and give an accurate diagnosis.

                        **Input example:**
                        ## Patient symptoms:

                        * Obesity, excessive sweating, heavy limbs, greasy face, preference for greasy sweets, excessive phlegm, thick and greasy tongue coating, and easy to be attacked by wind, cold and dampness.

                        ## Patient body constitution:

                        * Phlegm and dampness constitution

                        ## Dietary suggestions:

                        * Eat a light diet, reduce or avoid sweets and drinks, and eat more seaweed foods.

                        ## Lifestyle suggestions:

                        * Avoid going out in cold and wet weather,
                        * Stay calm through meditation practice,
                        * Avoid excessive mood swings,
                        * Avoid a sedentary lifestyle.

                        Patient symptoms: overweight, sweating, heavy limbs, greasy face, likes to eat greasy sweets, phlegm, thick and greasy tongue coating, sensitive to rainy and humid environments.
                        Patient constitution: phlegm dampness
                        Reliable TCM Online Guide Recommendations: Eat a light diet, reduce or avoid sweets and beverages, eat more kelp
                        Reliable TCM Online Guide Recommended Lifestyle: Avoid outdoor activities in cold/humid weather, stay calm through meditation, avoid emotional excitement, and avoid a sedentary lifestyle

                        Follow-up questions:
                        Question: Can you describe the pain in your throat? (For example, is it scratching, burning, tingling, or something else?) Answer: Burning
                        Question: In addition to the sore throat, have you noticed other symptoms? (For example, runny nose, cough, fever, swollen lymph nodes, or difficulty swallowing?) Answer: Runny nose
                        Question: When did your sore throat start? Answer: 2 days ago Question: Have you been in contact with other sick people recently? Answer: No
                        Question: Have you tried anything to relieve your sore throat, and if so, what was it? (e.g. lozenges, salt water gargles, over-the-counter painkillers). Answer: Salt water gargle

                        ## What you need to do:
                        Provide two Body Constitutions; one based on the questionnaire answers and the other based on the tongue image.

                        Combined with the theory of traditional Chinese medicine, use the method of "differentiation of syndromes" to analyze the nature, location, and relationship between the positive and negative forces of the disease, and determine its syndrome type, such as "cold due to wind and cold", "weak spleen and stomach", etc.
                        Combined with modern medical knowledge, use the method of "differentiation of diseases" to determine the specific diseases that the patient may have, such as "acute bronchitis", "functional dyspepsia", etc.
                        Give the diagnosis results and explain the basis for the diagnosis.

                        **Output example:**
                        Body Constitution (Tongue Image): Phlegm Dampness Constitution

                        Body Constitution (Questionnaire Answers): Phlegm Dampness Constitution

                        TCM diagnosis: clear TCM diagnosis results, such as "liver qi stagnation", "phlegm heat disturbance".

                        Diagnostic basis: a brief explanation of the diagnosis, such as "according to the patient's symptoms of headache, dizziness, irritability, red tongue, thin yellow fur, and stringy pulse, the diagnosis is liver yang hyperactivity."

                        Treatment suggestions: based on the diagnosis results, provide dietary therapy and lifestyle adjustment suggestions.

                        You must be very detailed in your diagnosis.

                        Note: Do not provide Western medicine diagnosis.

                        ----------------------------------------------------------
                        USER INPUT DATA:
                        `
                    },
                    {
                        inline_data: {
                        mime_type: "image/png",
                        data: base64Image
                        }
                    },
                    {
                        text: JSON.stringify(data, null, 2)
                    }
                    ]
                }]
                })
          });
    
          const result = await response.json();
          console.log(result);
          return result.candidates[0].content.parts[0].text;
        } catch (error) {
          console.error('Error sending user data to API:', error);
          throw error;
        }
    };

    const handleRadioChange = (section: string, question: string, value: string) => {
        const sectionName = language === 'en' ? section : questionnaireData.find(s => s.sectionName === section)?.sectionNameZh || section;
        setAnswers(prev => ({
          ...prev,
          [sectionName]: {
            ...prev[sectionName],
            [question]: value
          }
        }));
      };
      

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            const result = reader.result as string;
            setImagePreview(result);
            setIsImageUploaded(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateFollowUp = () => {
        const questions = generateFollowUpQuestions(otherAilments);
        setFollowUpQuestions(questions);
    };

    const handleFollowUpAnswer = (question: never, answer: string) => {
        setFollowUpAnswers(prev => ({ ...prev, [question]: answer }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const compiledResponses = compileResponses();
        
        try {
            setIsLoading(true);
            const apiResponse = await sendUserDataToAPI(compiledResponses);
            
            localStorage.setItem('lastReport', JSON.stringify({
                ...compiledResponses,
                apiAnalysis: apiResponse
            }));
            alert('Report saved and sent to API successfully!');
            router.push('/');
        } catch (error) {
            alert('Failed to send report to API. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            const parsedData = JSON.parse(savedFormData);
            setAnswers(parsedData.answers || {});
            setImagePreview(parsedData.imagePreview || null);
            setHasOtherAilments(parsedData.hasOtherAilments || false);
            setOtherAilments(parsedData.otherAilments || "");
            setFollowUpQuestions(parsedData.followUpQuestions || []);
            setFollowUpAnswers(parsedData.followUpAnswers || {});
            setIsImageUploaded(!!parsedData.imagePreview);
        }
    }, []);

    useEffect(() => {
        const formData = {
            answers,
            imagePreview,
            hasOtherAilments,
            otherAilments,
            followUpQuestions,
            followUpAnswers
        };
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [answers, imagePreview, hasOtherAilments, otherAilments, followUpQuestions, followUpAnswers]);

    useEffect(() => {
        const allQuestionsAnswered = questionnaireData.every(section => 
          section.questions.every((question, index) => {
            const sectionName = language === 'en' ? section.sectionName : section.sectionNameZh;
            const questionText = language === 'en' ? question : section.questionsZh[index];
            return answers[sectionName]?.[questionText];
          })
        );
        setIsQuestionnaireComplete(allQuestionsAnswered);
      }, [answers, language]);

    const isFormComplete = isQuestionnaireComplete && isImageUploaded;

    return (
        <div className="min-h-screen p-8">
            <div className="w-full max-w-4xl mx-auto mt-8 relative">
                <Button 
                onClick={() => router.push('/')} 
                className="fixed top-4 right-4 z-10"
                >
                    Return to Home
                </Button>
                <Button
                onClick={toggleLanguage}
                className="fixed top-4 right-40 z-10"
                >
                    {language === 'en' ? '切换到中文' : 'Switch to English'}
                </Button>
                        <form onSubmit={handleSubmit} className="mt-16 p-6 border rounded-lg shadow-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="flex">
                    <TabsList className="flex flex-col h-full space-y-2 mr-6">
                        <TabsTrigger value="questionnaire" className="justify-start">{t.title}</TabsTrigger>
                        <TabsTrigger value="image-upload" className="justify-start">{t.imageUpload}</TabsTrigger>
                        <TabsTrigger value="additional-info" className="justify-start">{t.additionalInfo}</TabsTrigger>
                    </TabsList>

                    <div className="flex-grow">
                    <TabsContent value="questionnaire">
                        <h2 className="text-2xl font-bold mb-4">Questionnaire</h2>
                        {translatedQuestionnaireData.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">{section.sectionName}</h3>
                            <div className="mb-4 grid grid-cols-[1fr,repeat(5,auto)] gap-4 items-center">
                            <div></div>
                            {t.options.map((option, index) => (
                                <span key={index} className="text-sm text-center">{option}</span>
                            ))}
                            {section.questions.map((question, qIndex) => (
                                <React.Fragment key={qIndex}>
                                <p className="mr-4">{question}</p>
                                <RadioGroup 
                                    className="contents" 
                                    onValueChange={(value) => handleRadioChange(section.sectionName, question, value)}
                                    value={answers[section.sectionName]?.[question] || ""}
                                >
                                    {t.options.map((_, index) => (
                                    <div key={index} className="flex justify-center">
                                        <RadioGroupItem 
                                        value={t.options[index]} 
                                        id={`${section.sectionName}-q${qIndex}-${index}`}
                                        />
                                    </div>
                                    ))}
                                </RadioGroup>
                                </React.Fragment>
                            ))}
                            </div>
                        </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="image-upload">
                        <h2 className="text-2xl font-bold mb-4">{t.imageUpload}</h2>
                        <div className="mb-4">
                        <Label htmlFor="image-upload">{t.uploadImage}</Label>
                        <Input 
                            id="image-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                        />
                        </div>
                        {imagePreview && (
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">{t.imagePreview}</h3>
                            <img src={imagePreview} alt="Uploaded preview" className="max-w-full h-auto" />
                        </div>
                        )}
                    </TabsContent>

                    <TabsContent value="additional-info">
                        <h2 className="text-2xl font-bold mb-4">{t.additionalInfo}</h2>
                        <div className="mb-4 flex items-center space-x-2">
                        <Label htmlFor="other-ailments">{t.otherAilments}</Label>
                        <Switch
                            id="other-ailments"
                            checked={hasOtherAilments}
                            onCheckedChange={setHasOtherAilments}
                        />
                        </div>
                        {hasOtherAilments && (
                        <div className="mb-4">
                            <Label htmlFor="ailments-input">{t.describeAilments}</Label>
                            <Input
                            id="ailments-input"
                            value={otherAilments}
                            onChange={(e) => setOtherAilments(e.target.value)}
                            placeholder={t.enterAilments}
                            className="mb-2"
                            />
                            {followUpQuestions.length <= 0 && <Button type="button" onClick={handleGenerateFollowUp}>{t.generateQuestions}</Button>}
                        </div>
                        )}
                        {followUpQuestions.length > 0 && hasOtherAilments && (
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">{t.followUpQuestions}</h3>
                            {followUpQuestions.map((question, index) => (
                            <div key={index} className="mb-3">
                                <Label htmlFor={`followup-${index}`}>{question}</Label>
                                <Input
                                id={`followup-${index}`}
                                value={followUpAnswers[question] || ''}
                                onChange={(e) => handleFollowUpAnswer(question, e.target.value)}
                                placeholder={t.yourAnswer}
                                className="mt-1"
                                />
                            </div>
                            ))}
                        </div>
                        )}
                    </TabsContent>
                    </div>
                </Tabs>
                {isFormComplete && <Button type="submit" className="mt-4">{t.submitReport}</Button>}
                </form>
            </div>
        </div>
    );
};

export default MultiSectionForm;  