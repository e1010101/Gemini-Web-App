'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface Report {
    questionnaire: { 
        answers: { [section: string]: { [question: string]: string } };
        scores: { [section: string]: number };
    };
    imageUpload: { image: string };
    additionalInfo: {
        hasOtherAilments: boolean;
        otherAilments: string;
        followUpAnswers: { [key: string]: string };
    };
    highestScoringSection: { section: string; score: number };
    constitutionInfo: {
        generalDescription: string;
        diet: string;
        lifestyleTips: string;
    };
    imageAnalysis: string;
    apiAnalysis: string;
}

export default function ViewReport() {
    const [report, setReport] = useState<Report | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const lastReport = localStorage.getItem('lastReport');
        if (lastReport) {
            setReport(JSON.parse(lastReport));
        }
    }, []);

    if (!report) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-24">
                <h1 className="text-2xl font-bold mb-4">No Report Found</h1>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </main>
        );
    }

    const renderQuestionnaireSection = () => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Questionnaire:</h2>
            {Object.entries(report.questionnaire.answers).map(([sectionName, questions]) => (
            <div key={sectionName} className="mb-4">
                <h3 className="text-lg font-semibold">{sectionName}</h3>
                {Object.entries(questions).map(([question, answer]) => (
                <div key={question} className="mb-2">
                    <strong>{question}:</strong> {answer}
                </div>
                ))}
            </div>
            ))}
        </div>
    );

    const renderImageUploadSection = () => (
        <div className="mb-8 max-w-sm max-h-md">
            <h2 className="text-xl font-semibold mb-4">Uploaded Image:</h2>
            <div className="w-64 h-64 overflow-hidden rounded-lg shadow-lg">
                <img 
                src={report.imageUpload.image} 
                alt="Uploaded Image" 
                className="w-full h-full object-cover"
                />
            </div>
        </div>
    );

    const renderAdditionalInfoSection = () => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Additional Information:</h2>
            <div><strong>Has Other Ailments:</strong> {report.additionalInfo.hasOtherAilments ? 'Yes' : 'No'}</div>
            {report.additionalInfo.hasOtherAilments && (
            <>
                <div><strong>Other Ailments:</strong> {report.additionalInfo.otherAilments}</div>
                <h3 className="text-lg font-semibold mt-4 mb-2">Follow-up Answers:</h3>
                {Object.entries(report.additionalInfo.followUpAnswers).map(([question, answer]) => (
                <div key={question} className="mb-2">
                    <strong>{question}</strong> {answer}
                </div>
                ))}
            </>
            )}
        </div>
    );

    const renderHighestScoringSection = () => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Body Constitution:</h2>
            {report.highestScoringSection ? (
            <div>
                <strong>{report.highestScoringSection.section}</strong>
            </div>
            ) : (
            <div>No Body Constitution available.</div>
            )}
        </div>
    );

    const renderConstitutionInfo = () => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Constitution Information:</h2>
            <div className="mb-4">
                <strong>General Description:</strong>
                <p>{report.constitutionInfo.generalDescription}</p>
            </div>
            <div className="mb-4">
                <strong>Dietary Recommendations:</strong>
                <p>{report.constitutionInfo.diet}</p>
            </div>
            <div className="mb-4">
                <strong>Lifestyle Tips:</strong>
                <p>{report.constitutionInfo.lifestyleTips}</p>
            </div>
        </div>
    );

    const renderAPIAnalysis = () => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">AI Analysis:</h2>
            <div className="prose max-w-none">
                <ReactMarkdown>{report.apiAnalysis}</ReactMarkdown>
            </div>
        </div>
    );

    const renderPage1 = () => (
        <>
            {renderHighestScoringSection()}
            {renderConstitutionInfo()}
            {renderAPIAnalysis()}
        </>
    );

    const renderPage2 = () => (
        <>
            {renderImageUploadSection()}
            {renderQuestionnaireSection()}
            {renderAdditionalInfoSection()}
        </>
    );

    const renderNavigationButtons = () => (
        <div className="flex justify-center mt-8 space-x-4">
            <Button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={currentPage === 1 ? 'bg-blue-500 text-white' : ''}
            >
                1
            </Button>
            <Button
                onClick={() => setCurrentPage(2)}
                disabled={currentPage === 2}
                className={currentPage === 2 ? 'bg-blue-500 text-white' : ''}
            >
                2
            </Button>
        </div>
    );

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
                    <Button asChild className="fixed top-4 right-4 z-10">
                        <Link href="/">Back to Home</Link>
                    </Button>
                    <h1 className="text-2xl font-bold mb-4">Last Report - Page {currentPage}</h1>
                    {currentPage === 1 ? renderPage1() : renderPage2()}
                    {renderNavigationButtons()}
                </div>
            </div>
        </main>
    );
}